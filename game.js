/// game.js - Final version with centered popup and improved game over
let speed = 200;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = null;
let food = spawnFood();
let score = 0;
let isPaused = false;
let lastKeyPressTime = 0;

const wishes = [
  "🌟 Tuổi 21 thật bùng nổ với nhiều thành công và trải nghiệm .",
  "🌸 Mỗi ngày đều đầy tiếng cười và những hạnh phúc ngọt ngào.",
  "🎓 Hành trình sinh viên thật đáng nhớ và tràn ngập cảm hứng.",
  "💖 Chúc một tuổi mới rực rỡ, đáng yêu, và thật nhiều niềm vui!",
  ""
];

document.addEventListener("keydown", changeDirection, { passive: false });

// Replace just the changeDirection function
function changeDirection(e) {
  // Prevent default action for arrow keys to avoid page scrolling
  if (e.keyCode >= 37 && e.keyCode <= 40) {
    e.preventDefault();
  }

  if (isPaused) {
    // If paused and any key is pressed, resume game
    if (e.keyCode >= 37 && e.keyCode <= 40) { // Arrow keys
      resumeGame();
    }
    return;
  }

  const key = e.keyCode;

  // Store the last direction to prevent rapid reversals
  // This is crucial for responsiveness without breaking the game logic
  const lastDirection = direction;

  if (key === 37 && lastDirection !== "RIGHT") direction = "LEFT";
  else if (key === 38 && lastDirection !== "DOWN") direction = "UP";
  else if (key === 39 && lastDirection !== "LEFT") direction = "RIGHT";
  else if (key === 40 && lastDirection !== "UP") direction = "DOWN";
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
  };
}

function drawGame() {
  if (isPaused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  
  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#e91e63" : "#f48fb1";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "#4caf50";
  ctx.fillRect(food.x, food.y, box, box);
  ctx.strokeStyle = "#fff";
  ctx.strokeRect(food.x, food.y, box, box);

  // Calculate new head position
  let headX = snake[0].x;
  let headY = snake[0].y;
  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  // Game over conditions (explained below)
  if (checkGameOver(headX, headY)) {
    gameOver();
    return;
  }

  // Create the new head
  let newHead = { x: headX, y: headY };

  // Check if food is eaten
  if (headX === food.x && headY === food.y) {
    eatFood();
  } else {
    snake.pop();
  }

  snake.unshift(newHead);

  if (score >= wishes.length) {
    celebrate();
    clearInterval(game);
  }
}

// New function to check game over conditions
function checkGameOver(headX, headY) {
  // 1. Hit the wall
  const hitWall = headX < 0 || headX >= canvas.width || 
                 headY < 0 || headY >= canvas.height;

  // 2. Hit itself (collision with any segment except the head)
  const hitSelf = snake.slice(1).some(segment => 
    segment.x === headX && segment.y === headY);

  return hitWall || hitSelf;
}

function gameOver() {
  clearInterval(game);
  // Show game over message on canvas instead of alert
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width/2, canvas.height/2 - 30);
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 10);
  ctx.fillText("Press R to restart", canvas.width/2, canvas.height/2 + 50);

  // Listen for restart key
  document.addEventListener("keydown", function restartListener(e) {
    if (e.key.toLowerCase() === "r") {
      document.removeEventListener("keydown", restartListener);
      restartGame();
    }
  });
}

function eatFood() {
  isPaused = true;
  showWishPopup(score);
  launchConfetti();

  const eatSound = document.getElementById("eatSound");
  eatSound.currentTime = 0;
  eatSound.play();

  score++;
  food = spawnFood();
  speed = Math.max(80, speed - 20);
  clearInterval(game);
  game = setInterval(drawGame, speed);
}

function resumeGame() {
  isPaused = false;
  document.getElementById("wishPopup").style.display = "none";
}

// New function for centered popup
function showWishPopup(index) {
  const popup = document.getElementById("wishPopup");
  const popupText = document.getElementById("wishPopupText");

  popupText.textContent = wishes[index];
  popup.style.display = "flex";
}

function drawGrid() {
  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 0.5;

  for (let x = 0; x <= canvas.width; x += box) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += box) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function celebrate() {
  // Hide the game canvas
  document.getElementById("gameCanvas").style.display = "none";

  // Change background and show celebration
  document.getElementById("wishPopup").style.display = "none";
  document.getElementById("celebration").style.display = "flex";
  document.getElementById("restartBtn").style.display = "inline-block";

  // Launch confetti effect
  launchConfetti();

  // Create floating balloons
  createBalloons();
}
function launchConfetti() {
  const confettiColors = [
    "#f06292", "#ba68c8", "#4dd0e1", "#81c784", "#ffd54f", 
    "#ffb74d", "#64b5f6", "#4db6ac", "#aed581", "#ff8a65"
  ];

  for (let i = 0; i < 150; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti-piece";
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      confetti.style.left = `${Math.random() * window.innerWidth}px`;
      confetti.style.top = `-10px`;
      confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      confetti.style.position = "fixed";
      confetti.style.zIndex = "200";
      confetti.style.animation = `confetti ${Math.random() * 3 + 2}s linear forwards`;
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 5000);
    }, i * 30);
  }
}

function randomColor() {
  const colors = ["#f06292", "#ba68c8", "#4dd0e1", "#81c784", "#ffd54f"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function restartGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = null;
  food = spawnFood();
  score = 0;
  speed = 200;
  isPaused = false;

  // Show the canvas again
  document.getElementById("gameCanvas").style.display = "block";

  // Clear any balloon elements
  document.querySelectorAll('.balloon').forEach(balloon => balloon.remove());
  document.querySelectorAll('.confetti-piece').forEach(confetti => confetti.remove());

  document.getElementById("wishPopup").style.display = "none";
  document.getElementById("celebration").style.display = "none";
  document.getElementById("restartBtn").style.display = "none";
  document.body.style.background = "#fce4ec";

  clearInterval(game);
  game = setInterval(drawGame, speed);
}

window.onload = () => {
  const music = document.getElementById("bgMusic");
  music.volume = 0.4; // softer volume
  music.play().catch(err => {
    console.log("Auto-play blocked. Music will start on user interaction.");
  });
};

function toggleMusic() {
  const music = document.getElementById("bgMusic");
  const btn = document.getElementById("toggleMusicBtn");

  if (music.paused) {
    music.play();
    btn.textContent = "🎵 Tắt nhạc";
  } else {
    music.pause();
    btn.textContent = "🎵 Bật nhạc";
  }
}

function startGame() {
  document.getElementById("startBtn").style.display = "none";
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "RIGHT"; // Set initial direction
  food = spawnFood();
  score = 0;
  speed = 200; // Updated to match initial speed
  game = setInterval(drawGame, speed);
  document.getElementById("bgMusic").play();
}

function createBalloons() {
  // Create 15 balloons
  for (let i = 0; i < 15; i++) {
    const balloon = document.createElement("div");
    balloon.className = "balloon";
    balloon.style.left = `${Math.random() * 90 + 5}%`;
    balloon.style.animationDuration = `${Math.random() * 3 + 8}s`; // Different speeds
    balloon.style.animationDelay = `${Math.random() * 2}s`;

    // Random balloon colors
    const colors = ["#FF5252", "#FF4081", "#E040FB", "#7C4DFF", "#536DFE", "#448AFF", "#40C4FF", "#18FFFF"];
    balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    // Add balloon string
    const string = document.createElement("div");
    string.className = "balloon-string";
    balloon.appendChild(string);

    document.body.appendChild(balloon);
  }
}
function showTutorial() {
  document.getElementById("tutorialPopup").style.display = "flex";
}
function hideTutorial() {
  document.getElementById("tutorialPopup").style.display = "none";
}

let game;
