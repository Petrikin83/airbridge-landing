/* =========================================================
   AirBridge® Premium Landing — main.js (vanilla)
   No forms, no modals — the funnel drives B2B traffic to cdc.company.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector('.ab-header');
  let headerScrolled = null;
  let scrollTicking = false;

  const applyScrollState = () => {
    scrollTicking = false;
    if (!header) return;
    const scrolled = window.scrollY > 10;
    if (scrolled === headerScrolled) return;
    headerScrolled = scrolled;
    header.classList.toggle('is-scrolled', scrolled);
  };

  const onScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(applyScrollState);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  applyScrollState();

  /* ---------- Hero scroll indicator (fade on scroll) ---------- */
  const scrollIndicator = document.querySelector('.ab-hero__scroll');
  if (scrollIndicator) {
    let indicatorHidden = null;
    const toggleIndicator = () => {
      const hidden = window.scrollY > 40;
      if (hidden === indicatorHidden) return;
      indicatorHidden = hidden;
      scrollIndicator.classList.toggle('is-hidden', hidden);
    };
    window.addEventListener('scroll', toggleIndicator, { passive: true });
    toggleIndicator();
  }

  /* ---------- Hero video: autoplay guard + manual fallback ---------- */
  const heroVideo = document.querySelector('.ab-hero__video');
  const heroPlay = document.querySelector('.js-hero-play');

  if (heroVideo) {
    const showPlay = () => { if (heroPlay) heroPlay.hidden = false; };
    const hidePlay = () => { if (heroPlay) heroPlay.hidden = true; };

    const attemptPlay = () => {
      const attempt = heroVideo.play();
      if (attempt && typeof attempt.then === 'function') {
        attempt.then(hidePlay).catch(showPlay);
      }
    };

    const syncPlayButton = () => {
      if (heroVideo.paused && heroVideo.readyState >= 2) showPlay();
    };

    heroVideo.addEventListener('playing', hidePlay);
    heroVideo.addEventListener('pause', () => { if (heroVideo.currentTime > 0) showPlay(); });
    heroVideo.addEventListener('loadeddata', () => setTimeout(syncPlayButton, 400), { once: true });
    window.addEventListener('load', () => setTimeout(syncPlayButton, 400), { once: true });

    if (heroPlay) {
      heroPlay.addEventListener('click', attemptPlay);
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Respect the OS setting: no autoplay, manual control through the button only.
      heroVideo.removeAttribute('autoplay');
      heroVideo.pause();
      showPlay();
    } else {
      // Browsers may reject autoplay until the first user gesture: retry once.
      const retryOnGesture = () => {
        if (heroVideo.paused) attemptPlay();
        ['pointerdown', 'touchstart', 'scroll'].forEach((eventName) => {
          window.removeEventListener(eventName, retryOnGesture);
        });
      };
      ['pointerdown', 'touchstart', 'scroll'].forEach((eventName) => {
        window.addEventListener(eventName, retryOnGesture, { passive: true });
      });

      attemptPlay();
    }
  }

  /* ---------- Mobile burger menu ---------- */
  const burger = document.querySelector('.ab-header__burger');
  const nav = document.querySelector('.ab-nav');
  const mobileNav = window.matchMedia('(max-width: 768px)');

  if (burger && nav) {
    const setMenu = (open, returnFocus = false) => {
      nav.classList.toggle('is-open', open);
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));

      // A closed off-canvas panel must leave the tab order entirely.
      nav.inert = mobileNav.matches ? !open : false;

      if (open) {
        const firstLink = nav.querySelector('a');
        if (firstLink) firstLink.focus({ preventScroll: true });
      } else if (returnFocus) {
        burger.focus({ preventScroll: true });
      }
    };

    const syncMenu = () => setMenu(nav.classList.contains('is-open') && mobileNav.matches);

    burger.addEventListener('click', () => {
      setMenu(!nav.classList.contains('is-open'));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });

    // Rule 1 — Escape dismisses instantly and returns focus to the trigger.
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false, true);
      }
    });

    document.addEventListener('pointerdown', (event) => {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(event.target) || burger.contains(event.target)) return;
      setMenu(false);
    });

    mobileNav.addEventListener('change', syncMenu);
    syncMenu();
  }

  /* ---------- Showcase video: play overlay, tap-to-pause ---------- */
  const galleryFeature = document.querySelector('.ab-gallery__feature');
  const galleryVideo = document.querySelector('.js-gallery-video');
  const galleryPlay = document.querySelector('.js-gallery-play');

  if (galleryFeature && galleryVideo && galleryPlay) {
    let startedAt = 0;

    const setPlaying = (playing) => {
      galleryFeature.classList.toggle('is-playing', playing);
      galleryPlay.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
      if (playing) startedAt = performance.now();
    };

    galleryPlay.addEventListener('click', () => {
      // The button stays keyboard-reachable, so it also has to undo playback.
      if (!galleryVideo.paused) {
        galleryVideo.pause();
        return;
      }

      // The click is a user gesture, so the soundtrack may start here.
      galleryVideo.muted = false;

      const attempt = galleryVideo.play();
      if (!attempt || typeof attempt.then !== 'function') {
        setPlaying(!galleryVideo.paused);
        return;
      }
      attempt.then(() => setPlaying(true)).catch(() => {
        galleryVideo.muted = true;
        const retry = galleryVideo.play();
        if (retry && typeof retry.then === 'function') {
          retry.then(() => setPlaying(true)).catch(() => setPlaying(false));
        } else {
          setPlaying(!galleryVideo.paused);
        }
      });
    });

    // While playing the overlay is transparent, so a click lands on the frame.
    // The click that started playback must not pause it: `play` can fire before
    // the click finishes bubbling, and the overlay may hide mid-gesture.
    galleryFeature.addEventListener('click', (event) => {
      if (event.target.closest && event.target.closest('.js-gallery-play')) return;
      if (!galleryFeature.classList.contains('is-playing')) return;
      if (performance.now() - startedAt < 350) return;
      galleryVideo.pause();
    });

    galleryVideo.addEventListener('play', () => setPlaying(true));
    galleryVideo.addEventListener('pause', () => setPlaying(false));
    galleryVideo.addEventListener('ended', () => setPlaying(false));
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
    { sel: '.ab-stat:nth-child(1) .ab-stat__value', count: 500, render: (n) => '+' + n + '<span>%</span>' },
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

  const initSlider = (slider) => {
    const slidesWrap = slider.querySelector('.ab-slider__slides');
    const dotsWrap = slider.querySelector('.ab-slider__dots');
    const key = slider.dataset.solution;
    const sources = SOLUTION_IMAGES[key] || [];
    if (!slidesWrap || !dotsWrap || !sources.length) return;

    const slides = sources.map((src, i) => {
      const img = document.createElement('img');
      img.className = 'ab-slider__slide' + (i === 0 ? ' is-active' : '');
      img.dataset.src = src;
      img.alt = 'AirBridge® ' + (key === 'cable' ? 'cable crane' : 'ropeway') + ' — slide ' + (i + 1);
      img.loading = 'lazy';
      img.decoding = 'async';
      img.fetchPriority = 'low';
      slidesWrap.appendChild(img);
      return img;
    });

    // Load slides on demand: two at a time instead of all 14 photos at once.
    const loadSlide = (i) => {
      const img = slides[(i + slides.length) % slides.length];
      if (img && !img.getAttribute('src')) img.src = img.dataset.src;
    };

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

    const counter = slider.querySelector('.js-slider-counter');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const goTo = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, j) => s.classList.toggle('is-active', j === index));
      dots.forEach((d, j) => d.classList.toggle('is-active', j === index));
      if (counter) counter.textContent = (index + 1) + ' / ' + slides.length;
      loadSlide(index);
      loadSlide(index + 1);
    };

    // Rule 2 / 6 — autoplay is a fixed-duration loop: it pauses on interaction
    // and disappears entirely under reduced motion.
    const start = () => {
      if (reduceMotion) return;
      timer = window.setInterval(() => goTo(index + 1), 4000);
    };
    const restart = () => { window.clearInterval(timer); start(); };

    /* ---------- Rule 1 & 3: pointer drag, 1:1 tracking, rubber-banded edges ---------- */
    const at = (i) => slides[(i + slides.length) % slides.length];
    const stageWidth = () => slider.clientWidth || 1;

    // Progressive resistance: past the comfortable limit the surface follows the
    // finger less and less, so the edge never reads as a hard stop.
    const rubberband = (offset) => {
      const dimension = stageWidth();
      const limit = dimension * 0.6;
      const overshoot = Math.abs(offset) - limit;
      if (overshoot <= 0) return offset;
      const damped = limit + (overshoot * dimension * 0.55) / (dimension + 0.55 * overshoot);
      return Math.sign(offset) * damped;
    };

    let drag = null;
    let peek = null;
    let peekDir = 0;

    const dropPeek = () => {
      if (peek) {
        if (peek !== at(index)) peek.classList.remove('is-active');
        peek.style.transform = '';
        peek.classList.remove('is-dragging');
        peek = null;
      }
      peekDir = 0;
    };

    const clearSlideStyles = () => {
      slides.forEach((slide) => {
        slide.style.transform = '';
        slide.classList.remove('is-dragging');
      });
      dropPeek();
    };

    // Commit: the incoming slide lands where the finger threw it.
    const settleTo = (dir) => {
      const incoming = at(index + dir);
      const outgoing = at(index);

      slides.forEach((slide) => slide.classList.remove('is-dragging'));
      if (peek && peek !== incoming) {
        peek.classList.remove('is-active');
        peek.style.transform = '';
      }
      peek = null;
      peekDir = 0;

      incoming.classList.add('is-active');
      incoming.style.transform = 'translate3d(0, 0, 0)';
      outgoing.classList.remove('is-active');

      window.setTimeout(() => {
        goTo(index + dir);
        clearSlideStyles();
      }, reduceMotion ? 150 : 400);
    };

    // Cancel: everything returns to the current slide instead of snapping.
    const settleBack = () => {
      slides.forEach((slide) => slide.classList.remove('is-dragging'));
      at(index).style.transform = '';

      const leaving = peek;
      peek = null;
      peekDir = 0;
      if (leaving) {
        leaving.classList.remove('is-active');
        window.setTimeout(() => {
          leaving.style.transform = '';
          leaving.classList.remove('is-dragging');
        }, reduceMotion ? 150 : 400);
      }
    };

    const onPointerDown = (event) => {
      if (slides.length < 2) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      window.clearInterval(timer);
      drag = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastT: event.timeStamp,
        velocity: 0,
        dx: 0,
        axis: null
      };
      try {
        slider.setPointerCapture(event.pointerId);
      } catch (error) {
        /* synthetic events / older engines: capture is an optimisation only */
      }
    };

    const onPointerMove = (event) => {
      if (!drag || event.pointerId !== drag.id) return;

      const totalX = event.clientX - drag.startX;
      const totalY = event.clientY - drag.startY;

      // ~8 px hysteresis: vertical scrolling wins until intent is clear.
      if (drag.axis === null) {
        if (Math.abs(totalX) < 8 && Math.abs(totalY) < 8) return;
        drag.axis = Math.abs(totalX) > Math.abs(totalY) ? 'x' : 'y';
        if (drag.axis === 'y') {
          drag = null;
          clearSlideStyles();
          restart();
          return;
        }
        loadSlide(index + 1);
        loadSlide(index - 1);
        at(index).classList.add('is-dragging');
      }

      if (drag.axis !== 'x') return;
      event.preventDefault();

      const elapsed = event.timeStamp - drag.lastT;
      if (elapsed > 0) drag.velocity = (event.clientX - drag.lastX) / elapsed;
      drag.lastX = event.clientX;
      drag.lastT = event.timeStamp;

      drag.dx = rubberband(totalX);
      const direction = drag.dx < 0 ? 1 : -1;

      if (direction !== peekDir || !peek) {
        dropPeek();
        peek = at(index + direction);
        peekDir = direction;
        peek.classList.add('is-active');
        peek.classList.add('is-dragging');
      }

      at(index).style.transform = 'translate3d(' + drag.dx + 'px, 0, 0)';
      peek.style.transform = 'translate3d(' + (direction * stageWidth() + drag.dx) + 'px, 0, 0)';
    };

    const onPointerUp = (event) => {
      if (!drag || event.pointerId !== drag.id) return;

      const dx = drag.dx;
      const velocity = drag.velocity;
      drag = null;

      const speed = Math.abs(velocity);
      const flick = speed > 0.35;
      const passed = Math.abs(dx) > stageWidth() * 0.22;

      if (flick || passed) {
        // Rule 2 — momentum handoff: the sign of the release velocity decides
        // whether the gesture commits, not just the raw position.
        settleTo(flick ? (velocity > 0 ? -1 : 1) : (dx < 0 ? 1 : -1));
      } else {
        settleBack();
      }
      restart();
    };

    slider.addEventListener('dragstart', (event) => event.preventDefault());
    slider.addEventListener('pointerdown', onPointerDown);
    slider.addEventListener('pointermove', onPointerMove, { passive: false });
    slider.addEventListener('pointerup', onPointerUp);
    slider.addEventListener('pointercancel', onPointerUp);
    slider.addEventListener('lostpointercapture', () => {
      if (!drag) return;
      drag = null;
      settleBack();
      restart();
    });

    /* ---------- Rule 1: keyboard parity with the drag gesture ---------- */
    slider.tabIndex = 0;
    slider.setAttribute('role', 'group');
    slider.setAttribute('aria-roledescription', 'carousel');

    slider.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      goTo(index + (event.key === 'ArrowRight' ? 1 : -1));
      restart();
    });

    if (!reduceMotion) {
      slider.addEventListener('pointerenter', () => window.clearInterval(timer));
      slider.addEventListener('pointerleave', restart);
      slider.addEventListener('focusin', () => window.clearInterval(timer));
      slider.addEventListener('focusout', restart);
    }

    goTo(0);
    start();
  };

  // Build sliders only when they approach the viewport: without this the first
  // paint fetched all 25 gallery photos (~6 MB).
  const sliders = document.querySelectorAll('.js-slider');
  if ('IntersectionObserver' in window) {
    const sliderObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          initSlider(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '700px 0px' });

    sliders.forEach((slider) => sliderObserver.observe(slider));
  } else {
    sliders.forEach(initSlider);
  }
})();
