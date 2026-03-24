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
          var customClassName;
          if (!className) {
            customClassName = dropdown.find("input").first().val();
          }

          // reset dropdown values in popup
          var level = 1;
          var subclass = "None";
          if (char.class) {
            if (className && char.class[className]) {
              level = char.class[className]["level"];
              if (char.class[className]["subclass"]) {
                subclass = char.class[className]["subclass"];
              }
            } else if (customClassName && char.class[customClassName]) {
              level = char.class[customClassName]["level"];
            }
          }
          $("#select-level-").val(level);
          if (subclass != "None") {
            $("#select-subclass option").filter(function() {
              return $(this).text() == subclass;
            }).prop('selected', true);
          } else {
            $('#select-subclass').val(subclass);
          }

          // reset subclass description
          $('#subclass-desc .cont').hide();
          $(`#${subclass.replaceAll(' ', '-')}`).show();

          // open popup
          if (className) {
            openPopup('class-select-popup', className);
          } else {
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
          var customClassName;
          if (className.includes("Custom")) {
            className = className.split(") ")[1];
            className = className.split(" ").slice(0, -1).join(" ");
            customClassName = className;
            className = `(Custom Class) ${className}`;
          } else {
            className = className.split(" ")[0];
          }
          // reset dropdown values in popup
          var level = 1;
          var subclass = "None";
          if (char.class) {
            if (className && char.class[className]) {
              level = char.class[className]["level"];
              if (char.class[className]["subclass"]) {
                subclass = char.class[className]["subclass"];
              }
            } else if (customClassName && char.class[customClassName]) {
              level = char.class[customClassName]["level"];
            }
          }
          $("#select-level-").val(level);
          if (subclass != "None") {
            $("#select-subclass option").filter(function() {
              return $(this).text() == subclass;
            }).prop('selected', true);
          } else {
            $('#select-subclass').val(subclass);
          }

          // reset subclass description
          $('#subclass-desc .cont').hide();
          $(`#${subclass.replaceAll(' ', '-')}`).show();

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
              if (char.class[c]["level"] > maxLevel) {
                maxLevel = char.class[c]["level"];
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

        // reset dropdown values in popup
        var level = 1;
        var subclass = "None";
        if (char.class) {
          if (className && char.class[className]) {
            level = char.class[className]["level"];
            if (char.class[className]["subclass"]) {
              subclass = char.class[className]["subclass"];
            }
          } else if (customClassName && char.class[customClassName]) {
            level = char.class[customClassName]["level"];
          }
        }
        $("#select-level-").val(level);
        if (subclass != "None") {
          $("#select-subclass option").filter(function() {
            return $(this).text() == subclass;
          }).prop('selected', true);
        } else {
          $('#select-subclass').val(subclass);
        }

        // reset subclass description
        $('#subclass-desc .cont').hide();
        $(`#${subclass.replaceAll(' ', '-')}`).show();

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
function filterItems(sectionName) {
    var input, filter, classAcc, accItem, i, txtValue;
    input = document.getElementById("searchbar");
    filter = input.value.toUpperCase();
    acc = document.getElementById(sectionName + "-acc");
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

// updates the text in a searchbar with the provided value
function updateSearchBarSpell(text) {
  const searchbarSpell = $("#searchbar-spell");
  searchbarSpell.val(text);
}

function updateProficiencies() {  
  /*

    General Strategy.
    Skills are determined by following format.
    skills ["skill1", "skill2", choice{count:2, options:["skill3", "skill4", "skill5"]}]
    
    check to see if dict exists for respective class/race/background.
    if it does, loop through keys. If key is skills, add to proficiencies with format "class:skill name". If not, add to proficiencies with format "class:proficiency name".

  */


  let profHtml = "";
  let possibleSkills = [];
  let className = char["primaryClass"];
  var toggleEverything = false;
  if (char["primaryClass"] == "Custom") {
    toggleEverything = true;
    char["proficiencyOverlap"] = 2;
  } else {
    let classDict = specInfo["proficiencies"]["class"];
    console.log("classDict: ", classDict);
    if (classDict) {
      for (k in classDict) {
        console.log("key: ", k);
        console.log("variable type: ", typeof(classDict[k])); 
        for (p in classDict[k]) {
          console.log("prof: ", classDict[k][p]);
          console.log("variable type: ", typeof(classDict[k][p])); 
          if (classDict[k][p] == "Tools") {
            if (classDict[k][p][0] == 'None') {
              continue;
            } else {
              for (t in classDict[k][p]) {  
                char["proficiencies"][`Tool: ${classDict[k][p][t]}`] = true;
                console.log("Adding tool proficiency: ", `Tool: ${classDict[k][p][t]}`);
              }
            }
          }
          if (typeof(classDict[k][p]) === "number") {
            console.log("Adding proficiency overlap: ", classDict[k][p]);
            char["proficiencyOverlap"] += classDict[k][p];
            console.log("Updated proficiency overlap: ", char);
          }
          else if (typeof(classDict[k][p]) === "object") {
            for (s in classDict[k][p]) { 
              possibleSkills.push(classDict[k][p][s]);
              console.log ("Adding possible skill: ", classDict[k][p][s]);
            }
          }
          else {
            char["proficiencies"][k] = classDict[k][p];
            console.log("Adding proficiency: ", `${k}: ${classDict[k][p]}`);
          }
        }
        
      }
    } else {
      console.log("You are missing a proper class, and thus missing skill choices!");
    }
    console.log("possibleSkills: ", possibleSkills);
    console.log("Updating proficiencies...");
    console.log(specInfo["proficiencies"]);
    console.log("class dict: ", classDict);
    console.log("char dict: ", char);
  }

  let raceDict = specInfo["proficiencies"]["race"];
  let bgDict = specInfo["proficiencies"]["background"];

  let race = char["race"];
  let background = char["background"];


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