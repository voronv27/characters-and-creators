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
                <li><em>casting time</em></li>
                <li class="second"><em>range</em></li>
                <br clear="all">
              </ul> 
              <ul class="status bottom">
                <li><em>components</em></li>
                <li class="second"><em>duration</em></li>			
                <br clear="all">
              </ul>        
              <b class="need"></b>
              <p class="text"></p>
            </div>
            <b class="class></b>
            <b class="type></b>
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
      const spellName = genInfo["spells"][key]["name"];
      spellcard.find(".name").text(spellName);

      const spellDesc = genInfo["spells"][key]["desc"];
      spellcard.find(".text").text(spellDesc);
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
    console.log(added);
    return added;
  }


  function initNewAccItem(acc) {
  }

  function updateSection() {
    $(".section.selected").removeClass("selected");
    $(".section").eq(sectionNum).addClass("selected");
    $("#section-title").text($(".section.selected").attr("data-title"));
    let sectionId = $(".section.selected").attr("id");
    console.log("section id: ", sectionId)
    let sectionHash = "#" + sectionId.slice(0, sectionId.length - 8);
    if (window.location.hash != sectionHash) {
      console.log("window.location.hash: " + window.location.hash + ", section hash " + sectionHash)
      window.location.hash = sectionHash;
    }
  }


})();
