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
  /* ---------- Solution data ---------- */
  const SOLUTIONS = {
    passenger: {
      eyebrow: 'Passenger Ropeways',
      title: 'Passenger Ropeways',
      text: 'CDC passenger ropeways provide efficient, low-impact mobility across urban, mountain and remote environments. AirBridge® enables cabins to board and unload at any point along the line, independent from fixed stations.',
      video: 'assets/media/airbridge-demo-1.mp4',
      link: 'https://cdc.company/passenger-ropeways/',
      specs: [
        ['Boarding & unloading', 'At any point along the line'],
        ['Applications', 'Urban transport · tourism · mountain resorts · personnel'],
        ['Key benefits', 'Panoramic silent mobility, reduced land use & congestion'],
        ['Power options', 'Electric · hybrid · 100% zero-emission ammonia']
      ],
      images: [
        'assets/images/airbridge-passenger-1.jpg',
        'assets/images/airbridge-passenger-2.jpg',
        'assets/images/airbridge-passenger-3.jpg',
        'assets/images/airbridge-passenger-4.jpg'
      ]
    },
    material: {
      eyebrow: 'Material Ropeways',
      title: 'Material Ropeways',
      text: 'CDC material ropeways provide continuous transport of bulk materials across mountains, valleys, rivers and remote extraction sites where road infrastructure is costly, slow to build or environmentally disruptive.',
      video: 'assets/media/airbridge-demo-2.mp4',
      link: 'https://cdc.company/material-ropeways/',
      specs: [
        ['Transport', 'Continuous bulk material over long distances'],
        ['Applications', 'Construction · hydropower · mining & quarrying'],
        ['Payload', 'Up to 40 tons'],
        ['Key benefits', 'Reduced haul roads, minimal ground impact, lower OPEX']
      ],
      images: [
        'assets/images/airbridge-material-1.png',
        'assets/images/airbridge-material-2.png',
        'assets/images/airbridge-material-3.png',
        'assets/images/airbridge-material-4.jpg'
      ]
    },
    cable: {
      eyebrow: 'Cable Cranes',
      title: 'Cable Cranes',
      text: 'CDC develops and operates cable crane systems for lifting and transport across steep slopes, valleys and hard-to-access areas where conventional machinery cannot operate safely or efficiently.',
      video: 'assets/media/cdc-hero-video.mp4',
      link: 'https://cdc.company/cable-cranes/',
      specs: [
        ['System', 'Track ropes · motorized carriage · hauling system'],
        ['Applications', 'Steep slopes, valleys, complex construction sites'],
        ['Key benefits', 'No roads or heavy ground machinery required'],
        ['AirBridge® evolution', 'Long-distance, self-propelled, automation-ready']
      ],
      images: [
        'assets/images/airbridge-cable-1.png',
        'assets/images/airbridge-cable-2.jpg',
        'assets/images/airbridge-cable-3.jpg',
        'assets/images/airbridge-cable-4.jpg',
        'assets/images/airbridge-cable-5.jpg'
      ]
    }
  };

  /* ---------- Solution sliders (auto fade every 4s) ---------- */
  document.querySelectorAll('.js-slider').forEach((slider) => {
    const slides = slider.querySelectorAll('.ab-slider__slide');
    const dotsWrap = slider.querySelector('.ab-slider__dots');
    if (!slides.length || !dotsWrap) return;

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
  /* ---------- Solution modal ---------- */
  const smodal = document.querySelector('.js-smodal');
  const smodalVideo = document.getElementById('smodal-video');

  const openSModal = () => {
    if (!smodal) return;
    smodal.classList.add('is-open');
    smodal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeSModal = () => {
    if (!smodal) return;
    smodal.classList.remove('is-open');
    smodal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (smodalVideo) {
      smodalVideo.pause();
      smodalVideo.removeAttribute('src');
      smodalVideo.load();
    }
  };

  if (smodal) {
    smodal.querySelectorAll('.js-smodal-close').forEach((el) => {
      el.addEventListener('click', closeSModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && smodal.classList.contains('is-open')) closeSModal();
    });

    document.querySelectorAll('.js-solution-open').forEach((btn) => {
      btn.addEventListener('click', () => {
        const data = SOLUTIONS[btn.dataset.solution];
        if (!data) return;

        document.getElementById('smodal-eyebrow').textContent = data.eyebrow;
        document.getElementById('smodal-title').textContent = data.title;
        document.getElementById('smodal-text').textContent = data.text;

        if (smodalVideo) {
          smodalVideo.src = data.video;
          smodalVideo.poster = data.images[0];
          smodalVideo.load();
        }

        document.getElementById('smodal-specs').innerHTML = data.specs
          .map((pair) => '<li><b>' + pair[0] + '</b><span>' + pair[1] + '</span></li>')
          .join('');

        document.getElementById('smodal-gallery').innerHTML = data.images
          .map((src) => '<img src="' + src + '" alt="' + data.title + '" loading="lazy" />')
          .join('');

        document.getElementById('smodal-cta').href = data.link;

        openSModal();
      });
    });
  }
})();

