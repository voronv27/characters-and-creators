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