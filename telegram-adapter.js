/* Telegram Mini App adapter. No credentials are stored or trusted client-side. */
(function () {
  'use strict';
  const tg = window.Telegram && window.Telegram.WebApp;
  if (!tg || !tg.initData) return; // normal PWA / regular browser
  document.documentElement.classList.add('tg-mini');
  try {
    tg.ready();
    tg.expand();
    // The server must validate initData before granting access to remote data.
    // initDataUnsafe is intentionally NOT used for authentication.
    const updateInsets = function () {
      const root = document.documentElement;
      const safe = tg.safeAreaInset || {};
      const content = tg.contentSafeAreaInset || {};
      root.style.setProperty('--tg-safe-area-inset-bottom', (Number(safe.bottom) || 0) + 'px');
      root.style.setProperty('--tg-content-safe-area-inset-top', (Number(content.top) || 0) + 'px');
    };
    updateInsets();
    if (tg.onEvent) tg.onEvent('safeAreaChanged', updateInsets);
    if (tg.onEvent) tg.onEvent('contentSafeAreaChanged', updateInsets);
    const back = tg.BackButton;
    if (back && back.onClick) {
      back.onClick(function () {
        const sheet = document.getElementById('sheet');
        if (sheet && !sheet.hidden) {
          const close = sheet.querySelector('[data-s="close"]');
          if (close) close.click();
        } else if (window.history.length > 1) {
          window.history.back();
        }
      });
      // BackButton is only relevant while the operation editor is open.
      const sheet = document.getElementById('sheet');
      if (sheet && window.MutationObserver) {
        const sync = function () { if (sheet.hidden) back.hide(); else back.show(); };
        new MutationObserver(sync).observe(sheet, {attributes: true, attributeFilter: ['hidden']});
        sync();
      }
    }
  } catch (e) { /* Telegram APIs may vary across clients. */ }
})();
