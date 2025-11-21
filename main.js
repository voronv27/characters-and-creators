(function () {

  //Constants
  const P_B = "Parent Before";
  const P_A = "Parent After";
  const S_B = "Sibling Before";
  const S_A = "Sibling After";

  let char = {
    class: {},
    primaryClass: null,
    race: null,
    background: null,
  }
  const comp = {
    accItem: {
      html: `
        <div id="new" class="acc-item hidden">
<div class="header">
          <img class="icon-img">
          <div class="title"></div>
          <i class="fa-solid fa-chevron-down acc-icon"></i>
</div>
          <div class="cont"></div>
        </div>`,
      func: function (comp) {
        comp.click(function (event) {
          if ($(event.target).hasClass('select')) {
            // don't collapse if clicked on level select
            return;
          }
          $(this).closest(".acc").children().not(this).addClass("hidden");
          $(this).toggleClass("hidden");
        });
      }
    },
    classCont: {
      html: `
        <div id="new">
          <button class="select-class">Select Class</button>
          <label for="select-level-" class="select-level">Select level:</label>
          <select id="select-level-" class="select">
            <option selected="selected">1</option>`
        + [...Array(19).keys()].map(i => i + 2).reduce(
          (opts, newOpt) => opts + `<option>${newOpt}</option>\n`, "") +
        ` </select>
          <div class="desc"></div>
        </div>`,
      func: function (comp) {
        comp.children(".select-class").click(function (e) {
          e.stopPropagation();
          const className = $(this).closest(".acc-item").find(".title").first().text();
          const classLevel = $(this).closest(".acc-item").find(".select option:selected").text();
          char.class[className] = classLevel;
          console.log(`class ${className}, level ${classLevel}`);

          var selectedClasses = "";
          var primaryClass = "";
          var maxLevel = 0;
          for (c in char.class) {
            if (char.class[c] > maxLevel) {
              maxLevel = char.class[c];
              primaryClass = c;
            }
            selectedClasses += `${c} ${char.class[c]}<br>\n`;
          }
          char["primaryClass"] = primaryClass;
          $("#chosen-class").html(selectedClasses);
          $("#primary-class").html(primaryClass);

          // reset specificInfo because we changed class
          specificInfo = null;
          $("#stat-suggestion").show();
          //nextSection();
        })
      }
    },
    raceCont: {
      html: `
        <div id="new">
          <button class="select-race">Select Race</button><br>
          <img class="race-img">
          <div class="desc race-desc"></div>
        </div>
      `,
      func: function (comp) {
        comp.children(".select-race").click(function (e) {
          e.stopPropagation();
          const raceName = $(this).closest(".acc-item").find(".title").first().text();
          char.race = raceName;
          console.log(`race ${raceName}`);
          $("#chosen-race").html(raceName);
          // reset specificInfo because we changed race
          specificInfo = null;
        })
      }
    },
    backgroundCont: {
      html: `
        <div id="new">
          <button class="select-background">Select Background</button><br>
          <div class="desc background-desc"></div>
        </div>
      `,
      func: function (comp) {
        comp.children(".select-background").click(function (e) {
          e.stopPropagation();
          const bgName = $(this).closest(".acc-item").find(".title").first().text();
          char.background = bgName;
          console.log(`background ${bgName}`);
          $("#chosen-background").html(bgName);
          // reset specificInfo because we changed background
          specificInfo = null;
        })
      }
    },
    spellcard: {
      html: `
        <div id="new" class="spellcard">
          <div class="front">
            <div class="body">
              <h3 class="name"></h3>
              <ul class="status">
                <li><em>casting time</em><div class="casting"></div></li>
                <li class="second"><em>range</em><div class="range"></div></li>
                <br clear="all">
              </ul> 
              <ul class="status bottom">
                <li><em>components</em><div class="components"></div></li>
                <li class="second"><em>duration</em><div class="duration"></div></li>			
                <br clear="all">
              </ul>        
              <b class="need"></b>
              <p class="text"></p>
            </div>
            <b class="class"></b>
            <b class="type"></b>
          </div>
        </div>`,
      func: null
    }
  };

  const URL = "https://voronv.pythonanywhere.com"

  //Variables
  let generalInfo;
  let specificInfo;
  let genInfo;
  let specInfo;

  let numSections;
  let sectionNum = 0;

  let charStates;

  $(async function () {
    init();
    eventListeners();

    await initComps();
  });

  function init() {
    numSections = $(".section").length;

    const panzoom = Panzoom($("#character-sheet")[0], {
      excludeClass: 'x',
    });
    // No function bind needed
    // $("#character-sheet-parent").on('wheel', panzoom.zoomWithWheel);

    $("#character-sheet-parent")[0].addEventListener('wheel', panzoom.zoomWithWheel);

    //   if (!event.shiftKey) return
    //   panzoom.zoomWithWheel(event)
    //
    // });
    //Character Sheet
    $("#character-sheet").sortable({
      connectWith: '.comp, .sub-comp',
      handle: ".handle",
      placeholder: "placeholder",
      forcePlaceholderSize: true,
      start: function (e, ui) {
        // let items = $(this).data()['ui-sortable-helper'].items;
        // items.forEach(function (item) {
        //   item.height *= panzoom.getScale();
        //   item.width *= panzoom.getScale();
        // });

      },
      sort: function (e, ui) {
        let changeLeft = ui.position.left - ui.originalPosition.left;
        // For left position, the problem here is not only the scaling,
        // but the transform origin. Since the position is dynamic
        // the left coordinate you get from ui.position is not the one
        // used by transform origin. You need to adjust so that
        // it stays "0", this way the transform will replace it properly
        // let newLeft = ui.originalPosition.left + panzoom.getPan().x / panzoom.getScale() - ui.item.parent().offset().left;
        let newLeft = (ui.position.left - $("#character-sheet").offset().left) / panzoom.getScale();
        console.log("x", panzoom.getPan().x);
        console.log("y", panzoom.getPan().y);
        console.log("scale", panzoom.getScale());
        // For top, it's simpler. Since origin is top, 
        // no need to adjust the offset. Simply undo the correction
        // on the position that transform is doing so that
        // it stays with the mouse position
        let newTop = (ui.position.top - $("#character-sheet").offset().top) / panzoom.getScale();

        ui.helper.css({
          left: newLeft,
          top: newTop,
        });
      }
    });
    // $("#character-sheet .comp").on("sort", function (event, ui) {
    //
    // });
    //
    $("#character-sheet .comp").resizable({
      create: function (event, ui) {
        // $(".ui-resizable-handle").addClass("x")
        // $(".ui-resizable-e").html(`<i class="fa-solid fa-arrows-left-right"></i>`);
        // $(".ui-resizable-s").html(`<i class="fa-solid fa-arrows-up-down"></i>`);
        $(".ui-resizable-se").html(`<i class="fa-solid fa-up-right-and-down-left-from-center"></i>`).addClass("x");

      }

    }
    );

    //Warning for extra IDs
    $('[id]').each(function () {
      var ids = $('[id="' + this.id + '"]');
      if (ids.length > 1 && ids[0] == this)
        console.warn('Multiple IDs #' + this.id);
    });

    sectionFromURL();
    updateSection();
    initApiData();
  }

  function nextSection() {
    sectionNum = sectionNum + 1 >= numSections ? 0 : sectionNum + 1;
    updateSection();
  }

  function prevSection() {
    sectionNum = sectionNum - 1 < 0 ? numSections - 1 : sectionNum - 1;
    updateSection();
  }

  function eventListeners() {
    //Section logic
    $("#prev-section").click(prevSection);

    $("#next-section").click(nextSection);

    //Update section
    $(window).on("hashchange", function () {
      sectionFromURL();
      updateSection();
    });
  }

  function sectionFromURL() {
    let currentSection = window.location.hash + "-section";
    if ($(currentSection).hasClass("section")) {
      sectionNum = $(currentSection).index();
    }
  }

  function initApiData() {
    generalInfo = fetch(`${URL}/general-info`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }

  function specificApiData() {
    var fetchRequired = false;
    // TODO: more than primary class, subclass, subrace
    var paramUrl = `${URL}/specific-info?`;
    if (char.primaryClass) {
      paramUrl += `class=${char.primaryClass}`;
      fetchRequired = true;
    }
    if (char.race) {
      paramUrl += `&race=${char.race}`;
      fetchRequired = true;
    }
    if (char.background) {
      paramUrl += `&background=${char.background}`;
      fetchRequired = true;
    }

    if (fetchRequired) {
      specificInfo = fetch(paramUrl, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    }
    return fetchRequired;
  }

  // Update elements after updating specInfo
  function updateSpecInfo() {
    const recStats = "<b>" + specInfo["preferred-stats"].join("</b> and <b>") + "</b>";
    $("#rec-stats").html(recStats);
  }

  function getRaceDesc(data, subrace = "") {
    let converter = new showdown.Converter();
    const size = converter.makeHtml(data["size"]);
    const speed = converter.makeHtml(data["speed_desc"]);
    const asi = converter.makeHtml(data["asi_desc"]);
    const languages = converter.makeHtml(data["languages"]);
    const vision = converter.makeHtml(data["vision"]);
    const traits = converter.makeHtml(data["traits"]);

    var desc = `<b>Key Race Features:</b><br>
    ${size}
    ${speed}
    ${asi}
    ${languages}
    ${vision}
    ${traits}`
    if (subrace != "") {
      var subraceDesc = "";
      const subraceData = data[subrace];
      const subraceAsi = converter.makeHtml(subraceData["asi_desc"]);
      const subraceTraits = converter.makeHtml(subraceData["traits"]);
      if (subraceAsi) {
        subraceDesc += `${subraceAsi}`;
      }
      if (subraceTraits) {
        subraceDesc += `${subraceTraits}`;
      }
      if (subraceDesc.length) {
        desc += `<br><b>Selected Subrace Features:</b><br>${subraceDesc}`;
      }
    }
    return desc;
  }

  function getBackgroundDesc(data) {
    var desc = "";
    if (data["desc"]) {
      desc += `<br><b>Overview:</b><br>${data["desc"]}<br><br>`;
    }

    if (data["benefits"]) {
      desc += "<br><b>Key Background Features:</b><br><br>";
      const tagsToRemove = ["p"];
      const idTagsToRemove = ["h3"];
      for (b of data["benefits"]) {
        var html = converter.makeHtml(b["desc"]);
        for (t of tagsToRemove) {
          html = html.replaceAll(`<${t}>`, "").replaceAll(`</${t}>`, "");
        }
        for (t of idTagsToRemove) {
          html = html.replaceAll(RegExp(`<${t}.*>`, "g"), "").replaceAll(RegExp(`</${t}.*>`, "g"), "");
        }
        if (b["type"] == "suggested_characteristics") {
          html = html.slice(0, html.indexOf("|"));
          if (html == "Coming soon") {
            continue;
          }
        }
        desc += `${b["name"]}:<br>${html}`;
        if (desc.charAt(desc.length - 1) != ">") {
          desc += `<br><br>`;
        }
      }
    }
    return desc;
  }


  //Components creation that requires backend
  async function initComps() {
    genInfo = await generalInfo.then((resp) => resp.json());
    //Class Accordion
    $("#class-acc").empty();
    Object.keys(genInfo["classes"]).forEach(key => {
      let acc = initComp("accItem", "#class-acc");
      acc.find(".title").text(key);
      acc.attr("id", "acc-item-" + key);
      acc.find(".icon-img").attr("src", `assets/images/${key.toLowerCase()}.png`);
      converter = new showdown.Converter();
      htmlOutput = converter.makeHtml(genInfo["classes"][key]["desc"]);
      let classCont = initComp("classCont", "#acc-item-" + key + " .cont");
      classCont.find(".desc").html(htmlOutput);
      acc.find(".select-level").attr("for", "select-level-" + key);
      acc.find(".select").attr("id", "select-level-" + key);
    });

    $("#race-acc").empty();
    Object.keys(genInfo["races"]).forEach(key => {
      let acc = initComp("accItem", "#race-acc");
      acc.find(".title").text(key);
      acc.attr("id", "acc-item-" + key);
      let raceCont = initComp("raceCont", "#acc-item-" + key + " .cont");
      raceCont.find(".race-img").attr("src", `assets/images/${key.toLowerCase()}.png`);
      let raceDesc = getRaceDesc(genInfo["races"][key]);
      raceCont.find(".desc").html(raceDesc);
    });

    $("#background-acc").empty();
    Object.keys(genInfo["backgrounds"]).forEach(key => {
      let acc = initComp("accItem", "#background-acc");
      acc.find(".title").text(key);
      const keyId = key.replaceAll(" ", "-");
      acc.attr("id", "acc-item-" + keyId);
      let bgCont = initComp("backgroundCont", "#acc-item-" + keyId + " .cont");
      let bgDesc = getBackgroundDesc(genInfo["backgrounds"][key]);
      bgCont.find(".desc").html(bgDesc);
    });

    $("#spellcards-acc").empty();
    Object.keys(genInfo["spells"]).forEach(key => {
      let spellcard = initComp("spellcard", "#spellcards-acc");

      // TODO: move to function
      const spellInfo = genInfo["spells"][key];

      var spellName = spellInfo["name"];
      if (spellInfo["ritual"]) {
        spellName += " (ritual)"
      }
      spellcard.find(".name").text(spellName);

      var castTime = spellInfo["casting_time"];
      if (castTime[0] < '0' || castTime[0] > '9') {
        castTime = "1 " + castTime;
      } else if (castTime[1] != ' ') {
        castTime = castTime[0] + ' ' + castTime.slice(1);
      }
      spellcard.find(".casting").text(castTime);

      spellcard.find(".range").text(spellInfo["range_text"]);

      var spellComponents = "";
      if (spellInfo["verbal"]) { spellComponents += "V"; }
      if (spellInfo["somatic"]) {
        if (spellComponents != "") { spellComponents += ", "; }
        spellComponents += "S";
      }
      if (spellInfo["material"]) {
        if (spellComponents != "") { spellComponents += ", "; }
        spellComponents += "M";
      }
      spellcard.find(".components").text(spellComponents)

      spellcard.find(".duration").text(spellInfo["duration"]);

      var material = spellInfo["material_specified"];
      if (material) { material = material.toLowerCase().replace('.', ''); }
      spellcard.find('.need').text(material);

      var spellDesc = spellInfo["desc"];
      if (spellInfo["reaction_condition"]) {
        spellDesc = `<b>Reaction Condition</b>: Reaction ${spellInfo["reaction_condition"]}<br><br>${spellDesc}`;
      }
      if (spellInfo["higher_level"]) {
        spellDesc += `<br><b>At Higher Levels</b>: ${spellInfo["higher_level"]}`;
      }
      spellcard.find(".text").html(spellDesc);

      spellcard.find(".class").text(spellInfo["document"]["publisher"]["name"]);

      const level = spellInfo["level"];
      const school = spellInfo["school"]["name"];
      var type = `Level ${level} ${school}`;
      if (level == 0) { type = `${school} Cantrip`; }
      spellcard.find(".type").text(type);
    });
  }

  function initComp(key, existing, rel,) {
    switch (rel) {
      case S_B:
        $(existing).before(comp[key]["html"]);
        break;
      case S_A:
        $(existing).after(comp[key]["html"]);
        break;
      case P_B:
        $(existing).prepend(comp[key]["html"]);
        break;
      case P_A:
      default:
        $(existing).append(comp[key]["html"]);
        break;
    }
    let added = $("#new").removeAttr("id");
    if (comp[key].func) {
      comp[key].func(added);
    }
    // console.log(added);
    return added;
  }


  function initNewAccItem(acc) {
  }

  async function updateSection() {
    // if we don't have specificInfo, get it from the API
    if (!specificInfo && sectionNum > 3) {
      if (specificApiData()) {
        specInfo = await specificInfo.then((resp) => resp.json());
        updateSpecInfo();
      }
    }
    $(".section.selected").removeClass("selected");
    $(".section").eq(sectionNum).addClass("selected");
    $("#section-title").text($(".section.selected").attr("data-title"));
    let sectionId = $(".section.selected").attr("id");
    if ($("[id='" + sectionId + "']").length > 1) {
      console.error("There are duplicate sections for \"#" + sectionId + "\".")
    } else {
      console.log("Log length: " + $("[id='" + sectionId + "']").length);
    }
    console.log("section id: ", sectionId)
    let sectionHash = "#" + sectionId.slice(0, sectionId.length - 8);
    if (window.location.hash != sectionHash) {
      console.log("window.location.hash: " + window.location.hash + ", section hash " + sectionHash)
      window.location.hash = sectionHash;
    }
  }


})();
