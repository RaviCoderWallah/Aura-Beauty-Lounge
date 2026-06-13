/* ========================================================
   AURA BEAUTY LOUNGE — script.js
   Features: Mobile Nav · Sticky Header · Counters
             Swiper · Lightbox · Reveal · Form · Back-to-Top
======================================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* =================== MOBILE NAVIGATION =================== */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') &&
          !navMenu.contains(e.target) &&
          !navToggle.contains(e.target)) {
        closeNav();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) closeNav();
    });
  }

  function closeNav() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }


  /* =================== STICKY HEADER =================== */
  const header = document.getElementById('header');

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load


  /* =================== ACTIVE NAV LINK =================== */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-48% 0px -48% 0px' });

  sections.forEach(sec => sectionObserver.observe(sec));


  /* =================== SMOOTH SCROLL (Custom Offset) =================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* =================== COUNTER ANIMATION =================== */
  const counters = document.querySelectorAll('.trust-number');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.counted) return;
      entry.target.dataset.counted = 'true';

      const target    = parseFloat(entry.target.dataset.count);
      const isDecimal = entry.target.classList.contains('trust-decimal');
      const duration  = 2000;
      const startTime = performance.now();

      const tick = (now) => {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutCubic
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = eased * target;
        entry.target.textContent = isDecimal
          ? current.toFixed(1)
          : Math.floor(current).toLocaleString('en-IN');
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });

  counters.forEach(el => countObserver.observe(el));


  /* =================== SWIPER — TESTIMONIALS =================== */
  if (typeof Swiper !== 'undefined') {
    new Swiper('.testimonials-swiper', {
      loop: true,
      spaceBetween: 24,
      slidesPerView: 1,
      grabCursor: true,
      speed: 600,
      autoplay: {
        delay: 5500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1100: { slidesPerView: 3 },
      },
      a11y: {
        prevSlideMessage: 'Previous testimonial',
        nextSlideMessage: 'Next testimonial',
      },
    });
  }


  /* =================== GALLERY LIGHTBOX =================== */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxImg && lightboxClose) {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
      item.addEventListener('click',  openLightbox.bind(null, item));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item);
        }
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }

  function openLightbox(item) {
    const img = item.querySelector('img');
    if (!img || !lightboxImg) return;
    lightboxImg.src = img.src.replace('w=800', 'w=1400');
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }


  /* =================== SCROLL REVEAL =================== */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger children within the same parent grid
          const siblings = entry.target.parentElement.querySelectorAll('.reveal');
          let delay = 0;
          siblings.forEach((sib, i) => {
            if (sib === entry.target) delay = i * 60;
          });
          setTimeout(() => entry.target.classList.add('visible'), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all
    revealEls.forEach(el => el.classList.add('visible'));
  }


  /* =================== BACK TO TOP =================== */
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* =================== CONTACT FORM =================== */
  const contactForm  = document.getElementById('contact-form');
  const submitBtn    = document.getElementById('submit-btn');
  const formSuccess  = document.getElementById('form-success');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic validation
      const name    = contactForm.name.value.trim();
      const email   = contactForm.email.value.trim();
      const subject = contactForm.subject.value;
      const message = contactForm.message.value.trim();

      if (!name || !email || !subject || !message) {
        showFormError('Please fill in all required fields.');
        return;
      }

      if (!isValidEmail(email)) {
        showFormError('Please enter a valid email address.');
        return;
      }

      // Disable button & show loading
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span><i class="ri-loader-4-line" style="animation:spin 0.8s linear infinite"></i>';

      // Add spinner keyframe dynamically
      if (!document.getElementById('spin-style')) {
        const style = document.createElement('style');
        style.id = 'spin-style';
        style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
      }

      // Simulate async submission (replace with real fetch() for production)
      await delay(1800);

      // Success state
      submitBtn.innerHTML = '<span>Message Sent!</span><i class="ri-check-line"></i>';
      submitBtn.style.cssText = 'background: linear-gradient(135deg, #22c55e, #16a34a); box-shadow: 0 8px 24px rgba(34,197,94,0.35)';

      if (formSuccess) {
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      contactForm.reset();

      // Reset button after delay
      await delay(3500);
      submitBtn.disabled = false;
      submitBtn.style.cssText = '';
      submitBtn.innerHTML = '<span>Send Message</span><i class="ri-send-plane-line"></i>';
      if (formSuccess) formSuccess.hidden = true;
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormError(msg) {
    // Simple shake animation for invalid form
    contactForm.style.animation = 'none';
    requestAnimationFrame(() => {
      contactForm.style.animation = 'shake 0.4s var(--ease)';
    });
    // Add shake keyframe if needed
    if (!document.getElementById('shake-style')) {
      const s = document.createElement('style');
      s.id = 'shake-style';
      s.textContent = `@keyframes shake {
        0%,100% { transform: translateX(0); }
        20%,60%  { transform: translateX(-6px); }
        40%,80%  { transform: translateX(6px); }
      }`;
      document.head.appendChild(s);
    }
    // Focus first invalid field
    const firstInvalid = contactForm.querySelector(':invalid');
    if (firstInvalid) firstInvalid.focus();
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  /* =================== IMAGE LOADING FALLBACK =================== */
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.addEventListener('error', () => {
      img.style.background = 'linear-gradient(135deg, #F5D5DF, #F9F5F3)';
      img.alt = img.alt || 'Image unavailable';
    });
  });

}); // End DOMContentLoaded
