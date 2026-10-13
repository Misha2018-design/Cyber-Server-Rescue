(function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // Стан натиснутих клавіш (стрілки або A/D)
  const keys = {
    left: false,
    right: false,
  };

  // Об'єкт гравця: координати, розмір, швидкість, колір
  const player = new Player({
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 40,
    speed: 5,
    color: "#4de8ff",
  });

  function handleKeyDown(event) {
    switch (event.key) {
      case "ArrowLeft":
      case "a":
      case "A":
        keys.left = true;
        event.preventDefault();
        break;
      case "ArrowRight":
      case "d":
      case "D":
        keys.right = true;
        event.preventDefault();
        break;
    }
  }

  function handleKeyUp(event) {
    switch (event.key) {
      case "ArrowLeft":
      case "a":
      case "A":
        keys.left = false;
        break;
      case "ArrowRight":
      case "d":
      case "D":
        keys.right = false;
        break;
    }
  }

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  /**
   * Ігровий цикл: очищення → оновлення позиції → малювання.
   */
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update(keys, canvas.width, canvas.height);
    player.draw(ctx);

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
})();
