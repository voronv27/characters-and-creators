(function () {
  //Variables

  const URL = "https://voronv.pythonanywhere.com"
  let generalInfo;

  let numSections;
  let sectionNum = 0;


  $(async function () {
    init();

    //Section logic
    $("#prev-section").click(function () {
      sectionNum = sectionNum - 1 < 0 ? sectionNum : sectionNum - 1;
      updateSection();
    });

    $("#next-section").click(function () {
      sectionNum = sectionNum + 1 >= numSections ? 0 : sectionNum + 1;
      updateSection();
    });

    //Update section
    $(window).on('hashchange', function () {
      sectionFromURL();
      updateSection();
    });

    //General Section 
    let genInfo = await generalInfo.then((resp) => resp.json());
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
