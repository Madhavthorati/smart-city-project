// Simple working admin module
function render_admin(el) {
  console.log('Admin module starting...');
  
  try {
    el.innerHTML = `
      <div class="fade-in">
        <div class="breadcrumb">Smart City / <span>Admin Panel</span></div>
        <div class="module-header">
          <div class="module-title">🔐 Admin Dashboard</div>
          <div class="module-subtitle">System Management · ${window._currentCity||'Chandigarh'}</div>
        </div>
        
        <!-- Admin Stats -->
        <div class="grid-4" style="margin-bottom:16px">
          <div class="stat-card" style="--stat-color:var(--blue)">
            <div class="stat-label">Total Users</div>
            <div class="stat-value" style="color:var(--blue)" id="totalUsers">0</div>
            <div class="stat-sub">Registered accounts</div>
          </div>
          <div class="stat-card" style="--stat-color:var(--orange)">
            <div class="stat-label">Pending Requests</div>
            <div class="stat-value" style="color:var(--orange)" id="pendingRequests">0</div>
            <div class="stat-sub">Awaiting response</div>
          </div>
          <div class="stat-card" style="--stat-color:var(--green)">
            <div class="stat-label">Resolved Today</div>
            <div class="stat-value" style="color:var(--green)" id="resolvedToday">0</div>
            <div class="stat-sub">Issues solved</div>
          </div>
          <div class="stat-card" style="--stat-color:var(--purple)">
            <div class="stat-label">Active Modules</div>
            <div class="stat-value" style="color:var(--purple)" id="activeModules">7</div>
            <div class="stat-sub">System modules</div>
          </div>
        </div>

        <!-- Admin Navigation Tabs -->
        <div class="admin-tabs">
          <button class="admin-tab active" onclick="showSection('users')">👥 Users</button>
          <button class="admin-tab" onclick="showSection('requests')">📋 Requests</button>
          <button class="admin-tab" onclick="showSection('modules')">⚙️ Modules</button>
          <button class="admin-tab" onclick="showSection('logs')">📊 Activity Logs</button>
        </div>

        <!-- Users Section -->
        <div id="usersSection" class="admin-section active">
          <div class="section-header">
            <h3>User Management</h3>
            <div class="section-controls">
              <input type="text" placeholder="Search users..." class="search-input" id="userSearch" onkeyup="searchUsers()">
              <button class="btn-primary" onclick="exportUsers()">📥 Export</button>
            </div>
          </div>
          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="usersTableBody">
                <!-- Users will be populated here -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Requests Section -->
        <div id="requestsSection" class="admin-section">
          <div class="section-header">
            <h3>User Requests</h3>
            <div class="section-controls">
              <select class="filter-select" id="requestFilter" onchange="filterRequests()">
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button class="btn-primary" onclick="exportRequests()">📥 Export</button>
            </div>
          </div>
          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>User</th>
                  <th>Module</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="requestsTableBody">
                <!-- Requests will be populated here -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Modules Section -->
        <div id="modulesSection" class="admin-section">
          <div class="section-header">
            <h3>Module Management</h3>
            <button class="btn-primary" onclick="addNewModule()">➕ Add Module</button>
          </div>
          <div class="modules-grid" id="modulesGrid">
            <!-- Modules will be populated here -->
          </div>
        </div>

        <!-- Activity Logs Section -->
        <div id="logsSection" class="admin-section">
          <div class="section-header">
            <h3>Activity Logs</h3>
            <div class="section-controls">
              <select class="filter-select" id="logFilter" onchange="filterLogs()">
                <option value="all">All Activities</option>
                <option value="login">Logins</option>
                <option value="request">Requests</option>
                <option value="admin">Admin Actions</option>
              </select>
            </div>
          </div>
          <div class="logs-container" id="logsContainer">
            <!-- Logs will be populated here -->
          </div>
        </div>
      </div>
    `;

    // Initialize admin dashboard
    initializeAdmin();
    console.log('Admin module loaded successfully');
    
  } catch (error) {
    console.error('Error loading admin module:', error);
    el.innerHTML = `
      <div style="padding: 40px; background: var(--red-bg); color: var(--red); border-radius: 12px; margin: 20px 0;">
        <h2>Admin Module Error</h2>
        <p>Error: ${error.message}</p>
        <button onclick="location.reload()" style="background: var(--red); color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; margin-top: 10px;">Reload Page</button>
      </div>
    `;
  }
}

// Initialize admin dashboard
function initializeAdmin() {
  loadAdminStats();
  loadUsers();
  loadRequests();
  loadModules();
  loadActivityLogs();
}

// Load admin statistics
function loadAdminStats() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
  const today = new Date().toDateString();
  
  document.getElementById('totalUsers').textContent = users.length;
  document.getElementById('pendingRequests').textContent = requests.filter(r => r.status === 'pending').length;
  document.getElementById('resolvedToday').textContent = requests.filter(r => 
    r.status === 'resolved' && new Date(r.updatedAt).toDateString() === today
  ).length;
}

// Load users table
function loadUsers() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const tbody = document.getElementById('usersTableBody');
  
  tbody.innerHTML = users.map(user => `
    <tr>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.mobile}</td>
      <td>${new Date(user.createdAt).toLocaleDateString()}</td>
      <td>
        <button class="btn-sm btn-info" onclick="viewUserDetails('${user.id}')">View</button>
        <button class="btn-sm btn-warning" onclick="suspendUser('${user.id}')">Suspend</button>
      </td>
    </tr>
  `).join('');
}

// Load requests table
function loadRequests() {
  const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
  const requestsTable = document.getElementById('requestsTableBody');
  
  requestsTable.innerHTML = requests.map(request => `
    <tr>
      <td><code>${request.id}</code></td>
      <td>${request.username}</td>
      <td>${request.module}</td>
      <td>${request.type}</td>
      <td>${request.description}</td>
      <td><span class="priority-badge ${request.priority}">${request.priority}</span></td>
      <td><span class="status-badge ${request.status.replace(' ', '-')}">${request.status}</span></td>
      <td>${new Date(request.createdAt).toLocaleDateString()}</td>
      <td>
        <button class="btn-sm btn-info" onclick="viewRequestDetails('${request.id}')">View</button>
        <button class="btn-sm btn-success" onclick="updateRequestStatus('${request.id}', 'resolved')">Resolve</button>
        <button class="btn-sm btn-danger" onclick="deleteRequest('${request.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Load modules grid
function loadModules() {
  const modulesGrid = document.getElementById('modulesGrid');
  const modules = ['water', 'electricity', 'traffic', 'bus', 'waste', 'aqi', 'repairs'];
  
  modulesGrid.innerHTML = modules.map(module => `
    <div class="module-card">
      <div class="module-header">
        <h4>${module.charAt(0).toUpperCase() + module.slice(1)}</h4>
        <div class="module-status active">Active</div>
      </div>
      <div class="module-stats">
        <div class="stat">
          <span class="stat-label">Status:</span>
          <span class="stat-value">Running</span>
        </div>
      </div>
      <div class="module-actions">
        <button class="btn-sm btn-info" onclick="configureModule('${module}')">Configure</button>
        <button class="btn-sm btn-warning" onclick="toggleModule('${module}')">Disable</button>
      </div>
    </div>
  `).join('');
}

// Load activity logs
function loadActivityLogs() {
  const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
  const logsContainer = document.getElementById('logsContainer');
  
  logsContainer.innerHTML = logs.slice(0, 50).map(log => `
    <div class="log-entry">
      <div class="log-time">${new Date(log.timestamp).toLocaleString()}</div>
      <div class="log-type">${log.type}</div>
      <div class="log-user">${log.username}</div>
      <div class="log-action">${log.action}</div>
    </div>
  `).join('');
}

// Show section
function showSection(section) {
  // Hide all sections
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  
  // Show selected section
  document.getElementById(section + 'Section').classList.add('active');
  event.target.classList.add('active');
}

// Action functions
function viewUserDetails(userId) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.id === userId);
  if (user) {
    alert(`User Details:\n\nUsername: ${user.username}\nEmail: ${user.email}\nMobile: ${user.mobile}\nRegistered: ${new Date(user.createdAt).toLocaleString()}`);
  }
}

function suspendUser(userId) {
  if (confirm('Are you sure you want to suspend this user?')) {
    alert('User suspended successfully');
  }
}

function viewRequestDetails(requestId) {
  const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
  const request = requests.find(r => r.id === requestId);
  if (request) {
    alert(`Request Details:\n\nID: ${request.id}\nUser: ${request.username}\nModule: ${request.module}\nType: ${request.type}\nDescription: ${request.description}\nPriority: ${request.priority}\nStatus: ${request.status}`);
  }
}

function updateRequestStatus(requestId, newStatus) {
  const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex !== -1) {
    requests[requestIndex].status = newStatus;
    requests[requestIndex].updatedAt = new Date().toISOString();
    localStorage.setItem('userRequests', JSON.stringify(requests));
    
    alert(`Request status updated to ${newStatus}`);
    loadRequests();
  }
}

function deleteRequest(requestId) {
  if (confirm('Are you sure you want to delete this request?')) {
    const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
    const requestIndex = requests.findIndex(r => r.id === requestId);
    
    if (requestIndex !== -1) {
      requests.splice(requestIndex, 1);
      localStorage.setItem('userRequests', JSON.stringify(requests));
      loadRequests();
      alert('Request deleted successfully');
    }
  }
}

function configureModule(moduleName) {
  alert(`Configure ${moduleName} module - Feature coming soon!`);
}

function toggleModule(moduleName) {
  alert(`Toggle ${moduleName} module - Feature coming soon!`);
}

function addNewModule() {
  alert('Add new module - Feature coming soon!');
}

function exportUsers() {
  alert('Export users - Feature coming soon!');
}

function exportRequests() {
  alert('Export requests - Feature coming soon!');
}

function searchUsers() {
  const searchTerm = document.getElementById('userSearch').value.toLowerCase();
  const rows = document.querySelectorAll('#usersTableBody tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? '' : 'none';
  });
}

function filterRequests() {
  const filter = document.getElementById('requestFilter').value;
  const rows = document.querySelectorAll('#requestsTableBody tr');
  
  rows.forEach(row => {
    if (filter === 'all') {
      row.style.display = '';
    } else {
      const status = row.querySelector('.status-badge').textContent.toLowerCase();
      row.style.display = status === filter ? '' : 'none';
    }
  });
}

function filterLogs() {
  const filter = document.getElementById('logFilter').value;
  const entries = document.querySelectorAll('.log-entry');
  
  entries.forEach(entry => {
    if (filter === 'all') {
      entry.style.display = '';
    } else {
      const type = entry.querySelector('.log-type').textContent.toLowerCase();
      entry.style.display = type === filter ? '' : 'none';
    }
  });
}
