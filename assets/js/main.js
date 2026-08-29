/* =========================================================
   AirBridge® Premium Landing — main.js (vanilla)
   No forms, no modals — the funnel drives B2B traffic to cdc.company.
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

  /* ---------- Solution sliders (hardcoded image routing) ---------- */
  // Strict category binding — photos are hardcoded per solution (no cranes in ropeways, etc.)
  const SOLUTION_IMAGES = {
    'passenger-material': [
      'assets/images/solutions/passengers_material/passenger material 1.jpg',
      'assets/images/solutions/passengers_material/passenger material 10.jpeg',
      'assets/images/solutions/passengers_material/passenger material 11.jpeg',
      'assets/images/solutions/passengers_material/passenger material 12.jpeg',
      'assets/images/solutions/passengers_material/passenger material 13.jpeg',
      'assets/images/solutions/passengers_material/passenger material 14.jpeg',
      'assets/images/solutions/passengers_material/passenger material 2.jpg',
      'assets/images/solutions/passengers_material/passenger material 3.jpg',
      'assets/images/solutions/passengers_material/passenger material 4.png',
      'assets/images/solutions/passengers_material/passenger material 5.png',
      'assets/images/solutions/passengers_material/passenger material 6.jpg',
      'assets/images/solutions/passengers_material/passenger material 7.jpg',
      'assets/images/solutions/passengers_material/passenger material 8.jpg',
      'assets/images/solutions/passengers_material/passenger material 9.jpg'
    ],
    'cable': [
      'assets/images/solutions/cable_cranes/cable_cranes 1.jpg',
      'assets/images/solutions/cable_cranes/cable_cranes10.jpg',
      'assets/images/solutions/cable_cranes/cable_cranes11.jpeg',
      'assets/images/solutions/cable_cranes/cable_cranes2.png',
      'assets/images/solutions/cable_cranes/cable_cranes3.jpg',
      'assets/images/solutions/cable_cranes/cable_cranes4.png',
      'assets/images/solutions/cable_cranes/cable_cranes5.jpg',
      'assets/images/solutions/cable_cranes/cable_cranes6.jpeg',
      'assets/images/solutions/cable_cranes/cable_cranes7.png',
      'assets/images/solutions/cable_cranes/cable_cranes8.png',
      'assets/images/solutions/cable_cranes/cable_cranes9.png'
    ]
  };

  document.querySelectorAll('.js-slider').forEach((slider) => {
    const slidesWrap = slider.querySelector('.ab-slider__slides');
    const dotsWrap = slider.querySelector('.ab-slider__dots');
    const key = slider.dataset.solution;
    const sources = SOLUTION_IMAGES[key] || [];
    if (!slidesWrap || !dotsWrap || !sources.length) return;

    const slides = sources.map((src, i) => {
      const img = document.createElement('img');
      img.className = 'ab-slider__slide' + (i === 0 ? ' is-active' : '');
      img.src = src;
      img.alt = 'AirBridge® ' + (key === 'cable' ? 'cable crane' : 'ropeway') + ' — slide ' + (i + 1);
      slidesWrap.appendChild(img);
      return img;
    });

    const dots = [];
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'ab-slider__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => { goTo(i); restart(); });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    let index = 0;
    let timer = null;

    const goTo = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, j) => s.classList.toggle('is-active', j === index));
      dots.forEach((d, j) => d.classList.toggle('is-active', j === index));
    };

    const start = () => { timer = setInterval(() => goTo(index + 1), 4000); };
    const restart = () => { clearInterval(timer); start(); };

    start();
  });
})();
