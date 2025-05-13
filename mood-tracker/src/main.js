import "./style.css";

const moodSelect = document.getElementById("mood-select");
const saveBtn = document.getElementById("save-btn");
const moodHistory = document.getElementById("mood-history");

const waterInput = document.getElementById("water");
const activitySelect = document.getElementById("activity");
const sleepSelect = document.getElementById("sleep");
const noteInput = document.getElementById("note");

const happyEl = document.getElementById("happy-count");
const waterEl = document.getElementById("avg-water");
const activityEl = document.getElementById("top-activity");

let logs = JSON.parse(localStorage.getItem("moodLogs")) || [];

function renderLogs() {
  moodHistory.innerHTML = "";

  // Statistik
  let happyDays = 0;
  let totalWater = 0;
  let waterCount = 0;
  let activityMap = {};

  logs.forEach((log) => {
    if (log.mood === "Glad") happyDays++;

    if (log.water) {
      totalWater += parseInt(log.water);
      waterCount++;
    }

    if (log.activity) {
      activityMap[log.activity] = (activityMap[log.activity] || 0) + 1;
    }
  });

  if (happyEl && waterEl && activityEl) {
    happyEl.textContent = happyDays;
    const avg = waterCount > 0 ? (totalWater / waterCount).toFixed(1) : 0;
    waterEl.textContent = avg;

    let topActivity = "–";
    let max = 0;
    for (const [activity, count] of Object.entries(activityMap)) {
      if (count > max) {
        max = count;
        topActivity = activity;
      }
    }
    activityEl.textContent = topActivity;
  }

  // Visa loggar med boxicons
  logs.forEach((log) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <strong>${log.date}</strong><br />
      <i class="bx bx-happy"></i> Humör: ${log.mood}<br />
      <i class="bx bx-droplet"></i> Vatten: ${log.water || "–"} glas<br />
      <i class="bx bx-run"></i> Aktivitet: ${log.activity || "–"}<br />
      <i class="bx bx-moon"></i> Sov: ${log.sleep || "–"}<br />
      <i class="bx bx-note"></i> Anteckning: ${log.note || "–"}
    `;
    moodHistory.appendChild(item);
  });
}

// Spara ny logg
saveBtn.addEventListener("click", () => {
  const mood = moodSelect.value;
  const water = waterInput.value;
  const activity = activitySelect.value;
  const sleep = sleepSelect.value;
  const note = noteInput.value;

  if (mood === "") {
    alert("Välj ett humör först!");
    return;
  }

  const today = new Date().toLocaleDateString();
  const newLog = {
    date: today,
    mood,
    water,
    activity,
    sleep,
    note
  };

  logs.push(newLog);
  localStorage.setItem("moodLogs", JSON.stringify(logs));
  renderLogs();

  // Nollställ formulär
  moodSelect.value = "";
  waterInput.value = "";
  activitySelect.value = "";
  sleepSelect.value = "";
  noteInput.value = "";
});

// Rensa all historik
const clearBtn = document.getElementById("clear-btn");
clearBtn.addEventListener("click", () => {
  logs = [];
  localStorage.removeItem("moodLogs");
  renderLogs();
});

// Temaväxling
const themeButtons = document.querySelectorAll("#theme-buttons button");

function setTheme(theme) {
  document.body.className = "";
  document.body.classList.add(`theme-${theme}`);
  localStorage.setItem("theme", theme);
}

themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset.theme;
    setTheme(theme);
  });
});

// Start
const savedTheme = localStorage.getItem("theme") || "pink";
setTheme(savedTheme);
renderLogs();
