const PARTICLES_QTY = 100;
const MAX_TAIL_LENGTH = 50;

class Particle {
  constructor(effect) {
    this.effect = effect;
    this.x = Math.floor(Math.random() * effect.width);
    this.y = Math.floor(Math.random() * effect.height);
    this.vx = Math.random() * 2;
    this.vy = Math.random() * 2;
    this.angle = 0;
    this.history = [{ x: this.x, y: this.y }];
  }

  update() {
    this.angle += 0;
    this.x += this.vx + Math.sin(this.angle);
    this.y += this.vy + Math.random() * 5 - 2.5;

    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > MAX_TAIL_LENGTH) this.history.shift();
  }

  draw() {
    let context = this.effect.getContext();
    context.fillRect(this.x, this.y, 10, 10);
    context.beginPath();
    context.moveTo(this.history[0].x, this.history[0].y);
    this.history.forEach((pos) => context.lineTo(pos.x, pos.y));
    context.stroke();
  }
}

class Effect {
  constructor(canvas) {
    this.canvas = canvas;
    this.configureCanvas();
    this.width = canvas.width;
    this.height = canvas.height;
    this.particles = [];
  }

  configureCanvas() {
    const ctx = this.canvas.getContext("2d");

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    ctx.fillStyle = "blue";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
  }

  getContext() {
    return this.canvas.getContext("2d");
  }

  clearCanvas() {
    this.getContext().clearRect(0, 0, this.canvas.width, this.canvas.height);
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
