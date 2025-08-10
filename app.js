// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle with localStorage (default dark)
(function () {
  const html = document.documentElement;
  const key = 'theme';
  const saved = localStorage.getItem(key);
  if (saved) html.setAttribute('data-theme', saved); // keep last choice

  document.getElementById('themeToggle').addEventListener('click', function () {
    const cur = html.getAttribute('data-theme') || 'dark';
    const next = cur === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem(key, next);
    this.innerHTML = next === 'dark'
      ? '<i class="bi bi-moon-stars"></i>'
      : '<i class="bi bi-sun"></i>';
  });
})();

// Smooth scroll for in-page links (jQuery)
$(document).on('click', 'a.nav-link, a[href^="#"]', function (e) {
  const target = $(this.getAttribute('href'));
  if (target.length) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: target.offset().top - 70 }, 450);
  }
});

// Active link change on scroll
const sections = $('section[id], header#home');
const navLinks = $('.navbar .nav-link');
$(window).on('scroll', function () {
  const scrollPos = $(document).scrollTop() + 80;
  sections.each(function () {
    const top = $(this).offset().top;
    const bottom = top + $(this).outerHeight();
    if (scrollPos >= top && scrollPos < bottom) {
      const id = $(this).attr('id');
      navLinks.removeClass('active');
      $('.navbar .nav-link[href="#' + id + '"]').addClass('active');
    }
  });
});

// Reveal-on-scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Project filters
$('.filters .btn').on('click', function () {
  $('.filters .btn').removeClass('active');
  $(this).addClass('active');
  const filter = $(this).data('filter');
  $('.project-card').each(function () {
    const cat = ($(this).data('category') || '').toString();
    $(this).toggle(filter === 'all' || cat.includes(filter));
  });
});

// Back to top
const $backToTop = $('#backToTop');
$(window).on('scroll', function () {
  $(this).scrollTop() > 400 ? $backToTop.fadeIn(150) : $backToTop.fadeOut(150);
});
$backToTop.on('click', () => $('html, body').animate({ scrollTop: 0 }, 450));

/* ===== Images modal & carousel =====
   Usage: button.btn-images[data-images="path1.jpg,path2.jpg,..."]
*/
const imagesModal = new bootstrap.Modal(document.getElementById('imagesModal'));
$('.btn-images').on('click', function () {
  const list = ($(this).data('images') || '').toString()
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const $ind = $('#carouselIndicators').empty();
  const $inner = $('#carouselInner').empty();

  list.forEach((src, i) => {
    // indicators
    $('<button/>', {
      type: 'button',
      'data-bs-target': '#imagesCarousel',
      'data-bs-slide-to': i,
      class: i === 0 ? 'active' : '',
      'aria-current': i === 0 ? 'true' : 'false',
      'aria-label': `Slide ${i + 1}`
    }).appendTo($ind);

    // slides
    const $item = $('<div/>', { class: 'carousel-item' + (i === 0 ? ' active' : '') });
    $('<img/>', { src, alt: `Project image ${i + 1}` }).appendTo($item);
    $item.appendTo($inner);
  });

  imagesModal.show();
});

// Contact form demo validation
$('#contactForm').on('submit', function (e) {
  const form = this;
  if (!form.checkValidity()) {
    e.preventDefault();
    e.stopPropagation();
    $(form).addClass('was-validated');
    return;
  }
  e.preventDefault();
  const btn = $(form).find('button[type="submit"]');
  const original = btn.html();
  btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Sending...');
  setTimeout(() => {
    btn.prop('disabled', false).html(original);
    $(form).removeClass('was-validated')[0].reset();
    alert('Thanks! I’ll get back to you soon. (Demo)');
  }, 900);
});

/* ===== CV Modal (View-first, download/link secondary) ===== */
const cvModal = new bootstrap.Modal(document.getElementById('cvModal'));
$('.btn-cv-view').on('click', function () {
  const url = $(this).data('cv');
  $('#cvFrame').attr('src', url);
  $('#cvDownload').attr('href', url);
  $('#cvOpen').attr('href', url);
  cvModal.show();
});
document.getElementById('cvModal').addEventListener('hidden.bs.modal', () => {
  $('#cvFrame').attr('src', '');
});
