//JS file that stores all Section related vars/functions

let numSections;
let sectionNum = 0;
function init() {
  numSections = $(".section").length;

  const panzoom = Panzoom($("#character-sheet")[0], {
    excludeClass: 'x',
  });

  $("#character-sheet-parent")[0].addEventListener('wheel', panzoom.zoomWithWheel);


  //Character Sheet
  $("#character-sheet").sortable({
    connectWith: '.comp, .sub-comp',
    handle: ".handle",
    placeholder: "placeholder",
    forcePlaceholderSize: true,
  
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
  
  $("#character-sheet .comp").resizable({
    create: function (event, ui) {
      $(".ui-resizable-se").html(`<i class="fa-solid fa-up-right-and-down-left-from-center"></i>`).addClass("x");
    }
  });

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

  $("#export-pdf").click(function () {
    //Export format
    $("#character-sheet-parent").addClass("export-format");
    html2pdf($("#character-sheet-parent")[0], {
      filename: 'character-sheet.pdf',
      html2canvas: { scale: 1 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    });
    setTimeout(function () {
      $("#character-sheet-parent").removeClass("export-format");
    }, 1000);

  });
}

function sectionFromURL() {
  let currentSection = window.location.hash + "-section";
  if ($(currentSection).hasClass("section")) {
    sectionNum = $(currentSection).index();
  }
}

async function updateSection() {
  // if we don't have specificInfo, get it from the API
  if (!specificInfo && sectionNum > 3) {
    if (specificApiData()) {
      specInfo = await specificInfo.then((resp) => resp.json());
      updateSpecInfo();
    }
  }

  // if we are on the character sheet, fill in info
  if (sectionNum == 10) {
    updateCharacterSheet();
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