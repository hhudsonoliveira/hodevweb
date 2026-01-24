/* =====================================================
   SCROLL-EFFECTS.JS - HoDevWeb
   Animacoes ativadas por scroll usando GSAP ScrollTrigger
   ===================================================== */

// Aguarda GSAP e ScrollTrigger carregarem
function initScrollEffects() {
  // Verifica se GSAP esta disponivel
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP ou ScrollTrigger nao carregado - elementos permanecem visiveis');
    return;
  }

  // Verifica preferencias de movimento reduzido
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Registra ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // ============ TITULOS DE SECAO ============
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.fromTo(title,
      { opacity: 0.3, y: 40 },
      {
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }
    );
  });

  // ============ SUBTITULOS ============
  gsap.utils.toArray('.section-subtitle').forEach(subtitle => {
    gsap.fromTo(subtitle,
      { opacity: 0.3, y: 30 },
      {
        scrollTrigger: {
          trigger: subtitle,
          start: 'top 85%'
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.1,
        ease: 'power3.out'
      }
    );
  });

  // ============ SECTION TAGS ============
  gsap.utils.toArray('.section-tag').forEach(tag => {
    gsap.fromTo(tag,
      { opacity: 0.5, scale: 0.9 },
      {
        scrollTrigger: {
          trigger: tag,
          start: 'top 85%'
        },
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.5)'
      }
    );
  });

  // ============ SERVICE CARDS - Animacao suave ============
  const serviceCards = gsap.utils.toArray('.service-card');
  if (serviceCards.length > 0) {
    serviceCards.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0.5, y: 30 },
        {
          scrollTrigger: {
            trigger: card,
            start: 'top 90%'
          },
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'power2.out'
        }
      );
    });
  }

  // ============ PRICING CARDS ============
  const pricingCards = gsap.utils.toArray('.pricing-card');
  if (pricingCards.length > 0) {
    pricingCards.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0.5, y: 40 },
        {
          scrollTrigger: {
            trigger: card,
            start: 'top 90%'
          },
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: index * 0.15,
          ease: 'power2.out'
        }
      );
    });
  }

  // ============ TESTIMONIAL CARDS ============
  const testimonialCards = gsap.utils.toArray('.testimonial-card');
  if (testimonialCards.length > 0) {
    testimonialCards.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0.5, scale: 0.95 },
        {
          scrollTrigger: {
            trigger: card,
            start: 'top 90%'
          },
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'power2.out'
        }
      );
    });
  }

  // ============ PROCESS STEPS ============
  const processSteps = gsap.utils.toArray('.process__step');
  if (processSteps.length > 0) {
    processSteps.forEach((step, index) => {
      gsap.fromTo(step,
        { opacity: 0.5, y: 30 },
        {
          scrollTrigger: {
            trigger: step,
            start: 'top 90%'
          },
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: index * 0.1,
          ease: 'power2.out'
        }
      );
    });
  }

  // ============ STATS NUMBERS ============
  gsap.utils.toArray('.stats__number').forEach(stat => {
    const target = parseInt(stat.dataset.target) || parseInt(stat.textContent) || 0;

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(stat,
          { textContent: 0 },
          {
            textContent: target,
            duration: 2,
            ease: 'power1.inOut',
            snap: { textContent: 1 },
            onUpdate: function() {
              stat.textContent = Math.ceil(gsap.getProperty(stat, 'textContent'));
            }
          }
        );
      }
    });
  });

  // ============ CONTACT FORM ============
  const contactForm = document.querySelector('.contact__form');
  if (contactForm) {
    gsap.fromTo(contactForm,
      { opacity: 0.5, x: 30 },
      {
        scrollTrigger: {
          trigger: contactForm,
          start: 'top 85%'
        },
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: 'power2.out'
      }
    );
  }

  // ============ FOOTER COLUMNS ============
  const footerCols = gsap.utils.toArray('.footer__col, .footer__brand');
  if (footerCols.length > 0) {
    footerCols.forEach((col, index) => {
      gsap.fromTo(col,
        { opacity: 0.5, y: 20 },
        {
          scrollTrigger: {
            trigger: col,
            start: 'top 95%'
          },
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: index * 0.08,
          ease: 'power2.out'
        }
      );
    });
  }

  // ============ REFRESH SCROLLTRIGGER ON LOAD ============
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', initScrollEffects);
