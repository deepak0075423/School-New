/* =========================================
   VIDYALAYA ERP — DASHBOARD JS
   ========================================= */

/* ---- Sidebar toggle (mobile) ---- */
function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
}

/* ---- Section switcher ---- */
function showSection(sec, el) {
  // Hide all sections
  document.querySelectorAll('.dash-content').forEach(s => s.style.display = 'none');
  const target = document.getElementById('sec-' + sec);
  if (target) target.style.display = 'block';

  // Determine role class for nav active state
  const page = document.querySelector('.dash-page');
  let activeClass = 'admin-active';
  if (page?.classList.contains('student-dash')) activeClass = 'student-active';
  else if (page?.classList.contains('parent-dash'))  activeClass = 'parent-active';
  else if (page?.classList.contains('teacher-dash')) activeClass = 'teacher-active';

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active', activeClass));
  if (el) el.classList.add('active', activeClass);

  // Update topbar title
  const titleEl = document.getElementById('topbarTitle');
  if (titleEl && el) titleEl.textContent = el.textContent.trim();

  // Close sidebar on mobile
  if (window.innerWidth < 768) {
    document.getElementById('sidebar')?.classList.remove('open');
  }
}

/* ---- Progress bar animation on scroll ---- */
const progObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.progress-fill').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0';
        requestAnimationFrame(() => {
          bar.style.transition = 'width .9s ease';
          bar.style.width = w;
        });
      });
      progObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.dash-card').forEach(card => progObserver.observe(card));

/* ---- Stat card count-up ---- */
function countUp(el, target, prefix = '', suffix = '') {
  let current = 0;
  const isFloat = target % 1 !== 0;
  const step = isFloat ? (target / 50) : Math.max(1, Math.ceil(target / 50));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
    if (current >= target) { el.textContent = prefix + target + suffix; clearInterval(timer); }
  }, 30);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-val').forEach(val => {
        const text = val.textContent.trim();
        const num  = parseFloat(text.replace(/[^0-9.]/g, ''));
        const pre  = text.match(/^[^0-9]*/)?.[0] || '';
        const suf  = text.match(/[^0-9.]+$/)?.[0] || '';
        if (!isNaN(num)) countUp(val, num, pre, suf);
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stats-row').forEach(row => statObserver.observe(row));

/* ---- Attendance mark toggle ---- */
function setAttend(rowIndex, status, btn) {
  const row = document.getElementById('arow' + rowIndex);
  if (!row) return;
  row.querySelectorAll('.attend-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
}

function markAll(status) {
  document.querySelectorAll('.attend-btn.' + status).forEach(b => {
    document.querySelectorAll('.attend-btn').forEach(all => all.classList.remove('sel'));
  });
  document.querySelectorAll('.attend-student-row').forEach((row, i) => {
    row.querySelectorAll('.attend-btn').forEach(b => b.classList.remove('sel'));
    const target = row.querySelector('.attend-btn.' + status);
    if (target) target.classList.add('sel');
  });
}

/* ---- Notification bell ---- */
document.querySelectorAll('.notif-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.querySelector('.notif-dot')?.remove();
  });
});

/* ---- Rating stars (appraisal) ---- */
document.querySelectorAll('.rating-star').forEach((star, idx, all) => {
  star.addEventListener('click', () => {
    all.forEach((s, i) => {
      s.style.color   = i <= idx ? '#F59E0B' : '';
      s.style.opacity = i <= idx ? '1' : '.3';
    });
  });
  star.addEventListener('mouseover', () => {
    all.forEach((s, i) => {
      s.style.color   = i <= idx ? '#F59E0B' : '';
      s.style.opacity = i <= idx ? '1' : '.3';
    });
  });
});

/* ---- Smooth page load ---- */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .35s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});

/* ---- Active nav highlight on load ---- */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('.dash-page');
  const firstNav = document.querySelector('.nav-item.active');
  if (firstNav && page) {
    let cls = 'admin-active';
    if (page.classList.contains('student-dash')) cls = 'student-active';
    else if (page.classList.contains('parent-dash'))  cls = 'parent-active';
    else if (page.classList.contains('teacher-dash')) cls = 'teacher-active';
    firstNav.classList.add(cls);
  }
});
