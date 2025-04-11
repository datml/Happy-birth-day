const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = null;
let food = spawnFood();
let score = 0;

const wishes = [
  "🌟 Tuổi 21 thật bùng nổ với ước mơ rực rỡ và trái tim nhiệt huyết.",
  "🌸 Mỗi ngày đều đầy tiếng cười và những thành công ngọt ngào.",
  "🎓 Hành trình sinh viên thật đáng nhớ và tràn ngập cảm hứng.",
  "💖 Chúc một năm mới rực rỡ, đáng yêu, và thật nhiều niềm vui!"
];

document.addEventListener("keydown", changeDirection);

function changeDirection(e) {
  const key = e.keyCode;
  if (key === 37 && direction !== "RIGHT") direction = "LEFT";
  else if (key === 38 && direction !== "DOWN") direction = "UP";
  else if (key === 39 && direction !== "LEFT") direction = "RIGHT";
  else if (key === 40 && direction !== "UP") direction = "DOWN";
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
  };
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#e91e63" : "#f48fb1";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "#4caf50";
  ctx.fillRect(food.x, food.y, box, box);

  // Move snake
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  // Game over conditions
  if (
    headX < 0 || headX >= canvas.width ||
    headY < 0 || headY >= canvas.height ||
    collision(headX, headY, snake)
  ) {
    clearInterval(game);
    alert("Game Over!");
    return;
  }

  let newHead = { x: headX, y: headY };

  if (headX === food.x && headY === food.y) {
    showWish(score);
    score++;
    food = spawnFood();
  } else {
    snake.pop();
  }

  snake.unshift(newHead);

  if (score >= wishes.length) {
    celebrate();
    clearInterval(game);
  }
}

function collision(x, y, array) {
  return array.some(segment => segment.x === x && segment.y === y);
}

function showWish(index) {
  const wishBox = document.getElementById("wishBox");
  wishBox.textContent = wishes[index];

  const eatSound = document.getElementById("eatSound");
  eatSound.currentTime = 0;
  eatSound.play();
}

function celebrate() {
  document.body.style.background = "url('https://i.imgur.com/3eD3Flz.jpg') center/cover no-repeat";
  document.getElementById("wishBox").style.display = "none";
  document.getElementById("celebration").style.display = "flex";
  launchConfetti();
}

function launchConfetti() {
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.style.position = "absolute";
    confetti.style.width = "10px";
    confetti.style.height = "10px";
    confetti.style.backgroundColor = randomColor();
    confetti.style.left = `${Math.random() * window.innerWidth}px`;
    confetti.style.top = `-10px`;
    confetti.style.animation = `confetti ${Math.random() * 3 + 2}s linear infinite`;
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 5000);
  }
}

function randomColor() {
  const colors = ["#f06292", "#ba68c8", "#4dd0e1", "#81c784", "#ffd54f"];
  return colors[Math.floor(Math.random() * colors.length)];
}

let game = setInterval(drawGame, 150);
