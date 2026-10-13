"use strict";

const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");
const gameOverPanel = document.querySelector("#game-over");
const restartButton = document.querySelector("#restart-button");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PLAYER_SIZE = 34;
const ENEMY_SIZE = 30;
const ENEMY_COUNT = 5;
const PLAYER_SPEED = 320;
const INITIAL_ENEMY_SPEED = 115;
const SPEED_INCREASE_PER_SECOND = 4;

const player = {
  x: (WIDTH - PLAYER_SIZE) / 2,
  y: HEIGHT - PLAYER_SIZE - 28,
  width: PLAYER_SIZE,
  height: PLAYER_SIZE
};

let enemies = [];
let pressedKeys = new Set();
let isGameOver = false;
let elapsedSeconds = 0;
let previousFrameTime = 0;

function randomEnemyX() {
  return Math.random() * (WIDTH - ENEMY_SIZE);
}

function createEnemies() {
  return Array.from({ length: ENEMY_COUNT }, (_, index) => ({
    x: randomEnemyX(),
    y: -ENEMY_SIZE - index * (HEIGHT / ENEMY_COUNT),
    width: ENEMY_SIZE,
    height: ENEMY_SIZE
  }));
}

function intersects(first, second) {
  return first.x < second.x + second.width
    && first.x + first.width > second.x
    && first.y < second.y + second.height
    && first.y + first.height > second.y;
}

function drawBackground() {
  context.fillStyle = "#081827";
  context.fillRect(0, 0, WIDTH, HEIGHT);
  context.strokeStyle = "rgb(71 132 160 / 12%)";
  context.lineWidth = 1;

  for (let x = 0; x <= WIDTH; x += 40) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, HEIGHT);
    context.stroke();
  }

  for (let y = 0; y <= HEIGHT; y += 40) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(WIDTH, y);
    context.stroke();
  }
}

function drawPlayer() {
  context.save();
  context.shadowColor = "#53f5cf";
  context.shadowBlur = 18;
  context.fillStyle = "#53f5cf";
  context.fillRect(player.x, player.y, player.width, player.height);
  context.shadowBlur = 0;
  context.fillStyle = "#092a34";
  context.fillRect(player.x + 8, player.y + 8, 5, 5);
  context.fillRect(player.x + 21, player.y + 8, 5, 5);
  context.fillRect(player.x + 9, player.y + 21, 16, 4);
  context.restore();
}

function drawEnemies() {
  for (const enemy of enemies) {
    context.save();
    context.shadowColor = "#ff5577";
    context.shadowBlur = 14;
    context.fillStyle = "#ff5577";
    context.beginPath();
    context.arc(
      enemy.x + enemy.width / 2,
      enemy.y + enemy.height / 2,
      enemy.width / 2,
      0,
      Math.PI * 2
    );
    context.fill();
    context.shadowBlur = 0;
    context.fillStyle = "#3a1024";
    context.fillRect(enemy.x + 7, enemy.y + 10, 5, 5);
    context.fillRect(enemy.x + 18, enemy.y + 10, 5, 5);
    context.restore();
  }
}

function drawHud() {
  context.fillStyle = "#b8c8d6";
  context.font = "14px Segoe UI, sans-serif";
  context.fillText(`ЧАС: ${Math.floor(elapsedSeconds)} с`, 16, 26);
}

function finishGame() {
  isGameOver = true;
  gameOverPanel.hidden = false;
  restartButton.focus();
}

function update(deltaSeconds) {
  elapsedSeconds += deltaSeconds;

  const horizontalDirection = Number(pressedKeys.has("ArrowRight") || pressedKeys.has("d"))
    - Number(pressedKeys.has("ArrowLeft") || pressedKeys.has("a"));
  player.x = Math.max(
    0,
    Math.min(WIDTH - player.width, player.x + horizontalDirection * PLAYER_SPEED * deltaSeconds)
  );

  const enemySpeed = INITIAL_ENEMY_SPEED + elapsedSeconds * SPEED_INCREASE_PER_SECOND;
  for (const enemy of enemies) {
    enemy.y += enemySpeed * deltaSeconds;

    if (enemy.y > HEIGHT) {
      enemy.x = randomEnemyX();
      enemy.y = -enemy.height;
    }

    if (intersects(player, enemy)) {
      finishGame();
      return;
    }
  }
}

function render() {
  drawBackground();
  drawHud();
  drawEnemies();
  drawPlayer();
}

function frame(timestamp) {
  if (isGameOver) {
    return;
  }

  const deltaSeconds = previousFrameTime === 0
    ? 0
    : Math.min((timestamp - previousFrameTime) / 1000, 0.05);
  previousFrameTime = timestamp;
  update(deltaSeconds);
  render();

  if (!isGameOver) {
    requestAnimationFrame(frame);
  }
}

function startGame() {
  player.x = (WIDTH - PLAYER_SIZE) / 2;
  enemies = createEnemies();
  pressedKeys.clear();
  elapsedSeconds = 0;
  previousFrameTime = 0;
  isGameOver = false;
  gameOverPanel.hidden = true;
  render();
  requestAnimationFrame(frame);
}

document.addEventListener("keydown", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (["ArrowLeft", "ArrowRight", "a", "d"].includes(key)) {
    event.preventDefault();
    pressedKeys.add(key);
  }

  if (isGameOver && (key === "Enter" || key === " ")) {
    if (event.target === restartButton) {
      return;
    }
    event.preventDefault();
    startGame();
  }
});

document.addEventListener("keyup", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  pressedKeys.delete(key);
});

window.addEventListener("blur", () => pressedKeys.clear());
restartButton.addEventListener("click", startGame);

startGame();
