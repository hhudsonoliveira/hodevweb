/* =====================================================
   GSAP-ANIMATIONS.JS - HoDevWeb
   Animacoes principais usando GSAP
   ===================================================== */

function initGSAPAnimations() {
  // Verifica se GSAP esta disponivel
  if (typeof gsap === 'undefined') {
    console.warn('GSAP nao carregado');
    return;
  }

  // Verifica preferencias de movimento reduzido
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // ============ HERO ENTRANCE ANIMATION ============
  const heroTimeline = gsap.timeline({
    delay: 0.3,
    defaults: {
      ease: 'power3.out'
    }
  });

  // Anima elementos do hero em sequencia
  heroTimeline
    .from('.hero__badge', {
      opacity: 0,
      scale: 0,
      duration: 0.6,
      ease: 'back.out(2)'
    })
    .from('.hero__title', {
      opacity: 0,
      y: 80,
      duration: 1
    }, '-=0.3')
    .from('.hero__title .gradient-text', {
      opacity: 0,
      x: -30,
      duration: 0.8
    }, '-=0.6')
    .from('.hero__subtitle', {
      opacity: 0,
      y: 50,
      duration: 0.8
    }, '-=0.5')
    .from('.hero__buttons .btn', {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.6
    }, '-=0.4')
    .from('.hero__image-wrapper', {
      opacity: 0,
      scale: 0.8,
      rotation: -5,
      duration: 1,
      ease: 'back.out(1.2)'
    }, '-=0.8')
    .from('.hero__float', {
      opacity: 0,
      scale: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: 'back.out(2)'
    }, '-=0.6');

  // ============ TEXT SPLIT ANIMATION ============
  // Anima letras individualmente (opcional)
  const animatedTitles = document.querySelectorAll('[data-split-text]');
  animatedTitles.forEach(title => {
    const text = title.textContent;
    title.innerHTML = text.split('').map(char =>
      char === ' ' ? ' ' : `<span class="char">${char}</span>`
    ).join('');

    gsap.from(title.querySelectorAll('.char'), {
      opacity: 0,
      y: 50,
      rotateX: -90,
      stagger: 0.02,
      duration: 0.5,
      ease: 'back.out(2)',
      scrollTrigger: {
        trigger: title,
        start: 'top 80%'
      }
    });
  });

  // ============ MAGNETIC BUTTON EFFECT ============
  const magneticButtons = document.querySelectorAll('.magnetic-btn');

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  });

  // ============ 3D CARD TILT EFFECT ============
  const tiltCards = document.querySelectorAll('.service-card, [data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        transformPerspective: 1000,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });

  // ============ HOVER GLOW EFFECT ============
  const glowElements = document.querySelectorAll('[data-glow]');

  glowElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(el, {
        boxShadow: '0 0 40px rgba(0, 102, 255, 0.4)',
        duration: 0.3
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        boxShadow: '0 0 0 rgba(0, 102, 255, 0)',
        duration: 0.3
      });
    });
  });

  // ============ ICON ROTATION ON HOVER ============
  const iconWrappers = document.querySelectorAll('.icon-wrapper');

  iconWrappers.forEach(wrapper => {
    const card = wrapper.closest('.service-card');
    if (!card) return;

    card.addEventListener('mouseenter', () => {
      gsap.to(wrapper, {
        rotation: 360,
        scale: 1.1,
        duration: 0.6,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(wrapper, {
        rotation: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
  });

  // ============ STAGGER ANIMATION FOR LISTS ============
  const staggerLists = document.querySelectorAll('[data-stagger]');

  staggerLists.forEach(list => {
    const items = list.children;

    gsap.from(items, {
      scrollTrigger: {
        trigger: list,
        start: 'top 80%'
      },
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out'
    });
  });

  // ============ SMOOTH REVEAL FOR IMAGES ============
  const revealImages = document.querySelectorAll('[data-reveal-image]');

  revealImages.forEach(container => {
    const img = container.querySelector('img');
    if (!img) return;

    gsap.set(container, { overflow: 'hidden' });

    gsap.from(img, {
      scrollTrigger: {
        trigger: container,
        start: 'top 80%'
      },
      scale: 1.3,
      duration: 1.2,
      ease: 'power3.out'
    });
  });

  // ============ PRICING CARD HIGHLIGHT ============
  const featuredCard = document.querySelector('.pricing-card.featured');

  if (featuredCard) {
    // Animacao de pulso sutil
    gsap.to(featuredCard, {
      boxShadow: '0 0 60px rgba(0, 102, 255, 0.3)',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  // ============ GRADIENT TEXT ANIMATION ============
  const gradientTexts = document.querySelectorAll('.gradient-text');

  gradientTexts.forEach(text => {
    gsap.to(text, {
      backgroundPosition: '200% center',
      duration: 4,
      repeat: -1,
      ease: 'none'
    });
  });

  // ============ FLOAT ANIMATION FOR DECORATIVE ELEMENTS ============
  const floatElements = document.querySelectorAll('.hero__float, .float-element');

  floatElements.forEach((el, index) => {
    const duration = 4 + (index * 0.5);
    const yMove = 15 + (index * 5);

    gsap.to(el, {
      y: `+=${yMove}`,
      rotation: index % 2 === 0 ? 5 : -5,
      duration: duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  });
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', initGSAPAnimations);
