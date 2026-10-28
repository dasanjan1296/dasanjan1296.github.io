/* Progressive enhancements: the profile and galleries work without JavaScript. */
(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('#theme-toggle');
  const updateThemeButton = () => {
    const dark = root.dataset.theme === 'dark';
    themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
    document.querySelector('meta[name="theme-color"]').content = dark ? '#0f1114' : '#f4f1ea';
  };
  const toggleTheme = () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('anjan-theme', root.dataset.theme); } catch (_) {}
    updateThemeButton();
  };
  themeButton.hidden = false;
  themeButton.addEventListener('click', toggleTheme);
  updateThemeButton();
  document.addEventListener('keydown', event => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.target.closest('input, textarea, select, [contenteditable]')) return;
    if (event.key.toLowerCase() === 't') toggleTheme();
  });

  const gallery = document.querySelector('.gallery');
  const controls = document.querySelector('.gallery-controls');
  const previous = controls.querySelector('[data-gallery-prev]');
  const next = controls.querySelector('[data-gallery-next]');
  const moveGallery = direction => {
    const step = gallery.querySelector('figure').getBoundingClientRect().width + parseFloat(getComputedStyle(gallery).columnGap);
    gallery.scrollBy({ left: direction * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  const updateGallery = () => {
    previous.disabled = gallery.scrollLeft <= 2;
    next.disabled = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 2;
  };
  controls.hidden = false;
  previous.addEventListener('click', () => moveGallery(-1));
  next.addEventListener('click', () => moveGallery(1));
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      moveGallery(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  gallery.addEventListener('scroll', updateGallery, { passive: true });
  window.addEventListener('resize', updateGallery);
  updateGallery();

  if ('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('nav a')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -55% 0px' });
    document.querySelectorAll('main > section').forEach(section => observer.observe(section));
  }
})();
