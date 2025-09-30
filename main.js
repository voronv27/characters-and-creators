(function () {
  //Variables

  let numSections;
  let sectionNum = 0;

  let apiData;

  $(function () {
    init();
    $("#prev-section").click(function () {
      sectionNum = sectionNum - 1 < 0 ? sectionNum : sectionNum - 1;
      updateSection();
    });
    $("#next-section").click(function () {
      sectionNum = sectionNum + 1 >= numSections ? 0 : sectionNum + 1;
      updateSection();
    });
  });

  function init() {
    numSections = $(".section").length;
    updateSection();
  }

  function initApiData() {
    fetch("https://voronv.pythonanywhere.com/classnames")
  }

  function updateSection() {
    $(".section").hide();
    $(".section").eq(sectionNum).show();
  }


})();
