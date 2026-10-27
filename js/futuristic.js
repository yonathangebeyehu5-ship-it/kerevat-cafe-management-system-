/* ==========================================================================
   KEREVAT OS 3.0 — QUANTUM FUTURISTIC ENGINE
   Command Palette | Particle Canvas | Cyber FX | Telemetry HUD | Radar Sweep
   ========================================================================== */

(function () {
  "use strict";

  // ─── 1. PARTICLE CANVAS BACKGROUND ───────────────────────────────────────
  function initParticleCanvas() {
    const canvas = document.getElementById("cyberParticleCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function makeParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.5 + 0.1
      };
    }
    for (let i = 0; i < 130; i++) particles.push(makeParticle());

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(function(p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,212,255," + p.alpha + ")";
        ctx.fill();
      });
      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(0,212,255," + (0.06 * (1 - dist / 90)) + ")";
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ─── 2. CYBER FX TOGGLE ──────────────────────────────────────────────────
  function initCyberFxToggle() {
    var btn = document.getElementById("btnToggleCyberFx");
    if (!btn) return;
    var htmlEl = document.documentElement;
    var active = false;
    btn.addEventListener("click", function () {
      active = !active;
      if (active) {
        htmlEl.classList.add("cyber-fx-active");
        btn.title = "Cyber FX: ON — Click to disable scanlines";
        btn.style.color = "#ff006e";
        if (window.RestaurantApp && window.RestaurantApp.showToast) {
          window.RestaurantApp.showToast("⚡ Cyber FX Mode ACTIVATED — Scanlines engaged", "info");
        }
      } else {
        htmlEl.classList.remove("cyber-fx-active");
        btn.title = "Toggle Futuristic Cyber FX / Scanlines";
        btn.style.color = "";
        if (window.RestaurantApp && window.RestaurantApp.showToast) {
          window.RestaurantApp.showToast("Cyber FX deactivated", "info");
        }
      }
    });
  }

  // ─── 3. QUANTUM COMMAND PALETTE ──────────────────────────────────────────
  var CMD_COMMANDS = [
    // Navigation
    { group: "NAVIGATE", icon: "fa-tower-broadcast",    label: "Control Center",         hint: "Live restaurant command hub",    view: "control-center" },
    { group: "NAVIGATE", icon: "fa-chart-pie",          label: "Owner Dashboard",         hint: "Revenue & analytics overview",   view: "dashboard" },
    { group: "NAVIGATE", icon: "fa-gauge-high",         label: "Operations Status",       hint: "Manager operations view",        view: "manager-ops" },
    { group: "NAVIGATE", icon: "fa-cash-register",      label: "Cashier POS",             hint: "Point of sale terminal",         view: "pos" },
    { group: "NAVIGATE", icon: "fa-fire-burner",        label: "Kitchen Display (KDS)",   hint: "Live kitchen order queue",       view: "kds" },
    { group: "NAVIGATE", icon: "fa-table-cells-large",  label: "Floor Plan & Tables",     hint: "Tactical table matrix",          view: "tables" },
    { group: "NAVIGATE", icon: "fa-bell-concierge",     label: "Waiter Terminal",         hint: "Waiter order & table hub",       view: "waiter-hub" },
    { group: "NAVIGATE", icon: "fa-mug-hot",            label: "Barista & Bar KDS",       hint: "Coffee & beverage station",      view: "barista-station" },
    { group: "NAVIGATE", icon: "fa-boxes-stacked",      label: "Stock & Inventory",       hint: "Inventory management",           view: "inventory" },
    { group: "NAVIGATE", icon: "fa-calendar-check",     label: "Reservations",            hint: "Table booking management",       view: "reservations" },
    { group: "NAVIGATE", icon: "fa-motorcycle",         label: "Delivery Dispatch",       hint: "Delivery order tracking",        view: "delivery" },
    { group: "NAVIGATE", icon: "fa-users",              label: "Customers & Loyalty",     hint: "CRM and loyalty programme",      view: "crm" },
    { group: "NAVIGATE", icon: "fa-file-invoice-dollar",label: "Reports & P&L",          hint: "Financial reports",              view: "reports" },
    { group: "NAVIGATE", icon: "fa-shield-halved",      label: "Security & Audit Log",    hint: "System audit trail",             view: "audit-log" },
    { group: "NAVIGATE", icon: "fa-gears",              label: "Smart Automations",       hint: "Workflow automations",           view: "automations" },
    // Actions
    { group: "ACTIONS",  icon: "fa-plus",               label: "New Order",               hint: "Open POS for a new order",       action: "newOrder" },
    { group: "ACTIONS",  icon: "fa-brain",              label: "Open Quantum AI",         hint: "Neural AI restaurant assistant", action: "openAI" },
    { group: "ACTIONS",  icon: "fa-chart-line",         label: "Open HUD Telemetry",      hint: "Live system diagnostics",        action: "openTelemetry" },
    { group: "ACTIONS",  icon: "fa-wand-magic",         label: "Toggle Cyber FX",         hint: "Enable/disable scanlines",       action: "cyberFx" },
    { group: "ACTIONS",  icon: "fa-rotate",             label: "Refresh Control Center",  hint: "Reload live dashboard",          action: "refresh" },
  ];

  var cmdSelectedIndex = -1;
  var cmdFilteredResults = [];

  function openCommandPalette() {
    var overlay = document.getElementById("cmdPaletteOverlay");
    var input   = document.getElementById("cmdPaletteInput");
    if (!overlay || !input) return;
    overlay.classList.add("open");
    input.value = "";
    cmdSelectedIndex = -1;
    renderCommandResults("");
    setTimeout(function () { input.focus(); }, 80);
  }

  function closeCommandPalette() {
    var overlay = document.getElementById("cmdPaletteOverlay");
    if (overlay) overlay.classList.remove("open");
  }

  function renderCommandResults(query) {
    var resultsEl = document.getElementById("cmdPaletteResults");
    if (!resultsEl) return;
    var q = (query || "").toLowerCase().trim();
    var filtered = CMD_COMMANDS.filter(function (c) {
      return !q || c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q) || c.group.toLowerCase().includes(q);
    });
    cmdFilteredResults = filtered;
    cmdSelectedIndex = filtered.length > 0 ? 0 : -1;

    if (filtered.length === 0) {
      resultsEl.innerHTML = '<div style="padding:20px;text-align:center;color:rgba(148,163,184,0.5);font-size:0.85rem;">No results for "<strong>' + query + '</strong>"</div>';
      return;
    }

    var groups = {};
    filtered.forEach(function (c, idx) {
      if (!groups[c.group]) groups[c.group] = [];
      groups[c.group].push({ cmd: c, idx: idx });
    });

    var html = "";
    Object.keys(groups).forEach(function (grp) {
      html += '<div class="cmd-result-group-title">' + grp + '</div>';
      groups[grp].forEach(function (item) {
        var sel = item.idx === cmdSelectedIndex ? " selected" : "";
        html += '<div class="cmd-result-item' + sel + '" data-idx="' + item.idx + '">'
          + '<div class="cmd-result-icon"><i class="fa-solid ' + item.cmd.icon + '"></i></div>'
          + '<div><div class="cmd-result-label">' + item.cmd.label + '</div>'
          + '<div class="cmd-result-hint">' + item.cmd.hint + '</div></div>'
          + '</div>';
      });
    });
    resultsEl.innerHTML = html;

    resultsEl.querySelectorAll(".cmd-result-item").forEach(function (el) {
      el.addEventListener("click", function () {
        var idx = parseInt(el.getAttribute("data-idx"), 10);
        executeCommand(cmdFilteredResults[idx]);
      });
      el.addEventListener("mouseenter", function () {
        cmdSelectedIndex = parseInt(el.getAttribute("data-idx"), 10);
        highlightSelected();
      });
    });
  }

  function highlightSelected() {
    var items = document.querySelectorAll(".cmd-result-item");
    items.forEach(function (el, i) {
      el.classList.toggle("selected", parseInt(el.getAttribute("data-idx"), 10) === cmdSelectedIndex);
    });
  }

  function executeCommand(cmd) {
    if (!cmd) return;
    closeCommandPalette();
    if (cmd.view && window.RestaurantApp) {
      window.RestaurantApp.switchView(cmd.view);
    } else if (cmd.action) {
      switch (cmd.action) {
        case "newOrder":
          if (window.RestaurantApp) window.RestaurantApp.switchView("pos");
          break;
        case "openAI":
          var drawer = document.getElementById("aiAssistantDrawer");
          if (drawer) drawer.classList.add("open");
          break;
        case "openTelemetry":
          var tel = document.getElementById("telemetryModalOverlay");
          if (tel) tel.classList.add("open");
          break;
        case "cyberFx":
          var fxBtn = document.getElementById("btnToggleCyberFx");
          if (fxBtn) fxBtn.click();
          break;
        case "refresh":
          var ccBtn = document.getElementById("btnRefreshControlCenter");
          if (ccBtn) ccBtn.click();
          break;
      }
    }
    if (window.RestaurantApp && window.RestaurantApp.showToast) {
      window.RestaurantApp.showToast("⚡ " + cmd.label, "info");
    }
  }

  function initCommandPalette() {
    var overlay = document.getElementById("cmdPaletteOverlay");
    var input   = document.getElementById("cmdPaletteInput");
    var openBtn = document.getElementById("btnOpenCommandPalette");
    if (!overlay || !input) return;

    // Open via button
    if (openBtn) openBtn.addEventListener("click", openCommandPalette);

    // Global Ctrl+K
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        var isOpen = overlay.classList.contains("open");
        if (isOpen) closeCommandPalette(); else openCommandPalette();
      }
      if (!overlay.classList.contains("open")) return;
      if (e.key === "Escape") { closeCommandPalette(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        cmdSelectedIndex = Math.min(cmdSelectedIndex + 1, cmdFilteredResults.length - 1);
        highlightSelected();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        cmdSelectedIndex = Math.max(cmdSelectedIndex - 1, 0);
        highlightSelected();
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (cmdSelectedIndex >= 0) executeCommand(cmdFilteredResults[cmdSelectedIndex]);
      }
    });

    input.addEventListener("input", function () { renderCommandResults(input.value); });

    // Close on overlay click
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeCommandPalette();
    });
  }

  // ─── 4. TELEMETRY HUD MODAL ──────────────────────────────────────────────
  function initTelemetryHUD() {
    var openBtn  = document.getElementById("btnOpenTelemetryModal");
    var closeBtn = document.getElementById("btnCloseTelemetryModal");
    var doneBtn  = document.getElementById("btnCloseTelemetryDone");
    var exportBtn= document.getElementById("btnTeleExportLog");
    var overlay  = document.getElementById("telemetryModalOverlay");
    if (!overlay) return;

    if (openBtn)   openBtn.addEventListener("click",  function () { overlay.classList.add("open"); updateTelemetry(); });
    if (closeBtn)  closeBtn.addEventListener("click", function () { overlay.classList.remove("open"); });
    if (doneBtn)   doneBtn.addEventListener("click",  function () { overlay.classList.remove("open"); });
    overlay.addEventListener("click", function (e) { if (e.target === overlay) overlay.classList.remove("open"); });

    if (exportBtn) exportBtn.addEventListener("click", function () {
      var rows = document.querySelectorAll(".tele-feed-row");
      var txt = "KEREVAT OS 3.0 - TELEMETRY EXPORT\n" + new Date().toLocaleString() + "\n\n";
      rows.forEach(function (r) { txt += r.textContent.trim() + "\n"; });
      var blob = new Blob([txt], { type: "text/plain" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = "kerevat_telemetry_" + Date.now() + ".txt"; a.click();
    });
  }

  function updateTelemetry() {
    var latency = (Math.floor(Math.random() * 25) + 8) + "ms";
    var sessions = Math.floor(Math.random() * 8) + 8;
    var latEl = document.getElementById("teleMeshLatency");
    var sesEl = document.getElementById("teleActiveSessions");
    if (latEl) latEl.textContent = latency;
    if (sesEl) sesEl.textContent = sessions;

    // Append to live feed
    var feed = document.getElementById("teleLiveFeed");
    if (feed) {
      var now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      var msgs = [
        ["text-success", "▶ Heartbeat OK — All stations responding"],
        ["text-info",    "✓ Quantum AI neural sync complete"],
        ["text-warning", "⚠ Barista station queue at 4 items"],
        ["text-success", "💰 Transaction processed — 680 ETB"]
      ];
      var m = msgs[Math.floor(Math.random() * msgs.length)];
      var row = document.createElement("div");
      row.className = "tele-feed-row";
      row.innerHTML = '<span class="tele-time">' + now + '</span><span class="tele-msg ' + m[0] + '">' + m[1] + '</span>';
      feed.insertBefore(row, feed.firstChild);
      if (feed.children.length > 12) feed.removeChild(feed.lastChild);
    }
  }

  // ─── 5. FLOOR PLAN RADAR SWEEP CONTROLS ──────────────────────────────────
  function initRadarSweep() {
    var toggleBtn = document.getElementById("btnToggleRadarSweep");
    var statusEl  = document.getElementById("radarSweepStatusText");
    var grid      = document.getElementById("restaurantFloorGrid");
    if (!toggleBtn || !grid) return;

    var radarActive = true;
    toggleBtn.addEventListener("click", function () {
      radarActive = !radarActive;
      if (statusEl) statusEl.textContent = radarActive ? "ON" : "OFF";
      var beam = document.getElementById("radarSweepBeam");
      if (beam) beam.style.animationPlayState = radarActive ? "running" : "paused";
      toggleBtn.classList.toggle("active", radarActive);
      if (window.RestaurantApp) window.RestaurantApp.showToast("Radar sweep " + (radarActive ? "ACTIVE" : "PAUSED"), "info");
    });

    var heatmapBtn  = document.getElementById("btnToggleHeatmap");
    var heatmapText = document.getElementById("heatmapStatusText");
    if (heatmapBtn) {
      var heatOn = false;
      heatmapBtn.addEventListener("click", function () {
        heatOn = !heatOn;
        if (heatmapText) heatmapText.textContent = heatOn ? "ON" : "OFF";
        grid.classList.toggle("heatmap-active", heatOn);
        if (window.RestaurantApp) window.RestaurantApp.showToast("Zone heatmap " + (heatOn ? "ENABLED" : "DISABLED"), "info");
      });
    }

    var syncBtn = document.getElementById("btnFloorResetQuick");
    if (syncBtn) syncBtn.addEventListener("click", function () {
      if (window.RestaurantApp) {
        window.RestaurantApp.renderFloorPlan();
        window.RestaurantApp.showToast("⚡ Floor matrix synchronized", "success");
      }
    });
  }

  // ─── 6. LIVE TICKER LATENCY SIMULATION ───────────────────────────────────
  function initTickerLatency() {
    var latEl = document.getElementById("tickerLatency");
    if (!latEl) return;
    setInterval(function () {
      latEl.textContent = (Math.floor(Math.random() * 22) + 8) + "ms";
    }, 3000);
  }

  // ─── 7. AI ENHANCED TYPING ANIMATION & QUANTUM NEURAL INTELLIGENCE ────
  function patchAITypingAnimation() {
    if (!window.RestaurantApp) return;
    var orig = window.RestaurantApp.handleAIQuery.bind(window.RestaurantApp);
    var origGen = window.RestaurantApp.generateAIResponse.bind(window.RestaurantApp);

    // Supercharge AI response engine with futuristic analytics
    window.RestaurantApp.generateAIResponse = function (query) {
      var q = (query || "").toLowerCase();
      var state = window.appStore ? window.appStore.state : null;

      if (q.includes("predict") || q.includes("trend") || q.includes("forecast") || q.includes("tomorrow")) {
        return '<div class="ai-quantum-response">'
          + '<div class="ai-badge-header"><span class="badge-live-pulse"><i class="fa-solid fa-chart-line"></i> NEURAL REVENUE PROJECTION</span></div>'
          + '<p>🔮 <strong>Quantum Predictive Forecast (Next 24 Hours):</strong></p>'
          + '<p>• <strong>Projected Daily Revenue:</strong> <span style="color:var(--cyber-cyan); font-weight:800; font-family:\'Orbitron\',monospace; font-size:1.05rem;">56,400 ETB</span> <small style="color:var(--cyber-emerald); font-weight:600;">(▲ +8.2% vs 7-day baseline)</small></p>'
          + '<p>• <strong>Peak Traffic Surge:</strong> <strong style="color:var(--cyber-amber);">12:30 PM – 2:15 PM</strong> (Lunch Rush) and <strong style="color:var(--cyber-amber);">7:00 PM – 9:30 PM</strong> (Dinner Peak).</p>'
          + '<p>• <strong>Predicted Demand Spike:</strong> +38% orders for <em>Special Tibs</em> and <em>Kerevat Signature Burger</em>.</p>'
          + '<p>• <strong>Operational Recommendation:</strong> Pre-prep 45 portions of marinated beef & ensure Barista station has 24L fresh milk chilled by 11:30 AM.</p>'
          + '</div>';
      }

      if (q.includes("staff") || q.includes("performance") || q.includes("employee") || q.includes("roster")) {
        return '<div class="ai-quantum-response">'
          + '<div class="ai-badge-header"><span class="badge-live-pulse"><i class="fa-solid fa-users-gear"></i> CREW TELEMETRY MATRIX</span></div>'
          + '<p>👥 <strong>Active Shift Crew Intelligence:</strong></p>'
          + '<p>• <strong>Total Active On Shift:</strong> <strong style="color:var(--cyber-cyan);">24 Staff Members</strong> across 4 stations.</p>'
          + '<p>• <strong>Top Server Velocity:</strong> <strong style="color:var(--cyber-emerald);">Almaz T.</strong> — 38 table turns (avg 26 mins/table, 100% guest rating).</p>'
          + '<p>• <strong>Kitchen Expediter:</strong> <strong style="color:var(--cyber-cyan);">Chef Hailemariam</strong> — Ticket throughput 3.4 tickets/min, zero remakes.</p>'
          + '<p>• <strong>Shift Attendance Rate:</strong> <strong style="color:var(--cyber-emerald);">96%</strong> (1 scheduled shift swap approved).</p>'
          + '</div>';
      }

      if (q.includes("power") || q.includes("generator") || q.includes("energy") || q.includes("diesel")) {
        return '<div class="ai-quantum-response">'
          + '<div class="ai-badge-header"><span class="badge-live-pulse"><i class="fa-solid fa-bolt"></i> INFRASTRUCTURE RESILIENCE</span></div>'
          + '<p>⚡ <strong>Power & Cold-Chain Vitals:</strong></p>'
          + '<p>• <strong>Grid Status:</strong> Addis Grid stable (228V AC, 50Hz)</p>'
          + '<p>• <strong>Standby 150kVA Generator:</strong> Ready (Auto-transfer in &lt;6 seconds), Diesel at <strong style="color:var(--cyber-emerald);">84% capacity</strong> (~18.5 hours continuous run time).</p>'
          + '<p>• <strong>Walk-in Freezer:</strong> <strong style="color:var(--cyber-cyan);">-18.4°C</strong> (Target -18°C) | Dairy Chiller: <strong style="color:var(--cyber-cyan);">+3.1°C</strong>.</p>'
          + '</div>';
      }

      return origGen(query);
    };

    window.RestaurantApp.handleAIQuery = function (query) {
      var mc = document.getElementById("aiChatMessages");
      if (!mc) { orig(query); return; }

      // User bubble
      var userMsg = document.createElement("div");
      userMsg.className = "ai-message user-msg";
      userMsg.innerHTML = '<div class="msg-avatar"><i class="fa-solid fa-user"></i></div><div class="msg-content">' + query + '</div>';
      mc.appendChild(userMsg);
      mc.scrollTop = mc.scrollHeight;

      // Typing indicator
      var typingMsg = document.createElement("div");
      typingMsg.className = "ai-message assistant-msg";
      typingMsg.innerHTML = '<div class="msg-avatar"><i class="fa-solid fa-brain"></i></div>'
        + '<div class="msg-content"><div class="ai-typing-indicator"><span></span><span></span><span></span></div></div>';
      mc.appendChild(typingMsg);
      mc.scrollTop = mc.scrollHeight;

      var app = window.RestaurantApp;
      setTimeout(function () {
        var answer = app.generateAIResponse(query);
        typingMsg.querySelector(".msg-content").innerHTML = answer;
        mc.scrollTop = mc.scrollHeight;
        if (app.playSound) app.playSound("ding");
      }, 700 + Math.random() * 400);
    };
  }

  // ─── 8. BRAND LOGO — NAVIGATE TO CONTROL CENTER ─────────────────────────
  function initBrandHomeClick() {
    var brand = document.getElementById("brandNavHome");
    if (!brand) return;
    brand.addEventListener("click", function () {
      if (window.RestaurantApp) window.RestaurantApp.switchView("control-center");
    });
  }

  // ─── 9. KDS CARD URGENCY CLASSIFICATION ──────────────────────────────────
  function initKDSUrgencyWatcher() {
    setInterval(function () {
      document.querySelectorAll(".kds-ticket-card").forEach(function (card) {
        var timeEl = card.querySelector(".kds-elapsed, .kds-timer, [data-elapsed]");
        if (!timeEl) return;
        var mins = parseInt(timeEl.textContent, 10);
        card.classList.toggle("urgent",      mins > 18);
        card.classList.toggle("warning-time", mins > 10 && mins <= 18);
      });
    }, 5000);
  }

  // ─── 10. SMOOTH VIEW TRANSITION ENHANCEMENT ──────────────────────────────
  function initViewTransitions() {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.classList && node.classList.contains("view-panel") && node.classList.contains("active")) {
            node.style.opacity = "0"; node.style.transform = "translateY(12px)";
            requestAnimationFrame(function () {
              node.style.transition = "opacity 0.35s ease, transform 0.35s ease";
              node.style.opacity = "1"; node.style.transform = "translateY(0)";
            });
          }
        });
      });
    });
    var main = document.getElementById("mainContent");
    if (main) observer.observe(main, { childList: false, attributes: true, subtree: true, attributeFilter: ["class"] });
  }

  // ─── BOOT ─────────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", function () {
    initParticleCanvas();
    initCyberFxToggle();
    initCommandPalette();
    initTelemetryHUD();
    initRadarSweep();
    initTickerLatency();
    initBrandHomeClick();
    initKDSUrgencyWatcher();
    initViewTransitions();

    // Patch AI after app initialises
    setTimeout(patchAITypingAnimation, 500);

    // Boot toast
    setTimeout(function () {
      if (window.RestaurantApp && window.RestaurantApp.showToast) {
        window.RestaurantApp.showToast("⚡ KEREVAT OS 3.0 QUANTUM ENGINE ONLINE — Press Ctrl+K for Command HUD", "info");
      }
    }, 1500);

    console.log("🚀 KEREVAT OS 3.0 Quantum Futuristic Engine Initialized");
  });

})();
