//JS file that stores utility functions/variables such as comp.

// comp contains html and functions for elements dynamically populated by the site
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
          const dropdown = $(this).closest(".acc-item");
          const className = dropdown.find(".title").first().text();
          const classLevel = dropdown.find(".select option:selected").text();
          char.class[className] = classLevel;
          console.log(`class ${className}, level ${classLevel}`);

          openPopup('class-select-popup', className);

          // create the the class dropdowns
          var selectedClasses = "";
          var primaryClass = "";
          var maxLevel = 0;
          for (c in char.class) {
            if (char.class[c] > maxLevel) {
              maxLevel = char.class[c];
              primaryClass = c;
            }

            //console.log(`${c} ${char.class[c]}<br>\n`);
            selectedClasses += `${c} ${char.class[c]}<br>\n`;

            // to change anything about this item--look up jquery method to modify newDropDown in desired way
            const newDropdown = dropdown.clone();
            const newDropdownId = dropdown.attr('id') + '-selected';
            newDropdown.find(".select-class").remove();
            newDropdown.attr('id', newDropdownId);
            selectedClasses += newDropdown[0].outerHTML;
          }

          //console.log(selectedClasses);
          char["primaryClass"] = primaryClass;
          $("#chosen-class").html(selectedClasses);
          $("#primary-class").html(primaryClass);
          

          // reset specificInfo because we changed class
          specificInfo = null;
          $("#stat-suggestion1").show();
          $("#stat-suggestion2").show();
          $("#stat-suggestion3").show();
          $("#stat-suggestion4").show();
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
  },
  dropdownItem: {
    html: `
      <div id="new" class="dropdown-item">
      </div>
      `,
    func: null
  }
};

// function to open the popup window and set the title as desired
const popupWindow = $("#popup-window");
const popupTitle = $("#popup-title");
var currentPopup;
function openPopup(contentId, title) {
  popupWindow.show();
  popupTitle.text(title);
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