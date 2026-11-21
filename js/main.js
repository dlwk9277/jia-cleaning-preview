/* Jia 家 Cleaning Services: page behaviour. Settings live in config.js. */
(() => {
  const S = window.SITE || {};
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ---- Contact details from config.js ---- */
  const wa = (text) => `https://wa.me/${S.whatsappNumber}?text=${encodeURIComponent(text)}`;
  if (S.whatsappNumber && S.messages) {
    $$('[data-wa]').forEach(a => { a.href = wa(S.messages[a.dataset.wa] || S.messages.general); });
    $$('[data-wa-service]').forEach(a => {
      a.href = wa(S.messages.service.replace('{service}', a.dataset.waService.toLowerCase()));
    });
  }
  if (S.phoneNumber) $$('[data-tel]').forEach(a => { a.href = `tel:+${S.phoneNumber}`; });
  if (S.phoneDisplay) $$('[data-phone-text]').forEach(el => { el.textContent = S.phoneDisplay; });
  if (S.email) $$('[data-email]').forEach(a => {
    a.href = `mailto:${S.email}?subject=${encodeURIComponent(S.emailSubject || '')}`;
    a.textContent = S.email;
  });
  if (S.hours) $$('[data-hours]').forEach(el => { el.textContent = S.hours; });
  if (S.address) $$('[data-address]').forEach(el => { el.textContent = S.address; });
  if (S.facebook) $$('[data-facebook]').forEach(a => { a.href = S.facebook; });
  if (S.mapQuery) $$('[data-map]').forEach(f => {
    const src = `https://www.google.com/maps?q=${encodeURIComponent(S.mapQuery)}&z=16&output=embed`;
    if (f.getAttribute('src') !== src) f.src = src;
  });
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---- Venue tabs (Home / Business / Industrial) ---- */
  const tabs = $$('[role="tab"]');
  const show = (tab, focus) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => show(tab));
    tab.addEventListener('keydown', e => {
      const n = tabs.length;
      const k = { ArrowRight: i + 1, ArrowLeft: i - 1 + n, Home: 0, End: n - 1 }[e.key];
      if (k === undefined) return;
      e.preventDefault();
      show(tabs[k % n], true);
    });
  });
  // Open the right tab from a link like #services-business
  const fromHash = tabs.find(t => location.hash === '#services-' + t.id.replace('tab-', ''));
  show(fromHash || tabs[0]);

  /* ---- Before / after sliders ---- */
  $$('[data-ba]').forEach(fig => {
    const frame = fig.querySelector('.ba__frame');
    const range = fig.querySelector('.ba__range');
    const set = () => frame.style.setProperty('--p', range.value + '%');
    range.addEventListener('input', set);
    set();
  });

  /* ---- Photo viewer ---- */
  const dlg = document.getElementById('zoom');
  if (dlg && typeof dlg.showModal === 'function') {
    const img = document.getElementById('zoom-img');
    const cap = document.getElementById('zoom-cap');
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-zoom]');
      if (!btn) return;
      const alt = btn.querySelector('img').alt;
      img.src = btn.dataset.zoom;
      img.alt = alt;
      cap.textContent = alt;
      dlg.showModal();
    });
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => { img.removeAttribute('src'); });
  } else {
    // Very old browsers: open the photo on its own
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-zoom]');
      if (btn) window.open(btn.dataset.zoom, '_blank', 'noopener');
    });
  }
})();
