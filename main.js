(function () {

  //Constants
  const P_B = "Parent Before";
  const P_A = "Parent After";
  const S_B = "Sibling Before";
  const S_A = "Sibling After";

  let char = {
    class: null
  }
  const comp = {
    accItem: {
      html: `
        <div id="new" class="acc-item hidden">
<div class="header">
          <div class="title"></div>
          <i class="fa-solid fa-chevron-down acc-icon"></i>
</div>
          <div class="cont"></div>
        </div>`,
      func: function (comp) {
        comp.click(function () {
          $(this).closest(".acc").children().not(this).addClass("hidden");
          $(this).toggleClass("hidden");
        });
      }
    },
    classCont: {
      html: `
        <div id="new">
          <button class="select-class">Select Class</button>
          <div class="desc"></div>
        </div>`,
      func: function (comp) {
        comp.children(".select-class").click(function (e) {
          e.stopPropagation();
          char.class = $(this).closest(".acc-item").find(".title").first();
          console.log(char.class)
          nextSection();
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
  let genInfo;

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

    const panzoom = Panzoom($("#character-sheet")[0], { excludeClass: 'x' });
    // No function bind needed
    // $("#character-sheet-parent").on('wheel', panzoom.zoomWithWheel);

    $("#character-sheet-parent")[0].addEventListener('wheel', panzoom.zoomWithWheel);

    //   if (!event.shiftKey) return
    //   panzoom.zoomWithWheel(event)
    //
    // });
    //Character Sheet
    $("#character-sheet").sortable({
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

  async function initComps() {
    genInfo = await generalInfo.then((resp) => resp.json());
    //Class Accordion
    $("#class-acc").empty();
    Object.keys(genInfo["classes"]).forEach(key => {
      let acc = initComp("accItem", "#class-acc");
      acc.find(".title").text(key);
      acc.attr("id", "acc-item-" + key)
      converter = new showdown.Converter();
      htmlOutput = converter.makeHtml(genInfo["classes"][key]["desc"]);
      let classCont = initComp("classCont", "#acc-item-" + key + " .cont");
      classCont.find(".desc").html(htmlOutput);
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

  function updateSection() {
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
