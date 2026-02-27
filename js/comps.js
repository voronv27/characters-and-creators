//JS file that stores component related functions
//Note: the comp variable is stored separately in utils.js at the moment.
//Feel free to move it if we feel like that'd be best for organization.

// Components creation that requires backend
async function initComps() {
  genInfo = await generalInfo.then((resp) => resp.json());
  //Class Accordion
  $("#class-acc").empty();
  Object.keys(genInfo["classes"]).forEach(key => {
    let acc = initComp("accItem", "#class-acc");
    acc.find(".title").text(key);
    acc.attr("id", "acc-item-" + key);
    acc.find(".icon-img").attr("src", `assets/images/${key.toLowerCase()}.png`);
    converter = new showdown.Converter();
    htmlOutput = converter.makeHtml(genInfo["classes"][key]["desc"]);
    let classCont = initComp("classCont", "#acc-item-" + key + " .cont");
    classCont.find(".desc").html(htmlOutput);
    acc.find(".select-level").attr("for", "select-level-" + key);
    acc.find(".select").attr("id", "select-level-" + key);
  });

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
  Object.keys(genInfo["backgrounds"]).forEach(key => {
    let acc = initComp("accItem", "#background-acc");
    acc.find(".title").text(key);
    const keyId = key.replaceAll(" ", "-");
    acc.attr("id", "acc-item-" + keyId);
    let bgCont = initComp("backgroundCont", "#acc-item-" + keyId + " .cont");
    let bgDesc = getBackgroundDesc(genInfo["backgrounds"][key]);
    bgCont.find(".desc").html(bgDesc);
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
  let added = $("#new").removeAttr("id");
  if (comp[key].func) {
    comp[key].func(added);
  }
  return added;
}