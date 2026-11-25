/* ВсепокрасимБел · Эковата */
(function () {
  'use strict';

  /* ---------- mobile nav ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- sticky header shadow ---------- */
  var head = document.querySelector('.site-head');
  if (head) {
    var onScroll = function () {
      head.classList.toggle('is-stuck', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- reveal on scroll ---------- */
  var items = document.querySelectorAll('.rv');
  if (items.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      items.forEach(function (el, i) {
        el.style.transitionDelay = (Math.min(i, 4) * 55) + 'ms';
        io.observe(el);
      });
    } else {
      items.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ---------- calculator ---------- */
  var calc = document.getElementById('calc');
  if (calc) {
    var typeEl = document.getElementById('calc-type');
    var areaEl = document.getElementById('calc-area');
    var thickEl = document.getElementById('calc-thick');
    var priceEl = document.getElementById('calc-price');
    var matEl = document.getElementById('calc-mat');
    var volEl = document.getElementById('calc-vol');
    var timeEl = document.getElementById('calc-time');

    // rate: BYN per m² for a 100 mm layer, density kg/m³
    var RATES = {
      floor:   { rate: 19, density: 42, label: 'перекрытие' },
      roof:    { rate: 22, density: 42, label: 'кровля' },
      wall:    { rate: 23, density: 62, label: 'каркасная стена' },
      cavity:  { rate: 20, density: 60, label: 'пустоты готовой стены' },
      wet:     { rate: 25, density: 68, label: 'влажное нанесение' },
      bath:    { rate: 21, density: 50, label: 'баня / гараж' }
    };

    var fmt = function (n) {
      return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    function recalc() {
      var cfg = RATES[typeEl.value] || RATES.wall;
      var area = parseFloat(areaEl.value) || 0;
      var thick = parseFloat(thickEl.value) || 100;

      var k = thick / 100;
      var lo = area * cfg.rate * k;
      var hi = lo * 1.18;
      var volume = area * (thick / 1000);
      var mass = volume * cfg.density;
      var days = Math.max(1, Math.ceil(area / 120));

      if (area <= 0) {
        priceEl.innerHTML = '— <small>BYN</small>';
        matEl.textContent = '0 кг';
        volEl.textContent = '0 м³';
        timeEl.textContent = '1 день';
        return;
      }

      priceEl.innerHTML = fmt(lo) + '–' + fmt(hi) + ' <small>BYN</small>';
      matEl.textContent = fmt(mass) + ' кг';
      volEl.textContent = volume.toFixed(1).replace('.', ',') + ' м³';
      timeEl.textContent = days + (days === 1 ? ' день' : (days < 5 ? ' дня' : ' дней'));
    }

    [typeEl, areaEl, thickEl].forEach(function (el) {
      el.addEventListener('input', recalc);
      el.addEventListener('change', recalc);
    });
    recalc();
  }

  /* ---------- year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
