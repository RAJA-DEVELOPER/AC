/* ==========================================================================
   ArcticCool HVAC — Enterprise Admin Dashboard JS
   State Management, Real-time Operations Simulation & Control Flow
   ========================================================================== */

'use strict';

// ── Mock Database State ──
const AdminState = {
  activeView: 'overview',
  stats: {
    monthlyRevenue: 3842000,
    activeWorkOrders: 48,
    deployedTechs: 36,
    totalTechs: 42,
    firstTimeFixRate: 94.2,
    amcContractValue: 12400000,
    pendingInvoices: 342000
  },
  workOrders: [
    { id: 'WO-9842', customer: 'Prestige Heights Tower A', phone: '+91 98201 11223', type: 'Commercial VRV Overhaul', city: 'Mumbai', priority: 'urgent', status: 'In Progress', tech: 'Arjun Kumar', date: 'Today, 11:30 AM', amount: '₹18,500' },
    { id: 'WO-9841', customer: 'Dr. Ananya Roy', phone: '+91 98199 44332', type: 'Split AC Gas Charging (R32)', city: 'Mumbai', priority: 'normal', status: 'Assigned', tech: 'Ravi Shankar', date: 'Today, 01:00 PM', amount: '₹1,500' },
    { id: 'WO-9840', customer: 'Nexus Infotech Park', phone: '+91 99300 77889', type: 'Quarterly AMC Duct Cleaning', city: 'Bengaluru', priority: 'normal', status: 'In Progress', tech: 'Deepak Verma', date: 'Today, 10:00 AM', amount: '₹42,000' },
    { id: 'WO-9839', customer: 'Vikramaditya Oberoi', phone: '+91 98210 55667', type: '3x Cassette AC Installation', city: 'Delhi NCR', priority: 'normal', status: 'Pending', tech: 'Unassigned', date: 'Today, 03:30 PM', amount: '₹8,490' },
    { id: 'WO-9838', customer: 'Oberoi Sky Heights #14B', phone: '+91 98205 99881', type: 'Inverter PCB Diagnostic', city: 'Mumbai', priority: 'urgent', status: 'Assigned', tech: 'Suresh Pillai', date: 'Today, 02:00 PM', amount: '₹2,800' },
    { id: 'WO-9837', customer: 'Kiran Mehta & Co.', phone: '+91 98112 33445', type: 'Emergency Compressor Leakage', city: 'Pune', priority: 'urgent', status: 'In Progress', tech: 'Arjun Kumar', date: 'Today, 09:15 AM', amount: '₹6,200' },
    { id: 'WO-9836', customer: 'Godrej Woods Flat 304', phone: '+91 97690 12345', type: 'Annual Gold AMC Service', city: 'Mumbai', priority: 'normal', status: 'Completed', tech: 'Ravi Shankar', date: 'Yesterday', amount: '₹0 (AMC)' },
    { id: 'WO-9835', customer: 'Apollo Clinic Reception', phone: '+91 98200 44556', type: 'Coil Sanitization & Filter', city: 'Chennai', priority: 'normal', status: 'Completed', tech: 'Deepak Verma', date: 'Yesterday', amount: '₹3,400' }
  ],
  technicians: [
    { id: 'TECH-101', name: 'Arjun Kumar', role: 'Lead HVAC Specialist', rating: 4.9, jobsDone: 387, activeJob: 'WO-9842 (Prestige Heights)', status: 'In-Service', city: 'Mumbai', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&q=80' },
    { id: 'TECH-102', name: 'Ravi Shankar', role: 'Installation Lead', rating: 4.8, jobsDone: 241, activeJob: 'WO-9841 (Dr. Ananya Roy)', status: 'En Route', city: 'Mumbai', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&q=80' },
    { id: 'TECH-103', name: 'Deepak Verma', role: 'Commercial Chillers & VRV', rating: 4.9, jobsDone: 512, activeJob: 'WO-9840 (Nexus Infotech)', status: 'In-Service', city: 'Bengaluru', avatar: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=120&q=80' },
    { id: 'TECH-104', name: 'Suresh Pillai', role: 'PCB Diagnostics & Spares', rating: 4.7, jobsDone: 198, activeJob: 'WO-9838 (Oberoi Sky Heights)', status: 'En Route', city: 'Mumbai', avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=120&q=80' },
    { id: 'TECH-105', name: 'Manoj Deshmukh', role: 'Gas Charging & Leakage', rating: 4.8, jobsDone: 164, activeJob: 'Standby for Dispatch', status: 'Available', city: 'Pune', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80' },
    { id: 'TECH-106', name: 'Amitabh Sen', role: 'Ductwork & Airflow Tech', rating: 4.9, jobsDone: 289, activeJob: 'Standby for Dispatch', status: 'Available', city: 'Delhi NCR', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80' }
  ],
  inventory: [
    { sku: 'GAS-R32-10KG', name: 'Daikin R32 Eco Refrigerant (10kg)', category: 'Refrigerants', inStock: 14, minStock: 25, unit: 'Cylinders', cost: '₹3,200', status: 'Critical Low' },
    { sku: 'GAS-R410A-11KG', name: 'Honeywell R410A Cylinder (11.3kg)', category: 'Refrigerants', inStock: 38, minStock: 20, unit: 'Cylinders', cost: '₹4,100', status: 'Healthy' },
    { sku: 'COMP-DK-15T', name: 'Daikin 1.5T Inverter Rotary Compressor', category: 'Compressors', inStock: 8, minStock: 12, unit: 'Units', cost: '₹14,800', status: 'Low Stock' },
    { sku: 'PCB-LG-DUAL-INV', name: 'LG Dual Inverter Main PCB Motherboard', category: 'Electronics', inStock: 19, minStock: 10, unit: 'Boards', cost: '₹4,900', status: 'Healthy' },
    { sku: 'COP-PIPE-05IN', name: 'Seamless Copper Tubing 1/2" (50m Coil)', category: 'Piping', inStock: 45, minStock: 15, unit: 'Coils', cost: '₹5,600', status: 'Healthy' },
    { sku: 'MOT-BLOW-VOLT', name: 'Voltas Indoor Blower Cross-Flow Motor', category: 'Motors', inStock: 6, minStock: 10, unit: 'Units', cost: '₹1,850', status: 'Low Stock' }
  ]
};

// ── View Router ──
function initAdminNavigation() {
  const navLinks = document.querySelectorAll('.admin-nav-link[data-view]');
  const viewPanels = document.querySelectorAll('.admin-view-panel');

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetView = link.dataset.view;

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      viewPanels.forEach(panel => {
        if (panel.id === `view-${targetView}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      AdminState.activeView = targetView;
      window.location.hash = targetView;

      // Close mobile sidebar
      const sidebar = document.querySelector('.admin-sidebar');
      sidebar?.classList.remove('open');
    });
  });

  // Check URL Hash on Load
  const currentHash = window.location.hash.replace('#', '');
  if (currentHash) {
    const matchingLink = document.querySelector(`.admin-nav-link[data-view="${currentHash}"]`);
    if (matchingLink) matchingLink.click();
  }
}

// ── Sidebar Collapse / Mobile Drawer ──
function initSidebarControls() {
  const toggleBtn = document.getElementById('adminSidebarToggle');
  const sidebar = document.querySelector('.admin-sidebar');
  const shell = document.querySelector('.admin-shell');

  toggleBtn?.addEventListener('click', () => {
    if (window.innerWidth <= 900) {
      sidebar?.classList.toggle('open');
    } else {
      const isCollapsed = shell?.getAttribute('data-sidebar-collapsed') === 'true';
      shell?.setAttribute('data-sidebar-collapsed', !isCollapsed);
    }
  });
}

// ── Work Orders Table Filtering & Search ──
function renderWorkOrdersTable(filter = 'all', searchTerm = '') {
  const tbody = document.getElementById('workOrdersTableBody');
  if (!tbody) return;

  const normalizedSearch = searchTerm.toLowerCase().trim();

  const filtered = AdminState.workOrders.filter(order => {
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'urgent' ? order.priority === 'urgent' :
      filter.toLowerCase() === order.status.toLowerCase();

    const matchesSearch =
      order.id.toLowerCase().includes(normalizedSearch) ||
      order.customer.toLowerCase().includes(normalizedSearch) ||
      order.type.toLowerCase().includes(normalizedSearch) ||
      order.city.toLowerCase().includes(normalizedSearch) ||
      order.tech.toLowerCase().includes(normalizedSearch);

    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding: 3rem; color: var(--text-muted);">
          No work orders match the selected filter.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(order => {
    const pillClass =
      order.status === 'Completed' ? 'status-pill--completed' :
      order.status === 'In Progress' ? 'status-pill--inprogress' :
      order.status === 'Assigned' ? 'status-pill--assigned' :
      'status-pill--urgent';

    return `
      <tr data-order-id="${order.id}">
        <td><strong>${order.id}</strong></td>
        <td>
          <div style="font-weight:var(--fw-bold); color:var(--text-primary);">${order.customer}</div>
          <div style="font-size:10px; color:var(--text-muted);">${order.phone}</div>
        </td>
        <td>${order.type}</td>
        <td><span class="city-chip" style="padding:2px 8px; font-size:11px;">${order.city}</span></td>
        <td>
          ${order.priority === 'urgent' ? '<span style="color:#ef4444; font-weight:var(--fw-bold);"><svg class="ac-ico" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> High / Urgent</span>' : '<span style="color:var(--text-muted);">Normal</span>'}
        </td>
        <td>
          <span class="status-pill ${pillClass}">
            ● ${order.status}
          </span>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <div style="width:8px; height:8px; border-radius:50%; background: ${order.tech === 'Unassigned' ? '#ef4444' : '#10b981'};"></div>
            <span>${order.tech}</span>
          </div>
        </td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn--sm btn--outline" style="padding:4px 8px; font-size:11px;" onclick="openDispatchModal('${order.id}')">
              ${order.tech === 'Unassigned' ? 'Dispatch' : 'Reassign'}
            </button>
            <button class="btn btn--sm btn--ghost" style="padding:4px 8px; font-size:11px;" onclick="window.ArcticCool?.ToastManager.show('Invoice #${order.id} exported as PDF', 'success')">
              PDF
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function initWorkOrdersFilter() {
  const filterChips = document.querySelectorAll('.table-filter-group .filter-chip');
  const searchInput = document.getElementById('woTableSearch');

  let currentFilter = 'all';

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter || 'all';
      renderWorkOrdersTable(currentFilter, searchInput?.value || '');
    });
  });

  searchInput?.addEventListener('input', (e) => {
    renderWorkOrdersTable(currentFilter, e.target.value);
  });
}

// ── Interactive SVG Charts ──
function renderRevenueChart() {
  const container = document.getElementById('svgRevenueChart');
  if (!container) return;

  const points = [
    { x: 30, y: 160, val: '24.2L', day: 'Mon' },
    { x: 120, y: 130, val: '29.5L', day: 'Tue' },
    { x: 210, y: 145, val: '27.1L', day: 'Wed' },
    { x: 300, y: 90,  val: '36.8L', day: 'Thu' },
    { x: 390, y: 65,  val: '42.4L', day: 'Fri' },
    { x: 480, y: 40,  val: '48.9L', day: 'Sat' },
    { x: 570, y: 75,  val: '38.4L', day: 'Sun' }
  ];

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L 570 200 L 30 200 Z`;

  container.innerHTML = `
    <svg viewBox="0 0 600 220" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--arctic)" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="var(--teal)" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <!-- Gridlines -->
      <line x1="30" y1="50" x2="570" y2="50" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
      <line x1="30" y1="100" x2="570" y2="100" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
      <line x1="30" y1="150" x2="570" y2="150" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
      <line x1="30" y1="200" x2="570" y2="200" stroke="rgba(255,255,255,0.1)"/>

      <!-- Fill Area -->
      <path d="${areaD}" fill="url(#chartGrad)"/>
      <!-- Line Stroke -->
      <path d="${pathD}" fill="none" stroke="var(--arctic)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Data Points -->
      ${points.map(pt => `
        <g class="chart-point-group" style="cursor:pointer;" tabindex="0">
          <circle cx="${pt.x}" cy="${pt.y}" r="5" fill="var(--midnight)" stroke="var(--arctic)" stroke-width="3"/>
          <circle cx="${pt.x}" cy="${pt.y}" r="12" fill="var(--arctic)" fill-opacity="0" class="hover-hitarea"/>
          <text x="${pt.x}" y="215" text-anchor="middle" fill="var(--text-muted)" font-size="10">${pt.day}</text>
          <text x="${pt.x}" y="${pt.y - 12}" text-anchor="middle" fill="white" font-size="10" font-weight="bold" opacity="0.85">₹${pt.val}</text>
        </g>
      `).join('')}
    </svg>
  `;
}

// ── Real-Time Operations Feed Ticker ──
function initLiveEventTicker() {
  const tickerEl = document.getElementById('liveOperationsTicker');
  if (!tickerEl) return;

  const mockEvents = [
    'Technician Arjun Kumar reached Prestige Heights (Job #WO-9842) · ETA 25m',
    'Low Inventory Alert: Daikin R32 Cylinders down to 14 units at Central Hub',
    'New Urgent Booking: Emergency Chiller Leakage at Nexus IT Park, Pune',
    'Gold AMC Contract Renewed: Taj Lands End Suites (₹4.8L ARR)',
    'Customer Review: <svg class="ac-ico" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> 5.0 received for Technician Deepak Verma in Bengaluru',
    'Spare Dispatched: 1.5T Inverter Compressor delivered to Site #WO-9838'
  ];

  let eventIdx = 0;
  setInterval(() => {
    eventIdx = (eventIdx + 1) % mockEvents.length;
    tickerEl.style.opacity = '0';
    setTimeout(() => {
      tickerEl.textContent = mockEvents[eventIdx];
      tickerEl.style.opacity = '1';
    }, 300);
  }, 4500);
}

// ── Modals & Quick Action Dispatcher ──
function initAdminModals() {
  const dispatchModal = document.getElementById('dispatchJobModal');
  const addTechModal = document.getElementById('addTechModal');
  const restockModal = document.getElementById('restockModal');

  // Close buttons
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-modal-backdrop').forEach(m => m.classList.remove('open'));
    });
  });

  // Modal background click
  document.querySelectorAll('.admin-modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.remove('open');
    });
  });

  // Global Dispatch Job Submission
  const dispatchForm = document.getElementById('dispatchJobForm');
  dispatchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const orderId = document.getElementById('dispOrderId')?.value;
    const techName = document.getElementById('dispTechSelect')?.value;

    const targetOrder = AdminState.workOrders.find(o => o.id === orderId);
    if (targetOrder) {
      targetOrder.tech = techName;
      targetOrder.status = 'Assigned';
    }

    renderWorkOrdersTable();
    dispatchModal?.classList.remove('open');
    window.ArcticCool?.ToastManager.show(`Job ${orderId} assigned to ${techName} with live GPS dispatch!`, 'success', 4000);
  });

  // Add Technician Form
  const addTechForm = document.getElementById('addTechForm');
  addTechForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('newTechName')?.value;
    const city = document.getElementById('newTechCity')?.value;
    const role = document.getElementById('newTechRole')?.value;

    if (name) {
      AdminState.technicians.unshift({
        id: `TECH-${Math.floor(100 + Math.random() * 900)}`,
        name,
        role,
        rating: 5.0,
        jobsDone: 0,
        activeJob: 'Standby for Dispatch',
        status: 'Available',
        city,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80'
      });

      renderTechniciansGrid();
      addTechModal?.classList.remove('open');
      window.ArcticCool?.ToastManager.show(`Field Engineer ${name} onboarded successfully!`, 'success', 4000);
    }
  });

  // Restock Form
  const restockForm = document.getElementById('restockForm');
  restockForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const sku = document.getElementById('restockSku')?.value;
    const qty = parseInt(document.getElementById('restockQty')?.value) || 10;

    const item = AdminState.inventory.find(i => i.sku === sku);
    if (item) {
      item.inStock += qty;
      item.status = item.inStock >= item.minStock ? 'Healthy' : 'Low Stock';
    }

    renderInventoryGrid();
    restockModal?.classList.remove('open');
    window.ArcticCool?.ToastManager.show(`Purchase Order for ${qty} units of ${sku} placed with OEM Supplier!`, 'success', 4000);
  });
}

function openDispatchModal(orderId = '') {
  const modal = document.getElementById('dispatchJobModal');
  const input = document.getElementById('dispOrderId');
  if (input && orderId) input.value = orderId;
  modal?.classList.add('open');
}

function openAddTechModal() {
  document.getElementById('addTechModal')?.classList.add('open');
}

function openRestockModal(sku = '') {
  const modal = document.getElementById('restockModal');
  const select = document.getElementById('restockSku');
  if (select && sku) select.value = sku;
  modal?.classList.add('open');
}

// ── Render Technician Roster ──
function renderTechniciansGrid() {
  const container = document.getElementById('techniciansFleetGrid');
  if (!container) return;

  container.innerHTML = AdminState.technicians.map(tech => `
    <div class="tech-fleet-card">
      <div class="tech-fleet-top">
        <img src="${tech.avatar}" alt="${tech.name}" class="tech-fleet-avatar">
        <div style="flex:1;">
          <div style="font-weight:var(--fw-bold); font-size:var(--fs-md); color:var(--text-primary);">${tech.name}</div>
          <div style="font-size:var(--fs-xs); color:var(--arctic); margin-bottom:4px;">${tech.role}</div>
          <span class="badge ${tech.status === 'Available' ? 'badge--success' : 'badge--copper'}" style="font-size:10px;">
            ● ${tech.status}
          </span>
        </div>
      </div>
      <div class="tech-fleet-stats-row">
        <div>
          <div class="tech-fleet-stat-val"><svg class="ac-ico" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ${tech.rating}</div>
          <div class="tech-fleet-stat-lbl">Rating</div>
        </div>
        <div>
          <div class="tech-fleet-stat-val">${tech.jobsDone}</div>
          <div class="tech-fleet-stat-lbl">Jobs Fixed</div>
        </div>
        <div>
          <div class="tech-fleet-stat-val">${tech.city}</div>
          <div class="tech-fleet-stat-lbl">Hub</div>
        </div>
      </div>
      <div style="font-size:var(--fs-xs); color:var(--text-secondary); background:var(--bg-tertiary); padding:var(--sp-2) var(--sp-3); border-radius:var(--radius-md);">
        <strong>Current Task:</strong> ${tech.activeJob}
      </div>
      <div style="display:flex; gap:var(--sp-2);">
        <button class="btn btn--sm btn--primary btn--full" onclick="openDispatchModal()">Assign Work</button>
        <button class="btn btn--sm btn--ghost" onclick="window.ArcticCool?.ToastManager.show('Contacting ${tech.name} on secure channel...', 'info')"><svg class="ac-ico" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></button>
      </div>
    </div>
  `).join('');
}

// ── Render Inventory Grid ──
function renderInventoryGrid() {
  const container = document.getElementById('inventoryStockGrid');
  if (!container) return;

  container.innerHTML = AdminState.inventory.map(item => `
    <div class="stock-card ${item.status === 'Critical Low' ? 'low-stock' : ''}">
      <div>
        <div style="font-size:10px; color:var(--text-muted); font-family:monospace; margin-bottom:2px;">${item.sku}</div>
        <div class="stock-title">${item.name}</div>
        <div style="font-size:var(--fs-xs); color:var(--text-secondary); margin-bottom:var(--sp-3);">${item.category}</div>
        <span class="${item.status === 'Critical Low' ? 'stock-badge-low' : 'badge badge--success'}" style="font-size:10px;">
          ${item.status}
        </span>
      </div>
      <div>
        <div style="display:flex; justify-content:space-between; align-items:baseline; margin:var(--sp-3) 0;">
          <span style="font-size:var(--fs-2xl); font-weight:var(--fw-extrabold); color:var(--text-primary); font-family:var(--font-heading);">${item.inStock}</span>
          <span style="font-size:var(--fs-xs); color:var(--text-muted);">Min: ${item.minStock} ${item.unit}</span>
        </div>
        <div class="cat-progress-track" style="margin-bottom:var(--sp-4);">
          <div class="cat-progress-fill" style="width:${Math.min((item.inStock / item.minStock) * 50, 100)}%; background:${item.inStock < item.minStock ? '#ef4444' : 'var(--arctic)'};"></div>
        </div>
        <button class="btn btn--sm btn--outline btn--full" onclick="openRestockModal('${item.sku}')">
          Restock +
        </button>
      </div>
    </div>
  `).join('');
}

// ── Global Keyboard Shortcuts (`Ctrl+K`) ──
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('adminGlobalSearch');
      searchInput?.focus();
    }
  });
}

// ── Initialize Full Admin Suite ──
document.addEventListener('DOMContentLoaded', () => {
  initAdminNavigation();
  initSidebarControls();
  renderWorkOrdersTable();
  initWorkOrdersFilter();
  renderRevenueChart();
  initLiveEventTicker();
  initAdminModals();
  renderTechniciansGrid();
  renderInventoryGrid();
  initKeyboardShortcuts();
});
