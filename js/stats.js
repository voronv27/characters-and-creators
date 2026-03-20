//JS file that stores all stats related functions

function diceRoll(max) {
  return Math.floor(Math.random() * (max)) + 1;
}

function rollStats() {
  var stats = [];
  // roll stats: we roll 4d6 and drop the lowest d6, repeat 6 times
  for (let i = 0; i < 6; i++) {
    var sum = 0;
    var min = 6;
    for (let j = 0; j < 4; j++) {
      const roll = diceRoll(6);
      if (roll < min) {
        min = roll;
      }
      sum += roll;
    }
    sum -= min;
    stats.push(sum);
  }
  displayGeneratedStats(stats);
}

function pointBuy() {
  console.log("point buy");
}

function standardArray() {
  const stats = [15, 14, 13, 12, 10, 8];
  displayGeneratedStats(stats);
}

function displayGeneratedStats(stats) {
  const statOpts = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
  var html = `<b>Generated stats:</b><br>`
  for (s in stats) {
    stat = stats[s];
    html += `<b>${stat} </b>
            <select id="select-stat-${s}" class="select-stat">
            <option selected disabled hidden value=${stat}>Select Stat</option>`
      + statOpts.reduce(
        (opts, newOpt) => opts + `<option value=${stat}>${newOpt}</option>\n`, "") +
      " </select><br>"
  }
  html += "<button onclick='assignStats();'>Assign Stats</button><br><br>";
  $("#generated-stats").html(html);
}

function assignStats() {
  char["stats"] = {};
  const assignedStats = $(".select-stat option:selected");
  assignedStats.each(e => {
    const aStat = assignedStats[e];
    if (aStat.text != "Select Stat") {
      $(`#${aStat.text}`).val(aStat.value);
      char["stats"][aStat.text] = parseInt(aStat.value);
    }
  });
  console.log(char["stats"]);
  console.log(char);
}

function displayAssignedStats(stats) {
  var html = `<b>Assigned stats:</b><br>`
  const statNames = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
  for (s in stats) {
    stat = stats[s];
    html += `<b>${statNames[s]}: ${stat}</b><br>`;
    char["stats"][statNames[s]] = stat;
  }
  console.log(char["stats"]);
  console.log(char);
  $("#generated-stats").html(html);
}


function trueRollTest(trueRandom) {
  var stats = [];
  // roll stats: we roll 4d6 and drop the lowest d6, repeat 6 times
  for (let i = 0; i < 6; i++) {
    var sum = 0;
    var min = 6;
    for (let j = 0; j < 4; j++) {
      const roll = diceRoll(6);
      if (roll < min) {
        min = roll;
      }
      sum += roll;
    }
    sum -= min;
    stats.push(sum);
  }
  if (trueRandom) {
    displayAssignedStats(stats);
  } else {
    displayGeneratedStats(stats);
  }
}


function OpenTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function increment(statName,store) {
  let counterElement = document.getElementById(statName);
  let scoreElement = document.getElementById(store);
  let currentValue = parseInt(counterElement.innerText);
  let currentScore = parseInt(scoreElement.innerText);
  let newValue;
  if (currentValue >= 12 && currentValue <20 &&currentScore >= 2) {
    newValue = currentValue + 1;
    currentScore -= 2;
  } else if (currentScore >= 1 && currentValue < 20) {
    newValue = currentValue + 1;
    currentScore -= 1;
  } else {
      counterElement.innerText = currentValue;
      return;
  }
  counterElement.innerText = Math.min(newValue, 20);
  scoreElement.innerText = currentScore;
}
function decrement(statName,store) {
  let counterElement = document.getElementById(statName);
  let scoreElement = document.getElementById(store);
  let currentValue = parseInt(counterElement.innerText);
  let currentScore = parseInt(scoreElement.innerText);
  let newValue;
  if (currentValue >= 13 && currentScore <26) {
    newValue = currentValue - 1;
    currentScore += 2;
  } else if (currentValue ==8) {
    counterElement.innerText = currentValue;
    scoreElement.innerText = currentScore;
    return;
  }  else {
    newValue = currentValue - 1;
    currentScore += 1;
  }
  counterElement.innerText = Math.max(newValue, 8);
  scoreElement.innerText = currentScore;
}

function acceptStats() {
    const aStat = assignedStats[e];
}

function displayRecommendedStandardStats(primaryId, secondaryId) {
  //console.log("displaying recommended standard stats");
  //console.log(primaryId);  debug purposes
  //console.log(secondaryId);
  var divElement = document.getElementById("stat-suggestion4");
  var html = "";
  var standardOrder = { "Strength": 0, "Dexterity": 0, "Constitution": 0, "Intelligence": 0, "Wisdom": 0, "Charisma": 0 };
  var availableNumbers = [13,12,10,8];  //remaining stat values to assign after assigning the primary and secondary stats
  const stats = [   //order of importance of stats for the recommended standard array distribution, with the most important stat last
  "Charisma",
  "Intelligence",
  "Wisdom",
  "Strength",
  "Dexterity",
  "Constitution"
  ];
  standardOrder[primaryId] = 15;
  standardOrder[secondaryId] = 14;

  for (let s in stats) {
    if (standardOrder[stats[s]] == 0) {
      standardOrder[stats[s]] = availableNumbers.pop();
    }
  }
  for (let s in standardOrder) {
    html += `<h2 style="flex-grow: 1"><b>${s}: ${standardOrder[s]}</b></h2>`;
    char["stats"][s]= standardOrder[s];
  }
  $('#stat-suggestion4').html(html);

//console.log(char["stats"]);
//console.log(char);

}

function assignPointBuy(str, dex, con, int, wis, cha, store) {// assigning stats from the point buy tab
  let remainingPoints = document.getElementById(store);
  if (parseInt(remainingPoints.innerText)==0) { 
    const strNumber = parseInt(document.getElementById(str).innerText);
    const dexNumber = parseInt(document.getElementById(dex).innerText);
    const conNumber = parseInt(document.getElementById(con).innerText);
    const intNumber = parseInt(document.getElementById(int).innerText);
    const wisNumber = parseInt(document.getElementById(wis).innerText);
    const chaNumber = parseInt(document.getElementById(cha).innerText);
    //console.log(strNumber, dexNumber, conNumber, intNumber, wisNumber, chaNumber);
    //console.log(char);
    //console.log(char["stats"]);
    char["stats"][str] = (strNumber);
    char["stats"][dex] = (dexNumber);
    char["stats"][con] = (conNumber);
    char["stats"][int] = (intNumber);
    char["stats"][wis] = (wisNumber);
    char["stats"][cha] = (chaNumber);
  } else {
    console.log("Hold on, you still have points left: " + parseInt(remainingPoints.innerText));
  }

}


function assignCustom(str, dex, con, int, wis, cha) {
  const strNumber = parseInt(document.getElementById(str).value);
  const dexNumber = parseInt(document.getElementById(dex).value);
  const conNumber = parseInt(document.getElementById(con).value);
  const intNumber = parseInt(document.getElementById(int).value);
  const wisNumber = parseInt(document.getElementById(wis).value);
  const chaNumber = parseInt(document.getElementById(cha).value);

  char["stats"][str] = (strNumber);
  char["stats"][dex] = (dexNumber);
  char["stats"][con] = (conNumber);
  char["stats"][int] = (intNumber);
  char["stats"][wis] = (wisNumber);
  char["stats"][cha] = (chaNumber);
  console.log(char["stats"]);
  console.log(char);
}

function displayCustomStatSuggestion() {
  var html = `<h2><b>As you are making a custom class, you get to choose which stats from the standard array:</b></h2><br><br>`;
  var stats = [15, 14, 13, 12, 10, 8];
  const statOpts = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
  var html = `<div><b>Standard Array:</b><br></div><div style="flex-direction: column; gap: 10px;">`
  for (s in stats) {
    stat = stats[s];
    html += `<b>${stat} </b>
            <select id="select-stat-${s}" class="select-stat">
            <option selected disabled hidden value=${stat}>Select Stat</option>`
      + statOpts.reduce(
        (opts, newOpt) => opts + `<option value=${stat}>${newOpt}</option>\n`, "") +
      " </select><br>"
  }
  html += "</div><br><br>";
  html += "<button onclick='assignStats();'>Assign Stats</button><br><br>";
  $('#stat-suggestion4').html(html);
}