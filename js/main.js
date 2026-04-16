//JS file that currently stores character info and API data.

// Store values to display on the character sheet
let char = {
  name: null,
  class: {},
  primaryClass: null,
  race: null,
  subrace: null,
  background: null,
  stats: {},
  proficiencies: {
    "armors": [],
    "weapons": [],
    "tools": [],
    "savingThrows": [],
    "skills": [],
    "possibleSkills": []
  },
  expertise: [],
  proficiencyOverlap: 0
};

// Constants
const URL = "https://voronv.pythonanywhere.com"
//const URL = "http://127.0.0.1:5000"

// Variables
let generalInfo;
let specificInfo;
let genInfo; // this is the actual dictionary with general info
let specInfo; // this is the actual dictionary with specific info

let languages;
let primaryStat;
let secondaryStat;

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
  console.log(char.primaryClass);
  console.log("Fetching API data");
  var fetchRequired = false;
  // TODO: more than primary class, subclass, subrace
  var paramUrl = `${URL}/specific-info?`;
  classList = ["Barbarian", "Bard", "Cleric", "Druid", "Fighter", "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard"];
  console.log("class comparison: ", char.primaryClass, ":", classList[0], ":", typeof(char.primaryClass), ":", typeof(classList[0]));
  if (char.primaryClass != null) {
    paramUrl += `&class=`;
    for (c in char.class) { 
      if (classList.includes(c)) {
        console.log("Selected classes: ", char.class, "current class: ", c, "Last class: ", Object.keys(char.class)[Object.keys(char.class).length-1]);
        if (c == Object.keys(char.class)[Object.keys(char.class).length-1] ) { //if the class is hte last in the list, don't add a comma after it
          paramUrl += `${c}`;
        } else {
          paramUrl += `${c},`;
        }
      }
    }
    //console.log("paramUrl after class: ", paramUrl);
    console.log("subclass check: ", char.class[char.primaryClass], "and ", char.class[char.primaryClass]["subclass"]);
    if (char.class[char.primaryClass]["subclass"]) {
      paramUrl += `&subclass=${char.class[char.primaryClass]["subclass"]}`;
    }
    fetchRequired = true;
  } else if (char.primaryClass) {
    console.log("Primary class not in class list: ", char.primaryClass);
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
  classList = ["Barbarian", "Bard", "Cleric", "Druid", "Fighter", "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard"];
  const recStats = "<b>" + specInfo["preferred-stats"].join("</b> and <b>") + "</b>";
  const primaryDisplay = "<b>" + specInfo["preferred-stats"][0] + "</b>";
  const secondaryDisplay = "<b>" + specInfo["preferred-stats"][1] + "</b>";
  updateProficiencies();
  if (!classList.includes(char.primaryClass)) {
    console.log("Primary class not in class list: ", char["primaryClass"]);
  } else {
    $("#rec-stats").html(recStats);
    $("#primary-stat").html(primaryDisplay);
    $("#secondary-stat").html(secondaryDisplay);
    displayRecommendedStandardStats(specInfo["preferred-stats"][0], specInfo["preferred-stats"][1]);
  }
}

function getRaceDesc(data) {
  let converter = new showdown.Converter();
  const speed = converter.makeHtml(data["speed_desc"]);
  const asi = converter.makeHtml(data["asi_desc"]);
  const vision = converter.makeHtml(data["vision"]);

  var desc = `<h3><b>Key Race Features:</b></h3>
  ${speed}
  ${asi}
  ${vision}`
  return desc;
}

function getRaceMoreInfo(data) {
  let converter = new showdown.Converter();
  const desc = converter.makeHtml(data["desc"]);
  const age = converter.makeHtml(data["age"]);
  const alignment = converter.makeHtml(data["alignment"]);
  const size = converter.makeHtml(data["size"]);
  const speed = converter.makeHtml(data["speed_desc"]);
  const vision = converter.makeHtml(data["vision"]);
  const asi = converter.makeHtml(data["asi_desc"]);
  const languages = converter.makeHtml(data["languages"]);
  const traits = converter.makeHtml(data["traits"]);
  
  var moreInfo = `${desc}
  ${age}
  ${alignment}
  ${size}
  ${speed}
  ${vision}
  ${asi}
  ${languages}
  ${traits}`
  return moreInfo;
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
