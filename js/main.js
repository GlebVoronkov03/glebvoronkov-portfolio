(function() {
  'use strict';

  // --- DOM Elements ---
  const navLinks = document.querySelectorAll('nav a[data-tab]');
  const panels = document.querySelectorAll('.tab-panel');
  const mainNav = document.getElementById('mainNav');

  // --- Switch active tab ---
  function showTab(tabId) {
    // Hide all panels
    panels.forEach(p => p.classList.remove('active'));
    // Show selected panel
    const activePanel = document.getElementById(tabId);
    if (activePanel) {
      activePanel.classList.add('active');
    }

    // Update nav active class
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-tab') === tabId) {
        link.classList.add('active');
      }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Event listeners for nav ---
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const tab = this.getAttribute('data-tab');
      showTab(tab);
      // Update URL hash without jumping
      history.pushState(null, null, '#' + tab);
      // Close mobile menu if open
      if (mainNav) mainNav.classList.remove('show');
    });
  });

  // --- Event listeners for inline data-tab links (e.g. CTA button) ---
  document.querySelectorAll('a[data-tab]').forEach(el => {
    if (!el.closest('nav')) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        const tab = this.getAttribute('data-tab');
        showTab(tab);
        history.pushState(null, null, '#' + tab);
        if (mainNav) mainNav.classList.remove('show');
      });
    }
  });

  // --- Mobile menu toggle ---
  window.toggleMenu = function() {
    if (mainNav) mainNav.classList.toggle('show');
  };

  // --- Initialise tab from URL hash on page load ---
  function initFromHash() {
    const hash = window.location.hash.substring(1); // remove '#'
    if (hash) {
      // Check if a panel with that id exists
      const targetPanel = document.getElementById(hash);
      if (targetPanel) {
        showTab(hash);
        return;
      }
    }
    // Default: show 'about' if no valid hash
    showTab('about');
  }

  // --- Handle back/forward browser buttons ---
  window.addEventListener('hashchange', initFromHash);

  // --- Start ---
  initFromHash();
})();
