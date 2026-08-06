/* ============================================================
   HEXAWEB STUDIO — script.js
   Vanilla JS: theming, navigation, animations, portfolio,
   testimonials, FAQ, form validation. No dependencies.
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
      if (header) header.classList.toggle('menu-open', open);   // keep header readable on top
      document.body.style.overflow = open ? 'hidden' : '';      // lock scroll while open
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

  /* ---------- Portfolio: data, filter, modal ---------- */
  const PROJECTS = {
    arunika: { title:'Arunika Coffee Roasters', cat:'E-Commerce', year:'2024', client:'Concept build', seed:'arunika-coffee',
      desc:'A complete storefront concept for a specialty roastery — product catalog, subscriptions, and a streamlined two-step checkout, built end-to-end as a working demo of how we\'d launch a real store.',
      deliver:['Brand-led store design','Product catalog & subscriptions','Payment gateway integration','Order & inventory dashboard','Hosting, domain & SSL setup','Maintenance plan structure'],
      tech:['HTML/CSS/JS','Node.js','PostgreSQL','Midtrans','Cloudflare'] },
    legalax: { title:'Legalax Partners', cat:'Company Profile', year:'2023', client:'Concept build', seed:'legalax-lawfirm',
      desc:'A corporate profile concept for a fictional law firm — bilingual structure, practice-area pages, and a lightweight CMS so a real firm could edit everything without touching code.',
      deliver:['Bilingual ID/EN structure','Practice-area CMS','Team & case study pages','Structured data & SEO','Managed hosting & email setup'],
      tech:['HTML/CSS/JS','Headless CMS','Cloudflare','Google Analytics'] },
    terranest: { title:'TerraNest Realty', cat:'Business Website', year:'2024', client:'Personal project', seed:'terranest-realty',
      desc:'A property-listings concept with map filters and a lead pipeline wired into a CRM — our way of practicing fast, data-heavy pages that still feel effortless.',
      deliver:['Listings with map filters','Lead capture → CRM pipeline','Agent profile pages','WhatsApp enquiry buttons','Deployment & monitoring'],
      tech:['HTML/CSS/JS','Laravel','Maps API','MySQL'] },
    medicare: { title:'MediCare+ Clinic OS', cat:'Web Application', year:'2024', client:'Concept build', seed:'medicare-clinic',
      desc:'An appointment-booking system concept with a patient portal, doctor dashboards, and reminder flows — built to understand real clinic workflows from the inside.',
      deliver:['Patient booking portal','Doctor & admin dashboards','Reminder engine design','Role-based access control','Load-tested deployment'],
      tech:['Node.js','PostgreSQL','WhatsApp API','Docker'] },
    voltra: { title:'Voltra Launch', cat:'Landing Page', year:'2025', client:'Experiment', seed:'voltra-saas',
      desc:'A SaaS waitlist landing page we use as our A/B testing playground — two variants, careful analytics wiring, and sub-second loads on purpose.',
      deliver:['Conversion-focused design','A/B test variants','Waitlist backend','Analytics & event tracking','Edge deployment'],
      tech:['HTML/CSS/JS','Node.js','A/B testing','Plausible'] },
    kirana: { title:'Kirana Visuals', cat:'Portfolio', year:'2023', client:'Personal project', seed:'kirana-photography',
      desc:'A photography portfolio with password-protected client galleries and a CDN image pipeline — built around a photographer friend\'s real workflow.',
      deliver:['Gallery-first design','Private client galleries','CDN image pipeline','Booking enquiry flow'],
      tech:['HTML/CSS/JS','CDN','Lightbox','SEO'] },
    logistik: { title:'LogistikPro Dashboard', cat:'Web Application', year:'2023', client:'Experiment', seed:'logistik-fleet',
      desc:'A real-time fleet dashboard concept with live maps, delivery reporting, and alerts — our stress test for live-data interfaces.',
      deliver:['Real-time fleet map','Delivery & SLA reporting','Alerting rules engine','Driver mobile views','24/7 monitoring setup'],
      tech:['Node.js','WebSockets','PostgreSQL','Redis'] },
    lumbung: { title:'Lumbung Batik', cat:'E-Commerce', year:'2022', client:'Concept build', seed:'lumbung-batik',
      desc:'A multi-vendor marketplace concept for batik artisans — vendor onboarding and split payouts, built to learn e-commerce at real depth.',
      deliver:['Multi-vendor marketplace','Split payment payouts','Vendor onboarding portal','Story-driven product pages','Maintenance plan structure'],
      tech:['Laravel','Stripe','MySQL','Hand-written CSS'] },
    summit: { title:'Summit Accounting', cat:'Business Website', year:'2022', client:'Concept build', seed:'summit-accounting',
      desc:'A corporate site concept with a secure client document portal — simple on the surface, carefully engineered underneath.',
      deliver:['Corporate identity site','Secure client portal','Encrypted file uploads','SSO login','Hosting & SLA structure'],
      tech:['HTML/CSS/JS','Node.js','SSO','PostgreSQL'] }
  };

  const grid = $('#portfolioGrid');
  if (grid) {
    // Filter
    const items = $$('.project-item', grid);
    const countEl = $('#filterCount');
    $$('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        let shown = 0;
        items.forEach(it => {
          const match = f === 'all' || it.dataset.cat === f;
          if (match) {
            shown++;
            it.classList.remove('is-hidden');
            requestAnimationFrame(() => requestAnimationFrame(() => it.classList.remove('is-out')));
          } else {
            it.classList.add('is-out');
            setTimeout(() => it.classList.add('is-hidden'), 260);
          }
        });
        if (countEl) countEl.textContent = 'Showing ' + shown + ' project' + (shown === 1 ? '' : 's');
      });
    });

    // Modal
    const modal = $('#projectModal');
    if (modal) {
      const mImage = $('#mImage'), mTitle = $('#mTitle'), mCat = $('#mCat'),
            mClient = $('#mClient'), mYear = $('#mYear'), mDesc = $('#mDesc'),
            mDeliver = $('#mDeliver'), mTech = $('#mTech'), mClose = $('#modalClose');
      let lastFocus = null;

      const openModal = id => {
        const p = PROJECTS[id];
        if (!p) return;
        mImage.src = 'https://picsum.photos/seed/' + p.seed + '/1200/750';
        mImage.alt = p.title + ' project preview';
        mTitle.textContent = p.title;
        mCat.textContent = p.cat;
        mClient.textContent = p.client;
        mYear.textContent = p.year;
        mDesc.textContent = p.desc;
        mDeliver.innerHTML = p.deliver.map(d =>
          '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>' + d + '</li>').join('');
        mTech.innerHTML = p.tech.map(t => '<span>' + t + '</span>').join('');
        lastFocus = document.activeElement;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        mClose.focus();
      };
      const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocus) lastFocus.focus();
      };
      items.forEach(it => {
        it.addEventListener('click', () => openModal(it.dataset.id));
        it.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(it.dataset.id); }
        });
      });
      mClose.addEventListener('click', closeModal);
      $('.modal-backdrop', modal).addEventListener('click', closeModal);
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
      });
    }
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