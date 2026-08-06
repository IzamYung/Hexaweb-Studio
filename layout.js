/* ============================================================
   HEXAWEB STUDIO — layout.js
   Single source of truth for the site header & footer.

   Usage — synchronous tags, exactly where the block should render:
     <script src="layout.js" data-layout="header"></script>   (top of body)
     <script src="layout.js" data-layout="footer"></script>   (end of body)

   The active nav link is detected from the current page automatically.
   ============================================================ */
(function () {
  var me = document.currentScript;
  if (!me) return;

  var slot = me.getAttribute('data-layout');
  var page = (location.pathname.split('/').pop() || 'index.html').split('#')[0];

  var LOGO = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2l8.66 5v10L12 22 3.34 17V7L12 2z" stroke="currentColor" stroke-width="1.6"/><path d="M9.2 8.4v7.2M14.8 8.4v7.2M9.2 12h5.6" stroke="#38bdf8" stroke-width="1.6" stroke-linecap="round"/></svg>';

  var NAV = [
    ['index.html', 'Home'],
    ['services.html', 'Services'],
    ['portfolio.html', 'Portfolio'],
    ['team.html', 'Team'],
    ['about.html', 'About']
  ];

  function navLinks(extraClass) {
    return NAV.map(function (n) {
      var cls = [];
      if (n[0] === page) cls.push('active');
      if (extraClass) cls.push(extraClass);
      return '<a href="' + n[0] + '"' + (cls.length ? ' class="' + cls.join(' ') + '"' : '') + '>' + n[1] + '</a>';
    }).join('');
  }

  /* ---------------- HEADER ---------------- */
  if (slot === 'header') {
    me.insertAdjacentHTML('beforebegin',
      '<header class="site-header" id="siteHeader">' +
        '<div class="container nav-inner">' +
          '<a class="brand" href="index.html" aria-label="Hexaweb Studio — home">' + LOGO + '<span class="brand-text">Hexa<em>web</em></span></a>' +
          '<nav class="main-nav" aria-label="Primary">' + navLinks() + '</nav>' +
          '<div class="nav-actions">' +
            '<button class="theme-toggle" id="themeToggle" type="button" aria-label="Toggle light and dark mode">' +
              '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5 5l1.6 1.6M17.4 17.4L19 19M19 5l-1.6 1.6M6.6 17.4L5 19"/></svg>' +
              '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
            '</button>' +
            '<a href="contact.html" class="btn btn-primary btn-sm nav-cta">Get Free Consultation</a>' +
            '<button class="nav-burger" id="navBurger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu"><span></span><span></span></button>' +
          '</div>' +
        '</div>' +
        '<nav class="mobile-menu" id="mobileMenu" aria-label="Mobile">' +
          navLinks() +
          '<a href="contact.html" class="btn btn-primary">Get Free Consultation</a>' +
        '</nav>' +
      '</header>'
    );
  }

  /* ---------------- FOOTER ---------------- */
  if (slot === 'footer') {
    me.insertAdjacentHTML('beforebegin',
      '<footer class="site-footer">' +
        '<div class="container">' +
          '<div class="footer-grid">' +
            '<div class="f-col">' +
              '<a class="brand" href="index.html">' + LOGO + '<span class="brand-text">Hexa<em>web</em></span></a>' +
              '<p class="f-blurb">A student-run, three-person web studio — building high-converting landing pages and keeping them fast, secure, and online.</p>' +
              '<div class="socials">' +
                '<a href="https://github.com" class="social-link" aria-label="GitHub" rel="noopener" target="_blank"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg></a>' +
                '<a href="https://linkedin.com" class="social-link" aria-label="LinkedIn" rel="noopener" target="_blank"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-13h4v1.5A6 6 0 0 1 16 8zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg></a>' +
                '<a href="https://instagram.com" class="social-link" aria-label="Instagram" rel="noopener" target="_blank"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.6h.01"/></svg></a>' +
                '<a href="https://dribbble.com" class="social-link" aria-label="Dribbble" rel="noopener" target="_blank"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9.5"/><path d="M6 4.5c3.5 4 6.5 8.5 8.5 15M20.5 9c-5 2-11 2.5-17 1M3.5 16.5c5.5-1 10.5.5 14 5"/></svg></a>' +
              '</div>' +
            '</div>' +
            '<div class="f-col">' +
              '<h4 class="f-title">Pages</h4>' +
              '<a href="index.html">Home</a><a href="services.html">Services</a><a href="portfolio.html">Portfolio</a><a href="team.html">Team</a><a href="about.html">About</a><a href="contact.html">Contact</a>' +
            '</div>' +
            '<div class="f-col">' +
              '<h4 class="f-title">Services</h4>' +
              '<a href="services.html#landing-pages">Custom Landing Pages</a>' +
              '<a href="services.html#hosting-domain">Hosting &amp; Domain</a>' +
              '<a href="services.html#maintenance">Maintenance &amp; Support</a>' +
            '</div>' +
            '<div class="f-col">' +
              '<h4 class="f-title">Get in touch</h4>' +
              '<p class="f-contact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="M3 7l9 6.5L21 7"/></svg><a href="mailto:hello@hexaweb.studio">hello@hexaweb.studio</a></p>' +
              '<p class="f-contact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"/></svg><a href="https://wa.me/6281234567890" rel="noopener" target="_blank">+62 812-3456-7890</a></p>' +
              '<p class="f-contact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="2.8"/></svg>Jakarta, Indonesia</p>' +
            '</div>' +
          '</div>' +
          '<div class="footer-bottom">' +
            '<p>© <span id="year">' + new Date().getFullYear() + '</span> Hexaweb Studio. All rights reserved.</p>' +
            '<p>Built by hand — HTML, CSS &amp; JavaScript only.</p>' +
          '</div>' +
        '</div>' +
      '</footer>'
    );
  }
})();