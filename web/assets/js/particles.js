/* =====================================================
   PARTICLES.JS - HoDevWeb
   Sistema de particulas animadas para o Hero
   ===================================================== */

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.animationId = null;
    this.isVisible = true;

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.addEventListeners();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];

    // Ajusta quantidade baseado no tamanho da tela
    const particleCount = window.innerWidth < 768 ? 40 : 80;

    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.canvas));
    }
  }

  addEventListeners() {
    // Resize handler
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });

    // Mouse move handler
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    // Mouse leave handler
    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Visibility API - pausa animacao quando aba nao esta visivel
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isVisible = false;
        cancelAnimationFrame(this.animationId);
      } else {
        this.isVisible = true;
        this.animate();
      }
    });
  }

  connectParticles() {
    const maxDistance = 120;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.5;
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(0, 102, 255, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    if (!this.isVisible) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(particle => {
      particle.update(this.mouse, this.canvas);
      particle.draw(this.ctx);
    });

    this.connectParticles();

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.baseSize = this.size;
    this.speedX = (Math.random() - 0.5) * 1;
    this.speedY = (Math.random() - 0.5) * 1;
    this.opacity = Math.random() * 0.5 + 0.2;

    // Cores variadas
    const colors = [
      { r: 0, g: 102, b: 255 },    // Primary blue
      { r: 0, g: 212, b: 255 },    // Cyan
      { r: 108, g: 92, b: 231 }    // Purple
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(mouse, canvas) {
    // Movimento base
    this.x += this.speedX;
    this.y += this.speedY;

    // Interacao com mouse
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;

        this.x -= forceDirectionX * force * 2;
        this.y -= forceDirectionY * force * 2;
        this.size = this.baseSize + force * 3;
      } else {
        this.size = this.baseSize;
      }
    }

    // Wrap around nas bordas
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
    ctx.fill();

    // Glow effect
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.2})`;
    ctx.fill();
  }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // Verifica se usuario prefere movimento reduzido
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    new ParticleSystem('hero-particles');
  }
});
