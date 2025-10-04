(function () {
  //Variables

  const comp = {
    accItem: `
    <div id="new" class="acc-item" >
      <div class="title"></div>
      <div class="content"></div>
    </div>`
  }

  const URL = "https://voronv.pythonanywhere.com"
  let generalInfo;
  let genInfo;

  let numSections;
  let sectionNum = 0;


  $(async function () {
    init();

    //Section logic
    $("#prev-section").click(function () {
      sectionNum = sectionNum - 1 < 0 ? numSections - 1 : sectionNum - 1;
      updateSection();
    });

    $("#next-section").click(function () {
      sectionNum = sectionNum + 1 >= numSections ? 0 : sectionNum + 1;
      updateSection();
    });

    //Update section
    $(window).on("hashchange", function () {
      sectionFromURL();
      updateSection();
    });

    //General Section 
    genInfo = await generalInfo.then((resp) => resp.json());
    initComps();
    console.log(genInfo);
  });

  function init() {
    numSections = $(".section").length;

    sectionFromURL();
    updateSection();
    initApiData();
  }

  function sectionFromURL() {
    let currentSection = window.location.hash + "-section";
    if ($(currentSection).hasClass("section")) {
      sectionNum = $(currentSection).index() - 1;
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

  function initComps() {
    //Class Accordion
    Object.keys(genInfo["classes"]).forEach(key => {
      $("#class-acc").append(comp.accItem);
      let acc = initComp();
      initNewAccItem(acc);
      console.log(genInfo["classes"][key]);
      acc.children(".title").text(key);
      acc.children(".content").text(genInfo["classes"][key]["desc"]);
    });
  }

  function initComp() {
    return $("#new").removeAttr("id");
  }


  function initNewAccItem(acc) {
    acc.click(function () {
      $(this).closest(".acc").children().not(this).addClass("hidden");
      $(this).removeClass("hidden");
    });

  }

  function updateSection() {
    $(".section.selected").removeClass("selected");
    $(".section").eq(sectionNum).addClass("selected");
    $("#section-title").text($(".section.selected").attr("data-title"));
    let sectionId = $(".section.selected").attr("id");
    let sectionHash = "#" + sectionId.slice(0, sectionId.length - 8);
    if (window.location.hash != sectionHash) {
      window.location.hash = sectionHash;
    }

  }


})();
