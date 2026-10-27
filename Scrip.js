// ===== Element references =====
const yearSpan = document.getElementById('year');
const themeBtn = document.getElementById('theme-btn');
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const topBtn = document.getElementById('top-btn');
const typedEl = document.getElementById('typed');
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

// ===== 1. Year in footer =====
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ===== 2. Dark mode (remembers choice, falls back to system setting) =====
function applyTheme(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  if (themeBtn) themeBtn.textContent = isDark ? '☀️' : '🌙';
}

let savedTheme = null;
try { savedTheme = localStorage.getItem('theme'); } catch (e) {}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark);

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    applyTheme(isDark);
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
  });
}

// ===== 3. Mobile menu =====
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== 4. Typing effect =====
if (typedEl) {
  const words = ['Information Technology Student', 'Web Developer in Training', 'Future IT Professional'];
  let w = 0, c = 0, deleting = false;

  function type() {
    const word = words[w];
    typedEl.textContent = word.slice(0, c);

    if (!deleting && c < word.length) {
      c++;
      setTimeout(type, 80);
    } else if (!deleting) {
      deleting = true;
      setTimeout(type, 1500);
    } else if (c > 0) {
      c--;
      setTimeout(type, 40);
    } else {
      deleting = false;
      w = (w + 1) % words.length;
      setTimeout(type, 300);
    }
  }
  type();
}

// ===== 5. Scroll reveal =====
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

// ===== 6. Highlight current section in the nav =====
const sections = document.querySelectorAll('main section[id]');
const links = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => navObserver.observe(s));

// ===== 7. Back-to-top button =====
if (topBtn) {
  window.addEventListener('scroll', () => {
    topBtn.classList.toggle('show', window.scrollY > 400);
  });
  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== 8. Contact form (opens the visitor's email app, no backend needed) =====
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements['name'].value.trim();
    const message = form.elements['message'].value.trim();

    if (!name || !message) {
      statusEl.textContent = 'Please fill in both your name and message.';
      statusEl.className = 'form-status error';
      return;
    }

    const subject = encodeURIComponent('Portfolio message from ' + name);
    const body = encodeURIComponent(message + '\n\n— ' + name);
    window.location.href = 'mailto:gkentfelix@gmail.com?subject=' + subject + '&body=' + body;

    statusEl.textContent = 'Opening your email app… thank you for reaching out!';
    statusEl.className = 'form-status ok';
    form.reset();
  });
}
