//JS file that stores utility functions/variables such as comp.

// comp contains html and functions for elements dynamically populated by the site
const comp = {
  accItem: {
    html: `
      <div id="new" class="acc-item hidden">
        <div class="header">
          <div class="title"></div>
          <img class="icon-img">
          <i class="fa-solid fa-chevron-down acc-icon"></i>
        </div>
        <div class="cont"></div>
      </div>`,
    func: function (comp) {
      comp.click(function (event) {
        $(this).closest(".acc").children().not(this).addClass("hidden");
        $(this).toggleClass("hidden");
      });
    }
  },
classCont: {
      html: `
        <div id="new">
          <div class="desc"></div>
          <button class="more-info">More Info</button>
          <button class="select-class">Select Class</button>
        </div>`,
      func: function (comp) {
        comp.children(".more-info").click(function (e) {
          e.stopPropagation();
          const dropdown = $(this).closest(".acc-item");
          const className = dropdown.find(".title").first().text();
          openPopup(`class-more-info-popup-${className}`, className);
        });
        comp.children(".select-class").click(function (e) {
          e.stopPropagation();
          const dropdown = $(this).closest(".acc-item");
          const className = dropdown.find(".title").first().text();
          openPopup('class-select-popup', className);
        });
    }
  },
  selectedClassCont: {
    html: `
        <div id="new">
          <div class="desc"></div>
          <button class="more-info">More Info</button>
          <button class="select-class">Update Class</button>
          <button class="remove-class">Remove Class</button>
        </div>`,
      func: function (comp) {
        comp.children(".more-info").click(function (e) {
          e.stopPropagation();
          const dropdown = $(this).closest(".acc-item");
          const className = dropdown.find(".title").first().text().split(" ")[0];
          openPopup(`class-more-info-popup-${className}`, className);
        });
        comp.children(".select-class").click(function (e) {
          e.stopPropagation();
          const dropdown = $(this).closest(".acc-item");
          const className = dropdown.find(".title").first().text().split(" ")[0];
          openPopup('class-select-popup', className);
        });
        comp.children(".remove-class").click(function (e) {
          e.stopPropagation();
          const dropdown = $(this).closest(".acc-item");
          const className = dropdown.find(".title").first().text().split(" ")[0];
          $(`#acc-item-${className}-selected`).remove();

          // remove this class from char
          delete char["class"][className];

          // remove if was primaryClass
          if (char["primaryClass"] == className) {
            var primaryClass = null;
            var maxLevel = 0;
            for (c in char.class) {
              if (char.class[c] > maxLevel) {
                maxLevel = char.class[c];
                primaryClass = c;
              }
            }
            char["primaryClass"] = primaryClass;

            $("#primary-class").html(primaryClass);
            if (primaryClass) {
              $("#stat-suggestion1").show();
              $("#stat-suggestion2").show();
              $("#stat-suggestion3").show();
              $("#stat-suggestion4").show();
            } else {
              $("#stat-suggestion1").hide();
              $("#stat-suggestion2").hide();
              $("#stat-suggestion3").hide();
              $("#stat-suggestion4").hide();
            }
          }
          // reset specificInfo because we changed class
          specificInfo = null;
        });
    }
  },
  langCont: {
    html: `
      <div id="new">
        <label for="select-language-" class="select-language">Select language:</label>
        <select id="select-language-" class="select">
          <option selected="selected"></option>
       </select>
        <div class="desc"></div>
      </div>`,
      func: function (comp) {

        const langDropdown = comp.find("#select-language-");

        langDropdown.append();
        genInfo["languages"].keys().foreach(lang => {
          langDropdown.append(lang);
        });
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
  },
  dropdownItem: {
    html: `
      <div id="new" class="dropdown-item">
      </div>
      `,
    func: null
  },
  moreInfo: {
    html: `
      <div id="new" style="display:none;">
        <div class="desc">
        </div>
        <button class="select-class">Select Class</button>
      </div>
      `,
    func: function (comp) {
      comp.children(".select-class").click(function (e) {
        e.stopPropagation();
        const className = $("#popup-title").text();
        openPopup("class-select-popup", className);
      });
    }
  }
};

// function to open the popup window and set the title as desired
const popupWindow = $("#popup-window");
const popupTitle = $("#popup-title");
var currentPopup;
function openPopup(contentId, title) {
  popupWindow.show();
  popupTitle.text(title);

  // if there's some existing popup open, hide it
  if (currentPopup) {
    currentPopup.hide();
  }
  currentPopup = $(`#${contentId}`);
  currentPopup.show();
}

// closes the popup window and hides the current popup content
function closePopup() {
  popupWindow.hide();
  if (currentPopup) {
    currentPopup.hide();
  }
}

// show/hide searchbar dropdown when clicking inside/outside
// searchbar container
const searchbarContainer = $("#searchbar-container")[0];
const searchbarDropdown = $("#searchbar-dropdown");
$(document).on("click", function (e) {
  if ($.contains(searchbarContainer, e.target)) {
    searchbarDropdown.show();
  } else {
    searchbarDropdown.hide();
  }
});

// upon searchbar input, display classes matching search value
function filterItems() {
    var input, filter, classAcc, accItem, i, txtValue;
    input = document.getElementById("searchbar");
    filter = input.value.toUpperCase();
    classAcc = document.getElementById("class-acc");
    accItem = classAcc.getElementsByClassName("acc-item");
    
    var dropdown = document.getElementById("searchbar-dropdown");
    var dropdownItems = dropdown.getElementsByClassName("dropdown-item");
    
    // show/hide
    for (i = 0; i < accItem.length; i++) { 
        txtValue = $(accItem[i]).find(".title").first().text();
        if ($(accItem[i]).has('input').length) {
          // custom has an input element in the title, set txtValue manually
          txtValue = "Custom";
        }
        if (filter == "" || txtValue.toUpperCase().indexOf(filter) == 0) {
            accItem[i].style.display = "";
            dropdownItems[i].style.display = "";
        } else {
            accItem[i].style.display = "none";
            dropdownItems[i].style.display = "none";
        }
    }
}

// updates the text in a searchbar with the provided value
function updateSearchBar(text) {
  const searchbar = $("#searchbar");
  searchbar.val(text);
}



function updateProficiencies() {
  char["proficiencies"] = [];//these should not bet initailized here, placeholder until i figure out when they get stored/whatever
  char["expertise"] = [];
  char["proficiencyOverlap"] = 0;

}