/* =====================================================
   CURSOR-FOLLOW.JS - HoDevWeb
   Cursor personalizado com efeito de seguir
   ===================================================== */

class CustomCursor {
  constructor() {
    // Apenas em dispositivos com mouse (desktop)
    if (window.innerWidth < 768 || !this.hasMouseInput()) {
      return;
    }

    this.cursor = null;
    this.follower = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.followerX = 0;
    this.followerY = 0;
    this.isHovering = false;
    this.isVisible = true;

    this.init();
  }

  hasMouseInput() {
    return window.matchMedia('(hover: hover)').matches;
  }

  init() {
    // Verifica preferencias de movimento reduzido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.createCursor();
    this.addEventListeners();
    this.animate();
  }

  createCursor() {
    // Cursor principal (ponto)
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    document.body.appendChild(this.cursor);

    // Cursor seguidor (circulo)
    this.follower = document.createElement('div');
    this.follower.className = 'cursor-follower';
    document.body.appendChild(this.follower);

    // Esconde cursor padrao em todo o documento
    document.body.style.cursor = 'none';
  }

  addEventListeners() {
    // Mouse move
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      // Posiciona cursor principal instantaneamente
      if (this.cursor) {
        this.cursor.style.left = this.mouseX + 'px';
        this.cursor.style.top = this.mouseY + 'px';
      }

      // Mostra cursor se estava escondido
      if (!this.isVisible) {
        this.showCursor();
      }
    });

    // Mouse leave (sai da janela)
    document.addEventListener('mouseleave', () => {
      this.hideCursor();
    });

    // Mouse enter (volta pra janela)
    document.addEventListener('mouseenter', () => {
      this.showCursor();
    });

    // Hover em elementos interativos
    const interactiveElements = document.querySelectorAll(
      'a, button, .btn, .service-card, .pricing-card, .testimonial-card, input, textarea, [data-cursor="hover"]'
    );

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => this.onHoverEnter());
      el.addEventListener('mouseleave', () => this.onHoverLeave());
    });

    // Mutation Observer para novos elementos
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const newInteractive = node.querySelectorAll
              ? node.querySelectorAll('a, button, .btn, .service-card, .pricing-card')
              : [];

            newInteractive.forEach(el => {
              el.addEventListener('mouseenter', () => this.onHoverEnter());
              el.addEventListener('mouseleave', () => this.onHoverLeave());
            });
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Click effect
    document.addEventListener('mousedown', () => this.onMouseDown());
    document.addEventListener('mouseup', () => this.onMouseUp());

    // Window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        this.destroy();
      }
    });
  }

  animate() {
    if (!this.follower) return;

    // Movimento suave do follower com easing
    const ease = 0.15;
    this.followerX += (this.mouseX - this.followerX) * ease;
    this.followerY += (this.mouseY - this.followerY) * ease;

    this.follower.style.left = this.followerX + 'px';
    this.follower.style.top = this.followerY + 'px';

    requestAnimationFrame(() => this.animate());
  }

  onHoverEnter() {
    this.isHovering = true;
    if (this.cursor) this.cursor.classList.add('cursor-hover');
    if (this.follower) this.follower.classList.add('cursor-hover');
  }

  onHoverLeave() {
    this.isHovering = false;
    if (this.cursor) this.cursor.classList.remove('cursor-hover');
    if (this.follower) this.follower.classList.remove('cursor-hover');
  }

  onMouseDown() {
    if (this.cursor) this.cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    if (this.follower) this.follower.style.transform = 'translate(-50%, -50%) scale(0.8)';
  }

  onMouseUp() {
    if (this.cursor) {
      this.cursor.style.transform = this.isHovering
        ? 'translate(-50%, -50%) scale(2)'
        : 'translate(-50%, -50%) scale(1)';
    }
    if (this.follower) {
      this.follower.style.transform = 'translate(-50%, -50%) scale(1)';
    }
  }

  showCursor() {
    this.isVisible = true;
    if (this.cursor) this.cursor.style.opacity = '1';
    if (this.follower) this.follower.style.opacity = '1';
  }

  hideCursor() {
    this.isVisible = false;
    if (this.cursor) this.cursor.style.opacity = '0';
    if (this.follower) this.follower.style.opacity = '0';
  }

  destroy() {
    if (this.cursor) {
      this.cursor.remove();
      this.cursor = null;
    }
    if (this.follower) {
      this.follower.remove();
      this.follower = null;
    }
    document.body.style.cursor = 'auto';
  }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new CustomCursor();
});
