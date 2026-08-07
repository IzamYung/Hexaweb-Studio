/* ============================================================
   HEXAWEB STUDIO — script.js
   Global site behaviour only: theming, navigation, animations,
   FAQ, form validation. Portfolio logic lives in portfolio.js.
   ============================================================ */
'use strict';

(function () {
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle (persisted) ---------- */
  const themeBtn = $('#themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const root = document.documentElement;
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('hexaweb-theme', next); } catch (e) {}
    });
  }

  /* ---------- Preloader ---------- */
  const preloader = $('#preloader');
  if (preloader) {
    const hide = () => preloader.classList.add('done');
    window.addEventListener('load', () => setTimeout(hide, REDUCED ? 0 : 350));
    setTimeout(hide, 1600); // safety net
  }

  /* ---------- Header scroll state + back-to-top ---------- */
  const header = $('#siteHeader');
  const toTop  = $('#toTop');
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 12);
    if (toTop)  toTop.classList.toggle('show', y > 620);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }));

  /* ---------- Mobile menu (full-screen, drops from top) ---------- */
  const burger = $('#navBurger');
  const mobileMenu = $('#mobileMenu');
  if (burger && mobileMenu) {
    const setMenu = open => {
      mobileMenu.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (header) header.classList.toggle('menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
    $$('a', mobileMenu).forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) setMenu(false);
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 900) setMenu(false); });
  }

  /* ---------- Active nav link (by current page) ---------- */
  const page = (location.pathname.split('/').pop() || 'index.html');
  $$('.main-nav a, .mobile-menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0];
    if (href === page) a.classList.add('active');
  });

  /* ---------- Scramble-decode for eyebrows ---------- */
  function scramble(el) {
    const target = el.dataset.text || el.textContent.trim();
    el.dataset.text = target;
    if (REDUCED) { el.textContent = target; return; }
    const chars = '!<>-_\\/[]=+*^?#';
    const total = Math.max(16, target.length * 1.3);
    let frame = 0;
    (function tick() {
      frame++;
      let out = '';
      const revealed = (frame / total) * target.length * 1.35;
      for (let i = 0; i < target.length; i++) {
        if (target[i] === ' ') { out += ' '; continue; }
        out += i < revealed ? target[i] : chars[(Math.random() * chars.length) | 0];
      }
      el.textContent = out;
      if (frame < total) requestAnimationFrame(tick);
      else el.textContent = target;
    })();
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$('[data-reveal]');
  if (revealEls.length) {
    if (REDUCED) {
      revealEls.forEach(el => el.classList.add('in-view'));
    } else {
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (!en.isIntersecting) return;
          en.target.classList.add('in-view');
          if (en.target.hasAttribute('data-scramble')) scramble(en.target);
          io.unobserve(en.target);
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(el => io.observe(el));
    }
  }

  // Eyebrows outside data-reveal (sticky columns etc.)
  $$('[data-scramble]:not([data-reveal])').forEach(el => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { scramble(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    io.observe(el);
  });

  /* ---------- Animated counters ---------- */
  const counters = $$('.counter');
  if (counters.length) {
    const runCounter = el => {
      const target   = parseFloat(el.dataset.counter);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const suffix   = el.dataset.suffix || '';
      if (REDUCED) { el.textContent = target.toFixed(decimals) + suffix; return; }
      const dur = 1600, start = performance.now();
      (function step(t) {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);
    };
    const cio = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }

  /* ---------- Process steps activation + scroller buttons ---------- */
  const steps = $$('.process-step');
  if (steps.length) {
    const sio = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('active'); });
    }, { threshold: 0.55 });
    steps.forEach(s => sio.observe(s));
  }
  const track = $('#processTrack');
  const pPrev = $('#pPrev'), pNext = $('#pNext');
  if (track && pPrev && pNext) {
    const move = dir => track.scrollBy({ left: dir * 300, behavior: REDUCED ? 'auto' : 'smooth' });
    pPrev.addEventListener('click', () => move(-1));
    pNext.addEventListener('click', () => move(1));
  }

  /* ---------- Testimonials slider ---------- */
  const tTrack = $('#tTrack');
  if (tTrack) {
    const slides = $$('.t-slide', tTrack);
    const dotsWrap = $('#tDots');
    const prev = $('#tPrev'), next = $('#tNext');
    let idx = 0, timer = null;

    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 't-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      d.addEventListener('click', () => { go(i); restart(); });
      if (dotsWrap) dotsWrap.appendChild(d);
    });
    const dots = $$('.t-dot', dotsWrap);

    function go(i) {
      idx = (i + slides.length) % slides.length;
      tTrack.style.transform = 'translateX(-' + idx * 100 + '%)';
      dots.forEach((d, di) => d.classList.toggle('active', di === idx));
    }
    function restart() {
      if (timer) clearInterval(timer);
      if (!REDUCED) timer = setInterval(() => go(idx + 1), 6000);
    }
    if (prev) prev.addEventListener('click', () => { go(idx - 1); restart(); });
    if (next) next.addEventListener('click', () => { go(idx + 1); restart(); });
    const shell = $('.t-shell');
    if (shell) {
      shell.addEventListener('mouseenter', () => { if (timer) clearInterval(timer); });
      shell.addEventListener('mouseleave', restart);
    }
    restart();
  }

  /* ---------- Hero parallax (pointer) ---------- */
  const device = $('.device');
  if (device && !REDUCED && window.matchMedia('(pointer: fine)').matches) {
    const hero = $('.hero');
    const chips = $$('.float-chip', device);
    if (hero) hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      chips.forEach(c => {
        const d = parseFloat(c.dataset.depth || 12);
        c.style.translate = (x * d) + 'px ' + (y * d) + 'px';
      });
    });
  }

  /* ---------- Scroll parallax (about images) ---------- */
  const parallaxEls = $$('[data-parallax]');
  if (parallaxEls.length && !REDUCED) {
    let ticking = false;
    const update = () => {
      parallaxEls.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const offset = (r.top + r.height / 2 - innerHeight / 2) * parseFloat(el.dataset.parallax);
        el.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- FAQ accordion ---------- */
  $$('.faq-item').forEach(item => {
    const q = $('.faq-q', item);
    const a = $('.faq-a', item);
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      $$('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        $('.faq-q', o).setAttribute('aria-expanded', 'false');
        $('.faq-a', o).style.maxHeight = '0px';
      });
      if (!isOpen) {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Contact form validation ---------- */
  const form = $('#contactForm');
  if (form) {
    const success = $('#formSuccess');
    const submitBtn = $('#cfSubmit');

    const setError = (input, on) => input.closest('.field').classList.toggle('error', on);
    const emailOk  = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    const phoneOk  = v => v === '' || /^[+\d][\d\s\-().]{6,}$/.test(v);

    ['cf-name', 'cf-email', 'cf-phone', 'cf-message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => setError(el, false));
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const name  = $('#cf-name'), email = $('#cf-email'),
            phone = $('#cf-phone'), msg = $('#cf-message');
      let valid = true;

      if (!name.value.trim())  { setError(name, true);  valid = false; }
      if (!emailOk(email.value.trim())) { setError(email, true); valid = false; }
      if (!phoneOk(phone.value.trim())) { setError(phone, true); valid = false; }
      if (!msg.value.trim())   { setError(msg, true);   valid = false; }
      if (!valid) {
        const firstError = $('.field.error input, .field.error textarea', form);
        if (firstError) firstError.focus();
        return;
      }

      // Simulated send (connect to your backend / form service here)
      submitBtn.classList.add('is-loading');
      submitBtn.firstChild.textContent = 'Sending… ';
      setTimeout(() => {
        form.hidden = true;
        if (success) { success.hidden = false; success.setAttribute('tabindex','-1'); }
      }, 900);
    });
  }
})();