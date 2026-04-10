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
          <button class="select-btn">Select Class</button>
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
        comp.children(".select-btn").click(function (e) {
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
            console.log(genInfo);
          // show valid dropdown options
          $("#select-subclass option").hide();
          $("#select-subclass option[value='None']").show();
            addEventListener("#select-level-", function(){
              if (level > genInfo["classes"][className]["subclassLevel"]){
                $(`#select-subclass option[value='${className}']`).show();
            }
                else{

                    $("#select-subclass option").hide();
                    $("#select-subclass option[value='None']").show();
                    // $(`#select-subclass option[value='${className}']`).hide();
                }
            })

        });
    }
  },
  selectedClassCont: {
    html: `
        <div id="new">
          <div class="desc"></div>
          <button class="more-info">More Info</button>
          <button class="select-btn">Update Class</button>
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
        comp.children(".select-btn").click(function (e) {
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
            addEventListener("#select-level-", function(){
              if (level > genInfo["classes"][className]["subclassLevel"]){
                $(`#select-subclass option[value='${className}']`).show();
            }
                else{
                $(`#select-subclass option[value='${className}']`).hide();
                }
            })

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
    // TODO: rename subclassDesc to something more generic
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
        <div class="grid-2-col">
          <div class="race-text-container">
            <div class="short-desc"></div>
            <div class="desc race-desc"></div>
          </div>
          <div class="race-img-container">
            <img class="race-img">
          </div>
        </div>
        <button class="more-info">More Info</button>
        <button class="select-btn">Select Race</button>
      </div>
    `,
    func: function (comp) {
      comp.children(".more-info").click(function (e) {
          e.stopPropagation();
          const dropdown = $(this).closest(".acc-item");
          const raceName = dropdown.find(".title").first().text();
          if (raceName) {
            openPopup(`race-more-info-popup-${raceName}`, raceName);
          } else {
            const customRaceName = dropdown.find("input").first().val();
            openPopup('race-more-info-popup-Custom', `(Custom Race) ${customRaceName}`);
          }
        });
      comp.children(".select-btn").click(function (e) {
        e.stopPropagation();

        const raceName = $(this).closest(".acc-item").find(".title").first().text();

        var customRaceName;
        if (raceName.includes("Custom")) {
          customRaceName = raceName.split(") ")[1];
          customRaceName = customRaceName.split(" ").slice(0, -1).join(" ");
        }

        // reset dropdown values in popup
        var subrace = "None";
        if (char.race) {
          if (raceName && char.race == raceName) {
            if (char.subrace) {
              subrace = char.subrace;
            }
          } else if (customRaceName && char.race == customRaceName) {
            if (char.subrace) {
              subrace = char.subrace;
            }
          }
        }
        if (subrace != "None") {
          $("#select-subrace option").filter(function() {
            return $(this).text() == subrace;
          }).prop('selected', true);
        } else {
          $('#select-subrace').val(subrace);
        }

        // reset subrace description
        $('#subrace-desc .cont').hide();
        $(`#${subrace.replaceAll(' ', '-')}`).show();

        openPopup("race-select-popup", raceName);

        // show valid dropdown options
        $("#select-subrace option").hide();
        $("#select-subrace option[value='None']").show();
        $(`#select-subrace option[value='${raceName}']`).show();
      });
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
        <div class="overflow-fade">
          <div class="desc">
          </div>
        </div>
        <div class="overflow-show">
          <button class="select-btn">Select Class</button>
        </div>
      </div>
      `,
    func: function (comp) {
      comp.find(".select-btn").click(function (e) {
        e.stopPropagation();
        const className = $("#popup-title").text();

        var customClassName;
        if (className.includes("Custom")) {
          customClassName = className.split(") ")[1];
          customClassName = customClassName.split(" ").slice(0, -1).join(" ");
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

        openPopup("class-select-popup", className);

        // show valid dropdown options
        $("#select-subclass option").hide();
        $("#select-subclass option[value='None']").show();
          if (level > genInfo[className]["subclassLevel"]){
            $(`#select-subclass option[value='${className}']`).show();
          }
        addEventListener("#select-level-", function(){
            console.log("Current level is:", level);
            if (level > genInfo["classes"][className]["subclassLevel"]){
                $(`#select-subclass option[value='${className}']`).show();
            }
            else{
                $(`#select-subclass option[value='${className}']`).hide();
            }
        })

      });
    }
  }, 
  moreInfoRace: {
    html: `
      <div id="new" style="display:none;">
        <div class="overflow-fade">
          <div class="desc">
          </div>
        </div>
        <div class="overflow-show">
          <button class="select-btn">Select Race</button>
        </div>
      </div>
      `,
    func: function (comp) {
      comp.find(".select-btn").click(function (e) {
        e.stopPropagation();
        const raceName = $("#popup-title").text();

        var customRaceName;
        if (raceName.includes("Custom")) {
          raceClassName = raceName.split(") ")[1];
          customRaceName = customRaceName.split(" ").slice(0, -1).join(" ");
        }

        // reset dropdown values in popup
        var subrace = "None";
        if (char.race) {
          if (raceName && char.race == raceName) {
            if (char.subrace) {
              subrace = char.subrace;
            }
          } else if (customRaceName && char.race == customRaceName) {
            if (char.subrace) {
              subrace = char.subrace;
            }
          }
        }
        if (subrace != "None") {
          $("#select-subrace option").filter(function() {
            return $(this).text() == subrace;
          }).prop('selected', true);
        } else {
          $('#select-subrace').val(subrace);
        }

        // reset subrace description
        $('#subrace-desc .cont').hide();
        $(`#${subrace.replaceAll(' ', '-')}`).show();

        openPopup("race-select-popup", raceName);

        // show valid dropdown options
        $("#select-subrace option").hide();
        $("#select-subrace option[value='None']").show();
        $(`#select-subrace option[value='${raceName}']`).show();
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
const searchbars = ["", "race", "background", "language", "spell"];
for (const s of searchbars) {
  var contId = "#searchbar-container";
  var dropId = "#searchbar-dropdown";
  if (s != "") {
    contId = "#searchbar-" + s + "-container";
    dropId = "#searchbar-" + s + "-dropdown";
  }
  const searchbarContainer = $(contId)[0];
  const searchbarDropdown = $(dropId);
  $(document).on("click", function (e) {
    if ($.contains(searchbarContainer, e.target)) {
      // dropdown gets hidden if you click on a dropdown item,
      // don't reset it to be shown
      if ($(e.target).closest('.dropdown-item').length <= 0) {
        searchbarDropdown.show();
      }
    } else {
      searchbarDropdown.hide();
    }
  });
}

// upon searchbar input, display classes matching search value
function filterItems(sectionName) {
    var input, filter, classAcc, accItem, i, txtValue, id, dropdownId;
    if (sectionName == "class") {
      id = "searchbar";
      dropdownId = "searchbar-dropdown";
    } else {
      id = `searchbar-${sectionName}`;
      dropdownId = `searchbar-${sectionName}-dropdown`;
    }
    input = document.getElementById(id);
    filter = input.value.toUpperCase();
    acc = document.getElementById(sectionName + "-acc");
    accItem = acc.getElementsByClassName("acc-item");
    
    var dropdown = document.getElementById(dropdownId);
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
function updateSearchBar(text, id="searchbar") {
  const searchbar = $(`#${id}`);
  searchbar.val(text);
}

function updateProficiencies() {  
  /*

    General Strategy.
    Skills are determined by following format.
    skills ["skill1", "skill2", choice{count:2, options:["skill3", "skill4", "skill5"]}]
    
    check to see if dict exists for respective class/race/background.
    if it does, loop through keys. If key is skills, add to proficiencies with format "class:skill name". If not, add to proficiencies with format "class:proficiency name".

  */

  let toolsEditable = false;
  let profHtml = "";
  let possibleSkills = [];
  let className = char["primaryClass"];
  var toggleEverything = false;
  //console.log("Class Name Checking: ", className);
  const classList = ["Barbarian", "Bard", "Cleric", "Druid", "Fighter", "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard"];
  if (!(char["primaryClass"] in classList)) {
    //console.log("Primary class not in class list, so skipping proficiency update for class and toggling all proficiency boxes: ", char["primaryClass"]);
    toggleEverything = true;
    char["proficiencyOverlap"] = 2;
  } else if (className != null && (className in classList)) {
    let classDict = specInfo["proficiencies"]["class"];
    //console.log("classDict: ", classDict);
    if (classDict) {
      for (k in classDict) {
        //console.log("key: ", k);
        //console.log("variable type: ", typeof(classDict[k])); 
        for (p in classDict[k]) {
          console.log("prof: ", classDict[k][p]);
          console.log("variable type: ", typeof(classDict[k][p])); 
          if (classDict[k][p] == "Tools") {
            if (classDict[k][p][0] == 'None') {
              continue;
            } else {
              for (t in classDict[k][p]) {  
                char["proficiencies"]["tools"].push(classDict[k][p][t]);
                console.log("Adding tool proficiency: ", `Tool: ${classDict[k][p][t]}`);
              }
            }
          }
          if (classDict[k][p] == "subclass") {
            continue;
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
            console.log("dictionary test: ", char["proficiencies"][k]);
            console.log("Adding proficiency: ", `${k}: ${classDict[k][p]}`);
            char["proficiencies"][`${k}`].push(classDict[k][p]);
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
  console.log("bgDict: ", bgDict);

  let race = char["race"];
  if (race == "Custom") {
    toggleEverything = true;
    char["proficiencyOverlap"] += 1;
  } else if (race != null) {
    console.log("raceDict: ", raceDict);

  }
  let background = char["background"];
  if (background == "Custom") {
    toggleEverything = true;
    char["proficiencyOverlap"] += 1;
  } else if (background != null) {
    console.log("bgDict: ", bgDict); //keys are usually either skills or tools
    for (k in bgDict) {
      console.log("key: ", k, "value: ", bgDict[k], "overall dict: ", bgDict);
      if (k == "skills") {
        for (p in bgDict[k]) {
          console.log("Adding skill proficiency: ", `Background skill choice: ${bgDict[k][p]}`);
          if (typeof(bgDict[k][p]) == "string") {
            console.log("Adding skill proficiency: ", `Background: ${bgDict[k][p]}`);
            if (bgDict[k][p] in char["proficiencies"]["skills"]) {
              char["proficiencyOverlap"] += 1;
            } else {
              char["proficiencies"]["skills"].push(bgDict[k][p]);
              document.getElementById(`${bgDict[k][p]}`).checked = true;
            }
          } else {
            //console.log("checking dicgionary for skill choice: ", bgDict[k][p]["choice"]["count"], bgDict[k][p]["choice"]["options"]);
            char["proficiencyOverlap"] += bgDict[k][p]["choice"]["count"];
            for (o in bgDict[k][p]["choice"]["options"]) {
              possibleSkills.push(bgDict[k][p]["choice"]["options"][o]);
              //console.log("Adding possible skill: ", bgDict[k][p]["choice"]["options"][o]);
            }
          }
        }
      } else if (k == "tools") {  //this shit is imparsable so add text box showing what you have proficiency in and let every box be editable
        for (p in bgDict[k]) {
          if (bgDict[k][p] != undefined) {
            console.log("Adding tool proficiency: ", bgDict[k][p]);
            char["proficiencies"]["tools"].push(bgDict[k][p]);
            if (!toolsEditable) {
              toolsEditable = true;
              let toolsArray = ["cobblerTools", "cookUtensils", "glassblowerTools", "jewelerTools", "leatherworkerTools", "masonTools", "painterTools", "pottersTools", "smithTools","tinkerTools", "weaverTools", "woodcarverTools", "bagpipes","drum","dulcimer","flute", "lute","lyre", "horn", "pan flute", "shawm", "viol","diceSet", "dragonChessSet", "playingCardSet","threeDragonAnteSet", "disguiseKit", "forgeryKit", "herbalismKit","navigatorTools", "theivesTools", "poisonerKit"];
              for (t in toolsArray) {
                const toolCheckbox = document.getElementById(toolsArray[t]);
                if (toolCheckbox) {
                  toolCheckbox.disabled = false;
                }
              }
            }
          }
          else {  //this should hopefully not print
            console.log("This should be empty: ", bgDict[k]);
          }
        }
      }
    }
  }
  console.log(char["proficiencies"]);
  document.getElementById("appliedProficiencies").innerHTML = profHtml;

  for (s in char["proficiencies"]) {    //for each proficiency within the proficiency types (armors, weapons, tools, saving throws, skills), loop through and add to the html list of proficiencies
    for (p in char["proficiencies"][s]) {
      console.log("Adding proficiency to html: ", char["proficiencies"][s][p]);
      profHtml += `<div id = "${char["proficiencies"][s][p]}">${char["proficiencies"][s][p]}</div>`;
    }
    console.log(char["proficiencies"][s]);
  }
  for (s in possibleSkills) {    //for each proficiency within the possible skills, find their corresponding checkbox and enable them for selection.
    const checkbox = document.getElementById(possibleSkills[s]);
    if (checkbox) {
      checkbox.disabled = false;
    }
  }
  for (s in char["proficiencies"]) {
    let arr = char["proficiencies"][s];
    console.log("Where am I?", s)
    for (p in arr) {
      if (s!="tools") {
        const checkbox = document.getElementById(char["proficiencies"][s][p]);
        if (checkbox) {
          checkbox.checked = true;
          if (char["proficiencies"][s][p] == "Simple weapons" || char["proficiencies"][s][p] == "martial weapons") {

            checkAllthatApply(char["proficiencies"][s][p]);
          }
        }
      }
    }
  }
  document.getElementById("appliedProficiencies").innerHTML = profHtml;

  if (toggleEverything) {
    proficiencyOverlap = "infinite";
    char["proficiencyOverlap"] = "infinite";
    let skillList = ["Athletics", "Acrobatics", "Sleight of Hand", "Stealth", "Arcana", "History", "Investigation", "Nature", "Religion", "Animal Handling", "Insight", "Medicine", "Perception", "Survival", "Deception", "Intimidation", "Performance", "Persuasion"];
    for (sk in skillList) {
      const skillCheckbox = document.getElementById(skillList[sk]);
      if (skillCheckbox) {
        skillCheckbox.disabled = false;
      }
    }

    let equipmentList = ["Light armor", "medium armor", "heavy armor", "shields", "Simple weapons", "martial weapons"];
    for (e in equipmentList) {
      const equipCheckbox = document.getElementById(equipmentList[e]);
      if (equipCheckbox) {
        equipCheckbox.disabled = false;
        if (equipmentList[e] == "Simple weapons" || equipmentList[e] == "martial weapons") {
          checkAllthatApply(equipmentList[e]);
        }
      }
    }

    let savesList = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
    for (sa in savesList) {
      const saveCheckbox = document.getElementById(savesList[sa]);
      if (saveCheckbox) {
        saveCheckbox.disabled = false;
      }
    }

    let toolsList = ["alchemistSupplies", "brewerSupplies", "calligrapherSupplies", "carpenterTools", "cartographerTools", "cobblerTools", "cookUtensils", "glassblowerTools", "jewelerTools", "leatherworkerTools", "masonTools", "painterTools", "pottersTools", "smithTools","tinkerTools", "weaverTools", "woodcarverTools", "bagpipes","drum","dulcimer","flute", "lute","lyre", "horn", "pan flute", "shawm", "viol","diceSet", "dragonChessSet", "playingCardSet","threeDragonAnteSet", "disguiseKit", "forgeryKit", "herbalismKit","navigatorTools", "thievesTools", "poisonerKit"];
    for (t in toolsList) {
      const toolCheckbox = document.getElementById(toolsList[t]);
      if (toolCheckbox) {
        toolCheckbox.disabled = false;
      }
    }
  }
  document.getElementById("remaingProficiencies").innerHTML = char["proficiencyOverlap"];

}

function checkAllthatApply(checkboxName) {
  //console.log("checking all that apply for: ", checkboxName);
  //console.log("s: ", char["proficiencies"][s]);
  if (checkboxName == "Simple weapons") {
    const simpleWeapons = ["club", "dagger", "greatclub", "handaxe", "javelin", "light hammer", "mace", "quarterstaff", "sickle", "spear"];
    for (w in simpleWeapons) {
      const checkbox = document.getElementById(simpleWeapons[w]);
      //console.log("checkbox: ", checkbox);
      if (checkbox) {
        checkbox.checked = document.getElementById(checkboxName).checked;
        proficiencyCheckboxClicked(simpleWeapons[w], true);
      }
    }

  } else if (checkboxName == "martial weapons") {
    const martialWeapons = ["battleaxe", "flail", "glaive", "greataxe", "greatsword", "halberd", "lance", "longsword", "maul", "morningstar", "pike", "rapier", "scimitar", "trident", "war pick", "warhammer", "whip", "blowgun", "hand crossbow", "heavy crossbow", "longbow", "net"]; 
    for (w in martialWeapons) {
      const checkbox = document.getElementById(martialWeapons[w]);
      if (checkbox) {
        checkbox.checked = document.getElementById(checkboxName).checked;
        proficiencyCheckboxClicked(martialWeapons[w], true);
      }
    }
  }

}

function proficiencyOverlapCheck(charge) {
  if (proficiencyOverlap != "infinite") {
    if (charge == "positive") {
      if (char["proficiencyOverlap"] == 0) {
        console.log("removing a proficiency and can now add more proficiencies"); //previously had no proficiencies left to add, but now has some after removing one, so update the webpage to reflect this change
        for (s in possibleSkills) {
          //console.log("checking possible skill: ", possibleSkills[s]);
          if (document.getElementById(possibleSkills[s]) && !document.getElementById(possibleSkills[s]).checked) {
            document.getElementById(possibleSkills[s]).disabled = false;
          }
        }
      }
      char["proficiencyOverlap"] += 1;
    } else if (charge == "negative") {
      char["proficiencyOverlap"] -= 1;
      if (char["proficiencyOverlap"] == 0) {
        //console.log("Adding last available proficiency."); //no longer any left to add, need to disable any non-checked proficiency checkboxes to reflect this change on the webpage
        for (s in possibleSkills) {
          //console.log("checking possible skill: ", possibleSkills[s]);
          if (document.getElementById(possibleSkills[s]) && !document.getElementById(possibleSkills[s]).checked) {
            document.getElementById(possibleSkills[s]).disabled = true;
          }
        }
      }
    }
  }
  //console.log("Updated proficiency overlap: ", char["proficiencyOverlap"]);
  document.getElementById("remaingProficiencies").innerHTML = char["proficiencyOverlap"];
}

function proficiencyCheckboxClicked(checkboxName, Special=false) { //when a proficiency checkbox is clicked, add/remove that proficiency from the char's proficiency list and update the html list of proficiencies accordingly.
  let stringSplit = checkboxName.split("-");
  let name = stringSplit[0];
  let category = stringSplit[1];
  let profHtml = document.getElementById("appliedProficiencies").innerHTML;
  //console.log("checkbox clicked: ", checkboxName);
  if (name=="Simple weapons" || name=="martial weapons") {
    checkAllthatApply(name);
  }

  let listingID = name.replaceAll(" ", "-") + "-added";
  if (!Special) {//special is for batch checking of simple and martial weapons, so we don't want to add the individual weapon to the proficiency list 
    //console.log("Special is false, updating proficiency list and html...");
    //console.log("proficiency checkbox element: ", document.getElementById(name));
    if (document.getElementById(name).checked) {  //element didn't exist before, add it to the list of proficiencies      
      char["proficiencies"][category].push(name);
      //console.log(char["proficiencies"]);
      profHtml += `<div id = "${listingID}">${name}</div>`;
      document.getElementById("appliedProficiencies").innerHTML = profHtml;
      proficiencyOverlapCheck("negative");
    } else { //element existed before, remove it from the list of proficiencies
      //console.log("Removing proficiency: ", listingID, "object: ", document.getElementById(listingID));
      let profCheck = char["proficiencies"];
      //console.log("checkbox category: ", category, "proficiency category: ", profCheck[category]);
      if (profCheck[category].includes(name)) {
        profCheck[category] = profCheck[category].filter(function(value, index, arr){ 
          return value != name;
        });
      }
      //console.log("Updated proficiency list: ", profCheck[category]);
      document.getElementById(listingID).remove();
      //console.log("Removal Check: ", document.getElementById("appliedProficiencies").innerHTML); //the element is no longer in the document, however the webpage is not updating the html list of proficiencies to reflect this change. I have no idea why.
      proficiencyOverlapCheck("positive");
    }
  } 

}
