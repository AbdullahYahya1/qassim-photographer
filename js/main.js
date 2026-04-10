/* =============================================
   QASSIM PHOTOGRAPHER - Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // === PRELOADER ===
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 800);
  });

  // === AOS INIT ===
  AOS.init({
    duration: 900,
    once: true,
    offset: 80,
    easing: 'ease-out-cubic',
  });

  // === NAVBAR SCROLL ===
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    // Back to top
    backToTop.classList.toggle('visible', window.scrollY > 500);
    // Active nav link
    updateActiveNav();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // === MOBILE MENU ===
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });

  // === ACTIVE NAV LINK ===
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (navLink) {
        navLink.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  }

  // === BACK TO TOP ===
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // === COUNTER ANIMATION ===
  const counters = document.querySelectorAll('.stat-num');
  let counted = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        counters.forEach(counter => {
          const target = parseInt(counter.dataset.count);
          let current = 0;
          const increment = target / 80;
          const update = () => {
            current += increment;
            if (current < target) {
              counter.textContent = Math.ceil(current);
              requestAnimationFrame(update);
            } else {
              counter.textContent = target;
            }
          };
          update();
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) countObserver.observe(heroStats);

  // === SKILL BARS ===
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const aboutSection = document.querySelector('.about');
  if (aboutSection) skillObserver.observe(aboutSection);

  // === PORTFOLIO FILTER ===
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach((item, i) => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`;
        if (show) {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
          item.style.display = '';
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            if (item.dataset.category !== filter && filter !== 'all') {
              item.style.display = 'none';
            }
          }, 400);
        }
      });
    });
  });

  // === GLIGHTBOX ===
  const lightbox = GLightbox({
    touchNavigation: true,
    loop: true,
    autoplayVideos: true,
    openEffect: 'zoom',
    closeEffect: 'fade',
  });

  // === CONTACT FORM (WhatsApp redirect) ===
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const service = document.getElementById('service');
      const serviceText = service.options[service.selectedIndex].text;
      const date = document.getElementById('date').value;
      const message = document.getElementById('message').value.trim();

      if (!name || !phone) {
        showNotification('يرجى ملء الحقول المطلوبة', 'error');
        return;
      }

      const whatsappNumber = '966500000000';
      let text = `مرحباً، أنا ${name}\n`;
      text += `📱 رقمي: ${phone}\n`;
      text += `🎯 الخدمة المطلوبة: ${serviceText}\n`;
      if (date) text += `📅 التاريخ المقترح: ${date}\n`;
      if (message) text += `📝 تفاصيل: ${message}\n`;
      text += `\nأرغب في الاستفسار عن خدمات التصوير.`;

      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
      window.open(whatsappURL, '_blank');

      showNotification('جاري التحويل إلى واتساب...', 'success');
      contactForm.reset();
    });
  }

  // === NOTIFICATION ===
  function showNotification(msg, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = msg;
    notification.style.cssText = `
      position: fixed;
      top: 90px;
      right: 20px;
      background: ${type === 'success' ? '#c9a84c' : '#e74c3c'};
      color: ${type === 'success' ? '#000' : '#fff'};
      padding: 14px 24px;
      border-radius: 8px;
      font-family: Cairo, sans-serif;
      font-weight: 600;
      font-size: 0.95rem;
      z-index: 9999;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      animation: slideInRight 0.4s ease;
    `;
    document.body.appendChild(notification);

    const style = document.createElement('style');
    style.textContent = `@keyframes slideInRight { from { transform: translateX(100%); opacity:0; } to { transform: translateX(0); opacity:1; } }`;
    document.head.appendChild(style);

    setTimeout(() => notification.remove(), 3500);
  }

  // === SMOOTH HOVER on hero ===
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 10;
      const y = (clientY / innerHeight - 0.5) * 10;
      const heroImg = heroSection.querySelector('.hero-bg-img');
      if (heroImg) {
        heroImg.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      const heroImg = heroSection.querySelector('.hero-bg-img');
      if (heroImg) heroImg.style.transform = 'scale(1.05)';
    });
  }

  // === LAZY IMAGE LOADING ===
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.transition = 'opacity 0.5s ease';
        img.style.opacity = '1';
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => {
    img.style.opacity = '0';
    imageObserver.observe(img);
  });

  // Initial call
  onScroll();
});
