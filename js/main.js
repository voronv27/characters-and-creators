// Store values to display on the character sheet
let char = {
  name: null,
  class: {},
  primaryClass: null,
  race: null,
  background: null,
  stats: {},
};

// Constants
const P_B = "Parent Before";
const P_A = "Parent After";
const S_B = "Sibling Before";
const S_A = "Sibling After";
const URL = "https://voronv.pythonanywhere.com"

// Variables
let generalInfo;
let specificInfo;
let genInfo;
let specInfo;


let languages = {"Common":{"type":"Exotic", "typical_speakers":["People"]},
                 "Undercommon":{"type": "Normal", "typical_speakers":["Underpeople"]},
                 "Amogi":{"type": "Amogus", "typical_speakers":["Amongi"]}} //note: placeholder, still need to add functionality

$("#enter-name").change(function () {
  char["name"] = $(this).val();
});

$(async function () {
  init();
  eventListeners();

  await initComps();
});

function initApiData() {
  generalInfo = fetch(`${URL}/general-info`, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
}

function specificApiData() {
  var fetchRequired = false;
  // TODO: more than primary class, subclass, subrace
  var paramUrl = `${URL}/specific-info?`;
  if (char.primaryClass) {
    paramUrl += `class=${char.primaryClass}`;
    fetchRequired = true;
  }
  if (char.race) {
    paramUrl += `&race=${char.race}`;
    fetchRequired = true;
  }
  if (char.background) {
    paramUrl += `&background=${char.background}`;
    fetchRequired = true;
  }

  if (fetchRequired) {
    specificInfo = fetch(paramUrl, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }
  return fetchRequired;
}

// Update elements after updating specInfo
function updateSpecInfo() {
  const recStats = "<b>" + specInfo["preferred-stats"].join("</b> and <b>") + "</b>";
  $("#rec-stats").html(recStats);
}

function getRaceDesc(data, subrace = "") {
  let converter = new showdown.Converter();
  const size = converter.makeHtml(data["size"]);
  const speed = converter.makeHtml(data["speed_desc"]);
  const asi = converter.makeHtml(data["asi_desc"]);
  const languages = converter.makeHtml(data["languages"]);
  const vision = converter.makeHtml(data["vision"]);
  const traits = converter.makeHtml(data["traits"]);

  var desc = `<b>Key Race Features:</b><br>
  ${size}
  ${speed}
  ${asi}
  ${languages}
  ${vision}
  ${traits}`
  if (subrace != "") {
    var subraceDesc = "";
    const subraceData = data[subrace];
    const subraceAsi = converter.makeHtml(subraceData["asi_desc"]);
    const subraceTraits = converter.makeHtml(subraceData["traits"]);
    if (subraceAsi) {
      subraceDesc += `${subraceAsi}`;
    }
    if (subraceTraits) {
      subraceDesc += `${subraceTraits}`;
    }
    if (subraceDesc.length) {
      desc += `<br><b>Selected Subrace Features:</b><br>${subraceDesc}`;
    }
  }
  return desc;
}

function getBackgroundDesc(data) {
  var desc = "";
  if (data["desc"]) {
    desc += `<br><b>Overview:</b><br>${data["desc"]}<br><br>`;
  }

  if (data["benefits"]) {
    desc += "<br><b>Key Background Features:</b><br><br>";
    const tagsToRemove = ["p"];
    const idTagsToRemove = ["h3"];
    for (b of data["benefits"]) {
      var html = converter.makeHtml(b["desc"]);
      for (t of tagsToRemove) {
        html = html.replaceAll(`<${t}>`, "").replaceAll(`</${t}>`, "");
      }
      for (t of idTagsToRemove) {
        html = html.replaceAll(RegExp(`<${t}.*>`, "g"), "").replaceAll(RegExp(`</${t}.*>`, "g"), "");
      }
      if (b["type"] == "suggested_characteristics") {
        html = html.slice(0, html.indexOf("|"));
        if (html == "Coming soon") {
          continue;
        }
      }
      desc += `${b["name"]}:<br>${html}`;
      if (desc.charAt(desc.length - 1) != ">") {
        desc += `<br><br>`;
      }
    }
  }
  return desc;
}

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

function updateCharacterSheet() {
  const fillableElements = $(".sheet-autofill");
  fillableElements.each(e => {
    const element = $(fillableElements[e]);
    const id = element.attr("id");

    var value = null;
    if (char[id]) {
      value = char[id];
      if (id == "class") {
        value = "";
        for (className in char[id]) {
          if (value != "") {
            value += ", ";
          }
          const classLevel = char[id][className];
          value += `${className} ${classLevel}`;
        }
      }
    } else if (id.startsWith("stats")) {
      const stat = id.split("-")[1];
      if (stat in char["stats"]) {
        value = char["stats"][stat];
      }
    }

    if (value) {
      if (element.is('input')) {
        element.val(value);
      } else if (element.hasClass('content x')) {
        console.log("TODO");
        console.log(value);
      }
    }
  })
}