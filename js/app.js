/* ==========================================================================
   RESTAURANT OS - MASTER CLIENT ENGINE & REACTIVE CONTROLLERS
   ========================================================================== */

(function () {
  'use strict';

  // Global App Controller
  const RestaurantApp = {
    currentRole: 'owner',
    currentBranch: 'lideta',
    activeView: 'control-center',
    posCart: [],
    posActiveOrderType: 'Dine-in',
    posSelectedTable: null,
    posSelectedCustomerId: '',
    posAppliedDiscount: 0, // percentage e.g. 10
    audioEnabled: true,
    charts: {},

    // Initialize the entire system
    init() {
      console.log("🚀 Initializing RESTAURANT OS Ethiopian Engine...");
      this.bindDOM();
      this.bindNavigation();
      this.bindRoleSwitcher();
      this.bindBranchSelector();
      this.bindPOS();
      this.bindKDS();
      this.bindFloorPlan();
      this.bindAIAssistant();
      this.bindModals();
      this.bindStaffAttendance();
      this.bindOpeningClosing();
      this.bindPurchasingAndInventory();

      // Render all views
      this.renderCurrentRoleUI();
      this.renderControlCenter();
      this.renderOwnerDashboard();
      this.renderManagerOps();
      this.renderPOSCatalog();
      this.renderKDSBoard();
      this.renderBaristaKDS();
      this.renderWaiterTerminal();
      this.renderFloorPlan();
      this.renderMenuManagement();
      this.renderRecipesBOM();
      this.renderInventory();
      this.renderPurchasing();
      this.renderSuppliers();
      this.renderExpenses();
      this.renderStaffRoster();
      this.renderTasks();
      this.renderHygieneAndMaintenance();
      this.renderReservations();
      this.renderCustomersCRM();
      this.renderDeliveryDispatch();
      this.renderComplaints();
      this.renderAutomations();
      this.renderAuditLogs();
      this.renderKitchenEfficiency();
      this.renderCashierHome();
      this.renderKitchenHome();
      this.updateTickerAndBadges();

      // Start live real-time simulation interval (increments kitchen timers, feeds telemetry)
      this.startRealtimeEngine();
      this.showToast("RESTAURANT OS ready. All 16 modules initialized.", "info");
    },

    // DOM Element Cache
    bindDOM() {
      this.dom = {
        roleSelector: document.getElementById('roleSelector'),
        branchSelector: document.getElementById('branchSelector'),
        sidebarToggleBtn: document.getElementById('sidebarToggleBtn'),
        appSidebar: document.getElementById('appSidebar'),
        currentUserName: document.getElementById('currentUserName'),
        currentUserRoleTag: document.getElementById('currentUserRoleTag'),
        currentUserAvatar: document.getElementById('currentUserAvatar'),
        audioToggleBtn: document.getElementById('audioToggleBtn'),
        btnOpenAI: document.getElementById('btnOpenAI'),
        aiAssistantDrawer: document.getElementById('aiAssistantDrawer'),
        btnCloseAIDrawer: document.getElementById('btnCloseAIDrawer'),
        toastContainer: document.getElementById('toastContainer'),
        navItems: document.querySelectorAll('.sidebar-nav .nav-item'),
        viewPanels: document.querySelectorAll('.view-panel')
      };
    },

    // Sidebar & View Navigation Router
    bindNavigation() {
      const self = this;
      this.dom.sidebarToggleBtn.addEventListener('click', () => {
        this.dom.appSidebar.classList.toggle('collapsed');
      });

      this.dom.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const targetView = item.getAttribute('data-view');
          self.switchView(targetView);
        });
      });

      // Handle in-view links (e.g. View Full Menu buttons)
      document.querySelectorAll('[data-view-target]').forEach(el => {
        el.addEventListener('click', (e) => {
          const target = el.getAttribute('data-view-target');
          if (target) self.switchView(target);
        });
      });

      // Audio Toggle
      this.dom.audioToggleBtn.addEventListener('click', () => {
        this.audioEnabled = !this.audioEnabled;
        this.dom.audioToggleBtn.innerHTML = this.audioEnabled ? 
          '<i class="fa-solid fa-volume-high"></i>' : 
          '<i class="fa-solid fa-volume-xmark text-muted"></i>';
        this.showToast(this.audioEnabled ? "Audio alerts enabled" : "Audio alerts muted", "info");
      });
    },

    switchView(viewId) {
      // Role Access Security Guard
      const navItem = Array.from(this.dom.navItems).find(n => n.getAttribute('data-view') === viewId);
      if (navItem && navItem.hasAttribute('data-roles')) {
        const allowedRoles = navItem.getAttribute('data-roles').split(',').map(r => r.trim());
        if (!allowedRoles.includes(this.currentRole) && this.currentRole !== 'owner') {
          this.showToast(`Access Restricted: ${window.appStore.state.roles[this.currentRole]?.title || 'This role'} cannot view ${viewId}`, 'warning');
          return;
        }
      }

      this.activeView = viewId;
      this.dom.navItems.forEach(nav => {
        nav.classList.toggle('active', nav.getAttribute('data-view') === viewId);
      });

      this.dom.viewPanels.forEach(panel => {
        panel.classList.toggle('active', panel.id === `view-${viewId}`);
      });

      // Trigger redraw of charts when switching to dashboard or control center
      if (viewId === 'dashboard') {
        this.renderOwnerDashboardCharts();
      } else if (viewId === 'kitchen-performance') {
        this.renderKitchenPerfChart();
      } else if (viewId === 'cashier-home') {
        this.renderCashierHome();
      } else if (viewId === 'kitchen-home') {
        this.renderKitchenHome();
      }

      // Close mobile sidebar if open
      if (window.innerWidth <= 768) {
        this.dom.appSidebar.classList.add('collapsed');
      }
    },

    // 16 Role Switcher with Strict Access Control
    bindRoleSwitcher() {
      this.dom.roleSelector.addEventListener('change', (e) => {
        this.currentRole = e.target.value;
        this.renderCurrentRoleUI();
        this.showToast(`Active Workstation: ${window.appStore.state.roles[this.currentRole].title}`, "info");
      });
    },

    renderCurrentRoleUI() {
      const roleData = window.appStore.state.roles[this.currentRole] || window.appStore.state.roles.owner;
      this.dom.currentUserName.innerText = roleData.name;
      this.dom.currentUserRoleTag.innerText = roleData.badge;
      this.dom.currentUserAvatar.innerText = roleData.avatar;
      this.dom.roleSelector.value = this.currentRole;

      // 1. FILTER SIDEBAR NAVIGATION LINKS ACCORDING TO ROLE PERMISSIONS
      this.dom.navItems.forEach(item => {
        const rolesAttr = item.getAttribute('data-roles');
        if (rolesAttr) {
          const allowedRoles = rolesAttr.split(',').map(r => r.trim());
          if (allowedRoles.includes(this.currentRole) || this.currentRole === 'owner') {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        } else {
          item.style.display = 'flex';
        }
      });

      // 2. FILTER SIDEBAR SECTION TITLES
      document.querySelectorAll('.sidebar-section-title').forEach(section => {
        const rolesAttr = section.getAttribute('data-roles');
        if (rolesAttr) {
          const allowedRoles = rolesAttr.split(',').map(r => r.trim());
          if (allowedRoles.includes(this.currentRole) || this.currentRole === 'owner') {
            section.style.display = 'block';
          } else {
            section.style.display = 'none';
          }
        } else {
          section.style.display = 'block';
        }
      });

      // 3. TARGET PRIMARY OPERATIONAL LANDING VIEW PER ROLE
      if (this.currentRole === 'cashier') {
        this.switchView('cashier-home');
      } else if (this.currentRole === 'chef' || this.currentRole === 'kitchen_staff') {
        this.switchView('kitchen-home');
      } else if (this.currentRole === 'barista' || this.currentRole === 'bartender') {
        this.switchView('barista-station');
      } else if (this.currentRole === 'waiter') {
        this.switchView('waiter-hub');
      } else if (this.currentRole === 'storekeeper') {
        this.switchView('inventory');
      } else if (this.currentRole === 'purchasing') {
        this.switchView('purchasing');
      } else if (this.currentRole === 'accountant') {
        this.switchView('reports');
      } else if (this.currentRole === 'hr') {
        this.switchView('staff-attendance');
      } else if (this.currentRole === 'delivery') {
        this.switchView('delivery');
      } else if (this.currentRole === 'cleaner') {
        this.switchView('cleaning');
      } else if (this.currentRole === 'general_manager' || this.currentRole === 'branch_manager' || this.currentRole === 'supervisor') {
        this.switchView('manager-ops');
      } else {
        this.switchView('control-center');
      }

      // Apply navbar visibility rules for this role
      this.applyRoleNavbarContext();
    },

    // ── Apply role-specific top navbar context labels & visibility
    applyRoleNavbarContext() {
      const role = this.currentRole;
      const ticker = document.getElementById('operationalTicker');
      const aiBtn = document.getElementById('btnOpenAI');
      const newOrderBtn = document.getElementById('btnQuickNewOrder');
      const branchWrapper = document.querySelector('.branch-selector-wrapper');
      const state = window.appStore.state;

      // Update sidebar footer card depending on role
      this.updateSidebarFooter(role);

      if (role === 'cashier') {
        // Cashier: dedicated drawer & unpaid ticker, hide AI & branch selector, show POS button
        if (aiBtn) aiBtn.style.display = 'none';
        if (branchWrapper) branchWrapper.style.display = 'none';
        if (newOrderBtn) {
          newOrderBtn.style.display = 'inline-flex';
          newOrderBtn.innerHTML = '<i class="fa-solid fa-cash-register"></i> <span class="hide-mobile">Open POS</span>';
        }
        if (ticker) {
          ticker.style.display = 'flex';
          const unpaid = state.orders.filter(o => o.paymentStatus !== 'PAID' && o.status !== 'PAID' && o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;
          const cashSales = state.orders.filter(o => (o.paymentStatus === 'PAID' || o.status === 'PAID') && (o.paymentMethod === 'Cash' || !o.paymentMethod)).reduce((s, o) => s + (o.total || o.totalAmount || 0), 0);
          const opening = state.meta.activeShift?.openingFloat || 10000;
          const drawerTotal = opening + cashSales;
          ticker.innerHTML = `
            <div class="ticker-item"><span class="ticker-pulse green"></span> <strong style="color:var(--success);">${drawerTotal.toLocaleString()} ETB</strong> in Drawer</div>
            <div class="ticker-divider">|</div>
            <div class="ticker-item"><i class="fa-solid fa-clock text-warning"></i> <strong>${unpaid}</strong> Unpaid Bills</div>
            <div class="ticker-divider">|</div>
            <div class="ticker-item"><span class="status-badge badge-success">Day Shift #104 Active</span></div>
          `;
        }
      } else if (role === 'chef' || role === 'kitchen_staff') {
        // Kitchen: live queue ticker, hide AI, branch selector & new order button (kitchen cooks, POS orders)
        if (aiBtn) aiBtn.style.display = 'none';
        if (branchWrapper) branchWrapper.style.display = 'none';
        if (newOrderBtn) newOrderBtn.style.display = 'none';
        if (ticker) {
          ticker.style.display = 'flex';
          const inQueue = state.orders.filter(o => o.status === 'NEW' || o.status === 'PENDING').length;
          const cooking = state.orders.filter(o => o.status === 'PREPARING').length;
          const ready   = state.orders.filter(o => o.status === 'READY').length;
          ticker.innerHTML = `
            <div class="ticker-item"><span class="ticker-pulse green"></span> 👨‍🍳 <strong>Kitchen Screen</strong></div>
            <div class="ticker-divider">|</div>
            <div class="ticker-item"><i class="fa-solid fa-hourglass-start text-warning"></i> <strong>${inQueue}</strong> In Queue</div>
            <div class="ticker-divider">|</div>
            <div class="ticker-item"><i class="fa-solid fa-fire text-primary"></i> <strong>${cooking}</strong> Cooking</div>
            <div class="ticker-divider">|</div>
            <div class="ticker-item"><i class="fa-solid fa-bell-concierge text-success"></i> <strong>${ready}</strong> Ready</div>
          `;
        }
      } else if (role === 'barista' || role === 'bartender') {
        if (aiBtn) aiBtn.style.display = 'none';
        if (branchWrapper) branchWrapper.style.display = 'none';
        if (newOrderBtn) newOrderBtn.style.display = 'none';
        if (ticker) {
          ticker.style.display = 'flex';
          const bevOrders = state.orders.filter(o => (o.status === 'NEW' || o.status === 'PREPARING') && o.items.some(i => i.station === 'Barista' || i.station === 'Bar')).length;
          ticker.innerHTML = `
            <div class="ticker-item"><span class="ticker-pulse green"></span> ☕ <strong>Beverage Station</strong></div>
            <div class="ticker-divider">|</div>
            <div class="ticker-item"><i class="fa-solid fa-mug-hot text-warning"></i> <strong>${bevOrders}</strong> Active Drinks</div>
          `;
        }
      } else if (role === 'waiter') {
        if (aiBtn) aiBtn.style.display = 'none';
        if (branchWrapper) branchWrapper.style.display = 'none';
        if (newOrderBtn) {
          newOrderBtn.style.display = 'inline-flex';
          newOrderBtn.innerHTML = '<i class="fa-solid fa-plus"></i> <span class="hide-mobile">New Order</span>';
        }
        if (ticker) {
          ticker.style.display = 'flex';
          const readyOrders = state.orders.filter(o => o.status === 'READY').length;
          ticker.innerHTML = `
            <div class="ticker-item"><span class="ticker-pulse green"></span> 🍽️ <strong>Waiter Hub</strong></div>
            <div class="ticker-divider">|</div>
            <div class="ticker-item"><i class="fa-solid fa-bell text-success"></i> <strong>${readyOrders}</strong> Dishes Ready to Serve</div>
          `;
        }
      } else if (role === 'cleaner' || role === 'delivery') {
        if (ticker) ticker.style.display = 'none';
        if (aiBtn) aiBtn.style.display = 'none';
        if (newOrderBtn) newOrderBtn.style.display = 'none';
        if (branchWrapper) branchWrapper.style.display = 'none';
      } else {
        // Owner / managers: show everything with management ticker
        if (aiBtn) aiBtn.style.display = 'flex';
        if (branchWrapper) branchWrapper.style.display = 'flex';
        if (newOrderBtn) {
          newOrderBtn.style.display = 'inline-flex';
          newOrderBtn.innerHTML = '<i class="fa-solid fa-plus"></i> <span class="hide-mobile">New Order</span>';
        }
        if (ticker) {
          ticker.style.display = 'flex';
          const activeCount = state.orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;
          const occupiedCount = state.tables.filter(t => t.status === 'occupied').length;
          ticker.innerHTML = `
            <div class="ticker-item"><span class="ticker-pulse green"></span> <strong>${activeCount}</strong> Active Orders</div>
            <div class="ticker-divider">|</div>
            <div class="ticker-item"><i class="fa-solid fa-chair text-warning"></i> <strong>${occupiedCount}/${state.tables.length}</strong> Tables Busy</div>
            <div class="ticker-divider">|</div>
            <div class="ticker-item"><i class="fa-solid fa-coins text-success"></i> <strong>48,750</strong> ETB Today</div>
            <div class="ticker-divider">|</div>
            <div class="ticker-item"><span class="status-badge badge-warning"><i class="fa-solid fa-triangle-exclamation"></i> 1 Alert</span></div>
          `;
        }
      }
    },

    updateSidebarFooter(role) {
      const footerCard = document.querySelector('.shift-status-card');
      if (!footerCard) return;
      if (role === 'cashier') {
        footerCard.innerHTML = `
          <div class="shift-dot active" style="background:var(--success);"></div>
          <div class="shift-info">
            <div class="shift-title">Day Shift #104</div>
            <div class="shift-sub">Cashier: Bethlehem T.</div>
          </div>
          <button class="btn btn-xs btn-outline" onclick="window.RestaurantApp.openShiftClosingModal()" title="End Shift Reconcile">Close</button>
        `;
      } else if (role === 'chef' || role === 'kitchen_staff') {
        footerCard.innerHTML = `
          <div class="shift-dot active" style="background:var(--danger);"></div>
          <div class="shift-info">
            <div class="shift-title">Kitchen Station</div>
            <div class="shift-sub">${role === 'chef' ? 'Chef Hailemariam' : 'Birtukan Worku'}</div>
          </div>
          <button class="btn btn-xs btn-outline" onclick="window.RestaurantApp.playSound('ready')" title="Test Audio Bell">Chime</button>
        `;
      } else {
        footerCard.innerHTML = `
          <div class="shift-dot active"></div>
          <div class="shift-info">
            <div class="shift-title">Lideta Flagship</div>
            <div class="shift-sub">${window.appStore.state.roles[role]?.name || 'Staff User'}</div>
          </div>
          <button class="btn btn-xs btn-outline" onclick="window.RestaurantApp.openShiftClosingModal()" title="Shift Info">Shift</button>
        `;
      }
    },

    bindBranchSelector() {
      this.dom.branchSelector.addEventListener('change', (e) => {
        this.currentBranch = e.target.value;
        this.updateTickerAndBadges();
        this.renderControlCenter();
        this.renderOwnerDashboard();
        this.showToast(`Branch context switched: ${e.target.options[e.target.selectedIndex].text}`, "info");
      });
    },

    // Web Audio Synthesizer (Zero External Audio File Dependency)
    playSound(type = 'ding') {
      if (!this.audioEnabled) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        if (type === 'ding') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
          gain.gain.setValueAtTime(0.25, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.35);
        } else if (type === 'ready') {
          // Double chime
          [523.25, 659.25, 783.99].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
            gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.1 + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + idx * 0.1);
            osc.stop(ctx.currentTime + idx * 0.1 + 0.3);
          });
        } else if (type === 'alert') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(320, ctx.currentTime);
          osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.4);
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.45);
        }
      } catch (err) {
        console.warn("Audio playback not supported or user hasn't interacted yet:", err);
      }
    },

    showToast(message, type = 'success') {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      let icon = 'fa-check text-success';
      if (type === 'warning') icon = 'fa-triangle-exclamation text-warning';
      if (type === 'danger') icon = 'fa-circle-xmark text-danger';
      if (type === 'info') icon = 'fa-circle-info text-info';

      toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
      this.dom.toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    },

    // Record Immutable System Audit Event
    logAuditEvent(action, entity, details) {
      const roleObj = window.appStore.state.roles[this.currentRole] || { name: "System", title: "Automated" };
      const newLog = {
        time: new Date().toLocaleTimeString(),
        user: `${roleObj.name} (${roleObj.title})`,
        role: roleObj.title,
        action,
        entity,
        details,
        branch: "Lideta Flagship"
      };
      window.appStore.state.auditLogs.unshift(newLog);
      if (window.appStore.state.auditLogs.length > 50) window.appStore.state.auditLogs.pop();
      window.appStore.save();
      this.renderAuditLogs();
      this.renderControlCenterFeed();
    },

    // =========================================================================
    // MODULE 1: REAL-TIME CONTROL CENTER (MISSION CONTROL)
    // =========================================================================
    renderControlCenter() {
      const state = window.appStore.state;
      const totalSales = state.orders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.total, 48750);
      const activeOrdersCount = state.orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;
      const occupiedCount = state.tables.filter(t => t.status === 'occupied').length;
      const lowStockCount = state.inventory.filter(i => i.stock <= i.minThreshold).length;
      const delayedCount = state.orders.filter(o => o.status === 'PREPARING' && o.elapsedMinutes > 15).length;

      document.getElementById('ccSalesTotal').innerHTML = `${totalSales.toLocaleString()} <span class="currency-tag">ETB</span>`;
      document.getElementById('ccActiveOrders').innerText = activeOrdersCount;
      document.getElementById('ccTableOccupancy').innerText = `${Math.round((occupiedCount / state.tables.length) * 100)}%`;
      document.getElementById('ccDelayedOrdersCount').innerText = `${delayedCount} order delayed (>15m)`;
      document.getElementById('ccLowStockItems').innerText = `${lowStockCount} Items Low`;

      this.renderControlCenterFeed();
    },

    renderControlCenterFeed() {
      const state = window.appStore.state;
      const alertsContainer = document.getElementById('ccAlertsFeed');
      const eventsContainer = document.getElementById('ccLiveEventsTimeline');

      // Triage Alerts
      let alertsHTML = '';
      const delayedOrders = state.orders.filter(o => o.status === 'PREPARING' && o.elapsedMinutes > 15);
      delayedOrders.forEach(o => {
        alertsHTML += `
          <div class="alert-item critical">
            <i class="fa-solid fa-triangle-exclamation alert-icon"></i>
            <div style="flex:1;">
              <div class="alert-title-row">
                <span>🔴 Order #${o.orderNumber} Delayed (${o.elapsedMinutes} mins)</span>
                <span class="alert-time">Table ${o.tableName}</span>
              </div>
              <div>${o.items.map(i => `${i.qty}x ${i.name}`).join(', ')}</div>
            </div>
          </div>
        `;
      });

      const lowStockItems = state.inventory.filter(i => i.stock <= i.minThreshold);
      lowStockItems.forEach(i => {
        alertsHTML += `
          <div class="alert-item attention">
            <i class="fa-solid fa-boxes-stacked alert-icon"></i>
            <div style="flex:1;">
              <div class="alert-title-row">
                <span>🟡 Stock Alert: ${i.name} Low</span>
                <span class="alert-time">Only ${i.stock} ${i.unit} left</span>
              </div>
              <div>Minimum threshold is ${i.minThreshold} ${i.unit}. Auto purchase request triggered.</div>
            </div>
          </div>
        `;
      });

      alertsHTML += `
        <div class="alert-item normal">
          <i class="fa-solid fa-circle-check alert-icon"></i>
          <div style="flex:1;">
            <div class="alert-title-row">
              <span>🟢 POS & Kitchen Operations Steady</span>
              <span class="alert-time">Live Telemetry</span>
            </div>
            <div>All stations responsive, no gateway dropouts detected.</div>
          </div>
        </div>
      `;

      alertsContainer.innerHTML = alertsHTML;

      // Event Timeline
      let eventsHTML = '';
      state.auditLogs.slice(0, 8).forEach(log => {
        let iconClass = 'pos';
        let faIcon = 'fa-receipt';
        if (log.action.includes('KDS')) { iconClass = 'kitchen'; faIcon = 'fa-fire'; }
        if (log.action.includes('STOCK')) { iconClass = 'stock'; faIcon = 'fa-box'; }
        if (log.action.includes('DISCOUNT')) { iconClass = 'auth'; faIcon = 'fa-stamp'; }

        eventsHTML += `
          <div class="event-timeline-card">
            <div class="event-icon-box ${iconClass}"><i class="fa-solid ${faIcon}"></i></div>
            <div class="event-details">
              <div class="event-header-text">${log.user}</div>
              <div class="event-desc-text">${log.details}</div>
            </div>
            <div class="event-time-stamp">${log.time}</div>
          </div>
        `;
      });
      eventsContainer.innerHTML = eventsHTML;
    },

    // =========================================================================
    // MODULE 2: OWNER EXECUTIVE DASHBOARD & BI
    // =========================================================================
    renderOwnerDashboard() {
      const state = window.appStore.state;
      const topSellingTableBody = document.querySelector('#ownerTopSellingTable tbody');
      const branchTableBody = document.querySelector('#ownerBranchTable tbody');

      // Top 5 dishes
      let topDishesHTML = '';
      state.menuItems.slice(0, 5).forEach((item, idx) => {
        const qtySold = [42, 38, 29, 24, 18][idx] || 15;
        const revenue = qtySold * item.price;
        const margin = Math.round(((item.price - item.cost) / item.price) * 100);
        topDishesHTML += `
          <tr>
            <td><strong>${item.emoji} ${item.name}</strong></td>
            <td><span class="status-badge badge-info">${item.category}</span></td>
            <td><strong>${qtySold}</strong></td>
            <td><strong>${revenue.toLocaleString()} ETB</strong></td>
            <td><span class="status-badge badge-success">${margin}%</span></td>
          </tr>
        `;
      });
      topSellingTableBody.innerHTML = topDishesHTML;

      // Branch comparisons
      let branchHTML = '';
      state.branches.forEach(b => {
        branchHTML += `
          <tr>
            <td><strong>${b.name}</strong></td>
            <td><strong>${b.todaySales.toLocaleString()} ETB</strong></td>
            <td>${b.activeOrders} active</td>
            <td>14 mins avg</td>
            <td><span class="status-badge badge-success">Optimal</span></td>
          </tr>
        `;
      });
      branchTableBody.innerHTML = branchHTML;
      this.renderOwnerDashboardCharts();
    },

    renderOwnerDashboardCharts() {
      if (typeof Chart === 'undefined') return;

      // 1. Sales Trend Chart
      const salesCanvas = document.getElementById('ownerSalesTrendChart');
      if (salesCanvas) {
        if (this.charts.salesTrend) this.charts.salesTrend.destroy();
        this.charts.salesTrend = new Chart(salesCanvas, {
          type: 'line',
          data: {
            labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
            datasets: [
              {
                label: 'Gross Sales (ETB)',
                data: [4200, 8900, 24500, 31200, 34800, 41200, 48750, 52000],
                borderColor: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                fill: true,
                tension: 0.35,
                borderWidth: 3
              },
              {
                label: 'Food Cost (ETB)',
                data: [1400, 2900, 8100, 10300, 11500, 13600, 16100, 17200],
                borderColor: '#10b981',
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                tension: 0.35,
                borderWidth: 2
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
              y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
            }
          }
        });
      }

      // 2. Category Pie Chart
      const catCanvas = document.getElementById('ownerCategorySalesChart');
      if (catCanvas) {
        if (this.charts.categorySales) this.charts.categorySales.destroy();
        this.charts.categorySales = new Chart(catCanvas, {
          type: 'doughnut',
          data: {
            labels: ['Ethiopian Dishes', 'Burgers & Pizza', 'Traditional Coffee', 'Bar & Cocktails', 'Delivery Orders'],
            datasets: [{
              data: [42, 28, 14, 10, 6],
              backgroundColor: ['#f59e0b', '#38bdf8', '#8b5cf6', '#ec4899', '#10b981'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'right', labels: { color: '#94a3b8', font: { size: 11 } } }
            }
          }
        });
      }
    },

    // =========================================================================
    // MODULE 3: MANAGER OPERATIONS & APPROVALS
    // =========================================================================
    renderManagerOps() {
      const state = window.appStore.state;
      const approvalsList = document.getElementById('managerApprovalsList');

      let html = '';
      state.purchasingRequests.filter(pr => pr.status === 'PENDING_MANAGER_APPROVAL').forEach(pr => {
        html += `
          <div class="panel-card" style="margin-bottom:0;">
            <div class="panel-card-header">
              <span class="status-badge badge-warning">Purchase Request #${pr.id}</span>
              <strong class="text-primary">${pr.amount.toLocaleString()} ETB</strong>
            </div>
            <p><strong>Supplier:</strong> ${pr.supplier}</p>
            <p class="text-muted"><strong>Items:</strong> ${pr.items}</p>
            <p class="text-muted"><small>Requested by: ${pr.requestedBy}</small></p>
            <div style="display:flex; gap:8px; margin-top:10px;">
              <button class="btn btn-success btn-xs" onclick="window.RestaurantApp.approvePurchase('${pr.id}')">
                <i class="fa-solid fa-check"></i> Authorize & Dispatch PO
              </button>
              <button class="btn btn-outline btn-xs" onclick="window.RestaurantApp.rejectPurchase('${pr.id}')">
                <i class="fa-solid fa-xmark"></i> Reject
              </button>
            </div>
          </div>
        `;
      });

      // Discount / Refund Approval Example
      html += `
        <div class="panel-card" style="margin-bottom:0;">
          <div class="panel-card-header">
            <span class="status-badge badge-danger">Customer Refund Authorization</span>
            <strong class="text-danger">520.00 ETB</strong>
          </div>
          <p><strong>Table 12 (Yonas A.)</strong>: Meal delayed > 25 mins.</p>
          <p class="text-muted"><small>Requested by Bethlehem T. (Cashier)</small></p>
          <div style="display:flex; gap:8px; margin-top:10px;">
            <button class="btn btn-danger btn-xs" onclick="window.RestaurantApp.showToast('Refund of 520 ETB Authorized', 'success')">
              <i class="fa-solid fa-stamp"></i> Manager PIN Approve
            </button>
          </div>
        </div>
      `;

      approvalsList.innerHTML = html;
    },

    approvePurchase(prId) {
      const pr = window.appStore.state.purchasingRequests.find(p => p.id === prId);
      if (pr) {
        pr.status = 'APPROVED';
        window.appStore.save();
        this.logAuditEvent('PURCHASE_APPROVED', prId, `Manager authorized PO of ${pr.amount} ETB to ${pr.supplier}`);
        this.showToast(`Purchase Request #${prId} approved! Supplier order dispatched.`, 'success');
        this.renderManagerOps();
        this.renderPurchasing();
      }
    },

    rejectPurchase(prId) {
      const pr = window.appStore.state.purchasingRequests.find(p => p.id === prId);
      if (pr) {
        pr.status = 'REJECTED';
        window.appStore.save();
        this.logAuditEvent('PURCHASE_REJECTED', prId, `Manager rejected PO of ${pr.amount} ETB`);
        this.showToast(`Purchase Request #${prId} rejected.`, 'warning');
        this.renderManagerOps();
        this.renderPurchasing();
      }
    },

    // =========================================================================
    // MODULE 4: CASHIER POINT OF SALE (POS) & ORDER CREATION
    // =========================================================================
    bindPOS() {
      const self = this;

      // Category filter chips
      document.querySelectorAll('#posCategoryChips .category-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          document.querySelectorAll('#posCategoryChips .category-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          self.renderPOSCatalog(chip.getAttribute('data-cat'), document.getElementById('posSearchInput').value);
        });
      });

      // Search input
      document.getElementById('posSearchInput').addEventListener('input', (e) => {
        const activeCat = document.querySelector('#posCategoryChips .category-chip.active').getAttribute('data-cat');
        self.renderPOSCatalog(activeCat, e.target.value);
      });

      // Order Type Buttons
      document.querySelectorAll('.pos-order-type-selector .order-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.pos-order-type-selector .order-type-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          self.posActiveOrderType = btn.getAttribute('data-type');
          document.getElementById('posCartOrderType').innerText = self.posActiveOrderType;
        });
      });

      // Assign Table Button
      document.getElementById('btnSelectTableForOrder').addEventListener('click', () => {
        self.showTableSelectionModal();
      });

      // Clear Cart
      document.getElementById('btnClearCart').addEventListener('click', () => {
        if (self.posCart.length === 0) return;
        if (confirm("Are you sure you want to clear the current cart?")) {
          self.posCart = [];
          self.posAppliedDiscount = 0;
          self.posSelectedTable = null;
          self.renderPOSCart();
        }
      });

      // Apply Discount
      document.getElementById('btnApplyDiscount').addEventListener('click', () => {
        if (self.posCart.length === 0) {
          self.showToast("Add items to cart first", "warning");
          return;
        }
        const pct = prompt("Enter VIP / Staff Discount percentage (e.g. 10 or 15%):", "10");
        if (pct && !isNaN(pct)) {
          self.posAppliedDiscount = parseFloat(pct);
          self.renderPOSCart();
          self.logAuditEvent('DISCOUNT_ENTERED', 'CART', `Entered ${pct}% discount`);
          self.showToast(`Applied ${pct}% Discount`, 'success');
        }
      });

      // Send to Kitchen (Principle 41 Connected Flow)
      document.getElementById('btnSendToKitchen').addEventListener('click', () => {
        self.submitOrderToKitchen();
      });

      // Open Payment Checkout Modal
      document.getElementById('btnOpenPaymentModal').addEventListener('click', () => {
        if (self.posCart.length === 0) return;
        self.openPaymentModal();
      });

      // Customer select change
      document.getElementById('posCustomerSelect').addEventListener('change', (e) => {
        self.posSelectedCustomerId = e.target.value;
      });

      // Quick top nav new order button
      document.getElementById('btnQuickNewOrder').addEventListener('click', () => {
        self.switchView('pos');
        document.getElementById('posSearchInput').focus();
      });
    },

    renderPOSCatalog(category = 'all', query = '') {
      const grid = document.getElementById('posProductsGrid');
      const state = window.appStore.state;
      let filtered = state.menuItems;

      if (category !== 'all') {
        filtered = filtered.filter(item => item.category === category);
      }

      if (query.trim()) {
        const q = query.toLowerCase();
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(q) || 
          item.category.toLowerCase().includes(q) || 
          item.description.toLowerCase().includes(q)
        );
      }

      let html = '';
      filtered.forEach(product => {
        const is86 = product.isAvailable === false;
        html += `
          <div class="pos-product-card" style="${is86 ? 'opacity:0.55; position:relative;' : 'position:relative;'}" onclick="window.RestaurantApp.addItemToPOSCart('${product.id}')">
            ${is86 ? '<span style="position:absolute; top:8px; right:8px; background:var(--danger); color:#fff; font-size:0.65rem; font-weight:800; padding:2px 6px; border-radius:4px;"><i class="fa-solid fa-ban"></i> 86 OUT</span>' : ''}
            <div>
              <div class="product-emoji-icon">${product.emoji}</div>
              <div class="product-card-name">${product.name}</div>
              <div class="product-card-desc">${product.description}</div>
            </div>
            <div class="product-card-footer">
              <span class="product-price">${product.price.toLocaleString()} ETB</span>
              <span class="product-station-badge"><i class="fa-solid fa-fire"></i> ${product.station}</span>
            </div>
          </div>
        `;
      });

      grid.innerHTML = html || '<div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-muted);">No dishes match your search.</div>';
    },

    addItemToPOSCart(productId) {
      const product = window.appStore.state.menuItems.find(m => m.id === productId);
      if (!product) return;

      if (product.isAvailable === false) {
        this.showToast(`⚠️ "${product.name}" is marked 86 (Out of Stock) in the kitchen!`, 'warning');
        this.playSound('ding');
        return;
      }

      const existing = this.posCart.find(i => i.id === productId);
      if (existing) {
        existing.qty += 1;
      } else {
        this.posCart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          station: product.station,
          qty: 1,
          specialNote: ''
        });
      }

      this.playSound('ding');
      this.renderPOSCart();
    },

    updateCartItemQty(index, delta) {
      if (!this.posCart[index]) return;
      this.posCart[index].qty += delta;
      if (this.posCart[index].qty <= 0) {
        this.posCart.splice(index, 1);
      }
      this.renderPOSCart();
    },

    setCartItemNote(index) {
      if (!this.posCart[index]) return;
      const note = prompt("Enter special kitchen/bar instructions (e.g. No onion, Extra spicy, Less sugar):", this.posCart[index].specialNote);
      if (note !== null) {
        this.posCart[index].specialNote = note;
        this.renderPOSCart();
      }
    },

    renderPOSCart() {
      const container = document.getElementById('posCartItemsList');
      const subtotalEl = document.getElementById('posSubtotal');
      const vatEl = document.getElementById('posVat');
      const serviceEl = document.getElementById('posServiceCharge');
      const grandTotalEl = document.getElementById('posGrandTotal');
      const payAmountEl = document.getElementById('btnPayAmount');
      const checkoutBtn = document.getElementById('btnOpenPaymentModal');
      const discountRow = document.getElementById('posDiscountRow');
      const discountAmtEl = document.getElementById('posDiscountAmount');
      const discountPctEl = document.getElementById('posDiscountPercent');

      if (this.posCart.length === 0) {
        container.innerHTML = `
          <div class="empty-cart-message">
            <i class="fa-solid fa-cart-shopping"></i>
            <p>Cart is currently empty.</p>
            <span>Select items from the menu to start order</span>
          </div>
        `;
        subtotalEl.innerText = "0.00 ETB";
        vatEl.innerText = "0.00 ETB";
        serviceEl.innerText = "0.00 ETB";
        grandTotalEl.innerText = "0.00 ETB";
        payAmountEl.innerText = "0.00 ETB";
        discountRow.style.display = 'none';
        checkoutBtn.disabled = true;
        return;
      }

      let subtotal = 0;
      let html = '';

      this.posCart.forEach((item, idx) => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        html += `
          <div class="cart-item-row">
            <div class="cart-item-top">
              <span class="cart-item-name">${item.name}</span>
              <span class="cart-item-price">${itemTotal.toLocaleString()} ETB</span>
            </div>
            ${item.specialNote ? `<div class="cart-item-instructions"><i class="fa-solid fa-pen"></i> "${item.specialNote}"</div>` : ''}
            <div class="cart-item-controls">
              <button class="btn btn-xs btn-outline" onclick="window.RestaurantApp.setCartItemNote(${idx})">
                <i class="fa-solid fa-note-sticky"></i> Note
              </button>
              <div class="qty-counter">
                <button class="qty-btn" onclick="window.RestaurantApp.updateCartItemQty(${idx}, -1)">-</button>
                <span class="qty-number">${item.qty}</span>
                <button class="qty-btn" onclick="window.RestaurantApp.updateCartItemQty(${idx}, 1)">+</button>
              </div>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;

      // Calculate Ethiopian Tax (15% VAT) and 10% Service Charge
      const vat = subtotal * 0.15;
      const serviceCharge = subtotal * 0.10;
      let discountAmount = 0;

      if (this.posAppliedDiscount > 0) {
        discountAmount = (subtotal + vat + serviceCharge) * (this.posAppliedDiscount / 100);
        discountRow.style.display = 'flex';
        discountPctEl.innerText = `${this.posAppliedDiscount}%`;
        discountAmtEl.innerText = `-${discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB`;
      } else {
        discountRow.style.display = 'none';
      }

      const grandTotal = Math.max(0, (subtotal + vat + serviceCharge) - discountAmount);

      subtotalEl.innerText = `${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB`;
      vatEl.innerText = `${vat.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB`;
      serviceEl.innerText = `${serviceCharge.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB`;
      grandTotalEl.innerText = `${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB`;
      payAmountEl.innerText = `${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB`;
      checkoutBtn.disabled = false;
    },

    showTableSelectionModal() {
      const self = this;
      const state = window.appStore.state;
      let bodyHtml = `
        <p class="text-secondary mb-3">Select a dining table to assign this order:</p>
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px;">
      `;

      state.tables.forEach(t => {
        const color = t.status === 'available' ? 'var(--success)' : (t.status === 'occupied' ? 'var(--danger)' : 'var(--warning)');
        bodyHtml += `
          <button class="btn btn-outline" style="border-color:${color}; padding:14px; text-align:center;" onclick="window.RestaurantApp.assignTableToCart('${t.id}')">
            <strong>${t.name}</strong><br>
            <small style="color:${color}">${t.status.toUpperCase()}</small>
          </button>
        `;
      });

      bodyHtml += `</div>`;
      this.showGenericModal("Assign Table", bodyHtml);
    },

    assignTableToCart(tableId) {
      const table = window.appStore.state.tables.find(t => t.id === tableId);
      if (table) {
        this.posSelectedTable = table;
        document.getElementById('posCartTableLabel').innerHTML = `Table: <strong class="text-primary">${table.name}</strong>`;
        this.closeGenericModal();
        this.showToast(`Assigned ${table.name} to order`, 'info');
      }
    },

    // Principle 41 Connected Flow: Submitting Order to Kitchen & Deducting Ingredients
    submitOrderToKitchen() {
      if (this.posCart.length === 0) {
        this.showToast("Cannot send empty order to kitchen", "warning");
        return;
      }

      const state = window.appStore.state;
      const orderNumber = 1000 + state.orders.length + 1;
      const orderId = `ORD-${orderNumber}`;

      // Calculate totals
      let subtotal = 0;
      this.posCart.forEach(i => subtotal += i.price * i.qty);
      const vat = subtotal * 0.15;
      const service = subtotal * 0.10;
      const total = subtotal + vat + service;

      const newOrder = {
        id: orderId,
        orderNumber,
        type: this.posActiveOrderType,
        tableId: this.posSelectedTable ? this.posSelectedTable.id : 'TAKEOUT',
        tableName: this.posSelectedTable ? this.posSelectedTable.name : 'Takeaway / Delivery',
        waiter: state.roles[this.currentRole].name || "Ephrem Tefera",
        customer: this.posSelectedCustomerId ? "VIP Guest" : "Walk-in Guest",
        status: "NEW",
        station: "Kitchen",
        priority: "NORMAL",
        timeReceived: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        elapsedMinutes: 0,
        items: JSON.parse(JSON.stringify(this.posCart)),
        subtotal,
        vat,
        serviceCharge: service,
        total,
        paymentStatus: "UNPAID",
        paymentMethod: null
      };

      // 1. Add to orders list
      state.orders.unshift(newOrder);

      // 2. If Dine-in, mark table as Occupied
      if (this.posSelectedTable) {
        const table = state.tables.find(t => t.id === this.posSelectedTable.id);
        if (table) {
          table.status = 'occupied';
          table.orderId = orderId;
          table.orderTotal = total;
          table.waiter = newOrder.waiter;
          table.durationMin = 1;
        }
      }

      // 3. RECIPE DEDUCTION ENGINE: Automatically deduct ingredients from live inventory
      this.posCart.forEach(cartItem => {
        const menuItem = state.menuItems.find(m => m.id === cartItem.id);
        if (menuItem && menuItem.recipe && menuItem.recipe.length > 0) {
          menuItem.recipe.forEach(recipeIng => {
            const invItem = state.inventory.find(i => i.id === recipeIng.ingredientId);
            if (invItem) {
              const deductAmount = recipeIng.qty * cartItem.qty;
              invItem.stock = Math.max(0, +(invItem.stock - deductAmount).toFixed(2));

              // Auto-trigger Low Stock Alert & Purchase Request if below minimum!
              if (invItem.stock <= invItem.minThreshold) {
                this.triggerLowStockAutomation(invItem);
              }
            }
          });
        }
      });

      // 4. Save and Log
      window.appStore.save();
      this.logAuditEvent('ORDER_CREATED', orderId, `Sent Order #${orderNumber} (${this.posCart.length} items, ${total.toLocaleString()} ETB) to preparation stations`);
      this.playSound('ready');

      // 5. Reset POS Cart
      this.posCart = [];
      this.posAppliedDiscount = 0;
      this.posSelectedTable = null;
      document.getElementById('posCartTableLabel').innerHTML = `Table: <strong>Not Assigned</strong>`;
      this.renderPOSCart();

      // 6. Refresh dependent modules
      this.renderKDSBoard();
      this.renderBaristaKDS();
      this.renderFloorPlan();
      this.renderControlCenter();
      this.renderInventory();
      this.updateTickerAndBadges();

      this.showToast(`Order #${orderNumber} dispatched to Kitchen & Barista KDS!`, 'success');
    },

    triggerLowStockAutomation(invItem) {
      const state = window.appStore.state;
      // Check if PR already exists
      const existingPR = state.purchasingRequests.find(pr => pr.items.includes(invItem.name) && pr.status === 'PENDING_MANAGER_APPROVAL');
      if (!existingPR) {
        const newPR = {
          id: `PR-${900 + state.purchasingRequests.length + 1}`,
          requestedBy: "Auto Smart Engine (Low Stock Alert)",
          supplier: "Mojo Fresh Produce Cooperative",
          items: `Replenish 50 ${invItem.unit} ${invItem.name}`,
          amount: Math.round(50 * invItem.unitCost),
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: "PENDING_MANAGER_APPROVAL"
        };
        state.purchasingRequests.unshift(newPR);
        this.logAuditEvent('AUTO_PURCHASE_TRIGGERED', newPR.id, `Stock of ${invItem.name} (${invItem.stock} ${invItem.unit}) fell below minimum (${invItem.minThreshold} ${invItem.unit}). Generated PR #${newPR.id}`);
        this.showToast(`⚠️ Low stock on ${invItem.name}! Auto-generated Purchase Request #${newPR.id}`, 'warning');
      }
    },

    // =========================================================================
    // MODULE 5: PAYMENT SETTLEMENT & PRINTABLE THERMAL RECEIPT
    // =========================================================================
    openPaymentModal(orderToPay = null) {
      const modal = document.getElementById('paymentModalOverlay');
      const grandTotalDisplay = document.getElementById('payModalGrandTotal');
      const cashCalcGroup = document.getElementById('cashCalcGroup');
      const cashInput = document.getElementById('payCashTendered');
      const changeEl = document.getElementById('payChangeAmount');

      let amountToPay = 0;
      if (orderToPay) {
        this.currentPaymentOrder = orderToPay;
        amountToPay = orderToPay.total;
      } else {
        // From active POS cart
        let subtotal = 0;
        this.posCart.forEach(i => subtotal += i.price * i.qty);
        const vat = subtotal * 0.15;
        const service = subtotal * 0.10;
        const discount = this.posAppliedDiscount > 0 ? (subtotal + vat + service) * (this.posAppliedDiscount / 100) : 0;
        amountToPay = (subtotal + vat + service) - discount;
        this.currentPaymentOrder = null;
      }

      this.currentPayTotal = amountToPay;
      grandTotalDisplay.innerText = `${amountToPay.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB`;
      cashInput.value = Math.ceil(amountToPay);
      changeEl.innerText = "0.00 ETB";

      // Bind Cash change calculator
      cashInput.oninput = () => {
        const tendered = parseFloat(cashInput.value) || 0;
        const change = tendered - amountToPay;
        changeEl.innerText = `${Math.max(0, change).toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB`;
      };

      // Payment Method selection
      document.querySelectorAll('.pay-method-radio input').forEach(radio => {
        radio.onchange = () => {
          if (radio.value === 'Cash') {
            cashCalcGroup.style.display = 'block';
          } else {
            cashCalcGroup.style.display = 'none';
          }
        };
      });

      modal.classList.add('open');
    },

    bindModals() {
      const self = this;

      // Close Payment Modal
      document.getElementById('btnClosePaymentModal').onclick = () => {
        document.getElementById('paymentModalOverlay').classList.remove('open');
      };
      document.getElementById('btnCancelPayment').onclick = () => {
        document.getElementById('paymentModalOverlay').classList.remove('open');
      };

      // Confirm Payment & Print Receipt
      document.getElementById('btnConfirmPaymentAndPrint').onclick = () => {
        self.executePaymentSettlement();
      };

      // Close Receipt Modal
      document.getElementById('btnCloseReceiptModal').onclick = () => {
        document.getElementById('receiptModalOverlay').classList.remove('open');
      };
      document.getElementById('btnCloseReceiptDone').onclick = () => {
        document.getElementById('receiptModalOverlay').classList.remove('open');
      };
      document.getElementById('btnPrintReceiptHardware').onclick = () => {
        window.print();
      };

      // Generic Modal close
      document.getElementById('btnCloseGenericModal').onclick = () => {
        self.closeGenericModal();
      };

      // End Shift Modal
      document.getElementById('btnQuickShiftClose').onclick = () => {
        self.openShiftClosingModal();
      };
      document.getElementById('btnCloseShiftModal').onclick = () => {
        document.getElementById('shiftCloseModalOverlay').classList.remove('open');
      };
      document.getElementById('btnCancelShiftClose').onclick = () => {
        document.getElementById('shiftCloseModalOverlay').classList.remove('open');
      };
      document.getElementById('btnSubmitShiftZReport').onclick = () => {
        self.submitShiftZReport();
      };

      // Cashier Home Shift Close triggers
      const btnChClose = document.getElementById('btnCashierHomeShiftClose');
      if (btnChClose) btnChClose.onclick = () => self.openShiftClosingModal();
      const btnChClose2 = document.getElementById('btnCashierHomeShiftClose2');
      if (btnChClose2) btnChClose2.onclick = () => self.openShiftClosingModal();

      // Kitchen 86 Modal
      const btnK86Close = document.getElementById('btnCloseKitchen86Modal');
      if (btnK86Close) btnK86Close.onclick = () => document.getElementById('kitchen86ModalOverlay').classList.remove('open');
      const btnK86Done = document.getElementById('btnCloseKitchen86Done');
      if (btnK86Done) btnK86Done.onclick = () => document.getElementById('kitchen86ModalOverlay').classList.remove('open');

      // Cashier Drawer Modal
      const btnDrawerClose = document.getElementById('btnCloseCashierDrawerModal');
      if (btnDrawerClose) btnDrawerClose.onclick = () => document.getElementById('cashierDrawerModalOverlay').classList.remove('open');
      const btnDrawerDone = document.getElementById('btnCloseCashierDrawerDone');
      if (btnDrawerDone) btnDrawerDone.onclick = () => document.getElementById('cashierDrawerModalOverlay').classList.remove('open');
    },

    executePaymentSettlement() {
      const modal = document.getElementById('paymentModalOverlay');
      const selectedMethod = document.querySelector('input[name="payMethod"]:checked').value;
      const state = window.appStore.state;

      let paidOrder = this.currentPaymentOrder;

      if (!paidOrder) {
        // Create completed order from cart
        const orderNumber = 1000 + state.orders.length + 1;
        const orderId = `ORD-${orderNumber}`;
        let subtotal = 0;
        this.posCart.forEach(i => subtotal += i.price * i.qty);
        const vat = subtotal * 0.15;
        const service = subtotal * 0.10;
        const total = this.currentPayTotal;

        paidOrder = {
          id: orderId,
          orderNumber,
          type: this.posActiveOrderType,
          tableId: this.posSelectedTable ? this.posSelectedTable.id : 'COUNTER',
          tableName: this.posSelectedTable ? this.posSelectedTable.name : 'Takeaway / POS Counter',
          waiter: state.roles[this.currentRole].name || "Bethlehem Tadesse",
          customer: "Guest Customer",
          status: "COMPLETED",
          station: "Kitchen",
          priority: "NORMAL",
          timeReceived: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          elapsedMinutes: 0,
          items: JSON.parse(JSON.stringify(this.posCart)),
          subtotal,
          vat,
          serviceCharge: service,
          total,
          paymentStatus: "PAID",
          paymentMethod: selectedMethod
        };
        state.orders.unshift(paidOrder);

        // Reset cart
        this.posCart = [];
        this.posAppliedDiscount = 0;
        this.posSelectedTable = null;
        this.renderPOSCart();
      } else {
        paidOrder.status = "COMPLETED";
        paidOrder.paymentStatus = "PAID";
        paidOrder.paymentMethod = selectedMethod;

        // Release table
        if (paidOrder.tableId && paidOrder.tableId !== 'TAKEOUT' && paidOrder.tableId !== 'COUNTER') {
          const table = state.tables.find(t => t.id === paidOrder.tableId);
          if (table) {
            table.status = 'cleaning';
            table.orderId = null;
            table.orderTotal = 0;
            table.waiter = null;
          }
        }
      }

      window.appStore.save();
      modal.classList.remove('open');

      if (typeof confetti !== 'undefined') {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }

      this.logAuditEvent('PAYMENT_RECEIVED', paidOrder.id, `Settled ${paidOrder.total.toLocaleString()} ETB via ${selectedMethod} for Order #${paidOrder.orderNumber}`);
      this.showToast(`Payment of ${paidOrder.total.toLocaleString()} ETB received via ${selectedMethod}!`, 'success');

      // Generate & Display Thermal Receipt
      this.showThermalReceipt(paidOrder);
      this.renderFloorPlan();
      this.renderControlCenter();
      this.renderOwnerDashboard();
      this.renderCashierHome();
      this.applyRoleNavbarContext();
      this.updateTickerAndBadges();
    },

    showThermalReceipt(order) {
      const receiptContainer = document.getElementById('thermalReceiptContent');
      let itemsHTML = '';

      order.items.forEach(item => {
        itemsHTML += `
          <div class="receipt-item-row">
            <span>${item.qty}x ${item.name}</span>
            <span>${(item.price * item.qty).toLocaleString()} ETB</span>
          </div>
        `;
      });

      receiptContainer.innerHTML = `
        <div class="receipt-header">
          <div class="receipt-brand-title">RESTAURANT OS</div>
          <div>Lideta Flagship • Lideta Sub-City, Addis Ababa, Ethiopia</div>
          <div>TIN: 0049281920 • Tel: +251 11 550 1122</div>
          <div style="margin-top:6px; font-weight:700;">OFFICIAL TAX INVOICE / RECEIPT</div>
        </div>
        <div><strong>Receipt #:</strong> ${order.id}</div>
        <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()}</div>
        <div><strong>Table/Order:</strong> ${order.tableName} (${order.type})</div>
        <div><strong>Cashier:</strong> ${order.waiter}</div>
        
        <div class="receipt-line-items">
          ${itemsHTML}
        </div>

        <div class="receipt-totals">
          <div class="receipt-total-row"><span>Subtotal:</span> <span>${order.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB</span></div>
          <div class="receipt-total-row"><span>VAT (15%):</span> <span>${order.vat.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB</span></div>
          <div class="receipt-total-row"><span>Service Charge (10%):</span> <span>${order.serviceCharge.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB</span></div>
          <div class="receipt-total-row receipt-grand-total"><span>TOTAL PAID:</span> <span>${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB</span></div>
          <div class="receipt-total-row"><span>Payment Method:</span> <strong>${order.paymentMethod || 'Cash'}</strong></div>
        </div>

        <div class="receipt-footer-text">
          <p>*** THANK YOU FOR DINING WITH US ***</p>
          <p>Ameseginalehu! Please visit again.</p>
        </div>
      `;

      document.getElementById('receiptModalOverlay').classList.add('open');
    },

    // =========================================================================
    // MODULE 6: KITCHEN DISPLAY SYSTEM (KDS) CONTROLLER
    // =========================================================================
    bindKDS() {
      const self = this;
      document.querySelectorAll('.kds-filter-bar .station-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.kds-filter-bar .station-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          self.renderKDSBoard(tab.getAttribute('data-station'));
        });
      });
    },

    renderKDSBoard(stationFilter = 'all') {
      const state = window.appStore.state;
      let orders = state.orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');

      if (stationFilter !== 'all') {
        orders = orders.filter(o => o.station === stationFilter || o.items.some(i => i.station === stationFilter));
      }

      const listNew = document.getElementById('kdsListNew');
      const listPrep = document.getElementById('kdsListPreparing');
      const listReady = document.getElementById('kdsListReady');
      const listServed = document.getElementById('kdsListServed');

      const colNew = orders.filter(o => o.status === 'NEW');
      const colPrep = orders.filter(o => o.status === 'PREPARING');
      const colReady = orders.filter(o => o.status === 'READY');
      const colServed = orders.filter(o => o.status === 'SERVED');

      document.getElementById('kdsColNewCount').innerText = colNew.length;
      document.getElementById('kdsColPrepCount').innerText = colPrep.length;
      document.getElementById('kdsColReadyCount').innerText = colReady.length;
      document.getElementById('kdsColServedCount').innerText = colServed.length;

      listNew.innerHTML = this.buildKDSTicketsHTML(colNew, 'NEW');
      listPrep.innerHTML = this.buildKDSTicketsHTML(colPrep, 'PREPARING');
      listReady.innerHTML = this.buildKDSTicketsHTML(colReady, 'READY');
      listServed.innerHTML = this.buildKDSTicketsHTML(colServed, 'SERVED');
    },

    buildKDSTicketsHTML(tickets, statusColumn) {
      if (tickets.length === 0) {
        return '<div style="text-align:center; padding:30px; color:var(--text-muted); font-size:0.8rem;">No tickets</div>';
      }

      let html = '';
      tickets.forEach(order => {
        const isDelayed = order.elapsedMinutes > 15;
        let itemsListHTML = '';

        order.items.forEach(item => {
          itemsListHTML += `
            <div class="kds-item-row">
              <div><span class="kds-item-qty">${item.qty}x</span> <span class="kds-item-name">${item.name}</span></div>
              ${item.specialNote ? `<div class="kds-special-note"><i class="fa-solid fa-triangle-exclamation"></i> ${item.specialNote}</div>` : ''}
            </div>
          `;
        });

        let actionBtns = '';
        if (statusColumn === 'NEW') {
          actionBtns = `
            <button class="btn btn-warning btn-block btn-sm" onclick="window.RestaurantApp.transitionKDSOrder('${order.id}', 'PREPARING')">
              <i class="fa-solid fa-fire"></i> START PREPARATION
            </button>
          `;
        } else if (statusColumn === 'PREPARING') {
          actionBtns = `
            <button class="btn btn-success btn-block btn-sm" onclick="window.RestaurantApp.transitionKDSOrder('${order.id}', 'READY')">
              <i class="fa-solid fa-bell"></i> MARK READY (NOTIFY WAITER)
            </button>
          `;
        } else if (statusColumn === 'READY') {
          actionBtns = `
            <button class="btn btn-primary btn-block btn-sm" onclick="window.RestaurantApp.transitionKDSOrder('${order.id}', 'SERVED')">
              <i class="fa-solid fa-check-double"></i> MARK SERVED
            </button>
          `;
        } else if (statusColumn === 'SERVED') {
          actionBtns = `
            <button class="btn btn-secondary btn-block btn-xs" onclick="window.RestaurantApp.openPaymentModal(window.appStore.state.orders.find(o=>o.id==='${order.id}'))">
              <i class="fa-solid fa-receipt"></i> Settle Bill
            </button>
          `;
        }

        html += `
          <div class="kds-ticket-card ${isDelayed ? 'delayed' : ''}">
            <div class="kds-ticket-top">
              <div>
                <span class="kds-ticket-num">#${order.orderNumber}</span>
                <span class="kds-ticket-table">${order.tableName}</span>
              </div>
              <span class="kds-timer-badge ${isDelayed ? 'danger' : 'warning'}">
                <i class="fa-regular fa-clock"></i> ${order.elapsedMinutes}m
              </span>
            </div>
            
            <div class="kds-items-list">
              ${itemsListHTML}
            </div>

            <div class="kds-ticket-actions">
              ${actionBtns}
            </div>
          </div>
        `;
      });

      return html;
    },

    transitionKDSOrder(orderId, newStatus) {
      const order = window.appStore.state.orders.find(o => o.id === orderId);
      if (!order) return;

      order.status = newStatus;
      window.appStore.save();

      if (newStatus === 'READY') {
        this.playSound('ready');
        this.showToast(`Order #${order.orderNumber} is READY! Waiter ${order.waiter} notified.`, 'success');
        this.logAuditEvent('KDS_READY', orderId, `Kitchen marked Order #${order.orderNumber} as Ready`);
      } else if (newStatus === 'PREPARING') {
        this.playSound('ding');
        this.showToast(`Order #${order.orderNumber} started preparation`, 'info');
      }

      this.renderKDSBoard();
      this.renderBaristaKDS();
      this.renderWaiterTerminal();
      this.renderControlCenter();
      // Also refresh role home screens
      if (this.activeView === 'kitchen-home') this.renderKitchenHome();
      if (this.activeView === 'cashier-home')  this.renderCashierHome();
    },

    // Public alias so inline onclick buttons in Kitchen Home can call this
    updateKDSOrderStatus(orderId, newStatus) {
      this.transitionKDSOrder(orderId, newStatus);
    },

    // Open POS checkout for a specific unpaid order (from Cashier Home)
    openCheckoutForOrder(orderId) {
      const order = window.appStore.state.orders.find(o => o.id === orderId);
      if (!order) return;
      this.openPaymentModal(order);
    },

    // Settle first pending unpaid bill from Cashier Home
    settleFirstUnpaidOrder() {
      const state = window.appStore.state;
      const unpaid = state.orders.find(o => o.paymentStatus !== 'PAID' && o.status !== 'PAID' && o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
      if (unpaid) {
        this.openPaymentModal(unpaid);
      } else {
        this.showToast("No pending unpaid orders to settle! All tables cleared.", "info");
      }
    },

    // Reprint the most recent settled receipt
    reprintLastReceipt() {
      const state = window.appStore.state;
      const settled = state.orders.filter(o => o.paymentStatus === 'PAID' || o.status === 'PAID' || o.status === 'COMPLETED');
      if (settled.length > 0) {
        const lastOrder = settled[settled.length - 1];
        this.showThermalReceipt(lastOrder);
      } else {
        this.showToast("No settled receipts found for this shift yet.", "info");
      }
    },

    // View specific receipt
    printReceipt(orderId) {
      const order = window.appStore.state.orders.find(o => o.id === orderId);
      if (order) {
        this.showThermalReceipt(order);
      }
    },

    // Show live cash drawer float breakdown modal
    showDrawerCheckModal() {
      const modal = document.getElementById('cashierDrawerModalOverlay');
      if (!modal) return;
      const state = window.appStore.state;
      const opening = state.meta.activeShift?.openingFloat || 10000;
      const cashSales = state.orders.filter(o => (o.paymentStatus === 'PAID' || o.status === 'PAID') && (o.paymentMethod === 'Cash' || !o.paymentMethod)).reduce((s, o) => s + (o.total || o.totalAmount || 0), 0);
      const totalDrawer = opening + cashSales;

      const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
      setEl('drawerOpeningVal', `${opening.toLocaleString()}.00 ETB`);
      setEl('drawerCashSalesVal', `+${cashSales.toLocaleString()}.00 ETB`);
      setEl('drawerTotalCashVal', `${totalDrawer.toLocaleString()}.00 ETB`);

      modal.classList.add('open');
    },

    // Kitchen 86 / Out of Stock Manager
    openKitchen86Modal() {
      const modal = document.getElementById('kitchen86ModalOverlay');
      if (!modal) return;
      this.renderKitchen86List();
      modal.classList.add('open');
    },

    renderKitchen86List() {
      const listContainer = document.getElementById('kitchen86ItemsList');
      if (!listContainer) return;
      const items = window.appStore.state.menuItems;

      listContainer.innerHTML = items.map(item => {
        const isAvail = item.isAvailable !== false;
        return `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:1.4rem;">${item.emoji || '🍽️'}</span>
              <div>
                <strong style="color:var(--text-primary); font-size:0.9rem;">${item.name}</strong>
                <div style="font-size:0.75rem; color:var(--text-muted);">${item.category} • ${item.station}</div>
              </div>
            </div>
            <div>
              <button class="btn btn-xs ${isAvail ? 'btn-success' : 'btn-danger'}" onclick="window.RestaurantApp.toggleKitchenItem86('${item.id}')">
                ${isAvail ? '<i class="fa-solid fa-check"></i> IN STOCK' : '<i class="fa-solid fa-ban"></i> 86 (OUT OF STOCK)'}
              </button>
            </div>
          </div>
        `;
      }).join('');
    },

    toggleKitchenItem86(productId) {
      const item = window.appStore.state.menuItems.find(m => m.id === productId);
      if (!item) return;
      item.isAvailable = item.isAvailable === false ? true : false;
      window.appStore.save();
      this.renderKitchen86List();
      this.renderPOSCatalog();
      this.showToast(item.isAvailable ? `✅ ${item.name} is now IN STOCK` : `⚠️ ${item.name} marked 86 / OUT OF STOCK in Kitchen`, item.isAvailable ? 'success' : 'warning');
      this.logAuditEvent('KITCHEN_86_STATUS', productId, `Kitchen marked ${item.name} as ${item.isAvailable ? 'IN_STOCK' : '86_OUT_OF_STOCK'}`);
    },

    renderBaristaKDS() {
      const container = document.getElementById('baristaStationContainer');
      if (!container) return;

      const baristaOrders = window.appStore.state.orders.filter(o => 
        (o.status === 'NEW' || o.status === 'PREPARING' || o.status === 'READY') && 
        o.items.some(i => i.station === 'Barista' || i.station === 'Bar')
      );

      if (baristaOrders.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted);">No beverage orders in queue.</div>';
        return;
      }

      let html = '';
      baristaOrders.forEach(order => {
        const beverageItems = order.items.filter(i => i.station === 'Barista' || i.station === 'Bar');
        html += `
          <div class="panel-card" style="border-left:4px solid var(--ethio-gold);">
            <div class="panel-card-header">
              <div>
                <strong>Order #${order.orderNumber}</strong> (${order.tableName})
                <div class="text-muted"><small>Waiter: ${order.waiter}</small></div>
              </div>
              <span class="status-badge badge-warning">${order.status}</span>
            </div>
            <div style="margin:10px 0;">
              ${beverageItems.map(i => `<div><strong>${i.qty}x</strong> ${i.name} ${i.specialNote ? `<i class="text-warning">(${i.specialNote})</i>` : ''}</div>`).join('')}
            </div>
            <button class="btn btn-success btn-block btn-sm" onclick="window.RestaurantApp.transitionKDSOrder('${order.id}', 'READY')">
              <i class="fa-solid fa-mug-hot"></i> Mark Drinks Ready
            </button>
          </div>
        `;
      });
      container.innerHTML = html;
    },

    // =========================================================================
    // MODULE 7: VISUAL FLOOR PLAN & TABLES MAP
    // =========================================================================
    bindFloorPlan() {
      const self = this;
      document.querySelectorAll('.floor-zone-tabs .zone-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.floor-zone-tabs .zone-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          self.renderFloorPlan(tab.getAttribute('data-zone'));
        });
      });
    },

    renderFloorPlan(zone = 'all') {
      const grid = document.getElementById('restaurantFloorGrid');
      let tables = window.appStore.state.tables;

      if (zone !== 'all') {
        tables = tables.filter(t => t.zone === zone);
      }

      let html = '';
      tables.forEach(table => {
        let statusClass = table.status; // available, occupied, reserved, cleaning, out-of-service
        let statusBadge = `<span class="status-badge badge-success">Available</span>`;

        if (table.status === 'occupied') statusBadge = `<span class="status-badge badge-danger">Occupied (${table.durationMin}m)</span>`;
        if (table.status === 'reserved') statusBadge = `<span class="status-badge badge-warning">Reserved</span>`;
        if (table.status === 'cleaning') statusBadge = `<span class="status-badge badge-info">Cleaning</span>`;

        html += `
          <div class="table-card ${statusClass}" onclick="window.RestaurantApp.openTableModal('${table.id}')">
            <div class="table-card-top">
              <span class="table-name">${table.name}</span>
              <span class="table-capacity"><i class="fa-solid fa-user-group"></i> ${table.capacity}</span>
            </div>
            <div class="table-card-middle">
              ${table.status === 'occupied' ? `
                <div class="table-order-total">${table.orderTotal.toLocaleString()} ETB</div>
                <div class="table-waiter-name"><i class="fa-solid fa-bell-concierge"></i> ${table.waiter || 'Assigned'}</div>
              ` : (table.status === 'reserved' ? `<div class="text-warning"><small>${table.resGuest || 'Reserved'}</small></div>` : '<div class="text-muted"><small>Ready for guests</small></div>')}
            </div>
            <div class="table-card-footer">
              ${statusBadge}
              <button class="btn btn-xs btn-outline" style="padding:2px 6px;">Manage</button>
            </div>
          </div>
        `;
      });

      grid.innerHTML = html;
    },

    openTableModal(tableId) {
      const table = window.appStore.state.tables.find(t => t.id === tableId);
      if (!table) return;

      let bodyHtml = `
        <div style="display:flex; justify-content:space-between; margin-bottom:14px;">
          <div>
            <h3>${table.name}</h3>
            <p class="text-muted">Zone: ${table.zone.toUpperCase()} • Capacity: ${table.capacity} Seats</p>
          </div>
          <div><span class="status-badge badge-${table.status === 'available' ? 'success' : (table.status === 'occupied' ? 'danger' : 'warning')}">${table.status.toUpperCase()}</span></div>
        </div>
      `;

      if (table.status === 'occupied' && table.orderId) {
        const order = window.appStore.state.orders.find(o => o.id === table.orderId);
        bodyHtml += `
          <div class="panel-card" style="margin-bottom:14px;">
            <h4>Active Order #${order ? order.orderNumber : 'N/A'}</h4>
            <p class="text-muted">Waiter: ${table.waiter} • Seated: ${table.durationMin} mins</p>
            <div style="margin:10px 0;">
              ${order ? order.items.map(i => `<div style="display:flex; justify-content:space-between;"><span>${i.qty}x ${i.name}</span> <strong>${(i.price * i.qty).toLocaleString()} ETB</strong></div>`).join('') : ''}
            </div>
            <div style="display:flex; justify-content:space-between; border-top:1px dashed var(--border-medium); padding-top:8px;">
              <strong>Total Bill:</strong>
              <strong class="text-primary">${table.orderTotal.toLocaleString()} ETB</strong>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <button class="btn btn-success" onclick="window.RestaurantApp.closeGenericModal(); window.RestaurantApp.openPaymentModal(window.appStore.state.orders.find(o=>o.id==='${table.orderId}'))">
              <i class="fa-solid fa-receipt"></i> Settle Bill
            </button>
            <button class="btn btn-warning" onclick="window.RestaurantApp.transferTablePrompt('${table.id}')">
              <i class="fa-solid fa-arrow-right-arrow-left"></i> Transfer Table
            </button>
          </div>
        `;
      } else {
        bodyHtml += `
          <p class="text-secondary">This table is currently ${table.status}.</p>
          <div style="display:flex; gap:10px; margin-top:16px;">
            <button class="btn btn-primary" onclick="window.RestaurantApp.posSelectedTable = window.appStore.state.tables.find(t=>t.id==='${table.id}'); document.getElementById('posCartTableLabel').innerHTML='Table: <strong class=text-primary>${table.name}</strong>'; window.RestaurantApp.closeGenericModal(); window.RestaurantApp.switchView('pos');">
              <i class="fa-solid fa-plus"></i> Open New Order
            </button>
            <button class="btn btn-outline" onclick="window.RestaurantApp.setTableStatus('${table.id}', 'cleaning'); window.RestaurantApp.closeGenericModal();">
              <i class="fa-solid fa-broom"></i> Set Cleaning
            </button>
            <button class="btn btn-outline" onclick="window.RestaurantApp.setTableStatus('${table.id}', 'available'); window.RestaurantApp.closeGenericModal();">
              <i class="fa-solid fa-check"></i> Set Available
            </button>
          </div>
        `;
      }

      this.showGenericModal(`Table Details: ${table.name}`, bodyHtml);
    },

    setTableStatus(tableId, status) {
      const table = window.appStore.state.tables.find(t => t.id === tableId);
      if (table) {
        table.status = status;
        window.appStore.save();
        this.renderFloorPlan();
        this.renderControlCenter();
        this.showToast(`Updated ${table.name} status to ${status}`, 'info');
      }
    },

    transferTablePrompt(sourceTableId) {
      const targetTableId = prompt("Enter target Table ID to transfer order to (e.g. T3, T4, VIP2):");
      if (targetTableId) {
        const source = window.appStore.state.tables.find(t => t.id === sourceTableId);
        const target = window.appStore.state.tables.find(t => t.id.toLowerCase() === targetTableId.toLowerCase());

        if (source && target) {
          target.status = 'occupied';
          target.orderId = source.orderId;
          target.orderTotal = source.orderTotal;
          target.waiter = source.waiter;
          target.durationMin = source.durationMin;

          // Free source table
          source.status = 'cleaning';
          source.orderId = null;
          source.orderTotal = 0;
          source.waiter = null;

          window.appStore.save();
          this.closeGenericModal();
          this.renderFloorPlan();
          this.logAuditEvent('TABLE_TRANSFER', sourceTableId, `Transferred active order to ${target.name}`);
          this.showToast(`Transferred order from ${source.name} to ${target.name}`, 'success');
        } else {
          alert("Invalid target table ID.");
        }
      }
    },

    renderWaiterTerminal() {
      const container = document.getElementById('waiterTablesGrid');
      if (!container) return;

      const myTables = window.appStore.state.tables.filter(t => t.waiter === 'Ephrem Tefera' || t.status === 'occupied');
      let html = '';

      myTables.forEach(t => {
        const order = window.appStore.state.orders.find(o => o.id === t.orderId);
        html += `
          <div class="panel-card" style="border-left:4px solid var(--primary);">
            <div class="panel-card-header">
              <div>
                <strong>${t.name}</strong> • ${t.guests} Guests
                <div class="text-muted"><small>Seated: ${t.durationMin}m</small></div>
              </div>
              <span class="status-badge badge-${order && order.status === 'READY' ? 'success' : 'warning'}">${order ? order.status : 'OCCUPIED'}</span>
            </div>
            ${order && order.status === 'READY' ? `
              <div class="alert-item normal" style="margin:8px 0; padding:6px 10px;">
                <i class="fa-solid fa-bell text-success"></i> <strong>Kitchen Ready! Serve to table now.</strong>
              </div>
            ` : ''}
            <div style="display:flex; justify-content:space-between; margin:10px 0;">
              <span>Current Total:</span>
              <strong class="text-primary">${t.orderTotal.toLocaleString()} ETB</strong>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
              <button class="btn btn-outline btn-xs" onclick="window.RestaurantApp.openTableModal('${t.id}')">
                <i class="fa-solid fa-plus"></i> Add Items
              </button>
              <button class="btn btn-success btn-xs" onclick="window.RestaurantApp.openPaymentModal(window.appStore.state.orders.find(o=>o.id==='${t.orderId}'))">
                <i class="fa-solid fa-receipt"></i> Request Bill
              </button>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
    },

    // =========================================================================
    // MODULE 8: MENU & RECIPE MANAGEMENT (BILL OF MATERIALS)
    // =========================================================================
    renderMenuManagement() {
      const tableBody = document.querySelector('#menuManagementTable tbody');
      if (!tableBody) return;

      let html = '';
      window.appStore.state.menuItems.forEach(item => {
        const margin = Math.round(((item.price - item.cost) / item.price) * 100);
        html += `
          <tr>
            <td><strong>${item.emoji} ${item.name}</strong><br><small class="text-muted">${item.description.substring(0, 45)}...</small></td>
            <td><span class="status-badge badge-info">${item.category}</span></td>
            <td>${item.station}</td>
            <td>${item.cost} ETB</td>
            <td><strong>${item.price} ETB</strong></td>
            <td><span class="status-badge badge-success">${margin}%</span></td>
            <td>${item.prepTime} mins</td>
            <td><span class="status-badge badge-${item.isAvailable ? 'success' : 'danger'}">${item.isAvailable ? 'Active' : 'Disabled'}</span></td>
            <td>
              <button class="btn btn-xs btn-outline" onclick="window.RestaurantApp.editMenuPrice('${item.id}')"><i class="fa-solid fa-pen"></i></button>
            </td>
          </tr>
        `;
      });
      tableBody.innerHTML = html;
    },

    editMenuPrice(itemId) {
      const item = window.appStore.state.menuItems.find(m => m.id === itemId);
      if (!item) return;

      const newPrice = prompt(`Enter new selling price for ${item.name} (Current: ${item.price} ETB):`, item.price);
      if (newPrice && !isNaN(newPrice)) {
        item.price = parseFloat(newPrice);
        window.appStore.save();
        this.renderMenuManagement();
        this.renderPOSCatalog();
        this.logAuditEvent('PRICE_MODIFIED', itemId, `Changed price of ${item.name} to ${newPrice} ETB`);
        this.showToast(`Updated price of ${item.name} to ${newPrice} ETB`, 'success');
      }
    },

    renderRecipesBOM() {
      const container = document.getElementById('recipesListContainer');
      if (!container) return;

      let html = '';
      window.appStore.state.menuItems.filter(m => m.recipe && m.recipe.length > 0).forEach(dish => {
        let ingRows = '';
        dish.recipe.forEach(r => {
          const invItem = window.appStore.state.inventory.find(i => i.id === r.ingredientId);
          ingRows += `
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; border-bottom:1px solid var(--border-subtle); padding:4px 0;">
              <span>${invItem ? invItem.name : r.ingredientId}</span>
              <strong>${r.qty} ${r.unit}</strong>
            </div>
          `;
        });

        html += `
          <div class="panel-card">
            <div class="panel-card-header">
              <strong>${dish.emoji} ${dish.name}</strong>
              <span class="status-badge badge-info">${dish.category}</span>
            </div>
            <p class="text-muted"><small>Automatic Inventory Bill of Materials (BOM) per 1 plate sold:</small></p>
            <div style="margin:10px 0;">
              ${ingRows}
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-top:8px;">
              <span>Total Ingredient Cost: <strong>${dish.cost} ETB</strong></span>
              <span>Selling: <strong>${dish.price} ETB</strong></span>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
    },

    // =========================================================================
    // MODULE 9: INVENTORY & STOCK MANAGEMENT
    // =========================================================================
    bindPurchasingAndInventory() {
      const self = this;
      const search = document.getElementById('inventorySearchInput');
      if (search) {
        search.addEventListener('input', (e) => {
          self.renderInventory(e.target.value);
        });
      }

      const btnReceive = document.getElementById('btnNewStockReceiptModal');
      if (btnReceive) {
        btnReceive.addEventListener('click', () => {
          self.showStockReceiptModal();
        });
      }

      const btnWastage = document.getElementById('btnRecordWastageModal');
      if (btnWastage) {
        btnWastage.addEventListener('click', () => {
          self.showWastageModal();
        });
      }
    },

    renderInventory(query = '') {
      const tableBody = document.querySelector('#inventoryTable tbody');
      if (!tableBody) return;

      let items = window.appStore.state.inventory;
      if (query.trim()) {
        const q = query.toLowerCase();
        items = items.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
      }

      let html = '';
      let totalStockValue = 0;
      let lowStockCount = 0;

      items.forEach(item => {
        const itemVal = item.stock * item.unitCost;
        totalStockValue += itemVal;
        const isLow = item.stock <= item.minThreshold;
        if (isLow) lowStockCount++;

        html += `
          <tr>
            <td><strong>${item.name}</strong></td>
            <td><span class="status-badge badge-info">${item.category}</span></td>
            <td><strong>${item.stock} ${item.unit}</strong></td>
            <td>${item.minThreshold} ${item.unit}</td>
            <td>${item.unitCost} ETB</td>
            <td>${Math.round(itemVal).toLocaleString()} ETB</td>
            <td>
              <span class="status-badge badge-${isLow ? 'danger' : 'success'}">
                <i class="fa-solid ${isLow ? 'fa-triangle-exclamation' : 'fa-check'}"></i> ${isLow ? 'LOW STOCK' : 'Optimal'}
              </span>
            </td>
            <td>
              <button class="btn btn-xs btn-outline" onclick="window.RestaurantApp.adjustStockPrompt('${item.id}')">
                <i class="fa-solid fa-plus-minus"></i>
              </button>
            </td>
          </tr>
        `;
      });

      tableBody.innerHTML = html;
      document.getElementById('invTotalValue').innerText = `${Math.round(totalStockValue).toLocaleString()} ETB`;
      document.getElementById('invTotalItems').innerText = window.appStore.state.inventory.length;
      document.getElementById('invLowStockTotal').innerText = `${lowStockCount} Items`;
    },

    adjustStockPrompt(itemId) {
      const item = window.appStore.state.inventory.find(i => i.id === itemId);
      if (!item) return;

      const qty = prompt(`Add (+) or Subtract (-) stock for ${item.name} (Current: ${item.stock} ${item.unit}):`, "10");
      if (qty && !isNaN(qty)) {
        item.stock = Math.max(0, +(item.stock + parseFloat(qty)).toFixed(2));
        window.appStore.save();
        this.renderInventory();
        this.renderControlCenter();
        this.logAuditEvent('STOCK_MANUAL_ADJUST', itemId, `Adjusted ${item.name} by ${qty} ${item.unit}. New balance: ${item.stock}`);
        this.showToast(`Updated ${item.name} stock to ${item.stock} ${item.unit}`, 'success');
      }
    },

    showStockReceiptModal() {
      let bodyHtml = `
        <div class="form-group">
          <label class="form-label">Select Ingredient</label>
          <select id="receiptItemSelect" class="form-input">
            ${window.appStore.state.inventory.map(i => `<option value="${i.id}">${i.name} (Current: ${i.stock} ${i.unit})</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Quantity Received</label>
          <input type="number" id="receiptQty" class="form-input" placeholder="e.g. 50" />
        </div>
        <div class="form-group">
          <label class="form-label">Supplier / Delivery Invoice #</label>
          <input type="text" id="receiptInvoice" class="form-input" placeholder="e.g. INV-9942 Bishoftu Farms" />
        </div>
      `;

      this.showGenericModal("Receive Fresh Stock", bodyHtml, () => {
        const itemId = document.getElementById('receiptItemSelect').value;
        const qty = parseFloat(document.getElementById('receiptQty').value);
        const inv = document.getElementById('receiptInvoice').value;

        if (qty > 0) {
          const item = window.appStore.state.inventory.find(i => i.id === itemId);
          if (item) {
            item.stock += qty;
            window.appStore.save();
            window.RestaurantApp.renderInventory();
            window.RestaurantApp.renderControlCenter();
            window.RestaurantApp.logAuditEvent('STOCK_RECEIVED', itemId, `Received ${qty} ${item.unit} of ${item.name} via ${inv}`);
            window.RestaurantApp.showToast(`Successfully received ${qty} ${item.unit} of ${item.name}!`, 'success');
            window.RestaurantApp.closeGenericModal();
          }
        }
      });
    },

    showWastageModal() {
      let bodyHtml = `
        <div class="form-group">
          <label class="form-label">Select Ingredient / Food Item</label>
          <select id="wasteItemSelect" class="form-input">
            ${window.appStore.state.inventory.map(i => `<option value="${i.id}">${i.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Wasted Quantity</label>
          <input type="number" id="wasteQty" class="form-input" placeholder="e.g. 2.5" />
        </div>
        <div class="form-group">
          <label class="form-label">Reason for Wastage</label>
          <select id="wasteReason" class="form-input">
            <option value="Expired / Spoiled">Expired / Spoiled</option>
            <option value="Kitchen Prep Mistake">Kitchen Prep Mistake</option>
            <option value="Returned by Customer">Returned by Customer (Cold / Wrong Spec)</option>
            <option value="Damaged in transit">Damaged in transit</option>
          </select>
        </div>
      `;

      this.showGenericModal("Record Inventory Wastage / Loss", bodyHtml, () => {
        const itemId = document.getElementById('wasteItemSelect').value;
        const qty = parseFloat(document.getElementById('wasteQty').value);
        const reason = document.getElementById('wasteReason').value;

        if (qty > 0) {
          const item = window.appStore.state.inventory.find(i => i.id === itemId);
          if (item) {
            item.stock = Math.max(0, +(item.stock - qty).toFixed(2));
            window.appStore.save();
            window.RestaurantApp.renderInventory();
            window.RestaurantApp.logAuditEvent('WASTAGE_RECORDED', itemId, `Logged ${qty} ${item.unit} wastage for ${item.name}. Reason: ${reason}`);
            window.RestaurantApp.showToast(`Wastage of ${qty} ${item.unit} recorded.`, 'warning');
            window.RestaurantApp.closeGenericModal();
          }
        }
      });
    },

    // =========================================================================
    // MODULE 10: PURCHASING & SUPPLIERS
    // =========================================================================
    renderPurchasing() {
      const tableBody = document.querySelector('#purchasingOrdersTable tbody');
      if (!tableBody) return;

      let html = '';
      window.appStore.state.purchasingRequests.forEach(po => {
        html += `
          <tr>
            <td><strong>#${po.id}</strong></td>
            <td>${po.requestedBy}</td>
            <td><strong>${po.supplier}</strong></td>
            <td>${po.items}</td>
            <td><strong>${po.amount.toLocaleString()} ETB</strong></td>
            <td>${po.date}</td>
            <td>
              <span class="status-badge badge-${po.status === 'APPROVED' ? 'success' : (po.status === 'DELIVERED_RECEIVED' ? 'info' : 'warning')}">
                ${po.status}
              </span>
            </td>
            <td>
              ${po.status === 'PENDING_MANAGER_APPROVAL' ? `
                <button class="btn btn-xs btn-success" onclick="window.RestaurantApp.approvePurchase('${po.id}')">Approve</button>
              ` : '<span class="text-muted"><i class="fa-solid fa-check"></i> Processed</span>'}
            </td>
          </tr>
        `;
      });
      tableBody.innerHTML = html;
    },

    renderSuppliers() {
      const grid = document.getElementById('suppliersGrid');
      if (!grid) return;

      let html = '';
      window.appStore.state.suppliers.forEach(s => {
        html += `
          <div class="panel-card">
            <div class="panel-card-header">
              <strong>${s.name}</strong>
              <span class="status-badge badge-warning"><i class="fa-solid fa-star"></i> ${s.rating}</span>
            </div>
            <p><i class="fa-solid fa-phone text-muted"></i> ${s.contact}</p>
            <p class="text-muted"><small>Supplies: ${s.supplies}</small></p>
            <div style="display:flex; justify-content:space-between; margin-top:10px; border-top:1px solid var(--border-subtle); padding-top:8px;">
              <span>Terms: <strong>${s.terms}</strong></span>
              <span>Balance Due: <strong class="text-danger">${s.balanceDue.toLocaleString()} ETB</strong></span>
            </div>
          </div>
        `;
      });
      grid.innerHTML = html;
    },

    // =========================================================================
    // MODULE 11: EXPENSES & FINANCE
    // =========================================================================
    renderExpenses() {
      const tableBody = document.querySelector('#expensesTable tbody');
      if (!tableBody) return;

      let html = '';
      window.appStore.state.expenses.forEach(exp => {
        html += `
          <tr>
            <td><strong>#${exp.id}</strong></td>
            <td><span class="status-badge badge-info">${exp.category}</span></td>
            <td>${exp.description}</td>
            <td><strong>${exp.amount.toLocaleString()} ETB</strong></td>
            <td>${exp.paidBy}</td>
            <td>${exp.date}</td>
            <td><span class="status-badge badge-success">${exp.status}</span></td>
          </tr>
        `;
      });
      tableBody.innerHTML = html;
    },

    // =========================================================================
    // MODULE 12: STAFF ROSTER, ATTENDANCE & SHIFTS
    // =========================================================================
    bindStaffAttendance() {
      const self = this;
      const btnClock = document.getElementById('btnClockInOutModal');
      if (btnClock) {
        btnClock.addEventListener('click', () => {
          self.showClockInOutModal();
        });
      }
    },

    renderStaffRoster() {
      const tableBody = document.querySelector('#staffAttendanceTable tbody');
      if (!tableBody) return;

      let html = '';
      window.appStore.state.staff.forEach(emp => {
        html += `
          <tr>
            <td><strong>${emp.name}</strong></td>
            <td><span class="status-badge badge-info">${emp.role}</span></td>
            <td>${emp.shift}</td>
            <td>${emp.clockIn || '--:--'}</td>
            <td>${emp.clockOut || '--:--'}</td>
            <td>
              <span class="status-badge badge-${emp.status.includes('Present') ? 'success' : 'warning'}">
                ${emp.status}
              </span>
            </td>
            <td><code>${emp.pin}</code></td>
            <td>
              <button class="btn btn-xs btn-outline" onclick="window.RestaurantApp.toggleStaffClock('${emp.id}')">
                ${emp.clockIn ? 'Clock Out' : 'Clock In'}
              </button>
            </td>
          </tr>
        `;
      });
      tableBody.innerHTML = html;
    },

    showClockInOutModal() {
      let bodyHtml = `
        <div class="form-group">
          <label class="form-label">Enter 4-Digit Employee PIN</label>
          <input type="password" id="staffPinInput" maxlength="4" class="form-input" style="font-size:1.8rem; text-align:center; letter-spacing:10px;" placeholder="••••" />
        </div>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; max-width:260px; margin:0 auto;">
          ${[1,2,3,4,5,6,7,8,9,'C',0,'OK'].map(key => `
            <button class="btn btn-secondary" style="font-size:1.2rem; padding:12px;" onclick="window.RestaurantApp.handlePinPadPress('${key}')">${key}</button>
          `).join('')}
        </div>
      `;

      this.showGenericModal("Employee Time Clock (PIN)", bodyHtml);
    },

    handlePinPadPress(key) {
      const input = document.getElementById('staffPinInput');
      if (!input) return;

      if (key === 'C') {
        input.value = '';
      } else if (key === 'OK') {
        this.verifyAndClockEmployee(input.value);
      } else {
        if (input.value.length < 4) {
          input.value += key;
          if (input.value.length === 4) {
            setTimeout(() => this.verifyAndClockEmployee(input.value), 200);
          }
        }
      }
    },

    verifyAndClockEmployee(pin) {
      const emp = window.appStore.state.staff.find(s => s.pin === pin);
      if (emp) {
        if (!emp.clockIn) {
          emp.clockIn = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          emp.status = "Present";
          this.showToast(`Welcome ${emp.name}! Clocked IN at ${emp.clockIn}`, 'success');
        } else {
          emp.clockOut = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          emp.status = "Clocked Out";
          this.showToast(`Goodbye ${emp.name}! Clocked OUT at ${emp.clockOut}`, 'info');
        }
        window.appStore.save();
        this.closeGenericModal();
        this.renderStaffRoster();
        this.logAuditEvent('ATTENDANCE_PIN', emp.id, `${emp.name} (${emp.role}) punched time clock`);
      } else {
        alert("Invalid PIN. Please try again.");
        const input = document.getElementById('staffPinInput');
        if (input) input.value = '';
      }
    },

    toggleStaffClock(empId) {
      const emp = window.appStore.state.staff.find(s => s.id === empId);
      if (emp) {
        if (!emp.clockIn) {
          emp.clockIn = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          emp.status = "Present";
        } else {
          emp.clockOut = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          emp.status = "Clocked Out";
        }
        window.appStore.save();
        this.renderStaffRoster();
      }
    },

    // =========================================================================
    // MODULE 13: TASKS, HYGIENE & MAINTENANCE
    // =========================================================================
    renderTasks() {
      const p = document.getElementById('taskColPending');
      const prog = document.getElementById('taskColInProgress');
      const comp = document.getElementById('taskColCompleted');
      if (!p || !prog || !comp) return;

      p.innerHTML = `
        <div class="panel-card" style="padding:10px; margin-bottom:8px;">
          <strong>Deep clean walk-in refrigerator</strong>
          <p class="text-muted"><small>Assigned: Birtukan (Kitchen Staff) • Due: 14:00</small></p>
        </div>
        <div class="panel-card" style="padding:10px; margin-bottom:8px;">
          <strong>Restock Popcorn & Harar coffee beans</strong>
          <p class="text-muted"><small>Assigned: Solomon (Barista)</small></p>
        </div>
      `;

      prog.innerHTML = `
        <div class="panel-card" style="padding:10px; margin-bottom:8px; border-left:3px solid var(--warning);">
          <strong>Sanitize outdoor terrace tables</strong>
          <p class="text-muted"><small>Assigned: Meseret (Cleaner)</small></p>
        </div>
      `;

      comp.innerHTML = `
        <div class="panel-card" style="padding:10px; margin-bottom:8px; border-left:3px solid var(--success);">
          <strong>Morning cash float count & receipt paper load</strong>
          <p class="text-muted"><small>Completed: Bethlehem (Cashier)</small></p>
        </div>
      `;
    },

    renderHygieneAndMaintenance() {
      const checkContainer = document.getElementById('sanitationChecklistContainer');
      const ticketsContainer = document.getElementById('maintenanceTicketsList');

      if (checkContainer) {
        checkContainer.innerHTML = `
          <label class="sop-step"><input type="checkbox" checked /> Clean and sanitize all 24 dining tables & chairs</label>
          <label class="sop-step"><input type="checkbox" checked /> Disinfect kitchen preparation cutting boards & knives</label>
          <label class="sop-step"><input type="checkbox" checked /> Inspect grease trap and floor drainage</label>
          <label class="sop-step"><input type="checkbox" /> Restock guest restroom soap, paper towels & sanitizers</label>
          <label class="sop-step"><input type="checkbox" /> Clean espresso group heads and milk steam wands</label>
        `;
      }

      if (ticketsContainer) {
        ticketsContainer.innerHTML = `
          <div class="alert-item attention">
            <i class="fa-solid fa-screwdriver-wrench alert-icon"></i>
            <div>
              <div class="alert-title-row"><span>Espresso Machine Group #2 Low Pressure</span> <span class="alert-time">Today</span></div>
              <div>Assigned to Addis Tech Service. Technician arriving at 16:00.</div>
            </div>
          </div>
          <div class="alert-item normal">
            <i class="fa-solid fa-check alert-icon"></i>
            <div>
              <div class="alert-title-row"><span>Walk-in Chiller Defrost Cycle</span> <span class="alert-time">Resolved</span></div>
              <div>Temperature stable at +3°C.</div>
            </div>
          </div>
        `;
      }
    },

    // =========================================================================
    // MODULE 14: RESERVATIONS & CRM LOYALTY
    // =========================================================================
    renderReservations() {
      const tableBody = document.querySelector('#reservationsTable tbody');
      if (!tableBody) return;

      let html = '';
      window.appStore.state.reservations.forEach(r => {
        html += `
          <tr>
            <td><strong>${r.guest}</strong></td>
            <td>${r.phone}</td>
            <td>${r.date} @ <strong>${r.time}</strong></td>
            <td>${r.guests} Guests</td>
            <td><span class="status-badge badge-info">${r.tableId}</span></td>
            <td><small>${r.specialNotes || 'None'}</small></td>
            <td><span class="status-badge badge-${r.status === 'CONFIRMED' ? 'success' : 'warning'}">${r.status}</span></td>
            <td>
              <button class="btn btn-xs btn-outline" onclick="window.RestaurantApp.showToast('Reservation confirmed', 'success')"><i class="fa-solid fa-check"></i></button>
            </td>
          </tr>
        `;
      });
      tableBody.innerHTML = html;
    },

    renderCustomersCRM() {
      const tableBody = document.querySelector('#customersTable tbody');
      if (!tableBody) return;

      let html = '';
      window.appStore.state.customers.forEach(c => {
        html += `
          <tr>
            <td><strong>${c.name}</strong></td>
            <td>${c.phone}</td>
            <td><span class="status-badge badge-warning">${c.tier}</span></td>
            <td>${c.visits} visits</td>
            <td><strong>${c.totalSpend.toLocaleString()} ETB</strong></td>
            <td><strong class="text-primary">${c.points} pts</strong></td>
            <td>${c.favDish}</td>
            <td><button class="btn btn-xs btn-outline">Profile</button></td>
          </tr>
        `;
      });
      tableBody.innerHTML = html;
    },

    renderDeliveryDispatch() {
      const grid = document.getElementById('deliveryBoardGrid');
      if (!grid) return;

      let html = '';
      window.appStore.state.deliveryOrders.forEach(d => {
        html += `
          <div class="panel-card" style="border-left:4px solid var(--info);">
            <div class="panel-card-header">
              <strong>Order #${d.orderNumber} (${d.customer})</strong>
              <span class="status-badge badge-info">${d.status}</span>
            </div>
            <p><i class="fa-solid fa-location-dot text-primary"></i> ${d.address}</p>
            <p><i class="fa-solid fa-motorcycle text-muted"></i> Driver: <strong>${d.driver}</strong> • Tel: ${d.phone}</p>
            <div style="display:flex; justify-content:space-between; margin-top:10px; border-top:1px solid var(--border-subtle); padding-top:8px;">
              <span>Fee: ${d.fee} ETB</span>
              <strong class="text-primary">${d.total.toLocaleString()} ETB</strong>
            </div>
            <button class="btn btn-success btn-block btn-sm" style="margin-top:8px;" onclick="window.RestaurantApp.showToast('Delivery #${d.orderNumber} marked Delivered!', 'success')">
              <i class="fa-solid fa-check"></i> Mark Delivered
            </button>
          </div>
        `;
      });
      grid.innerHTML = html;
    },

    renderComplaints() {
      const grid = document.getElementById('complaintsListGrid');
      if (!grid) return;

      let html = '';
      window.appStore.state.complaints.forEach(c => {
        html += `
          <div class="panel-card" style="border-left:4px solid var(--danger);">
            <div class="panel-card-header">
              <strong>Complaint #${c.id}: ${c.guest}</strong>
              <span class="status-badge badge-warning">${c.status}</span>
            </div>
            <p class="text-danger">"${c.issue}"</p>
            <p class="text-muted"><small>Assigned: ${c.assignedTo}</small></p>
            <p class="text-success"><small><strong>Resolution:</strong> ${c.resolution}</small></p>
          </div>
        `;
      });
      grid.innerHTML = html;
    },

    renderAutomations() {
      const grid = document.getElementById('automationRulesGrid');
      if (!grid) return;

      let html = '';
      window.appStore.state.automations.forEach(a => {
        html += `
          <div class="panel-card" style="border-left:4px solid var(--primary);">
            <div class="panel-card-header">
              <strong><i class="fa-solid fa-bolt text-accent"></i> ${a.id}</strong>
              <span class="status-badge badge-success">ACTIVE</span>
            </div>
            <p style="font-weight:700; color:var(--primary);">${a.trigger}</p>
            <p class="text-muted"><small>Condition: <code>${a.condition}</code></small></p>
            <div style="margin-top:8px; padding:8px; background:var(--bg-input); border-radius:var(--radius-sm);">
              <strong>ACTION:</strong> ${a.action}
            </div>
          </div>
        `;
      });
      grid.innerHTML = html;
    },

    renderAuditLogs() {
      const tableBody = document.querySelector('#auditLogTable tbody');
      if (!tableBody) return;

      let html = '';
      window.appStore.state.auditLogs.forEach(log => {
        html += `
          <tr>
            <td><code>${log.time}</code></td>
            <td><strong>${log.user}</strong></td>
            <td><span class="status-badge badge-info">${log.action}</span></td>
            <td><code>${log.entity}</code></td>
            <td>${log.details}</td>
            <td>${log.branch}</td>
          </tr>
        `;
      });
      tableBody.innerHTML = html;
    },

    renderKitchenEfficiency() {
      const tableBody = document.querySelector('#delayedOrdersTable tbody');
      if (!tableBody) return;

      const delayed = window.appStore.state.orders.filter(o => o.status === 'PREPARING' && o.elapsedMinutes > 15);
      let html = '';

      delayed.forEach(o => {
        html += `
          <tr>
            <td><strong>#${o.orderNumber}</strong></td>
            <td>${o.tableName}</td>
            <td>${o.items.map(i => `${i.qty}x ${i.name}`).join(', ')}</td>
            <td><strong class="text-danger">${o.elapsedMinutes} mins</strong></td>
            <td><span class="status-badge badge-danger">CRITICAL DELAY</span></td>
          </tr>
        `;
      });

      tableBody.innerHTML = html || '<tr><td colspan="5" class="text-muted" style="text-align:center;">No delayed orders at this time.</td></tr>';
      this.renderKitchenPerfChart();
    },

    renderKitchenPerfChart() {
      if (typeof Chart === 'undefined') return;
      const canvas = document.getElementById('kitchenPrepSpeedChart');
      if (!canvas) return;

      if (this.charts.kitchenSpeed) this.charts.kitchenSpeed.destroy();
      this.charts.kitchenSpeed = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: ['Ethiopian Stews', 'Burgers & Fries', 'Pizza', 'Traditional Bunna', 'Fresh Spris Juice', 'Cocktails'],
          datasets: [{
            label: 'Avg Preparation Time (Minutes)',
            data: [14, 12, 16, 6, 5, 4],
            backgroundColor: '#38bdf8',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    },

    // =========================================================================
    // CASHIER HOME DASHBOARD RENDERER (CASHIER RESPONSIBILITIES ONLY)
    // =========================================================================
    renderCashierHome() {
      const state = window.appStore.state;
      const orders = state.orders || [];

      // KPI counters
      const settled = orders.filter(o => o.paymentStatus === 'PAID' || o.status === 'PAID' || o.status === 'COMPLETED');
      const unpaid  = orders.filter(o => o.paymentStatus !== 'PAID' && o.status !== 'PAID' && o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
      const shiftSales = settled.reduce((s, o) => s + (o.total || o.totalAmount || 0), 0);
      const cashSales = settled.filter(o => (o.paymentMethod === 'Cash' || !o.paymentMethod)).reduce((s, o) => s + (o.total || o.totalAmount || 0), 0);
      const mobileSales = settled.filter(o => (o.paymentMethod === 'Telebirr' || o.paymentMethod === 'CBE Birr')).reduce((s, o) => s + (o.total || o.totalAmount || 0), 0);
      const cardSales = settled.filter(o => o.paymentMethod === 'Card / POS').reduce((s, o) => s + (o.total || o.totalAmount || 0), 0);
      const openingFloat = state.meta.activeShift?.openingFloat || 10000;
      const totalCashInDrawer = openingFloat + cashSales;

      const setEl = (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML = v; };
      setEl('chSalesTotal',    `${shiftSales.toLocaleString()} <span class="currency-tag">ETB</span>`);
      setEl('chOrdersSettled', settled.length);
      setEl('chCashTotal',     `${totalCashInDrawer.toLocaleString()} <span class="currency-tag">ETB</span>`);
      setEl('chMobileTotal',   `${mobileSales.toLocaleString()} <span class="currency-tag">ETB</span>`);
      setEl('chOpenTablesCount', unpaid.length);
      setEl('chOpeningFloat',  `${openingFloat.toLocaleString()} <span class="currency-tag">ETB</span>`);

      setEl('chBreakdownCash',   `${cashSales.toLocaleString()} ETB`);
      setEl('chBreakdownMobile', `${mobileSales.toLocaleString()} ETB`);
      setEl('chBreakdownCard',   `${cardSales.toLocaleString()} ETB`);

      // Unpaid orders table
      const unpaidBody = document.getElementById('cashierHomeUnpaidBody');
      if (unpaidBody) {
        if (unpaid.length === 0) {
          unpaidBody.innerHTML = '<tr><td colspan="6" class="text-muted" style="text-align:center; padding:30px;"><i class="fa-solid fa-circle-check text-success" style="font-size:1.5rem; display:block; margin-bottom:8px;"></i>All guest bills are settled! No unpaid orders pending. 🎉</td></tr>';
        } else {
          unpaidBody.innerHTML = unpaid.map(o => {
            const badgeClass = o.status === 'READY' ? 'badge-success' : o.status === 'PREPARING' ? 'badge-warning' : 'badge-info';
            const orderTotal = o.total || o.totalAmount || 0;
            const waiterName = o.waiter || o.waiterName || '—';
            return `
              <tr>
                <td><strong>#${o.orderNumber}</strong></td>
                <td><i class="fa-solid fa-chair text-muted"></i> ${o.tableName}</td>
                <td>${waiterName}</td>
                <td><strong class="text-primary">${orderTotal.toLocaleString()} ETB</strong></td>
                <td><span class="status-badge ${badgeClass}">${o.status}</span></td>
                <td>
                  <button class="btn btn-xs btn-success" onclick="window.RestaurantApp.openCheckoutForOrder('${o.id}')">
                    <i class="fa-solid fa-cash-register"></i> Pay & Settle
                  </button>
                </td>
              </tr>`;
          }).join('');
        }
      }

      // Settled transactions table
      const settledBody = document.getElementById('cashierHomeSettledBody');
      if (settledBody) {
        if (settled.length === 0) {
          settledBody.innerHTML = '<tr><td colspan="6" class="text-muted" style="text-align:center; padding:30px;">No settled transactions recorded yet this shift.</td></tr>';
        } else {
          settledBody.innerHTML = settled.slice(-15).reverse().map(o => {
            const payIcon = o.paymentMethod === 'Cash' ? 'fa-money-bill text-success' : (o.paymentMethod === 'Telebirr' || o.paymentMethod === 'CBE Birr') ? 'fa-mobile text-primary' : 'fa-credit-card text-warning';
            const orderTotal = o.total || o.totalAmount || 0;
            const receiptNum = o.id.replace('ORD-', 'RCP-');
            return `
              <tr>
                <td><strong>${receiptNum}</strong></td>
                <td>${o.timeReceived || '12:30 PM'}</td>
                <td>${o.tableName}</td>
                <td><strong>${orderTotal.toLocaleString()} ETB</strong></td>
                <td><i class="fa-solid ${payIcon}"></i> ${o.paymentMethod || 'Cash'}</td>
                <td>
                  <button class="btn btn-xs btn-outline" onclick="window.RestaurantApp.printReceipt('${o.id}')" title="Print Thermal Receipt">
                    <i class="fa-solid fa-print"></i> Receipt
                  </button>
                </td>
              </tr>`;
          }).join('');
        }
      }
    },

    // =========================================================================
    // KITCHEN HOME DASHBOARD RENDERER (KITCHEN RESPONSIBILITIES ONLY)
    // =========================================================================
    kitchenHomeStationFilter: 'all',

    filterKitchenHomeStation(station, btnEl) {
      this.kitchenHomeStationFilter = station;
      document.querySelectorAll('[data-kitchen-filter]').forEach(b => {
        b.classList.remove('active', 'btn-primary');
        b.classList.add('btn-secondary');
      });
      if (btnEl) {
        btnEl.classList.add('active', 'btn-primary');
        btnEl.classList.remove('btn-secondary');
      }
      this.renderKitchenHome();
    },

    renderKitchenHome() {
      const state = window.appStore.state;
      let activeOrders = (state.orders || []).filter(o => 
        o.status === 'NEW' || o.status === 'PENDING' || o.status === 'PREPARING' || o.status === 'READY'
      );

      const inQueueCount = activeOrders.filter(o => o.status === 'NEW' || o.status === 'PENDING').length;
      const cookingCount = activeOrders.filter(o => o.status === 'PREPARING').length;
      const readyCount   = activeOrders.filter(o => o.status === 'READY').length;

      const setEl = (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML = v; };
      setEl('khQueueCount', inQueueCount);
      setEl('khPrepCount',  cookingCount);
      setEl('khReadyCount', readyCount);

      const filter = this.kitchenHomeStationFilter || 'all';
      if (filter === 'READY') {
        activeOrders = activeOrders.filter(o => o.status === 'READY');
      } else if (filter !== 'all') {
        activeOrders = activeOrders.filter(o => 
          o.station === filter || o.items.some(i => i.station === filter || (filter === 'Kitchen' && (!i.station || i.station === 'Kitchen')))
        );
      }

      const container = document.getElementById('kitchenHomeLiveCards');
      if (!container) return;

      if (activeOrders.length === 0) {
        container.innerHTML = `
          <div style="grid-column:1/-1; text-align:center; padding:70px 20px; color:var(--text-muted); background:var(--bg-surface); border-radius:var(--radius-lg); border:1px dashed var(--border-medium);">
            <i class="fa-solid fa-circle-check" style="font-size:3.5rem; color:var(--success); margin-bottom:16px;"></i>
            <h2 style="color:var(--text-primary); margin-bottom:6px;">All Tickets Clear!</h2>
            <p style="color:var(--text-secondary); max-width:400px; margin:0 auto;">No active kitchen orders in queue. The system will ring an audio chime when the next food order is punched.</p>
          </div>`;
        return;
      }

      container.innerHTML = activeOrders.map(order => {
        const isReady     = order.status === 'READY';
        const isPreparing = order.status === 'PREPARING';
        const elapsed     = order.elapsedMinutes || 0;
        const timerColor  = elapsed > 15 ? 'text-danger' : elapsed > 8 ? 'text-warning' : 'text-success';
        const cardBorder  = isReady ? '2px solid var(--success)' : isPreparing ? '2px solid var(--warning)' : '1px solid var(--border-medium)';

        let nextStatus = 'PREPARING';
        let btnLabel   = '🔥 START COOKING';
        let btnClass   = 'btn-warning';

        if (isPreparing) {
          nextStatus = 'READY';
          btnLabel   = '🔔 MARK READY FOR WAITER';
          btnClass   = 'btn-success';
        } else if (isReady) {
          nextStatus = 'SERVED';
          btnLabel   = '✅ BUMP / DISH SERVED';
          btnClass   = 'btn-primary';
        }

        const itemsHTML = (order.items || []).map(item => `
          <div style="display:flex; justify-content:space-between; align-items:flex-start; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
            <div>
              <span style="font-weight:700; font-size:1rem; color:var(--text-primary);">
                <span style="background:var(--primary); color:#fff; border-radius:6px; min-width:26px; height:24px; display:inline-flex; align-items:center; justify-content:center; font-size:0.85rem; margin-right:8px; font-weight:800;">${item.qty}x</span>
                ${item.name}
              </span>
              ${item.specialNote ? `<div style="font-size:0.8rem; color:var(--warning); margin-left:34px; margin-top:2px;"><i class="fa-solid fa-triangle-exclamation"></i> <em>${item.specialNote}</em></div>` : ''}
            </div>
            <span style="font-size:0.75rem; color:var(--text-muted); background:rgba(255,255,255,0.06); padding:2px 6px; border-radius:4px;">${item.station || 'Kitchen'}</span>
          </div>
        `).join('');

        return `
          <div class="panel-card" style="border:${cardBorder}; position:relative; padding:18px; display:flex; flex-direction:column; justify-content:space-between;">
            ${ isReady ? '<div style="position:absolute;top:12px;right:12px;background:var(--success);color:#fff;padding:3px 10px;border-radius:20px;font-size:0.72rem;font-weight:800;letter-spacing:0.5px;"><i class="fa-solid fa-bell"></i> PLATED & READY</div>' : '' }
            ${ isPreparing ? '<div style="position:absolute;top:12px;right:12px;background:var(--warning);color:#000;padding:3px 10px;border-radius:20px;font-size:0.72rem;font-weight:800;"><i class="fa-solid fa-fire"></i> ON STOVE</div>' : '' }
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; padding-right:${isReady || isPreparing ? '110px' : '0'};">
                <div>
                  <div style="font-size:1.35rem; font-weight:800; color:var(--text-primary);">Ticket #${order.orderNumber}</div>
                  <div style="color:var(--text-secondary); font-size:0.82rem; margin-top:3px;">
                    <i class="fa-solid fa-chair text-muted"></i> <strong>${order.tableName}</strong> &nbsp;•&nbsp; 
                    <i class="fa-solid fa-user text-muted"></i> ${order.waiter || order.waiterName || 'Staff'}
                  </div>
                </div>
                <div style="text-align:right;">
                  <div class="${timerColor}" style="font-size:1.15rem; font-weight:800;">
                    <i class="fa-solid fa-stopwatch"></i> ${elapsed}m
                  </div>
                  <div style="font-size:0.68rem; color:var(--text-muted);">elapsed</div>
                </div>
              </div>

              <div style="margin:14px 0 16px;">
                ${itemsHTML}
              </div>
            </div>

            <button class="btn ${btnClass}" style="width:100%; font-size:0.95rem; padding:12px; font-weight:800; letter-spacing:0.5px; border-radius:var(--radius-md);"
              onclick="window.RestaurantApp.updateKDSOrderStatus('${order.id}', '${nextStatus}')">
              ${btnLabel}
            </button>
          </div>
        `;
      }).join('');
    },

    // =========================================================================
    // MODULE 15: AI RESTAURANT ASSISTANT ("GURSHA AI")
    // =========================================================================
    bindAIAssistant() {
      const self = this;
      this.dom.btnOpenAI.addEventListener('click', () => {
        this.dom.aiAssistantDrawer.classList.toggle('open');
      });

      this.dom.btnCloseAIDrawer.addEventListener('click', () => {
        this.dom.aiAssistantDrawer.classList.remove('open');
      });

      // Quick query chips
      document.querySelectorAll('.ai-quick-prompts .ai-prompt-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const query = chip.getAttribute('data-query');
          self.handleAIQuery(query);
        });
      });

      // Send prompt button & enter key
      const sendBtn = document.getElementById('btnSendAIMessage');
      const input = document.getElementById('aiInputPrompt');

      sendBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (text) {
          input.value = '';
          self.handleAIQuery(text);
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const text = input.value.trim();
          if (text) {
            input.value = '';
            self.handleAIQuery(text);
          }
        }
      });
    },

    handleAIQuery(query) {
      const messagesContainer = document.getElementById('aiChatMessages');

      // Add user bubble
      const userMsg = document.createElement('div');
      userMsg.className = 'ai-message user-msg';
      userMsg.innerHTML = `<div class="msg-avatar"><i class="fa-solid fa-user"></i></div><div class="msg-content">${query}</div>`;
      messagesContainer.appendChild(userMsg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      // Generate intelligent answer based on real-time application store
      setTimeout(() => {
        const answer = this.generateAIResponse(query);
        const aiMsg = document.createElement('div');
        aiMsg.className = 'ai-message assistant-msg';
        aiMsg.innerHTML = `<div class="msg-avatar"><i class="fa-solid fa-robot"></i></div><div class="msg-content">${answer}</div>`;
        messagesContainer.appendChild(aiMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.playSound('ding');
      }, 350);
    },

    generateAIResponse(query) {
      const q = query.toLowerCase();
      const state = window.appStore.state;
      const totalSales = state.orders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.total, 48750);
      const activeOrdersCount = state.orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;
      const lowStockItems = state.inventory.filter(i => i.stock <= i.minThreshold);
      const delayedOrders = state.orders.filter(o => o.status === 'PREPARING' && o.elapsedMinutes > 15);

      if (q.includes('how much') || q.includes('sales') || q.includes('sell today') || q.includes('revenue')) {
        return `
          <p>💰 <strong>Today's Total Sales:</strong> <span style="color:var(--success); font-weight:800;">${totalSales.toLocaleString()} ETB</span> across <strong>427 orders</strong>.</p>
          <p>• <strong>Lideta Flagship:</strong> 48,750 ETB (Lideta Exclusive Operations)</p>
          <p>Estimated Gross Profit: <strong>830,000 ETB (66.4% margin)</strong>.</p>
        `;
      }

      if (q.includes('best sell') || q.includes('popular') || q.includes('most')) {
        return `
          <p>🍔 <strong>Top Selling Dishes This Week:</strong></p>
          <ol style="margin-left: 18px; margin-top:4px;">
            <li><strong>Kerevat Special Burger</strong> - 42 orders (20,160 ETB)</li>
            <li><strong>Traditional Doro Wat Combo</strong> - 38 orders (24,700 ETB)</li>
            <li><strong>Special Beef Tibs</strong> - 29 orders (15,080 ETB)</li>
            <li><strong>Ethiopian Jebena Bunna</strong> - 65 servings (4,875 ETB)</li>
          </ol>
        `;
      }

      if (q.includes('low') || q.includes('stock') || q.includes('inventory') || q.includes('ingredient')) {
        if (lowStockItems.length === 0) {
          return `<p>✅ All inventory ingredients are currently above minimum operating thresholds.</p>`;
        }
        let list = lowStockItems.map(i => `• <strong>${i.name}</strong>: ${i.stock} ${i.unit} left (Min: ${i.minThreshold} ${i.unit})`).join('<br>');
        return `
          <p>⚠️ <strong>${lowStockItems.length} Ingredients are running below minimum threshold:</strong></p>
          <p>${list}</p>
          <p><em>Auto-purchase requests have already been routed to the Storekeeper & Manager for re-supply.</em></p>
        `;
      }

      if (q.includes('delay') || q.includes('late') || q.includes('kitchen')) {
        if (delayedOrders.length === 0) {
          return `<p>🟢 Kitchen is running at peak efficiency. Average cook speed is <strong>14 minutes</strong>, no delayed orders.</p>`;
        }
        let list = delayedOrders.map(o => `• <strong>Order #${o.orderNumber}</strong> (${o.tableName}): Preparing for <strong>${o.elapsedMinutes} mins</strong>`).join('<br>');
        return `
          <p>🔴 <strong>Delayed Orders Alert:</strong></p>
          <p>${list}</p>
          <p>Chef Hailemariam and Line 1 have been notified to prioritize these tickets.</p>
        `;
      }

      if (q.includes('expense') || q.includes('cost')) {
        return `
          <p>💸 <strong>Today's Operating Expenses:</strong></p>
          <p>• <strong>Standby Generator Diesel:</strong> 19,400 ETB</p>
          <p>• <strong>Kitchen Overtime Allowance:</strong> 4,800 ETB</p>
          <p>• <strong>Espresso Machine Service:</strong> 3,500 ETB</p>
          <p>• <strong>Emergency Produce:</strong> 1,800 ETB</p>
          <p>Total recorded expenses: <strong>29,500 ETB</strong>.</p>
        `;
      }

      return `
        <p>I have analyzed your restaurant operating parameters for <strong>${state.branches.find(b => b.id === this.currentBranch)?.name || 'Consolidated Operations'}</strong>.</p>
        <p>Currently running <strong>${activeOrdersCount} active orders</strong> across dining floors and delivery. Sales and stock movements are synchronized in real-time.</p>
      `;
    },

    // =========================================================================
    // MODULE 16: OPENING / CLOSING PROCEDURES & SHIFT RECONCILIATION
    // =========================================================================
    bindOpeningClosing() {
      const closeBtn = document.getElementById('btnCloseBusinessDayBtn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          const checks = document.querySelectorAll('#closingChecklistSteps input[type="checkbox"]');
          let allChecked = true;
          checks.forEach(c => { if (!c.checked) allChecked = false; });

          if (!allChecked) {
            alert("Please complete and verify all 6 closing checklist items before ending the business day.");
            return;
          }

          if (confirm("Confirm closing the business day? This will seal daily accounts and generate the official executive report.")) {
            window.appStore.state.meta.businessDayStatus = "CLOSED";
            window.appStore.save();
            this.showToast("Business Day Closed. Daily Management Report Sealed.", "success");
            this.switchView('reports');
          }
        });
      }
    },

    openShiftClosingModal() {
      const modal = document.getElementById('shiftCloseModalOverlay');
      const state = window.appStore.state;
      const opening = state.meta.activeShift.openingFloat;
      const cashSales = 40000;
      const refunds = 0;
      const expected = opening + cashSales - refunds;

      document.getElementById('reconOpeningCash').innerText = `${opening.toLocaleString()}.00 ETB`;
      document.getElementById('reconCashSales').innerText = `+${cashSales.toLocaleString()}.00 ETB`;
      document.getElementById('reconCashRefunds').innerText = `-${refunds.toLocaleString()}.00 ETB`;
      document.getElementById('reconExpectedCash').innerText = `${expected.toLocaleString()}.00 ETB`;

      const input = document.getElementById('reconActualCashInput');
      const diffEl = document.getElementById('reconDiffAmount');
      input.value = expected;
      diffEl.innerText = "0.00 ETB";

      input.oninput = () => {
        const actual = parseFloat(input.value) || 0;
        const diff = actual - expected;
        diffEl.innerText = `${diff >= 0 ? '+' : ''}${diff.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB`;
        diffEl.style.color = diff === 0 ? 'var(--success)' : (diff > 0 ? 'var(--primary)' : 'var(--danger)');
      };

      modal.classList.add('open');
    },

    submitShiftZReport() {
      const input = document.getElementById('reconActualCashInput');
      const actual = parseFloat(input.value) || 0;
      const expected = 50000;
      const diff = actual - expected;

      this.logAuditEvent('SHIFT_CLOSED_ZREPORT', 'SHIFT-104', `Cashier Bethlehem T. closed shift. Expected: ${expected} ETB, Counted: ${actual} ETB (Diff: ${diff} ETB)`);
      document.getElementById('shiftCloseModalOverlay').classList.remove('open');
      this.showToast(`Z-Report submitted! Cash Discrepancy: ${diff} ETB`, diff === 0 ? 'success' : 'warning');
    },

    // Generic Modal Helper
    showGenericModal(title, bodyHTML, onConfirm = null) {
      const overlay = document.getElementById('genericFormModalOverlay');
      document.getElementById('genericModalTitle').innerText = title;
      document.getElementById('genericModalBody').innerHTML = bodyHTML;

      const footer = document.getElementById('genericModalFooter');
      if (onConfirm) {
        footer.innerHTML = `
          <button class="btn btn-secondary" onclick="window.RestaurantApp.closeGenericModal()">Cancel</button>
          <button class="btn btn-primary" id="btnGenericConfirmAction">Confirm Action</button>
        `;
        document.getElementById('btnGenericConfirmAction').onclick = onConfirm;
      } else {
        footer.innerHTML = `<button class="btn btn-secondary" onclick="window.RestaurantApp.closeGenericModal()">Close</button>`;
      }

      overlay.classList.add('open');
    },

    closeGenericModal() {
      document.getElementById('genericFormModalOverlay').classList.remove('open');
    },

    // Real-Time Engine Ticker (Simulates live restaurant heartbeat)
    startRealtimeEngine() {
      const self = this;
      setInterval(() => {
        // Increment prep timer on active orders
        window.appStore.state.orders.forEach(o => {
          if (o.status === 'PREPARING') {
            o.elapsedMinutes += 1;
          }
        });

        // Increment occupied table durations
        window.appStore.state.tables.forEach(t => {
          if (t.status === 'occupied') {
            t.durationMin += 1;
          }
        });

        self.updateTickerAndBadges();
        if (self.activeView === 'control-center')  self.renderControlCenter();
        if (self.activeView === 'kds')             self.renderKDSBoard();
        if (self.activeView === 'kitchen-home')    self.renderKitchenHome();
        if (self.activeView === 'cashier-home')    self.renderCashierHome();
      }, 30000); // every 30 seconds
    },

    updateTickerAndBadges() {
      const state = window.appStore.state;
      const activeCount = state.orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;
      const occupiedCount = state.tables.filter(t => t.status === 'occupied').length;
      const lowStockCount = state.inventory.filter(i => i.stock <= i.minThreshold).length;

      const tickerOrders = document.getElementById('tickerActiveOrders');
      if (tickerOrders) tickerOrders.innerText = activeCount;
      const tickerTables = document.getElementById('tickerOccupiedTables');
      if (tickerTables) tickerTables.innerText = `${occupiedCount}/${state.tables.length}`;
      const navOpen = document.getElementById('navOpenOrdersCount');
      if (navOpen) navOpen.innerText = activeCount;
      const navKds = document.getElementById('navKdsActiveCount');
      if (navKds) navKds.innerText = activeCount;
      const navLow = document.getElementById('navLowStockCount');
      if (navLow) navLow.innerText = lowStockCount;

      // Cashier Home unpaid count pill
      const unpaidCount = state.orders.filter(o => o.paymentStatus !== 'PAID' && o.status !== 'PAID' && o.status !== 'CANCELLED' && o.status !== 'COMPLETED').length;
      const cashierPill = document.getElementById('navCashierUnpaidCount');
      if (cashierPill) cashierPill.innerText = unpaidCount;

      // Kitchen Home queue count pill
      const kitchenQueue = state.orders.filter(o => o.status === 'NEW' || o.status === 'PENDING').length;
      const kitchenPill = document.getElementById('navKitchenQueueCount');
      if (kitchenPill) kitchenPill.innerText = kitchenQueue;

      // Keep role navbar context in sync
      this.applyRoleNavbarContext();
    }
  };

  // Expose to window for inline events
  window.RestaurantApp = RestaurantApp;

  // Boot on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    RestaurantApp.init();
  });

})();
