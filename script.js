const topScoreEl = document.getElementById("top-score");
const totalCounterEl = document.getElementById("total-counter");
const clickableArea = document.getElementById("clickable-area");
const catStatic = document.getElementById("cat-static");
const catPop = document.getElementById("cat-pop");

let totalClicks = parseInt(localStorage.getItem("totalClicks")) || 10492;
let topScore = parseInt(localStorage.getItem("topScore")) || 0;
let keyPressed = false;

totalCounterEl.textContent = totalClicks.toLocaleString();
topScoreEl.textContent = topScore.toLocaleString();

function updateScore(points) {
  totalClicks += points;
  topScore += 1;

  totalCounterEl.textContent = totalClicks.toLocaleString();
  topScoreEl.textContent = topScore.toLocaleString();

  localStorage.setItem("totalClicks", totalClicks);
  localStorage.setItem("topScore", topScore);
}

function showPopImage() {
  catStatic.style.display = "none";
  catPop.style.display = "block";
}

function hidePopImage() {
  catStatic.style.display = "block";
  catPop.style.display = "none";
}

function handleMouseDown() {
  showPopImage();
  updateScore(1);
}

function handleMouseUp() {
  hidePopImage();
}

function handleKeyDown(event) {
  if (!keyPressed) {
    keyPressed = true;
    showPopImage();
    updateScore(1);
  }
}

function handleKeyUp() {
  keyPressed = false;
  hidePopImage();
}

function randomIncrement() {
  const randomValue = Math.floor(Math.random() * 5) + 1;

  totalClicks += randomValue;
  totalCounterEl.textContent = totalClicks.toLocaleString();

  localStorage.setItem("totalClicks", totalClicks);
}

clickableArea.addEventListener("mousedown", handleMouseDown);
clickableArea.addEventListener("mouseup", handleMouseUp);
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

setInterval(() => {
  randomIncrement();
}, Math.random() * (60 * 1000));