// Enhanced Main JavaScript with Advanced Features
// Mark document as JS-enabled to allow gated animations/styles
document.documentElement.classList.add('js-enabled');
// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Scroll Progress Bar
function updateScrollProgress() {
  const scrollProgress = document.getElementById('scrollProgress');
  if (!scrollProgress) return;
  
  const scrollTop = window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  
  scrollProgress.style.width = scrollPercent + '%';
}

// Back to Top Button
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;
  
  function toggleBackToTop() {
    if (window.pageYOffset > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  window.addEventListener('scroll', toggleBackToTop);
}

// Lazy Loading e Parallax removidos (uso de loading="lazy" nativo e design minimalista)

// Smooth reveal on scroll - enhanced version
function handleReveal(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}

const revealObserver = new IntersectionObserver(handleReveal, { 
  threshold: 0.1,
  rootMargin: '50px 0px -50px 0px'
});

// Service Worker Registration
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered successfully');
      })
      .catch(error => {
        console.log('SW registration failed');
      });
  }
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
  // Existing functionality
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
  
  // Timer de segurança: após 3 segundos, revela todos os elementos não revelados
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
      el.classList.add('revealed');
    });
  }, 3000);
  
  // Initialize new features
  initBackToTop();
  registerServiceWorker();
  initBlurUp();
  initProductFilters();
  initLightbox();
  // initCarousel may have been removed; guard the call to avoid a runtime error
  if (typeof initCarousel === 'function') initCarousel();
  initCustomCursor();
});

// Scroll event listener for progress bar
window.addEventListener('scroll', updateScrollProgress);

// Current year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Netlify forms: se houve redirect com ?sucesso=1, mostra confirmação
const params = new URLSearchParams(window.location.search);
const form = document.getElementById('orcamento-form');
const formMsg = document.getElementById('formMsg');

if (params.get('sucesso') === '1' && formMsg) {
  formMsg.className = 'mt-6 text-center text-zapGreen bg-zapGreen/10 border border-zapGreen/20 rounded-xl p-4';
  formMsg.textContent = '✅ Obrigado! Recebemos seu pedido e retornaremos em breve.';
  formMsg.classList.remove('hidden');
}

// Smooth scroll enhancement for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerHeight = 0; // header removido
      const targetPosition = target.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      // Header/nav removidos: sem atualização de aria-current/fechamento de menu
    }
  });
});

// Lógica de nav ativo removida (sem header/nav principal)

// Card hover effects minimalistas (controlados por CSS)

// Enhanced form submission with loading states
if (form) {
  form.addEventListener('submit', function(e) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="inline-flex items-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Enviando...</span>';
      
      // Re-enable after a delay (in case of errors)
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Enviar Solicitação de Orçamento';
      }, 5000);
    }
  });
}

// Auto-hide Header removido

// Remove blur-up effect when images finish loading
function initBlurUp() {
  const images = Array.from(document.querySelectorAll('img.blur-up'));
  if (!images.length) return;

  images.forEach((img) => {
    const markLoaded = () => img.classList.add('loaded');
    if (img.complete && img.naturalWidth > 0) {
      // Already loaded from cache
      markLoaded();
    } else {
      img.addEventListener('load', markLoaded, { once: true });
      img.addEventListener('error', markLoaded, { once: true });
      // Try decoding for browsers that support it
      if (typeof img.decode === 'function') {
        img.decode().then(markLoaded).catch(() => {});
      }
    }
  });
}

// Filtros de produtos por categoria
function initProductFilters() {
  const toolbar = document.getElementById('productFilter');
  if (!toolbar) return;
  const cards = Array.from(document.querySelectorAll('[data-category]'));

  // Initialize transition classes on cards
  cards.forEach(card => {
    card.classList.add('card-transition', 'card-visible');
  });

  toolbar.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-filter]');
    if (!btn) return;

    const filter = btn.getAttribute('data-filter');
    // Toggle pressed state
    toolbar.querySelectorAll('button[data-filter]').forEach(b => {
      const isActive = b === btn;
      b.setAttribute('aria-pressed', String(isActive));
      b.classList.toggle('bg-zapGreen', isActive);
      b.classList.toggle('text-white', isActive);
      b.classList.toggle('ring-zapGreen', isActive);
      b.classList.toggle('text-zapGray', !isActive);
      b.classList.toggle('ring-gray-200', !isActive);
    });

    // Show/hide by toggling 'hidden' + animation classes
    cards.forEach(card => {
      const cat = card.getAttribute('data-category');
      const show = filter === 'todos' || cat === filter;
      if (show) {
        card.classList.remove('hidden', 'card-hidden');
        // force reflow to allow transition
        void card.offsetWidth;
        card.classList.add('card-visible');
      } else {
        // start hide animation then set hidden after transition
        card.classList.remove('card-visible');
        card.classList.add('card-hidden');
        // after transition, add hidden to remove from layout
        setTimeout(() => card.classList.add('hidden'), 240);
      }
    });
  });
}

// Lightbox para imagens dos cards
function initLightbox() {
  const modal = document.getElementById('lightbox');
  const imgEl = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  if (!modal || !imgEl || !closeBtn) return;

  function open(src, alt) {
    imgEl.src = src;
    imgEl.alt = alt || 'Visualização do produto';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('no-scroll');
  }

  function close() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('no-scroll');
    imgEl.src = '';
  }

  // Clique/teclado nas imagens dos produtos (lightbox)
  document.querySelectorAll('#produtos img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => open(img.src, img.alt));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(img.src, img.alt);
      }
    });
  });

  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// Carousel simples com scroll-snap
// Carousel init removed (destaques carousel was removed from the page)

// Minimal, elegant custom cursor (dot + ring)
function initCustomCursor() {
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!finePointer) return; // Keep native cursor on touch/coarse

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('cursor-enhanced');

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(ring);
  document.body.appendChild(dot);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let ringScale = 1;
  let rafId = null;

  const lerp = (a, b, n) => (1 - n) * a + n * b;

  function render() {
    const speed = prefersReduced ? 1 : 0.18;
    ringX = lerp(ringX, mouseX, speed);
    ringY = lerp(ringY, mouseY, speed);

    // Center elements on pointer
    dot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
    ring.style.transform = `translate3d(${ringX - 14}px, ${ringY - 14}px, 0) scale(${ringScale})`;

    rafId = requestAnimationFrame(render);
  }

  const show = () => { dot.style.opacity = '1'; ring.style.opacity = '1'; };
  const hide = () => { dot.style.opacity = '0'; ring.style.opacity = '0'; };

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    if (rafId === null) render();
    show();
  });
  document.addEventListener('mouseenter', show);
  document.addEventListener('mouseleave', hide);

  document.addEventListener('mousedown', () => { ringScale = 0.9; });
  document.addEventListener('mouseup', () => { ringScale = 1; });

  const onInteractiveHover = (active) => {
    ringScale = active ? 1.25 : 1;
    ring.style.borderColor = active ? '#FA4A21' : '#FA4A21';
    dot.style.background = active ? '#FA4A21' : '#003D95';
  };

  function handleHover(e) {
    const isInteractive = !!e.target.closest('a, button, [role="button"], .btn-primary, .btn-secondary, input, textarea, select');
    onInteractiveHover(isInteractive);
  }

  document.addEventListener('mouseover', handleHover);
  document.addEventListener('focusin', handleHover);

  // Hide cursor over iframes (can't track)
  document.querySelectorAll('iframe').forEach((f) => {
    f.addEventListener('mouseenter', hide);
    f.addEventListener('mouseleave', show);
  });
}
