// ================================================
//  Smart City — Module Router (main.js)
// ================================================

// Clock
function updateClock() {
  document.getElementById('clock').textContent =
    new Date().toLocaleTimeString('en-IN');
}
setInterval(updateClock, 1000);
updateClock();

// City selector
function selectCity(btn, city) {
  document.querySelectorAll('.city-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  window._currentCity = city;
  // Re-render current module with new city
  const active = document.querySelector('.nav-item.active');
  if (active) loadModule(active.dataset.module, active);
}

window._currentCity = 'Chandigarh';

// ── Module Loader ──
// Modules that are bundled in emergency.js (all service modules)
const BUNDLE_SRC = 'modules/emergency.js';

const MODULE_FILES = {
  dashboard:   'modules/dashboard.js',
  map:         BUNDLE_SRC,
  ai:          BUNDLE_SRC,
  bus:         'modules/bus.js',
  traffic:     'modules/traffic.js',
  repairs:     'modules/repairs.js',
  electricity: 'modules/electricity.js',
  water:       'modules/water.js',
  waste:       'modules/waste.js',
  aqi:         'modules/aqi.js',
  emergency:   BUNDLE_SRC,
  hospitals:   BUNDLE_SRC,
  schools:     BUNDLE_SRC,
  municipal:   BUNDLE_SRC,
  events:      BUNDLE_SRC,
  alerts:      BUNDLE_SRC,
};

const _loadedScripts = {};

function loadModule(name, navEl) {
  // Update sidebar active state
  if (navEl) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    navEl.classList.add('active');
  }

  const frame = document.getElementById('moduleFrame');

  // Show skeleton loader
  frame.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;padding:4px 0;">
      <div class="skeleton" style="height:32px;width:260px;"></div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;">
        ${[1,2,3,4].map(()=>`<div class="skeleton" style="height:90px;border-radius:12px;"></div>`).join('')}
      </div>
      <div class="skeleton" style="height:320px;border-radius:12px;"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <div class="skeleton" style="height:200px;border-radius:12px;"></div>
        <div class="skeleton" style="height:200px;border-radius:12px;"></div>
      </div>
    </div>`;

  // Load the module script if not already loaded, then render
  const src = MODULE_FILES[name];
  if (!src) {
    frame.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text3);">Module "${name}" not found.</div>`;
    return;
  }

  setTimeout(() => {
    if (_loadedScripts[name]) {
      // Already loaded — just render
      window[`render_${name}`] && window[`render_${name}`](frame);
    } else {
      // Dynamically inject script
      const s = document.createElement('script');
      s.src = src + '?v=' + Date.now(); // bust cache
      s.onload = () => {
        _loadedScripts[name] = true;
        window[`render_${name}`] && window[`render_${name}`](frame);
      };
      s.onerror = () => {
        frame.innerHTML = `<div style="padding:40px;text-align:center;color:var(--red);">⚠ Failed to load module: ${name}</div>`;
      };
      document.body.appendChild(s);
    }
  }, 300); // brief delay lets skeleton flash
}

// Load dashboard on start
window.addEventListener('DOMContentLoaded', () => {
  const dashNav = document.querySelector('[data-module="dashboard"]');
  loadModule('dashboard', dashNav);
});
