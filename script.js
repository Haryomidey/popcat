const topScoreEl = document.getElementById("top-score");
const totalCounterEl = document.getElementById("total-counter");
const clickableArea = document.getElementById("clickable-area");
const catStatic = document.getElementById("cat-static");
const catPop = document.getElementById("cat-pop");
const copyIcon = document.querySelector(".fa-copy");
const checkIcon = document.querySelector(".fa-check");
const addressText = document.querySelector(".address");

const handleCopyClick = () => {
  navigator.clipboard.writeText(addressText.textContent).then(() => {
    copyIcon.classList.add("hidden");
    checkIcon.classList.remove("hidden");

    setTimeout(() => {
      checkIcon.classList.add("hidden");
      copyIcon.classList.remove("hidden");
    }, 2000);
  }).catch(err => {
    console.error("Failed to copy: ", err);
  });
};

copyIcon.addEventListener("click", handleCopyClick);

const popSound = new Audio("/pop-sound.mp3");

let totalClicks = 0;
let topScore = 0;
let keyPressed = false;

async function fetchInitialScores() {
  try {
    const response = await fetch("http://localhost:5000/api/get-score");
    const data = await response.json();
    totalClicks = data.totalClicks || 0;

    totalCounterEl.textContent = totalClicks.toLocaleString();
    topScoreEl.textContent = topScore.toLocaleString();
  } catch (error) {
    console.error("Error fetching initial scores:", error);
  }
}

async function updateScore(points) {
  totalClicks += points;
  topScore += 1;

  totalCounterEl.textContent = totalClicks.toLocaleString();
  topScoreEl.textContent = topScore.toLocaleString();

  try {
    await fetch("http://localhost:5000/api/update-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ totalClicks, topScore }),
    });
  } catch (error) {
    console.error("Error updating score:", error);
  }
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
  popSound.play();
  showPopImage();
  updateScore(1);
}

function handleMouseUp() {
  hidePopImage();
}

function handleTouchStart() {
  popSound.play();
  showPopImage();
  updateScore(1);
}

function handleTouchEnd() {
  hidePopImage();
}

function handleKeyDown(event) {
  if (!keyPressed) {
    popSound.play();
    keyPressed = true;
    showPopImage();
    updateScore(1);
  }
}

function handleKeyUp() {
  keyPressed = false;
  hidePopImage();
}

clickableArea.addEventListener("mousedown", handleMouseDown);
clickableArea.addEventListener("mouseup", handleMouseUp);
clickableArea.addEventListener("touchstart", handleTouchStart);
clickableArea.addEventListener("touchend", handleTouchEnd);
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

catStatic.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

catPop.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

fetchInitialScores();
