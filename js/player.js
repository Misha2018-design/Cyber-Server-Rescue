/**
 * Гравець — об'єкт з координатами, розміром, швидкістю та кольором.
 */
class Player {
  constructor({ x, y, width, height, speed, color }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.color = color;
  }

  /**
   * Оновлює позицію гравця за напрямком руху та обмежує межами канвасу.
   * @param {{ left: boolean, right: boolean }} keys
   * @param {number} canvasWidth
   * @param {number} canvasHeight
   */
  update(keys, canvasWidth, canvasHeight) {
    if (keys.left) {
      this.x -= this.speed;
    }
    if (keys.right) {
      this.x += this.speed;
    }

    // Межі канвасу — гравець не виходить за екран
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.width > canvasWidth) {
      this.x = canvasWidth - this.width;
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y + this.height > canvasHeight) {
      this.y = canvasHeight - this.height;
    }
  }

  /**
   * Малює гравця на канвасі.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Невеликий «цифровий» акцент зверху
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(this.x + 8, this.y + 6, this.width - 16, 4);
  }
}
