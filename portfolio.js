/* ============================================================
   HEXAWEB STUDIO — portfolio.js
   EVERYTHING portfolio lives here: project data (multiple images
   per project), card rendering, filter buttons, count, and the
   case-study modal with an INFINITE image slider.

   ➕ Add a project   = push one object into PROJECTS.
   ➕ Add more photos = add more entries into `images`.
      • Card preview always uses images[0].
      • Modal shows all images as a seamless infinite slider.
   ============================================================ */
'use strict';

(function () {
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- PROJECT DATA (edit here only) ---------------- */
  const PROJECTS = [
    { id:'voltra', title:'Voltra Launch', cat:'landing', catLabel:'Landing Page', origin:'Experiment', year:'2025',
      images:['voltra-saas','voltra-saas-variant','voltra-saas-mobile'],
      desc:'A SaaS waitlist landing page we use as our A/B testing playground — two variants, careful analytics wiring, and sub-second loads on purpose.',
      deliver:['Conversion-focused design','A/B test variants','Waitlist backend','Analytics & event tracking','Edge deployment'],
      tech:['HTML/CSS/JS','Node.js','A/B testing','Plausible'] },
    { id:'arunika', title:'Arunika Coffee Roasters', cat:'ecommerce', catLabel:'E-Commerce', origin:'Concept build', year:'2024',
      images:['arunika-coffee','arunika-coffee-menu','arunika-coffee-checkout'],
      desc:'A complete storefront concept for a specialty roastery — product catalog, subscriptions, and a streamlined two-step checkout, built end-to-end as a working demo of how we\'d launch a real store.',
      deliver:['Brand-led store design','Product catalog & subscriptions','Payment gateway integration','Order & inventory dashboard','Hosting, domain & SSL setup','Maintenance plan structure'],
      tech:['HTML/CSS/JS','Node.js','PostgreSQL','Midtrans','Cloudflare'] },
    { id:'medicare', title:'MediCare+ Clinic OS', cat:'webapp', catLabel:'Web Application', origin:'Concept build', year:'2024',
      images:['medicare-clinic','medicare-clinic-booking','medicare-clinic-dashboard'],
      desc:'An appointment-booking system concept with a patient portal, doctor dashboards, and reminder flows — built to understand real clinic workflows from the inside.',
      deliver:['Patient booking portal','Doctor & admin dashboards','Reminder engine design','Role-based access control','Load-tested deployment'],
      tech:['Node.js','PostgreSQL','WhatsApp API','Docker'] },
    { id:'terranest', title:'TerraNest Realty', cat:'business', catLabel:'Business Website', origin:'Personal project', year:'2024',
      images:['terranest-realty','terranest-realty-map','terranest-realty-listing'],
      desc:'A property-listings concept with map filters and a lead pipeline wired into a CRM — our way of practicing fast, data-heavy pages that still feel effortless.',
      deliver:['Listings with map filters','Lead capture → CRM pipeline','Agent profile pages','WhatsApp enquiry buttons','Deployment & monitoring'],
      tech:['HTML/CSS/JS','Laravel','Maps API','MySQL'] },
    { id:'legalax', title:'Legalax Partners', cat:'profile', catLabel:'Company Profile', origin:'Concept build', year:'2023',
      images:['legalax-lawfirm','legalax-lawfirm-team','legalax-lawfirm-practice'],
      desc:'A corporate profile concept for a fictional law firm — bilingual structure, practice-area pages, and a lightweight CMS so a real firm could edit everything without touching code.',
      deliver:['Bilingual ID/EN structure','Practice-area CMS','Team & case study pages','Structured data & SEO','Managed hosting & email setup'],
      tech:['HTML/CSS/JS','Headless CMS','Cloudflare','Google Analytics'] },
    { id:'kirana', title:'Kirana Visuals', cat:'portfolio', catLabel:'Portfolio', origin:'Personal project', year:'2023',
      images:['kirana-photography','kirana-photography-gallery','kirana-photography-wedding'],
      desc:'A photography portfolio with password-protected client galleries and a CDN image pipeline — built around a photographer friend\'s real workflow.',
      deliver:['Gallery-first design','Private client galleries','CDN image pipeline','Booking enquiry flow'],
      tech:['HTML/CSS/JS','CDN','Lightbox','SEO'] },
    { id:'logistik', title:'LogistikPro Dashboard', cat:'webapp', catLabel:'Web Application', origin:'Experiment', year:'2023',
      images:['logistik-fleet','logistik-fleet-map','logistik-fleet-reports'],
      desc:'A real-time fleet dashboard concept with live maps, delivery reporting, and alerts — our stress test for live-data interfaces.',
      deliver:['Real-time fleet map','Delivery & SLA reporting','Alerting rules engine','Driver mobile views','24/7 monitoring setup'],
      tech:['Node.js','WebSockets','PostgreSQL','Redis'] },
    { id:'lumbung', title:'Lumbung Batik', cat:'ecommerce', catLabel:'E-Commerce', origin:'Concept build', year:'2022',
      images:['lumbung-batik','lumbung-batik-vendor','lumbung-batik-product'],
      desc:'A multi-vendor marketplace concept for batik artisans — vendor onboarding and split payouts, built to learn e-commerce at real depth.',
      deliver:['Multi-vendor marketplace','Split payment payouts','Vendor onboarding portal','Story-driven product pages','Maintenance plan structure'],
      tech:['Laravel','Stripe','MySQL','Hand-written CSS'] },
    { id:'summit', title:'Summit Accounting', cat:'business', catLabel:'Business Website', origin:'Concept build', year:'2022',
      images:['summit-accounting','summit-accounting-portal','summit-accounting-team'],
      desc:'A corporate site concept with a secure client document portal — simple on the surface, carefully engineered underneath.',
      deliver:['Corporate identity site','Secure client portal','Encrypted file uploads','SSO login','Hosting & SLA structure'],
      tech:['HTML/CSS/JS','Node.js','SSO','PostgreSQL'] }
  ];

  const grid = $('#portfolioGrid');
  if (!grid) return; // only runs on the portfolio page

  const filterBar = $('#filterBar');
  const countEl   = $('#filterCount');

  /* ---------------- Filter buttons (auto-generated) ---------------- */
  const cats = [];
  PROJECTS.forEach(p => { if (!cats.some(c => c.key === p.cat)) cats.push({ key: p.cat, label: p.catLabel }); });
  if (filterBar) {
    filterBar.innerHTML =
      '<button class="filter-btn active" type="button" data-filter="all">All projects</button>' +
      cats.map(c => '<button class="filter-btn" type="button" data-filter="' + c.key + '">' + c.label + '</button>').join('');
  }

  /* ---------------- Loop the data → render the cards ----------------
     Card preview always uses the FIRST image (images[0]). */
  grid.innerHTML = PROJECTS.map((p, i) =>
    '<article class="work-card project-item" data-reveal style="--d:' + (i % 3) * 0.08 + 's" data-cat="' + p.cat + '" data-id="' + p.id + '" tabindex="0" role="button" aria-label="View ' + p.title + ' case study">' +
      '<div class="work-media"><img src="https://picsum.photos/seed/' + p.images[0] + '/800/560" alt="' + p.title + ' project preview" loading="lazy">' +
        '<span class="work-cta">View case study <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg></span></div>' +
      '<div class="work-body"><div><span class="work-cat">' + p.catLabel + '</span><h3 class="work-title">' + p.title + '</h3><p class="work-desc">' + p.desc + '</p></div></div>' +
      '<div class="work-tags">' + p.tech.slice(0, 3).map(t => '<span>' + t + '</span>').join('') + '</div>' +
    '</article>'
  ).join('');

  const items = $$('.project-item', grid);

  /* ---------------- Reveal cards on scroll (self-contained) ---------------- */
  if (REDUCED) {
    items.forEach(it => it.classList.add('in-view'));
  } else {
    const rio = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in-view'); rio.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    items.forEach(it => rio.observe(it));
  }

  /* ---------------- Count ---------------- */
  const updateCount = n => { if (countEl) countEl.textContent = 'Showing ' + n + ' project' + (n === 1 ? '' : 's'); };
  updateCount(items.length);

  /* ---------------- Filtering ---------------- */
  if (filterBar) filterBar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    $$('.filter-btn', filterBar).forEach(b => b.classList.remove('active'));
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
    updateCount(shown);
  });

  /* ---------------- Case-study modal + INFINITE image slider ---------------- */
  const modal = $('#projectModal');
  if (!modal) return;
  const mMedia = $('#mMedia'), mTitle = $('#mTitle'), mCat = $('#mCat'),
        mClient = $('#mClient'), mYear = $('#mYear'), mDesc = $('#mDesc'),
        mDeliver = $('#mDeliver'), mTech = $('#mTech'), mClose = $('#modalClose');
  let lastFocus = null;

  const openModal = id => {
    const p = PROJECTS.find(x => x.id === id);
    if (!p) return;

    /* Infinite loop trick: [clone of LAST] + slides + [clone of FIRST].
       Next on the last slide animates right into the first clone, then
       silently snaps to the real first slide — looks unlimited. */
    const seeds = p.images && p.images.length ? p.images : ['placeholder'];
    const N = seeds.length;
    const slideHTML = s => '<figure class="m-slide"><img src="https://picsum.photos/seed/' + s + '/1200/750" alt="' + p.title + ' preview" loading="lazy"></figure>';

    const trackInner = N > 1
      ? slideHTML(seeds[N - 1]) + seeds.map(slideHTML).join('') + slideHTML(seeds[0])
      : seeds.map(slideHTML).join('');

    mMedia.innerHTML =
      '<div class="m-slider">' +
        '<div class="m-track">' + trackInner + '</div>' +
        (N > 1 ?
          '<button class="m-btn m-prev" type="button" aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button>' +
          '<button class="m-btn m-next" type="button" aria-label="Next image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>' +
          '<div class="m-dots">' + seeds.map((_, i) => '<button class="m-dot' + (i === 0 ? ' active' : '') + '" type="button" aria-label="Image ' + (i + 1) + '"></button>').join('') + '</div>'
        : '') +
      '</div>';

    /* Slider behaviour (infinite, both directions) */
    if (N > 1) {
      const trackEl = $('.m-track', mMedia);
      const dots    = $$('.m-dot', mMedia);
      let pos = 1; // 0 = last clone · 1..N = real slides · N+1 = first clone

      const setX = animate => {
        trackEl.style.transition = animate ? '' : 'none';
        trackEl.style.transform = 'translateX(-' + (pos * 100) + '%)';
        if (!animate) void trackEl.offsetWidth; // reflow so "none" applies instantly
      };
      const realIndex = () => ((pos - 1) % N + N) % N;
      const syncDots = () => dots.forEach((d, di) => d.classList.toggle('active', di === realIndex()));
      const normalize = () => {           // silent snap after landing on a clone
        if (pos === N + 1) { pos = 1; setX(false); }
        else if (pos === 0) { pos = N; setX(false); }
      };

      trackEl.addEventListener('transitionend', e => { if (e.target === trackEl) normalize(); });

      const step = dir => {
        if (REDUCED) { pos = ((pos - 1 + dir) % N + N) % N + 1; setX(false); }
        else { normalize(); pos += dir; setX(true); }
        syncDots();
      };

      $('.m-prev', mMedia).addEventListener('click', () => step(-1));
      $('.m-next', mMedia).addEventListener('click', () => step(1));
      dots.forEach((d, di) => d.addEventListener('click', () => {
        normalize();
        pos = di + 1;
        setX(!REDUCED);
        syncDots();
      }));

      setX(false); // start at the real first slide (skip the prepended clone)
      syncDots();
    }

    /* Fill the rest of the modal */
    mTitle.textContent = p.title;
    mCat.textContent = p.catLabel;
    mClient.textContent = p.origin;
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
})();