const PARTICLES_QTY = 2000;
const MAX_TAIL_LENGTH = 100;
const CELL_SIZE = 16;
const ZOOM = 0.11;
const CURVE = 7;

class Particle {
  constructor(effect) {
    this.effect = effect;
    this.vx;
    this.vy;
    this.speedModified = Math.random() * 3 + 1;
    this.angle = 0;
    this.reset();
  }

  update() {
    this.timer--;

    if (this.timer >= 1) {
      let cellX = Math.floor(this.x / CELL_SIZE);
      let cellY = Math.floor(this.y / CELL_SIZE);
      let index = cellY * this.effect.columns + cellX;
      this.angle = this.effect.flowField[index];

      this.vx = Math.cos(this.angle);
      this.vy = Math.sin(this.angle);

      this.x += this.vx * this.speedModified;
      this.y += this.vy * this.speedModified;

      this.history.push({ x: this.x, y: this.y });
      if (this.history.length > MAX_TAIL_LENGTH) this.history.shift();
    } else if (this.history.length > 1) {
      this.history.shift();
    } else {
      this.reset();
    }
  }

  draw() {
    let context = this.effect.context;
    context.beginPath();
    context.moveTo(this.history[0].x, this.history[0].y);
    this.history.forEach((pos) => context.lineTo(pos.x, pos.y));
    context.stroke();
  }

  reset() {
    this.x = Math.floor(Math.random() * effect.width);
    this.y = Math.floor(Math.random() * effect.height);
    this.timer = MAX_TAIL_LENGTH * 2;
    this.history = [{ x: this.x, y: this.y }];
  }
}

class Effect {
  constructor(canvas) {
    this.canvas = canvas;
    this.particles = [];
    this.rows;
    this.columns;
    this.flowField = [];
    this.configureCanvas();
    this.configureFlowField();
  }

  configureCanvas() {
    const ctx = this.canvas.getContext("2d");

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    ctx.fillStyle = "blue";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  get context() {
    return this.canvas.getContext("2d");
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  configureFlowField() {
    this.rows = Math.floor(this.height / CELL_SIZE);
    this.columns = Math.floor(this.width / CELL_SIZE);
    this.flowField = [];

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        let angle = (Math.cos(x * ZOOM) + Math.sin(y * ZOOM)) * CURVE;
        this.flowField.push(angle);
      }
    }
  }

  createParticles() {
    for (let i = 0; i < PARTICLES_QTY; i++) {
      this.particles.push(new Particle(this));
    }
  }

  handleParticles() {
    this.particles.forEach((particle) => {
      particle.draw();
      particle.update();
    });
  }

  renderFrame() {
    this.clearCanvas();
    this.handleParticles();
  }
}

// Entry point
const effect = new Effect(document.getElementById("canvas1"));
effect.createParticles();

function animate() {
  effect.renderFrame();
  window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);
