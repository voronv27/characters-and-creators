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
    moreInfoPopup.find(".desc").text("No info available for custom classes.");
  } else {
    converter = new showdown.Converter();
    htmlOutput = converter.makeHtml(genInfo["classes"][key]["desc"]);
    moreInfoPopup.find(".desc").html(htmlOutput);
  }

  // dropdown
  let dropdownItem = initComp("dropdownItem", "#searchbar-dropdown");
  dropdownItem.text(key);
  dropdownItem.click(function () {
    updateSearchBar(key);
    filterItems();
  });
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
  
  $("#race-acc").empty();
  Object.keys(genInfo["races"]).forEach(key => {
    let acc = initComp("accItem", "#race-acc");
    acc.find(".title").text(key);
    acc.attr("id", "acc-item-" + key);
    let raceCont = initComp("raceCont", "#acc-item-" + key + " .cont");
    raceCont.find(".race-img").attr("src", `assets/images/${key.toLowerCase()}.png`);
    let raceDesc = getRaceDesc(genInfo["races"][key]);
    raceCont.find(".desc").html(raceDesc);
  });

  $("#background-acc").empty();
  Object.keys(genInfo["backgrounds"]).forEach(key => {// http://127.0.0.1:3000/createCharacter.html#race
    let acc = initComp("accItem", "#background-acc");
    acc.find(".title").text(key);
    const keyId = key.replaceAll(" ", "-");
    acc.attr("id", "acc-item-" + keyId);
    let bgCont = initComp("backgroundCont", "#acc-item-" + keyId + " .cont");
    let bgDesc = getBackgroundDesc(genInfo["backgrounds"][key]);
    bgCont.find(".desc").html(bgDesc);
  });

  $("#language-acc").empty();
  Object.keys(genInfo["languages"]).forEach(key => {
    let acc = initComp("accItem", "#language-acc");
    acc.find(".title").text(key);
    //const keyId = key.relplaceAll(" ", "-");
    //acc.attr("id", "acc-item-" + keyId);
    //let langCont = intiComp();

  });
  $("#spellcards-acc").empty();
  Object.keys(genInfo["spells"]).forEach(key => {
    let spellcard = initComp("spellcard", "#spellcards-acc");

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

// clicking the select-class button moves the class over to selected classes
function selectClass() {
  const className = $("#popup-title").text();
  const dropdown = $("#select-level-");
  const classLevel = dropdown.find("option:selected").text();
  char.class[className] = classLevel;
  console.log(`class ${className}, level ${classLevel}`);

  // add acc-item to selected classes
  $("#chosen-class").html("");
  var primaryClass = "";
  var maxLevel = 0;
  const chosenClass = $("#chosen-class");
  for (c in char.class) {
    if (char.class[c] > maxLevel) {
      maxLevel = char.class[c];
      primaryClass = c;
    }
    
    const acc = initComp("accItem", "#chosen-class");
    acc.find(".title").text(`${className} ${classLevel}`);
    acc.attr("id", "acc-item-" + className + "-selected");
    acc.find(".icon-img").attr("src", `assets/images/${className.toLowerCase()}.png`);
    let classCont = initComp("selectedClassCont", "#acc-item-" + className + "-selected .cont");
    classCont.find(".desc").text(genInfo["classes"][className]["short_desc"]);
    chosenClass.append(acc);
  }

  // update primary class
  char["primaryClass"] = primaryClass;
  $("#primary-class").html(primaryClass);
  $("#stat-suggestion1").show();
  $("#stat-suggestion2").show();
  $("#stat-suggestion3").show();
  $("#stat-suggestion4").show();

  // reset specificInfo because we changed class
  specificInfo = null;
  
  // close the popup
  closePopup();
}