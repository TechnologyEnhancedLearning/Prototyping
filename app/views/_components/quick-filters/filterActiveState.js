  // Toggle on click (handles elements added later too)
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.quick-filters__button');
    if (!btn) return;
    btn.classList.toggle('quick-filters__button--active');
  });

  // Optional: keyboard support if it's not a native <button>
  document.addEventListener('keydown', function (e) {
    const btn = e.target.closest('.quick-filters__button');
    if (!btn) return;
    // Space or Enter toggles
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      btn.classList.toggle('quick-filters__button--active');
    }
  });
