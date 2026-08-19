/* ========================================
   ArcticCool HVAC — Dashboard JS
   ======================================== */

'use strict';

/* ── Navigation ── */
function initDashNav() {
  const navItems = document.querySelectorAll('.dash-nav-item[data-page]');
  const pages = document.querySelectorAll('.dash-page');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.page;

      navItems.forEach(n => n.classList.remove('active'));
      pages.forEach(p => p.classList.remove('active'));

      item.classList.add('active');
      const page = document.getElementById(target);
      if (page) page.classList.add('active');

      // Close mobile sidebar
      const sidebar = document.querySelector('.dash-sidebar');
      sidebar?.classList.remove('open');

      // Update URL hash
      history.pushState(null, '', `#${target}`);
    });
  });

  // Handle hash on load
  const hash = location.hash.slice(1);
  if (hash) {
    const item = document.querySelector(`[data-page="${hash}"]`);
    item?.click();
  }
}

/* ── Sidebar Toggle (Mobile) ── */
function initSidebarToggle() {
  const toggle = document.querySelector('.dash-sidebar-toggle');
  const sidebar = document.querySelector('.dash-sidebar');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

/* ── Booking Flow ── */
function initBookingFlow(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const steps = form.querySelectorAll('.booking-form-step');
  const progressSteps = form.querySelectorAll('.booking-step');
  const nextBtns = form.querySelectorAll('[data-next]');
  const prevBtns = form.querySelectorAll('[data-prev]');
  let current = 0;

  function showStep(index) {
    steps.forEach((s, i) => s.classList.toggle('active', i === index));
    progressSteps.forEach((s, i) => {
      s.classList.toggle('active', i === index);
      s.classList.toggle('done', i < index);
    });
    current = index;
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (current < steps.length - 1) showStep(current + 1);
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (current > 0) showStep(current - 1);
    });
  });

  showStep(0);
}

/* ── Service History Table ── */
function initServiceHistory() {
  const searchInput = document.querySelector('.dash-table-search input');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll('.service-history-row').forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

/* ── Notification Mark Read ── */
function initNotifications() {
  document.querySelectorAll('.notif-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.remove('unread');
      updateNotifCount();
    });
  });

  document.querySelector('.mark-all-read')?.addEventListener('click', () => {
    document.querySelectorAll('.notif-item.unread').forEach(i => i.classList.remove('unread'));
    updateNotifCount();
    window.ArcticCool?.ToastManager.show('All notifications marked as read', 'success');
  });
}

function updateNotifCount() {
  const count = document.querySelectorAll('.notif-item.unread').length;
  document.querySelectorAll('.notif-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? '' : 'none';
  });
  const badge = document.querySelector('.dash-nav-badge');
  if (badge) badge.textContent = count;
}

/* ── Settings Toggles ── */
function initSettings() {
  const emailNotif = document.getElementById('emailNotif');
  const smsNotif = document.getElementById('smsNotif');
  const darkModeSetting = document.getElementById('darkModeSetting');
  const rtlSetting = document.getElementById('rtlSetting');

  if (darkModeSetting) {
    darkModeSetting.checked = localStorage.getItem('ac_theme') === 'dark';
    darkModeSetting.addEventListener('change', () => {
      window.ArcticCool?.toggleTheme();
    });
  }

  if (rtlSetting) {
    rtlSetting.checked = localStorage.getItem('ac_dir') === 'rtl';
    rtlSetting.addEventListener('change', () => {
      window.ArcticCool?.toggleDir();
    });
  }

  if (emailNotif) {
    emailNotif.checked = localStorage.getItem('ac_email_notif') !== 'false';
    emailNotif.addEventListener('change', () => {
      localStorage.setItem('ac_email_notif', emailNotif.checked);
    });
  }

  if (smsNotif) {
    smsNotif.checked = localStorage.getItem('ac_sms_notif') !== 'false';
    smsNotif.addEventListener('change', () => {
      localStorage.setItem('ac_sms_notif', smsNotif.checked);
    });
  }
}

/* ── Profile Edit ── */
function initProfile() {
  const avatarEdit = document.querySelector('.profile-avatar-edit');
  const avatarInput = document.getElementById('avatarInput');

  if (avatarEdit && avatarInput) {
    avatarEdit.addEventListener('click', () => avatarInput.click());
    avatarInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        document.querySelectorAll('.profile-avatar, .dash-avatar').forEach(img => {
          img.src = ev.target.result;
        });
        window.ArcticCool?.ToastManager.show('Profile photo updated!', 'success');
      };
      reader.readAsDataURL(file);
    });
  }
}

/* ── AMC Progress Bar ── */
function initAMCProgress() {
  const bar = document.querySelector('.amc-bar');
  if (!bar) return;
  setTimeout(() => { bar.style.width = bar.dataset.progress || '60%'; }, 500);
}

/* ── Technician Tracker Animation ── */
function initTracker() {
  const techPin = document.querySelector('.tracker-pin--tech');
  if (!techPin) return;

  let x = 30, y = 60, dx = 0.3, dy = 0.15;

  setInterval(() => {
    x += dx + (Math.random() - 0.5) * 0.2;
    y += dy + (Math.random() - 0.5) * 0.1;
    if (x < 10 || x > 70) dx = -dx;
    if (y < 20 || y > 80) dy = -dy;
    techPin.style.left = x + '%';
    techPin.style.top  = y + '%';
  }, 2000);
}

/* ── Payment Chart (simple bar) ── */
function initPaymentChart() {
  const chartEl = document.getElementById('paymentChart');
  if (!chartEl) return;

  const data = [2400, 1800, 3200, 2900, 4100, 3600, 2800, 4800, 3900, 4200, 3100, 5200];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const max = Math.max(...data);

  chartEl.innerHTML = `
    <div class="chart-bars" style="display:flex;align-items:flex-end;gap:8px;height:160px;padding-bottom:24px;position:relative;">
      ${data.map((v, i) => `
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%;">
          <div style="flex:1;display:flex;align-items:flex-end;width:100%;">
            <div class="chart-bar" data-val="${v}" style="width:100%;height:0%;background:linear-gradient(180deg,var(--arctic),var(--teal));border-radius:4px 4px 0 0;transition:height 1s var(--ease-out);transition-delay:${i * 60}ms;" title="₹${v.toLocaleString()}"></div>
          </div>
          <span style="font-size:9px;color:var(--text-muted);white-space:nowrap;">${months[i]}</span>
        </div>
      `).join('')}
    </div>
  `;

  setTimeout(() => {
    chartEl.querySelectorAll('.chart-bar').forEach(bar => {
      const val = parseInt(bar.dataset.val);
      bar.style.height = (val / max * 100) + '%';
    });
  }, 200);
}

/* ── Init Dashboard ── */
function initDashboard() {
  initDashNav();
  initSidebarToggle();
  initBookingFlow('installBookingForm');
  initBookingFlow('serviceBookingForm');
  initServiceHistory();
  initNotifications();
  initSettings();
  initProfile();
  initAMCProgress();
  initTracker();
  initPaymentChart();
}

document.addEventListener('DOMContentLoaded', initDashboard);
