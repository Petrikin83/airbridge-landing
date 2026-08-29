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

  /* ---------- Hero scroll indicator (fade on scroll) ---------- */
  const scrollIndicator = document.querySelector('.ab-hero__scroll');
  if (scrollIndicator) {
    const toggleIndicator = () => {
      scrollIndicator.classList.toggle('is-hidden', window.scrollY > 40);
    };
    window.addEventListener('scroll', toggleIndicator, { passive: true });
    toggleIndicator();
  }

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

  /* ---------- Trust bar animated counters ---------- */
  const COUNTERS = [
    { sel: '.ab-stat:nth-child(1) .ab-stat__value', count: 500, render: (n) => '+<span>' + n + '%</span>' },
    { sel: '.ab-stat:nth-child(2) .ab-stat__value', count: 200, render: (n) => n + '<span>+</span>' },
    { sel: '.ab-stat:nth-child(3) .ab-stat__value', count: 3, render: (n) => 'Top <span>' + n + '</span>' },
    { sel: '.ab-stat:nth-child(4) .ab-stat__value', count: 4000, render: (n) => n.toLocaleString('en-US') + '<span>m+</span>' }
  ];

  const animateCounter = (el, count, render, duration) => {
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.innerHTML = render(Math.round(eased * count));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const trustBar = document.querySelector('.ab-trust');
  const counterEls = COUNTERS
    .map((c) => ({ ...c, el: document.querySelector(c.sel) }))
    .filter((c) => c.el);

  if (counterEls.length) {
    counterEls.forEach((c) => { c.el.innerHTML = c.render(0); });

    if ('IntersectionObserver' in window && trustBar) {
      const counterIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            counterEls.forEach((c) => animateCounter(c.el, c.count, c.render, 1600));
            counterIO.unobserve(trustBar);
          }
        });
      }, { threshold: 0.3 });
      counterIO.observe(trustBar);
    } else {
      counterEls.forEach((c) => { c.el.innerHTML = c.render(c.count); });
    }
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
      'assets/images/solutions/passengers_material/passenger material 4.jpg',
      'assets/images/solutions/passengers_material/passenger material 5.jpg',
      'assets/images/solutions/passengers_material/passenger material 6.jpg',
      'assets/images/solutions/passengers_material/passenger material 7.jpg',
      'assets/images/solutions/passengers_material/passenger material 8.jpg',
      'assets/images/solutions/passengers_material/passenger material 9.jpg'
    ],
    'cable': [
      'assets/images/solutions/cable_cranes/cable_cranes 1.jpg',
      'assets/images/solutions/cable_cranes/cable_cranes10.jpg',
      'assets/images/solutions/cable_cranes/cable_cranes11.jpeg',
      'assets/images/solutions/cable_cranes/cable_cranes2.jpg',
      'assets/images/solutions/cable_cranes/cable_cranes3.jpg',
      'assets/images/solutions/cable_cranes/cable_cranes4.jpg',
      'assets/images/solutions/cable_cranes/cable_cranes5.jpg',
      'assets/images/solutions/cable_cranes/cable_cranes6.jpeg',
      'assets/images/solutions/cable_cranes/cable_cranes7.jpg',
      'assets/images/solutions/cable_cranes/cable_cranes8.jpg',
      'assets/images/solutions/cable_cranes/cable_cranes9.jpg'
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
