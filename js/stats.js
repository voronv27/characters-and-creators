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
      char["stats"][aStat.text] = aStat.value;
    }
  });
}

function displayAssignedStats(stats) {
  var html = `<b>Assigned stats:</b><br>`
  const statNames = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
  for (s in stats) {
    stat = stats[s];
    html += `<b>${statNames[s]}: ${stat}</b><br>`;
  }
  html += "<br><button class='colorTheme' onclick='assignStats();'>Assssign Stats</button><br><br>";
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
  const newhtml = primaryStat + " as primary stat with 15, " + secondaryStat + " as secondary stat with 14, and the rest of the stats as 13, 12, 10, and 8.";
  var divElement = document.getElementById("displayStandardSpread");
  var html = `<b>Standard Array:</b><br>`;
  var availableNumbers = [13,12,10,8];
  var stats = {
  "Constitution": 0,
  "Dexterity": 0,
  "Strength": 0,
  "Intelligence": 0,
  "Wisdom": 0,
  "Charisma": 0
  };
  stats[document.getElementById(primaryId).value] = 15;
  stats[document.getElementById(secondaryId).value] = 14;

  for (let s in stats) {
    if (stats[s] == 0) {
      stats[s] = availableNumbers.pop();
    }
    html += `<b>${s}: ${stats[s]}</b><br>`;
    divElement.text = html;
//    $('#displayStandardSpread').html(html);
  }


  //$('#displayStandardSpread').html(html);

}