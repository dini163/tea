/* ============================================================
   🍵 Tea Encyclopedia — Interactive Logic
   Scroll animations, tab filtering, search, back-to-top
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // === Scroll Reveal (Intersection Observer) ===
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .tea-card, .brew-card');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve — keep for re-entry if needed
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // === Brewing Thermometer Animation ===
  const mercuryElements = document.querySelectorAll('.brew-mercury');

  const mercuryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const height = entry.target.dataset.height;
        entry.target.style.height = height + '%';
      }
    });
  }, { threshold: 0.3 });

  mercuryElements.forEach(el => mercuryObserver.observe(el));

  // === Nav Tab Switching ===
  const navTabs = document.querySelectorAll('.nav-tab');
  const layerSections = document.querySelectorAll('.layer-section');
  const dividers = document.querySelectorAll('.section-divider');
  const noResults = document.getElementById('noResults');

  function setActiveLayer(layer) {
    // Update tab styling
    navTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.layer === layer);
    });

    // Show/hide sections
    if (layer === 'all') {
      layerSections.forEach(s => s.classList.remove('hidden'));
      dividers.forEach(d => d.parentElement.style.display = '');
      noResults.classList.remove('active');
    } else {
      layerSections.forEach(s => {
        if (s.dataset.layer === layer) {
          s.classList.remove('hidden');
        } else {
          s.classList.add('hidden');
        }
      });
      // Hide dividers when filtering
      dividers.forEach(d => d.parentElement.style.display = 'none');
    }

    // Re-trigger reveal animations for newly visible elements
    setTimeout(() => {
      document.querySelectorAll('.tea-card, .brew-card, .reveal, .reveal-left').forEach(el => {
        if (!el.closest('.hidden')) {
          revealObserver.observe(el);
        }
      });
    }, 100);
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const layer = tab.dataset.layer;
      setActiveLayer(layer);

      // Clear search when switching tabs
      const searchInput = document.getElementById('searchInput');
      searchInput.value = '';
      resetSearch();

      // Scroll to section
      const target = document.getElementById(layer);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // === Search Functionality ===
  const searchInput = document.getElementById('searchInput');
  let searchTimeout;

  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      performSearch(searchInput.value.trim().toLowerCase());
    }, 200);
  });

  function performSearch(query) {
    if (!query) {
      resetSearch();
      return;
    }

    // First, show all layers
    setActiveLayer('all');

    const allCards = document.querySelectorAll('.tea-card');
    const allCategories = document.querySelectorAll('.tea-category');
    const tableRows = document.querySelectorAll('.naming-table tbody tr');
    let hasResults = false;

    // Filter tea cards
    allCards.forEach(card => {
      const name = (card.dataset.name || '').toLowerCase();
      const match = name.includes(query);
      card.style.display = match ? '' : 'none';
      if (match) hasResults = true;
    });

    // Hide empty categories
    allCategories.forEach(cat => {
      const visibleCards = cat.querySelectorAll('.tea-card:not([style*="display: none"])');
      cat.style.display = visibleCards.length > 0 ? '' : 'none';
    });

    // Filter naming table rows
    tableRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const match = text.includes(query);
      row.style.display = match ? '' : 'none';
      if (match) hasResults = true;
    });

    // Show/hide no results
    noResults.classList.toggle('active', !hasResults);
  }

  function resetSearch() {
    const allCards = document.querySelectorAll('.tea-card');
    const allCategories = document.querySelectorAll('.tea-category');
    const tableRows = document.querySelectorAll('.naming-table tbody tr');

    allCards.forEach(card => card.style.display = '');
    allCategories.forEach(cat => cat.style.display = '');
    tableRows.forEach(row => row.style.display = '');
    noResults.classList.remove('active');
  }

  // === Sticky Nav Shadow on Scroll ===
  const navSticky = document.querySelector('.nav-sticky');

  window.addEventListener('scroll', () => {
    navSticky.classList.toggle('scrolled', window.scrollY > 100);
  }, { passive: true });

  // === Back to Top Button ===
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // === Tea Card Hover Sound Effect (subtle) ===
  // Visual-only micro-interactions are handled by CSS

  // === Keyboard Navigation ===
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      resetSearch();
      searchInput.blur();
    }
  });

  // === Smooth Scroll Offset for Sticky Nav ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // === Spectrum Marker Click — Scroll to Category ===
  const spectrumMarkers = document.querySelectorAll('.spectrum-marker');
  const categoryMap = {
    '绿茶': 'cat-green',
    '白茶': 'cat-white',
    '黄茶': 'cat-yellow',
    '乌龙茶': 'cat-oolong',
    '红茶': 'cat-red',
    '黑茶': 'cat-dark'
  };

  spectrumMarkers.forEach(marker => {
    marker.addEventListener('click', () => {
      const name = marker.querySelector('.spectrum-name').textContent;
      const catId = categoryMap[name];
      if (catId) {
        document.getElementById(catId).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // === Page Load Animation ===
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(20px)';
    heroContent.style.transition = 'opacity 1.2s ease, transform 1.2s ease';

    setTimeout(() => {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 200);
  }
});
