/* ============================================================
   🍵 Tea Encyclopedia — Interactive Logic
   Scroll animations, tab filtering, search, back-to-top
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // === Card Enrichment & Efficacy Integration ===
  const teaCards = document.querySelectorAll('.tea-card');
  
  // Helper to determine semantic color themes for efficacy tags
  function getEfficacyTagTheme(tag) {
    tag = tag.trim();
    if (/提神|醒脑|益思/.test(tag)) return 'tag-theme-energy';
    if (/生津|止渴|消暑|清热|降火|解毒|避暑/.test(tag)) return 'tag-theme-cooling';
    if (/抗衰|美容|抗氧化|美白/.test(tag)) return 'tag-theme-beauty';
    if (/消食|去油|减肥|降脂|脾胃|暖胃|温胃|健脾|养胃|助消化/.test(tag)) return 'tag-theme-digest';
    if (/防辐射|防龋齿|降压|降糖|血管|心血管|保护/.test(tag)) return 'tag-theme-health';
    if (/祛湿|化痰|止痛|散寒|抗炎|杀菌|抗菌|理气|燥湿|排毒/.test(tag)) return 'tag-theme-detox';
    return 'tag-theme-default';
  }

  teaCards.forEach(card => {
    const teaNameEl = card.querySelector('.tea-card-name');
    if (!teaNameEl) return;
    
    const teaName = teaNameEl.textContent.trim();
    const details = window.TEA_DETAILS ? window.TEA_DETAILS[teaName] : null;
    
    if (details) {
      // 1. Add "Core Efficacy" to the card UI as colorful badges
      const cardInfoContainer = card.querySelector('.tea-card-info');
      if (cardInfoContainer) {
        const efficacyItem = document.createElement('div');
        efficacyItem.className = 'tea-info-item tea-info-efficacy';
        
        // Split efficacy string by '、' or ',' or '，'
        const rawEfficacy = details.coreEfficacy || details.efficacy || '';
        const tags = rawEfficacy.split(/[、，,]+/).filter(t => t.trim().length > 0);
        
        let tagsHTML = `<div class="efficacy-tags-container">`;
        tags.forEach(tag => {
          const themeClass = getEfficacyTagTheme(tag);
          tagsHTML += `<span class="efficacy-tag ${themeClass}">${tag}</span>`;
        });
        tagsHTML += `</div>`;
        
        efficacyItem.innerHTML = `
          <span class="tea-info-label">核心功效</span>
          ${tagsHTML}
        `;
        
        // Insert it right before the storage info if it exists
        const storageItem = cardInfoContainer.querySelector('.tea-info-storage');
        if (storageItem) {
          cardInfoContainer.insertBefore(efficacyItem, storageItem);
        } else {
          cardInfoContainer.appendChild(efficacyItem);
        }
      }
      
      // 2. Expand card data-name attribute in DOM dataset for efficacy search
      let keywords = (card.dataset.name || '') + ` ${details.efficacy} ${details.coreEfficacy || ''}`;
      card.dataset.name = keywords.toLowerCase();
    }
  });

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

  // === Tea Detail Modal Interactive Logic ===
  const teaModal = document.getElementById('teaModal');
  const modalClose = document.getElementById('modalClose');
  const modalImageContainer = document.getElementById('modalImageContainer');
  const modalBody = document.getElementById('modalBody');

  if (teaModal && modalClose && modalImageContainer && modalBody) {
    const teaCards = document.querySelectorAll('.tea-card');

    teaCards.forEach(card => {
      // Add visual hint that the card is clickable
      card.style.cursor = 'pointer';
      
      card.addEventListener('click', () => {
        const teaNameEl = card.querySelector('.tea-card-name');
        if (!teaNameEl) return;
        
        const teaName = teaNameEl.textContent.trim();
        const details = window.TEA_DETAILS ? window.TEA_DETAILS[teaName] : null;
        
        if (details) {
          // 1. Populate Image or Placeholder
          const cardImg = card.querySelector('.tea-card-img img');
          const cardPlaceholder = card.querySelector('.tea-card-img .tea-placeholder');
          
          if (cardImg) {
            modalImageContainer.innerHTML = `<img class="modal-img" src="${cardImg.src}" alt="${cardImg.alt}">`;
          } else if (cardPlaceholder) {
            modalImageContainer.innerHTML = `<div class="modal-img tea-placeholder" style="font-size: 5rem; height: 260px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary));">${cardPlaceholder.textContent}</div>`;
          } else {
            modalImageContainer.innerHTML = '';
          }
          
          // 2. Populate Body Content
          modalBody.innerHTML = `
            <div class="modal-header">
              <div class="modal-title-row">
                <h3 class="modal-title">${details.title}</h3>
              </div>
              <div class="modal-subtitle">${details.english}</div>
              <div class="modal-badges">
                <span class="modal-badge" style="background: rgba(200, 169, 110, 0.1); border-color: var(--gold); color: var(--gold)">${details.type}</span>
                <span class="modal-badge">发酵度：${details.fermentation}</span>
                <span class="modal-badge">🌡️ ${details.temp}</span>
                <span class="modal-badge">📦 储存：${details.storage.split('，')[0]}</span>
              </div>
            </div>
            
            <div class="modal-section">
              <h4 class="modal-section-title">✨ 茶叶功效</h4>
              <p class="modal-text">${details.efficacy}</p>
            </div>
            
            <div class="modal-section">
              <h4 class="modal-section-title">📜 历史渊源</h4>
              <p class="modal-text">${details.history}</p>
            </div>
            
            <div class="modal-section">
              <h4 class="modal-section-title">🎭 轶事趣闻</h4>
              <p class="modal-text">${details.anecdote}</p>
            </div>
            
            ${details.literature ? `
            <div class="modal-section">
              <h4 class="modal-section-title">📖 经典文献</h4>
              <p class="modal-text">${details.literature}</p>
            </div>
            ` : ''}
            
            ${details.poem ? `
            <div class="modal-section">
              <h4 class="modal-section-title">✍️ 经典诗词</h4>
              <div class="modal-poem">${details.poem}</div>
            </div>
            ` : ''}
          `;
          
          // 3. Open Modal
          teaModal.classList.add('active');
          document.body.style.overflow = 'hidden'; // Lock background scroll
        }
      });
    });

    // Close Modal Events
    const closeModal = () => {
      teaModal.classList.remove('active');
      document.body.style.overflow = ''; // Restore background scroll
    };

    modalClose.addEventListener('click', closeModal);
    
    // Close on clicking overlay background
    teaModal.addEventListener('click', (e) => {
      if (e.target === teaModal) {
        closeModal();
      }
    });

    // Close on Escape key press
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && teaModal.classList.contains('active')) {
        closeModal();
      }
    });
  }
});
