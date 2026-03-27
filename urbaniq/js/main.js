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
  userDashboard: 'modules/userDashboard.js',
  admin:       'modules/admin.js',
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

// Authentication check
function checkAuthentication() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = 'login.html';
    return false;
  }
  return JSON.parse(currentUser);
}

// Load dashboard on start
window.addEventListener('DOMContentLoaded', () => {
  // Check if user is authenticated
  const user = checkAuthentication();
  if (!user) return;
  
  // Add user info to header
  addUserInfoToHeader(user);
  
  const dashNav = document.querySelector('[data-module="dashboard"]');
  loadModule('dashboard', dashNav);
  
  // Add module-specific request buttons only
  setTimeout(() => {
    if (typeof addRequestButtonsToAllModules === 'function') {
      addRequestButtonsToAllModules();
    }
  }, 3000);
});

// Add manual request button for users
function addManualRequestButton() {
  // Check if button already exists
  if (document.getElementById('manualRequestBtn')) {
    return;
  }
  
  const header = document.querySelector('.header-right');
  if (header) {
    const btn = document.createElement('button');
    btn.id = 'manualRequestBtn';
    btn.className = 'request-btn header-request-btn';
    btn.innerHTML = '📝 Submit Request';
    btn.onclick = () => {
      if (typeof showGenericRequestDialog === 'function') {
        showGenericRequestDialog();
      } else {
        alert('Request system not ready. Please refresh the page.');
      }
    };
    
    // Add button with proper spacing
    header.appendChild(btn);
    console.log('Manual request button added to header');
  }
}

// Add user info to header
function addUserInfoToHeader(user) {
  const headerRight = document.querySelector('.header-right');
  const userInfo = document.createElement('div');
  userInfo.className = 'user-info';
  userInfo.innerHTML = `
    <span class="user-name">👤 ${user.username}</span>
    <button class="logout-btn" onclick="logout()">Logout</button>
  `;
  headerRight.insertBefore(userInfo, headerRight.firstChild);
  
  // Show admin panel for admin users
  if (user.username === 'admin' || user.email.includes('admin')) {
    document.getElementById('adminNavItem').style.display = 'block';
  }
}

// Logout function
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}
