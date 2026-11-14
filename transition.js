// Smooth page-to-page navigation
// 1) Warm up pages on hover / touch so the next page opens instantly (for browsers without Speculation Rules)
// 2) Fade fallback for browsers without native cross-page view transitions
(function () {
  const warmed = new Set();
  function warm(e) {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.origin !== location.origin) return;
    if (a.pathname === location.pathname || warmed.has(a.pathname)) return;
    warmed.add(a.pathname);
    const l = document.createElement('link');
    l.rel = 'prefetch';
    l.href = a.href;
    document.head.appendChild(l);
  }
  ['pointerover', 'touchstart', 'focusin'].forEach(t => document.addEventListener(t, warm, { passive: true }));

  // Browsers that support native cross-page transitions don't need the fade
  if ('PageRevealEvent' in window) return;

  document.body.classList.add('pt-fallback-in');

  // restore the page if the user comes back with the Back button
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) document.body.classList.remove('pt-fallback-out');
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || link.target === '_blank') return;
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    if (link.origin !== location.origin) return;                          // external link
    if (link.pathname === location.pathname) return;                      // same page

    e.preventDefault();
    document.body.classList.add('pt-fallback-out');
    setTimeout(() => { window.location.href = link.href; }, 250);
  });
})();
