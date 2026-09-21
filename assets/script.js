(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll progress + navbar compact state ---------- */
  var progressBar = document.getElementById('scrollProgress');
  var navbar = document.getElementById('navbar');
  var backToTop = document.getElementById('backToTop');

  function onScroll() {
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var height = doc.scrollHeight - doc.clientHeight;
    var pct = height > 0 ? (scrollTop / height) * 100 : 0;
    progressBar.style.width = pct + '%';

    navbar.classList.toggle('is-scrolled', scrollTop > 12);
    backToTop.classList.toggle('is-visible', scrollTop > 700);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Mobile drawer ---------- */
  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var drawerCloseBtn = document.getElementById('drawerCloseBtn');
  var drawer = document.getElementById('mobileDrawer');

  function openDrawer() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  hamburgerBtn.addEventListener('click', openDrawer);
  drawerCloseBtn.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a[data-nav]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(a.getAttribute('href'));
      closeDrawer();
      if (target) {
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        history.pushState(null, '', a.getAttribute('href'));
      }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
  });

  /* ---------- Active section indicator ---------- */
  var navLinks = document.querySelectorAll('a[data-nav]');
  var sections = Array.prototype.map.call(navLinks, function (a) {
    return document.querySelector(a.getAttribute('href'));
  }).filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = '#' + entry.target.id;
          navLinks.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    '.card, .brand-card, .value-card, .timeline-item, .number-card, .tip-card, .office-card, .step-panel, .section-head'
  );
  revealTargets.forEach(function (el, i) {
    el.setAttribute('data-reveal', '');
    el.style.transitionDelay = prefersReducedMotion ? '0ms' : Math.min((i % 6) * 60, 300) + 'ms';
  });

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Journey stepper (tabs) ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('#stepperTabs [role="tab"]'));
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });

  function selectTab(index) {
    tabs.forEach(function (t, i) {
      var active = i === index;
      t.setAttribute('aria-selected', active ? 'true' : 'false');
      t.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    tabs[index].focus();
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t, i) {
        var active = i === index;
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        t.tabIndex = active ? 0 : -1;
        panels[i].hidden = !active;
      });
    });
    tab.addEventListener('keydown', function (e) {
      var newIndex = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') newIndex = (index + 1) % tabs.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') newIndex = (index - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') newIndex = 0;
      if (e.key === 'End') newIndex = tabs.length - 1;
      if (newIndex !== null) { e.preventDefault(); selectTab(newIndex); }
    });
  });

  /* ---------- Testimonial carousel ---------- */
  var track = document.getElementById('carouselTrack');
  var slides = Array.prototype.slice.call(track.children);
  var prevBtn = document.getElementById('carouselPrev');
  var nextBtn = document.getElementById('carouselNext');
  var dotsWrap = document.getElementById('carouselDots');
  var indexLabel = document.getElementById('carouselIndex');
  var current = 0;

  slides.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Ir para depoimento ' + (i + 1));
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', function () { goTo(i); });
    dotsWrap.appendChild(dot);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function goTo(i) {
    current = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    track.style.transition = prefersReducedMotion ? 'none' : 'transform 420ms cubic-bezier(.22,.72,.32,1)';
    dots.forEach(function (d, di) { d.setAttribute('aria-selected', di === current ? 'true' : 'false'); });
    indexLabel.textContent = pad(current + 1) + ' / ' + pad(slides.length);
  }

  prevBtn.addEventListener('click', function () { goTo(current - 1); });
  nextBtn.addEventListener('click', function () { goTo(current + 1); });

  var carouselEl = document.getElementById('carousel');
  carouselEl.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { goTo(current - 1); }
    if (e.key === 'ArrowRight') { goTo(current + 1); }
  });

  var touchStartX = null;
  track.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    var delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) { delta < 0 ? goTo(current + 1) : goTo(current - 1); }
    touchStartX = null;
  }, { passive: true });

  goTo(0);
})();
