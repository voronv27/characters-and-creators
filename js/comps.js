//JS file that stores component related functions
//Note: the comp variable is stored separately in utils.js at the moment.
//Feel free to move it if we feel like that'd be best for organization.

// Constants
const P_B = "Parent Before";
const P_A = "Parent After";
const S_B = "Sibling Before";
const S_A = "Sibling After";

async function createClassComps(key) {
  // accordion
  let acc = initComp("accItem", "#class-acc");
  if (key == "Custom") {
    let nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Custom Class";
    acc.find(".title").append(nameInput);
  } else {
    acc.find(".title").text(key);
  }
  acc.attr("id", "acc-item-" + key);
  acc.find(".icon-img").attr("src", `assets/images/${key.toLowerCase()}.png`);
  let classCont = initComp("classCont", "#acc-item-" + key + " .cont");
  if (key == "Custom") {
    classCont.find(".desc").text("Your own custom class.");
  } else {
    classCont.find(".desc").text(genInfo["classes"][key]["short_desc"]);
  }

  // create the more info popup
  let moreInfoPopup = initComp("moreInfo", "#popup-inner-content");
  moreInfoPopup.attr("id", `class-more-info-popup-${key}`);
  if (key == "Custom") {
    moreInfoPopup.find(".desc").html("<br>No info available for custom classes.<br><br>");
  } else {
    converter = new showdown.Converter();
    htmlOutput = converter.makeHtml(genInfo["classes"][key]["desc"]);
    moreInfoPopup.find(".desc").html(htmlOutput);
  }

  // populate subclasses in the select class popup
  if (key != "Custom") {
    const subclassDropdown = $("#select-subclass");
    for (let i of genInfo["classes"][key]["archetypes"]) {
      const subclassName = i["name"];

      // populate dropdown
      const selOpt = new Option(subclassName, key);
      selOpt.style.display = "none";
      subclassDropdown.append(selOpt);

      // populate descs
      let subclassDesc = initComp("subclassDesc", "#subclass-desc");
      subclassDesc.attr("id", subclassName.replaceAll(" ", "-"));
      converter = new showdown.Converter();
      htmlOutput = converter.makeHtml(i["desc"].replaceAll("####", "##"));
      subclassDesc.html(htmlOutput);
    }
  }

  // searchbar dropdown
  let dropdownItem = initComp("dropdownItem", "#searchbar-dropdown");
  dropdownItem.text(key);
  dropdownItem.click(function () {
    updateSearchBar(key);
    filterItems('class');
    $("#searchbar-dropdown").hide();
  });
}

async function createRaceComps(key) {
  // accordion
  let acc = initComp("accItem", "#race-acc");
  if (key == "Custom-Race") {
    let nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Custom Race";
    acc.find(".title").append(nameInput);
  } else {
    acc.find(".title").text(key);
  }

  // populate race acc item information
  acc.attr("id", "acc-item-" + key);
  let raceCont = initComp("raceCont", "#acc-item-" + key + " .cont");
  if (key == "Custom-Race") {
    raceCont.find(".race-img").attr("src", `assets/images/custom-race.png`);
    raceCont.find(".short-desc").text("Your own custom race.");
    raceCont.find(".desc").html("<br>Type in your desired custom race name above and we'll add it to your character sheet! You will be able to select any proficiencies and languages you desire in the upcoming character creation steps.");
  } else {
    raceCont.find(".race-img").attr("src", `assets/images/${key.toLowerCase()}.png`);
    let shortDesc = genInfo["races"][key]["alignment"].replaceAll("*", "");
    shortDesc = shortDesc.replaceAll("_", "").replace("Alignment. ", "");
    raceCont.find(".short-desc").text(shortDesc);
    let raceDesc = getRaceDesc(genInfo["races"][key]);
    raceCont.find(".desc").html(raceDesc);
  }

  // searchbar dropdown
  let dropdownItem = initComp("dropdownItem", "#searchbar-race-dropdown");
  dropdownItem.text(key);
  dropdownItem.click(function () {
    updateSearchBar(key, "searchbar-race");
    filterItems('race');
    $("#searchbar-race-dropdown").hide();
  });

  // create the more info popup
  let moreInfoPopup = initComp("moreInfoRace", "#popup-inner-content");
  moreInfoPopup.attr("id", `race-more-info-popup-${key}`);
  if (key == "Custom-Race") {
    moreInfoPopup.find(".desc").html("<br>No info available for custom races.<br><br>");
  } else {
    converter = new showdown.Converter();
    htmlOutput = converter.makeHtml(genInfo["races"][key]["desc"]);
    moreInfoPopup.find(".desc").html(getRaceMoreInfo(genInfo["races"][key]));
  }

  // populate subraces in the select race popup
  if (key != "Custom-Race") {
    const subraceDropdown = $("#select-subrace");
    for (let i of genInfo["races"][key]["subraces"]) {
      const subraceName = i["name"];

      // populate dropdown
      const selOpt = new Option(subraceName, key);
      selOpt.style.display = "none";
      subraceDropdown.append(selOpt);

      // populate descs
      // yes I know it's building a subclassDesc comp item, that's correct
      let subraceDesc = initComp("subclassDesc", "#subrace-desc");
      subraceDesc.attr("id", subraceName.replaceAll(" ", "-").replaceAll("/", "-"));
      converter = new showdown.Converter();
      htmlOutput = converter.makeHtml(i["desc"].replaceAll("####", "##"));
      
      // insert a title at position 3 (i.e. after the <p>)
      htmlOutput = htmlOutput.slice(0, 3) + "<strong><em>General Description. </em></strong>" + htmlOutput.slice(3);
      htmlOutput += converter.makeHtml(i["asi_desc"]);
      htmlOutput += converter.makeHtml(i["traits"]);

      subraceDesc.html(htmlOutput);
    }
  }
}

// Components creation that requires backend
async function initComps() {
  genInfo = await generalInfo.then((resp) => resp.json());
  
  // Class Accordion and searchbar
  $("#class-acc").empty();
  Object.keys(genInfo["classes"]).forEach(key => {
    createClassComps(key);
  });
  // create an item for custom class as well
  createClassComps("Custom");
  
  // Add the level select dropdown
  const levelDropdown = $("#select-level-");
  for (let i = 2; i < 21; i++) {
    const selOpt = new Option(i, i);
    levelDropdown.append(selOpt);
  }

  // set up the subclass dropdown to change the displayed subclass text
  const subclassDropdown = $("#select-subclass");
  const subclassDescs = $("#subclass-desc");
  subclassDropdown.on('change', function() {
    subclassDescs.find("span").hide();
    const subclass = $(this).find("option:selected").text();
    subclassDescs.find(`#${subclass.replaceAll(" ", "-")}`).show();
  })
  
  
  $("#race-acc").empty();
  Object.keys(genInfo["races"]).forEach(key => {
    createRaceComps(key);
  });
  // create an item for custom race as well
  createRaceComps("Custom-Race");

  // set up the subrace dropdown to change the displayed subclass text
  const subraceDropdown = $("#select-subrace");
  const subraceDescs = $("#subrace-desc");
  subraceDropdown.on('change', function() {
    subraceDescs.find("span").hide();
    var subrace = $(this).find("option:selected").text();
    if (subrace == "None") {
      subrace = "None-subrace";
    }
    subraceDescs.find(`#${subrace.replaceAll(" ", "-").replaceAll("/", "-")}`).show();
  })

  $("#background-acc").empty();
  Object.keys(genInfo["backgrounds"]).forEach(key => {
    let acc = initComp("accItem", "#background-acc");
    acc.find(".title").text(key);
    const keyId = key.replaceAll(" ", "-");
    acc.attr("id", "acc-item-" + keyId);
    let bgCont = initComp("backgroundCont", "#acc-item-" + keyId + " .cont");
    let backgroundDesc = genInfo["backgrounds"][key]["desc"];
    if (backgroundDesc && backgroundDesc != "[No description provided]") {
      let splitDesc = backgroundDesc.split(".")
      let shortDesc = splitDesc[0];
      let longDesc = splitDesc.slice(1).join(".");
      let converter = new showdown.Converter();
      longDesc = converter.makeHtml(longDesc);

      bgCont.find(".short-desc").html(shortDesc + "...");
      bgCont.find(".desc").html(longDesc);
    } else {
      bgCont.find(".short-desc").html("(No special description available)");
      bgCont.find(".desc").html('<br>Click the "More Info" Button to see benefits of this background such as ability score improvements.<br><br>');
    }

    // searchbar dropdown
    let dropdownItem = initComp("dropdownItem", "#searchbar-background-dropdown");
    dropdownItem.text(key);
    dropdownItem.click(function () {
      updateSearchBar(key, "searchbar-background");
      filterItems('background');
      $("#searchbar-background-dropdown").hide();
    });

    // create the more info popup
    let moreInfoPopup = initComp("moreInfoBackground", "#popup-inner-content");
    moreInfoPopup.attr("id", `background-more-info-popup-${key}`);
    if (key == "Custom-Background") {
      moreInfoPopup.find(".desc").html("<br>No info available for custom backgrounds.<br><br>");
    } else {
      let bgDesc = getBackgroundDesc(genInfo["backgrounds"][key]);
      moreInfoPopup.find(".desc").html(bgDesc);
    }
  });

   $("#language-acc").empty();
  Object.keys(genInfo["languages"]).forEach(key => {
    let acc = initComp("accItem", "#language-acc");
    acc.find(".title").text(key);
    const keyId = key.replaceAll(" ", "-");
    acc.attr("id", "acc-item-" + keyId);

    // searchbar dropdown
    let dropdownItem = initComp("dropdownItem", "#searchbar-language-dropdown");
    dropdownItem.text(key);
    dropdownItem.click(function () {
      updateSearchBar(key, "searchbar-language");
      filterItems('language');
      $("#searchbar-language-dropdown").hide();
    });


  });

  $("#spell-acc").empty();
  Object.keys(genInfo["spells"]).forEach(key => {
    let spellcard = initComp("spellcard", "#spell-acc");

    // TODO: move to function
    const spellInfo = genInfo["spells"][key];

    var spellName = spellInfo["name"];
    if (spellInfo["ritual"]) {
      spellName += " (ritual)"
    }
    spellcard.find(".name").text(spellName);

    var castTime = spellInfo["casting_time"];
    if (castTime[0] < '0' || castTime[0] > '9') {
      castTime = "1 " + castTime;
    } else if (castTime[1] != ' ') {
      castTime = castTime[0] + ' ' + castTime.slice(1);
    }
    spellcard.find(".casting").text(castTime);

    spellcard.find(".range").text(spellInfo["range_text"]);

    var spellComponents = "";
    if (spellInfo["verbal"]) { spellComponents += "V"; }
    if (spellInfo["somatic"]) {
      if (spellComponents != "") { spellComponents += ", "; }
      spellComponents += "S";
    }
    if (spellInfo["material"]) {
      if (spellComponents != "") { spellComponents += ", "; }
      spellComponents += "M";
    }
    spellcard.find(".components").text(spellComponents)

    spellcard.find(".duration").text(spellInfo["duration"]);

    var material = spellInfo["material_specified"];
    if (material) { material = material.toLowerCase().replace('.', ''); }
    spellcard.find('.need').text(material);

    var spellDesc = spellInfo["desc"];
    if (spellInfo["reaction_condition"]) {
      spellDesc = `<b>Reaction Condition</b>: Reaction ${spellInfo["reaction_condition"]}<br><br>${spellDesc}`;
    }
    if (spellInfo["higher_level"]) {
      spellDesc += `<br><b>At Higher Levels</b>: ${spellInfo["higher_level"]}`;
    }
    spellcard.find(".text").html(spellDesc);

    spellcard.find(".class").text(spellInfo["document"]["publisher"]["name"]);

    const level = spellInfo["level"];
    const school = spellInfo["school"]["name"];
    var type = `Level ${level} ${school}`;
    if (level == 0) { type = `${school} Cantrip`; }
    spellcard.find(".type").text(type);

    // searchbar dropdown
    let dropdownItem = initComp("dropdownItem", "#searchbar-spell-dropdown");
    dropdownItem.text(key);
    dropdownItem.click(function () {
      updateSearchBar(key, "searchbar-spell");
      filterItems('spell');
      $("#searchbar-spell-dropdown").hide();
    });
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
      
  //$(existing).append(comp[key]["html"]);
  let added = $("#new").removeAttr("id");
  if (comp[key].func) {
    comp[key].func(added);
  }
  return added;
}

// clicking the "add class" button moves the class over to selected classes
function selectClass() {
  var className = $("#popup-title").text().split(") ");
  className = className[className.length - 1].replaceAll(" ", "_");
  if (className == "") {
    className = "Custom";
  }
  const dropdown = $("#select-level-");
  const classLevel = dropdown.find("option:selected").text();

  const subclassDropdown = $("#select-subclass");
  var subclass = subclassDropdown.find("option:selected").text();
  if (subclass == "None") {
    subclass = null;
  }
  char.class[className] = {
    "level": classLevel,
    "subclass": subclass
  };

  // add acc-item to selected classes
  $("#chosen-class").html("");
  var primaryClass = "";
  var maxLevel = 0;
  const chosenClass = $("#chosen-class");
  for (c in char.class) {
    if (char.class[c]["level"] > maxLevel) {
      maxLevel = char.class[c]["level"];
      primaryClass = c;
    }
    
    var isCustom = false;
    if (!(c in genInfo["classes"])) {
      isCustom = true;
    }

    const acc = initComp("accItem", "#chosen-class");
    if (isCustom) {
      acc.find(".title").text(`(Custom Class) ${c.replaceAll("_", " ")} ${char.class[c]["level"]}`);
    } else {
      if (char.class[c]["subclass"]) {
        acc.find(".title").html(`${c} ${char.class[c]["level"]}<br>${char.class[c]["subclass"]}`);
      } else {
        acc.find(".title").text(`${c} ${char.class[c]["level"]}`);
      }
    }
    acc.attr("id", "acc-item-" + c + "-selected");
    if (isCustom) {
      acc.find(".icon-img").attr("src", 'assets/images/custom.png');
    } else {
      acc.find(".icon-img").attr("src", `assets/images/${c.toLowerCase()}.png`);
    }
    let classCont = initComp("selectedClassCont", "#acc-item-" + c + "-selected .cont");
    
    if (isCustom) {
      classCont.find(".desc").text("Your own custom class.");
    } else {
      classCont.find(".desc").text(genInfo["classes"][c]["short_desc"]);
    }
    chosenClass.append(acc);
  }

  // update primary class
  char["primaryClass"] = primaryClass;
  $("#primary-class").html(primaryClass);
  if (primaryClass == "Custom") {
    $("#rec-stats").html("");
    $("#primary-stat").html("");
    $("#secondary-stat").html("");
    $("#recommended-stats").hide();
    displayCustomStatSuggestion();
  } else {
    $("#stat-suggestion1").show();
    $("#stat-suggestion2").show();
    $("#stat-suggestion3").show();
  }
  $("#stat-suggestion4").show();
  // reset specificInfo because we changed class
  specificInfo = null;
  
  // close the popup
  closePopup();
}

function selectRace() {
  var raceName = $("#popup-title").text().split(") ");
  raceName = raceName[raceName.length - 1].replaceAll(" ", "_");
  if (raceName == "") {
    raceName = "Custom";
  }

  const subraceDropdown = $("#select-subrace");
  var subrace = subraceDropdown.find("option:selected").text();
  if (subrace == "None") {
    subrace = null;
  }

  char.race = raceName;
  char.subrace = subrace;
  var subraceName = subrace;
  if (!subraceName) {
    subraceName = "None";
  }

  //console.log(`race ${raceName}, subrace ${subraceName}`);
  $("#chosen-race").html(raceName);
  $("#chosen-subrace").html(subraceName);

  // reset specificInfo because we changed race
  specificInfo = null;

  // close the popup
  closePopup();
}