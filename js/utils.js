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
          if (className) {
            openPopup(`class-more-info-popup-${className}`, className);
          } else {
            const customClassName = dropdown.find("input").first().val();
            openPopup('class-more-info-popup-Custom', `(Custom Class) ${customClassName}`);
          }
        });
        comp.children(".select-class").click(function (e) {
          e.stopPropagation();
          const dropdown = $(this).closest(".acc-item");
          const className = dropdown.find(".title").first().text();
          if (className) {
            openPopup('class-select-popup', className);
          } else {
            const customClassName = dropdown.find("input").first().val();
            openPopup('class-select-popup', `(Custom Class) ${customClassName}`);
          }
          // show valid dropdown options
          $("#select-subclass option").hide();
          $("#select-subclass option[value='None']").show();
          $(`#select-subclass option[value='${className}']`).show();
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
          var className = dropdown.find(".title").first().text();
          if (className.includes("Custom")) {
            className = className.split(") ")[1];
            className = className.split(" ").slice(0, -1).join(" ");
            openPopup('class-more-info-popup-Custom', `(Custom Class) ${className}`);
          } else {
            className = className.split(" ")[0];
            openPopup(`class-more-info-popup-${className}`, className);
          }
        });
        comp.children(".select-class").click(function (e) {
          e.stopPropagation();
          const dropdown = $(this).closest(".acc-item");
          var className = dropdown.find(".title").first().text();
          if (className.includes("Custom")) {
            className = className.split(") ")[1];
            className = className.split(" ").slice(0, -1).join(" ");
            className = `(Custom Class) ${className}`;
          } else {
            className = className.split(" ")[0];
          }
          openPopup('class-select-popup', className);

          // show valid dropdown options
          $("#select-subclass option").hide();
          $("#select-subclass option[value='None']").show();
          $(`#select-subclass option[value='${className}']`).show();
        });
        comp.children(".remove-class").click(function (e) {
          e.stopPropagation();
          const dropdown = $(this).closest(".acc-item");
          var className = dropdown.find(".title").first().text();
          if (className.includes("Custom")) {
            className = className.split(") ")[1];
            className = className.split(" ").slice(0, -1).join(" ");
            className = className.replace(" ", "_");
          }
          else {
            className = className.split(" ")[0];
          }
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
  subclassDesc: {
    html: `
      <span id=new class="cont" style="display:none;">
      </span>`,
    func: null
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

        // show valid dropdown options
        $("#select-subclass option").hide();
        $("#select-subclass option[value='None']").show();
        $(`#select-subclass option[value='${className}']`).show();
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

//easier way to do this: if we can pull id and just get "race" "class" etc. we can adjust the consts to match that maybe?
//current implementation is a lazy workaround for now

//CLASS
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
    acc = document.getElementById("class-acc");
    accItem = acc.getElementsByClassName("acc-item");
    
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

//RACE
const searchbarContainerRace = $("#searchbar-race-container")[0];
const searchbarDropdownRace = $("#searchbar-race-dropdown");
$(document).on("click", function (e) {
  if ($.contains(searchbarContainerRace, e.target)) {
    searchbarDropdownRace.show();
  } else {
    searchbarDropdownRace.hide();
  }
});

// upon searchbar input, display classes matching search value
function filterItemsRace() {
    var input, filter, classAcc, accItem, i, txtValue;
    input = document.getElementById("searchbar-race");
    filter = input.value.toUpperCase();
    classAcc = document.getElementById("class-acc");
    accItem = classAcc.getElementsByClassName("acc-item");
    
    var dropdown = document.getElementById("searchbar-race-dropdown");
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
function updateSearchBarRace(text) {
  const searchbarRace = $("#searchbar-race");
  searchbarRace.val(text);
}

//BACKGROUND
const searchbarContainerBackground = $("#searchbar-background-container")[0];
const searchbarDropdownBackground = $("#searchbar-background-dropdown");
$(document).on("click", function (e) {
  if ($.contains(searchbarContainerBackground, e.target)) {
    searchbarDropdownBackground.show();
  } else {
    searchbarDropdownBackground.hide();
  }
});

// upon searchbar input, display classes matching search value
function filterItemsBackground() {
    var input, filter, classAcc, accItem, i, txtValue;
    input = document.getElementById("searchbar-background");
    filter = input.value.toUpperCase();
    classAcc = document.getElementById("class-acc");
    accItem = classAcc.getElementsByClassName("acc-item");
    
    var dropdown = document.getElementById("searchbar-background-dropdown");
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
function updateSearchBarBackground(text) {
  const searchbarBackground = $("#searchbar-background");
  searchbarBackground.val(text);
}

//PROFICIENCY
const searchbarContainerProficiency = $("#searchbar-proficiency-container")[0];
const searchbarDropdownProficiency = $("#searchbar-proficiency-dropdown");
$(document).on("click", function (e) {
  if ($.contains(searchbarContainerProficiency, e.target)) {
    searchbarDropdownProficiency.show();
  } else {
    searchbarDropdownProficiency.hide();
  }
});

// upon searchbar input, display classes matching search value
function filterItemsProficiency() {
    var input, filter, classAcc, accItem, i, txtValue;
    input = document.getElementById("searchbar-proficiency");
    filter = input.value.toUpperCase();
    classAcc = document.getElementById("class-acc");
    accItem = classAcc.getElementsByClassName("acc-item");
    
    var dropdown = document.getElementById("searchbar-proficiency-dropdown");
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
function updateSearchBarProficiency(text) {
  const searchbarProficiency = $("#searchbar-proficiency");
  searchbarProficiency.val(text);
}

//LANGUAGE
const searchbarContainerLanguage = $("#searchbar-language-container")[0];
const searchbarDropdownLanguage = $("#searchbar-language-dropdown");
$(document).on("click", function (e) {
  if ($.contains(searchbarContainerLanguage, e.target)) {
    searchbarDropdownLanguage.show();
  } else {
    searchbarDropdownLanguage.hide();
  }
});

// upon searchbar input, display classes matching search value
function filterItemsLanguage() {
    var input, filter, classAcc, accItem, i, txtValue;
    input = document.getElementById("searchbar-language");
    filter = input.value.toUpperCase();
    classAcc = document.getElementById("class-acc");
    accItem = classAcc.getElementsByClassName("acc-item");
    
    var dropdown = document.getElementById("searchbar-language-dropdown");
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
function updateSearchBarLanguage(text) {
  const searchbarLanguage = $("#searchbar-language");
  searchbarLanguage.val(text);
}

//SPELL
const searchbarContainerSpell = $("#searchbar-spell-container")[0];
const searchbarDropdownSpell = $("#searchbar-spell-dropdown");
$(document).on("click", function (e) {
  if ($.contains(searchbarContainerSpell, e.target)) {
    searchbarDropdownSpell.show();
  } else {
    searchbarDropdownSpell.hide();
  }
});

// upon searchbar input, display classes matching search value
function filterItemsSpell() {
    var input, filter, classAcc, accItem, i, txtValue;
    input = document.getElementById("searchbar-spell");
    filter = input.value.toUpperCase();
    classAcc = document.getElementById("class-acc");
    accItem = classAcc.getElementsByClassName("acc-item");
    
    var dropdown = document.getElementById("searchbar-spell-dropdown");
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
function updateSearchBarSpell(text) {
  const searchbarSpell = $("#searchbar-spell");
  searchbarSpell.val(text);
}

function updateProficiencies() {
  console.log("Updating proficiencies...");
  console.log(specInfo["proficiencies"]);
  let classDict = specInfo["proficiencies"]["class"];
  let raceDict = specInfo["proficiencies"]["race"];
  let bgDict = specInfo["proficiencies"]["background"];
  let className = char["primaryClass"];
  let race = char["race"];
  let background = char["background"];
  let profHtml = "";
  if (classDict != null) {
    for (k in classDict) {
      console.log("class dict key: ", k);
      console.log("class dict value: ", classDict[k]);
      if (classDict[k] != "None" && classDict[k] != null && k != "skills") {
        profHtml += `${classDict[k]}: <b>${className}</b><br>`;
        for (kk in classDict[k]) {
          console.log("class dict subkey: ", kk);
          console.log("class dict subvalue: ", classDict[k][kk]);
          let temp = className + ":" + k;
          char["proficiencies"][temp] = kk;
        }
      }
    }
  }
  if (raceDict != null) {
    for (k in raceDict) {
      profHtml += `<b>${raceDict[k]}:</b> ${k}<br>`;
    }
  }
  if (bgDict != null) {
    for (k in bgDict) {
      profHtml += `<b>${bgDict[k]}:</b> ${k}<br>`;
    }
  }
  console.log(char["proficiencies"]);
  document.getElementById("appliedProficiencies").innerHTML = profHtml;
}