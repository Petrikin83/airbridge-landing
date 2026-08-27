/* =========================================================
   AirBridge® Premium Landing — main.js (vanilla)
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector('.ab-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile burger menu ---------- */
  const burger = document.querySelector('.ab-header__burger');
  const nav = document.querySelector('.ab-nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.ab-reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Gallery feature video (play/pause) ---------- */
  const featureVideo = document.querySelector('.js-gallery-video');
  const playToggle = document.querySelector('.js-gallery-play');

  if (featureVideo && playToggle) {
    const icon = playToggle.querySelector('i');
    const setPlaying = (playing) => {
      playToggle.classList.toggle('is-playing', playing);
      if (icon) icon.className = playing ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    };

    playToggle.addEventListener('click', () => {
      if (featureVideo.paused) {
        featureVideo.play();
      } else {
        featureVideo.pause();
      }
    });

    featureVideo.addEventListener('play', () => setPlaying(true));
    featureVideo.addEventListener('pause', () => setPlaying(false));
    featureVideo.addEventListener('ended', () => setPlaying(false));
  }

  /* ---------- Success modal ---------- */
  const modal = document.querySelector('.js-modal');
  const modalBackdrop = modal ? modal.querySelector('.ab-modal__backdrop') : null;
  const modalClose = modal ? modal.querySelector('.js-modal-close') : null;
  const modalMailto = modal ? modal.querySelector('.js-modal-mailto') : null;

  const openModal = (mailtoHref) => {
    if (!modal) return;
    if (modalMailto && mailtoHref) modalMailto.href = mailtoHref;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (modalClose) modalClose.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  if (modal) {
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  /* ---------- Form: validation + mailto fallback + modal ---------- */
  const form = document.querySelector('.js-quote-form');
  if (form) {
    const get = (sel) => form.querySelector(sel);
    const emailOk = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const setError = (input, on) => {
      if (!input) return;
      input.style.borderColor = on ? '#d93025' : '';
      input.setAttribute('aria-invalid', on ? 'true' : 'false');
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = get('#ab-name');
      const company = get('#ab-company');
      const email = get('#ab-email');
      const type = get('#ab-type');
      const message = get('#ab-message');

      let valid = true;
      if (!name.value.trim()) { setError(name, true); valid = false; } else setError(name, false);
      if (!emailOk(email.value.trim())) { setError(email, true); valid = false; } else setError(email, false);
      if (!message.value.trim()) { setError(message, true); valid = false; } else setError(message, false);
      if (!valid) return;

      const subject = encodeURIComponent('AirBridge® project calculation request');
      const body = encodeURIComponent(
        [
          'Name: ' + name.value,
          'Company: ' + company.value,
          'Email: ' + email.value,
          'Project type: ' + type.value,
          'Message: ' + message.value
        ].join('\n')
      );

      openModal('mailto:info@cdc.company?subject=' + subject + '&body=' + body);
      form.reset();
    });
  }
})();

