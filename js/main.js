//JS file that currently stores character info and API data.

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
const URL = "https://voronv.pythonanywhere.com"

// Variables
let generalInfo;
let specificInfo;
let specInfo;
let primaryStat;
let secondaryStat;
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