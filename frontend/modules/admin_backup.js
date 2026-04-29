// modules/admin.js

// Request System Class (backup definition)
class RequestSystem {
  constructor() {
    this.requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
  }

  getAllRequests() {
    return this.requests;
  }

  updateRequestWithResponse(requestId, status, adminResponse, adminUsername) {
    const requestIndex = this.requests.findIndex(r => r.id === requestId);
    if (requestIndex !== -1) {
      this.requests[requestIndex].status = status;
      this.requests[requestIndex].adminResponse = adminResponse;
      this.requests[requestIndex].updatedAt = new Date().toISOString();
      this.requests[requestIndex].respondedBy = adminUsername;
      
      this.saveRequests();
      this.logActivity('admin', adminUsername, `Responded to request ${requestId}`);
      
      return true;
    }
    return false;
  }

  saveRequests() {
    localStorage.setItem('userRequests', JSON.stringify(this.requests));
  }

  logActivity(type, username, action) {
    const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
    logs.push({
      type,
      username,
      action,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('activityLogs', JSON.stringify(logs));
  }
}

function render_admin(el) {
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
          <div class="stat-sub">Awaiting action</div>
        </div>
        <div class="stat-card" style="--stat-color:var(--green)">
          <div class="stat-label">Resolved Today</div>
          <div class="stat-value" style="color:var(--green)" id="resolvedToday">0</div>
          <div class="stat-sub">Issues resolved</div>
        </div>
        <div class="stat-card" style="--stat-color:var(--purple)">
          <div class="stat-label">Active Modules</div>
          <div class="stat-value" style="color:var(--purple)" id="activeModules">0</div>
          <div class="stat-sub">System modules</div>
        </div>
      </div>

      <!-- Admin Navigation Tabs -->
      <div class="admin-tabs">
        <button class="admin-tab active" onclick="showAdminSection('users')">👥 Users</button>
        <button class="admin-tab" onclick="showAdminSection('requests')">📋 Requests</button>
        <button class="admin-tab" onclick="showAdminSection('modules')">⚙️ Modules</button>
        <button class="admin-tab" onclick="showAdminSection('moduleData')">📝 Module Data</button>
        <button class="admin-tab" onclick="showAdminSection('logs')">📊 Activity Logs</button>
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
          <table class="data-table" id="usersTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Registered</th>
                <th>Status</th>
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
          <table class="data-table" id="requestsTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Type</th>
                <th>Module</th>
                <th>Description</th>
                <th>Status</th>
                <th>Priority</th>
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

      <!-- Module Data Editor Section -->
      <div id="moduleDataSection" class="admin-section">
        <div class="section-header">
          <h3>Module Data Editor</h3>
          <div class="section-controls">
            <select class="filter-select" id="moduleSelector" onchange="loadModuleData()">
              <option value="">Select Module...</option>
              <option value="water">Water Supply</option>
              <option value="electricity">Electricity</option>
              <option value="traffic">Traffic</option>
              <option value="bus">Bus Routes</option>
              <option value="waste">Waste Management</option>
              <option value="aqi">Air Quality</option>
              <option value="repairs">Road Repairs</option>
            </select>
            <button class="btn-primary" onclick="saveModuleData()">💾 Save Changes</button>
            <button class="btn-secondary" onclick="refreshModuleDisplay()">🔄 Refresh Display</button>
          </div>
        </div>
        <div id="moduleDataEditor" class="module-editor">
          <div class="editor-placeholder">
            <p>Select a module to edit its data</p>
          </div>
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
}

// Admin initialization
function initializeAdmin() {
  // Initialize request system if not already initialized
  if (!window.requestSystem) {
    window.requestSystem = new RequestSystem();
  }
  
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
  const resolvedToday = requests.filter(r => r.status === 'resolved' && new Date(r.updatedAt).toDateString() === today).length;
  
  document.getElementById('totalUsers').textContent = users.length;
  document.getElementById('pendingRequests').textContent = requests.filter(r => r.status === 'pending').length;
  document.getElementById('resolvedToday').textContent = resolvedToday;
  document.getElementById('activeModules').textContent = Object.keys(MODULE_FILES).length;
}

// Load users table
function loadUsers() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const tbody = document.getElementById('usersTableBody');
  
  tbody.innerHTML = users.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.mobile}</td>
      <td>${new Date(user.createdAt).toLocaleDateString()}</td>
      <td><span class="status-badge active">Active</span></td>
      <td>
        <button class="btn-sm btn-info" onclick="viewUserDetails('${user.id}')">View</button>
        <button class="btn-sm btn-warning" onclick="suspendUser('${user.id}')">Suspend</button>
      </td>
    </tr>
  `).join('');
}

// Load requests table
function loadRequests() {
  const requests = requestSystem ? requestSystem.getAllRequests() : [];
  const requestsTable = document.getElementById('requestsTable');
  
  requestsTable.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Request ID</th>
          <th>User</th>
          <th>Module</th>
          <th>Type</th>
          <th>Location</th>
          <th>Description</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Created</th>
          <th>Admin Response</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${requests.map(request => `
          <tr>
            <td><code>${request.id}</code></td>
            <td>${request.username}</td>
            <td><span class="module-badge">${request.module}</span></td>
            <td>${getRequestTypeLabel(request.type, request.module)}</td>
            <td>${request.location || 'N/A'}</td>
            <td><div class="description-text">${request.description}</div></td>
            <td><span class="priority-badge ${request.priority}">${request.priority}</span></td>
            <td><span class="status-badge ${request.status.replace(' ', '-')}">${request.status}</span></td>
            <td>${new Date(request.createdAt).toLocaleDateString()}</td>
            <td>
              ${request.adminResponse ? 
                `<div class="admin-response">
                  <div class="response-text">${request.adminResponse}</div>
                  <small>by ${request.respondedBy || 'Admin'}</small>
                </div>` : 
                '<span class="no-response">No response yet</span>'
              }
            </td>
            <td>
              <button class="btn-sm btn-info" onclick="viewRequestDetails('${request.id}')">View</button>
              ${!request.adminResponse ? 
                `<button class="btn-sm btn-success" onclick="respondToRequest('${request.id}')">Respond</button>` : 
                `<button class="btn-sm btn-warning" onclick="updateRequestStatus('${request.id}')">Update</button>`
              }
              <button class="btn-sm btn-danger" onclick="deleteRequest('${request.id}')">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Get request type label
function getRequestTypeLabel(type, module) {
  const labels = {
    water: {
      water_shortage: 'Water Shortage',
      low_pressure: 'Low Pressure',
      contamination: 'Contamination',
      leakage: 'Leakage',
      supply_timing: 'Supply Timing',
      quality_issue: 'Quality Issue',
      connection_issue: 'Connection Issue'
    },
    electricity: {
      power_outage: 'Power Outage',
      voltage_issue: 'Voltage Issue',
      billing_issue: 'Billing Issue',
      connection_request: 'New Connection',
      safety_hazard: 'Safety Hazard',
      street_light: 'Street Light'
    },
    traffic: {
      traffic_jam: 'Traffic Jam',
      signal_issue: 'Signal Issue',
      road_damage: 'Road Damage',
      parking_issue: 'Parking Issue',
      accident: 'Accident Report',
      signage_issue: 'Signage Issue'
    },
    bus: {
      bus_delay: 'Bus Delay',
      route_issue: 'Route Issue',
      driver_behavior: 'Driver Behavior',
      bus_condition: 'Bus Condition',
      schedule_issue: 'Schedule Issue',
      safety_issue: 'Safety Issue'
    },
    waste: {
      garbage_not_collected: 'Garbage Not Collected',
      collection_delay: 'Collection Delay',
      bin_overflow: 'Bin Overflow',
      illegal_dumping: 'Illegal Dumping',
      sewer_issue: 'Sewer Issue',
      recycling_issue: 'Recycling Issue'
    },
    aqi: {
      air_pollution: 'Air Pollution',
      industrial_emission: 'Industrial Emission',
      vehicle_pollution: 'Vehicle Pollution',
      construction_dust: 'Construction Dust',
      burning_issue: 'Burning Issue',
      health_concern: 'Health Concern'
    },
    repairs: {
      pothole: 'Pothole Repair',
      road_damage: 'Road Damage',
      street_light: 'Street Light Repair',
      drainage_issue: 'Drainage Issue',
      footpath_repair: 'Footpath Repair',
      traffic_sign: 'Traffic Sign Repair'
    }
  };
  
  return labels[module]?.[type] || type;
}

// Respond to request
function respondToRequest(requestId) {
  const request = requestSystem.requests.find(r => r.id === requestId);
  if (!request) return;
  
  const modal = document.createElement('div');
  modal.className = 'request-modal';
  modal.innerHTML = `
    <div class="request-modal-content">
      <div class="request-modal-header">
        <h3>📝 Respond to Request</h3>
        <button class="close-btn" onclick="closeRequestDialog()">&times;</button>
      </div>
      <div class="request-details">
        <h4>Request Details</h4>
        <p><strong>User:</strong> ${request.username}</p>
        <p><strong>Module:</strong> ${request.module}</p>
        <p><strong>Type:</strong> ${getRequestTypeLabel(request.type, request.module)}</p>
        <p><strong>Location:</strong> ${request.location || 'N/A'}</p>
        <p><strong>Description:</strong> ${request.description}</p>
        <p><strong>Priority:</strong> ${request.priority}</p>
      </div>
      <form id="responseForm" onsubmit="submitAdminResponse(event, '${requestId}')">
        <div class="form-group">
          <label for="responseStatus">Status</label>
          <select id="responseStatus" name="status" required>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div class="form-group">
          <label for="adminResponse">Your Response</label>
          <textarea id="adminResponse" name="response" required 
                    placeholder="Enter your response to the user..." 
                    rows="4"></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="closeRequestDialog()">Cancel</button>
          <button type="submit" class="btn-primary">Send Response</button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Submit admin response
function submitAdminResponse(event, requestId) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const status = formData.get('status');
  const response = formData.get('response');
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const success = requestSystem.updateRequestWithResponse(requestId, status, response, currentUser.username);
  
  if (success) {
    alert('Response sent successfully!');
    closeRequestDialog();
    loadRequests(); // Refresh the requests table
  }
}

// Update request status
function updateRequestStatus(requestId) {
  const request = requestSystem.requests.find(r => r.id === requestId);
  if (!request) return;
  
  const modal = document.createElement('div');
  modal.className = 'request-modal';
  modal.innerHTML = `
    <div class="request-modal-content">
      <div class="request-modal-header">
        <h3>🔄 Update Request Status</h3>
        <button class="close-btn" onclick="closeRequestDialog()">&times;</button>
      </div>
      <form id="statusForm" onsubmit="submitStatusUpdate(event, '${requestId}')">
        <div class="form-group">
          <label for="newStatus">New Status</label>
          <select id="newStatus" name="status" required>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div class="form-group">
          <label for="statusResponse">Additional Response (Optional)</label>
          <textarea id="statusResponse" name="response" 
                    placeholder="Add any additional information..." 
                    rows="3"></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="closeRequestDialog()">Cancel</button>
          <button type="submit" class="btn-primary">Update Status</button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Submit status update
function submitStatusUpdate(event, requestId) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const status = formData.get('status');
  const response = formData.get('response') || '';
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const success = requestSystem.updateRequestWithResponse(requestId, status, response, currentUser.username);
  
  if (success) {
    alert('Status updated successfully!');
    closeRequestDialog();
    loadRequests(); // Refresh the requests table
  }
}

// View request details
function viewRequestDetails(requestId) {
  const request = requestSystem.requests.find(r => r.id === requestId);
  if (!request) return;
  
  const modal = document.createElement('div');
  modal.className = 'request-modal';
  modal.innerHTML = `
    <div class="request-modal-content">
      <div class="request-modal-header">
        <h3>📋 Request Details</h3>
        <button class="close-btn" onclick="closeRequestDialog()">&times;</button>
      </div>
      <div class="request-details">
        <h4>Request Information</h4>
        <p><strong>Request ID:</strong> <code>${request.id}</code></p>
        <p><strong>User:</strong> ${request.username}</p>
        <p><strong>Email:</strong> ${request.email}</p>
        <p><strong>Mobile:</strong> ${request.mobile}</p>
        <p><strong>Module:</strong> ${request.module}</p>
        <p><strong>Type:</strong> ${getRequestTypeLabel(request.type, request.module)}</p>
        <p><strong>Location:</strong> ${request.location || 'N/A'}</p>
        <p><strong>Description:</strong></p>
        <div class="description-box">${request.description}</div>
        <p><strong>Priority:</strong> <span class="priority-badge ${request.priority}">${request.priority}</span></p>
        <p><strong>Status:</strong> <span class="status-badge ${request.status.replace(' ', '-')}">${request.status}</span></p>
        <p><strong>Created:</strong> ${new Date(request.createdAt).toLocaleString()}</p>
        <p><strong>Last Updated:</strong> ${new Date(request.updatedAt).toLocaleString()}</p>
        
        ${request.adminResponse ? `
          <h4>Admin Response</h4>
          <div class="admin-response-box">
            <p>${request.adminResponse}</p>
            <small>Responded by: ${request.respondedBy || 'Admin'}</small>
          </div>
        ` : '<p><em>No admin response yet</em></p>'}
      </div>
      <div class="form-actions">
        <button class="btn-secondary" onclick="closeRequestDialog()">Close</button>
        ${!request.adminResponse ? 
          `<button class="btn-primary" onclick="respondToRequest('${request.id}')">Respond</button>` : 
          `<button class="btn-warning" onclick="updateRequestStatus('${request.id}')">Update Status</button>`
        }
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Delete request
function deleteRequest(requestId) {
  if (confirm('Are you sure you want to delete this request?')) {
    const requestIndex = requestSystem.requests.findIndex(r => r.id === requestId);
    if (requestIndex !== -1) {
      requestSystem.requests.splice(requestIndex, 1);
      requestSystem.saveRequests();
      loadRequests(); // Refresh the requests table
      alert('Request deleted successfully!');
    }
  }
}

// Load modules grid
function loadModules() {
  const modulesGrid = document.getElementById('modulesGrid');
  const moduleNames = Object.keys(MODULE_FILES);
  
  modulesGrid.innerHTML = moduleNames.map(module => `
    <div class="module-card">
      <div class="module-header">
        <h4>${module.charAt(0).toUpperCase() + module.slice(1)}</h4>
        <div class="module-status active">Active</div>
      </div>
      <div class="module-stats">
        <div class="stat">
          <span class="stat-label">Requests:</span>
          <span class="stat-value">${getModuleRequestCount(module)}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Last Updated:</span>
          <span class="stat-value">Today</span>
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

// Helper functions
function getModuleRequestCount(module) {
  const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
  return requests.filter(r => r.module === module).length;
}

function showAdminSection(section) {
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
    logActivity('admin', getCurrentUser().username, `Suspended user ${userId}`);
    alert('User suspended successfully');
    loadUsers();
  }
}

function viewRequestDetails(requestId) {
  const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
  const request = requests.find(r => r.id === requestId);
  if (request) {
    alert(`Request Details:\n\nType: ${request.type}\nModule: ${request.module}\nDescription: ${request.description}\nStatus: ${request.status}\nPriority: ${request.priority}\nCreated: ${new Date(request.createdAt).toLocaleString()}`);
  }
}

function updateRequestStatus(requestId, newStatus) {
  const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex !== -1) {
    requests[requestIndex].status = newStatus;
    requests[requestIndex].updatedAt = new Date().toISOString();
    localStorage.setItem('userRequests', JSON.stringify(requests));
    
    logActivity('admin', getCurrentUser().username, `Updated request ${requestId} to ${newStatus}`);
    loadRequests();
    loadAdminStats();
    alert(`Request ${newStatus} successfully`);
  }
}

function configureModule(moduleName) {
  alert(`Configure ${moduleName} module - Feature coming soon!`);
}

function toggleModule(moduleName) {
  if (confirm(`Are you sure you want to disable ${moduleName} module?`)) {
    logActivity('admin', getCurrentUser().username, `Disabled ${moduleName} module`);
    alert(`${moduleName} module disabled`);
    loadModules();
  }
}

function exportUsers() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const csv = convertToCSV(users);
  downloadCSV(csv, 'users.csv');
}

function exportRequests() {
  const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
  const csv = convertToCSV(requests);
  downloadCSV(csv, 'requests.csv');
}

function convertToCSV(data) {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => 
    headers.map(header => `"${row[header] || ''}"`).join(',')
  );
  
  return csvHeaders + '\n' + csvRows.join('\n');
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

function logActivity(type, username, action) {
  const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
  logs.push({
    type,
    username,
    action,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('activityLogs', JSON.stringify(logs));
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

// Module Data Management
function loadModuleData() {
  const selectedModule = document.getElementById('moduleSelector').value;
  const editor = document.getElementById('moduleDataEditor');
  
  if (!selectedModule) {
    editor.innerHTML = `
      <div class="editor-placeholder">
        <p>Select a module to edit its data</p>
      </div>
    `;
    return;
  }

  // Load module data based on selection
  const moduleData = getModuleData(selectedModule);
  
  editor.innerHTML = `
    <div class="module-data-form">
      <h4>${getModuleTitle(selectedModule)} Data Editor</h4>
      <div class="data-editor-container">
        ${generateModuleEditor(selectedModule, moduleData)}
      </div>
    </div>
  `;
}

function getModuleData(moduleName) {
  // First try to get stored data
  const storedData = localStorage.getItem(`moduleData_${moduleName}`);
  if (storedData) {
    console.log(`Loading stored data for ${moduleName}:`, JSON.parse(storedData));
    return JSON.parse(storedData);
  }
  
  // Return default data for each module if no stored data exists
  console.log(`No stored data found for ${moduleName}, using defaults`);
  const defaultData = {
    water: {
      zones: [
        {name: 'North', pct: 82, pressure: 'Good', supply: '6h/day', issue: ''},
        {name: 'Central', pct: 38, pressure: 'Low', supply: '4h/day', issue: 'Partial restriction'},
        {name: 'East', pct: 74, pressure: 'Normal', supply: '6h/day', issue: ''},
        {name: 'South', pct: 22, pressure: 'Critical', supply: '2h/day', issue: 'Pipe burst repair'},
        {name: 'West', pct: 90, pressure: 'Good', supply: '6h/day', issue: ''},
        {name: 'Industrial', pct: 65, pressure: 'Normal', supply: '8h/day', issue: ''}
      ]
    },
    electricity: {
      areas: [
        {name: 'Sector 1-10', status: 'Stable', load: '78%', outage: 'None'},
        {name: 'Sector 11-20', status: 'Maintenance', load: '45%', outage: '2 hours'},
        {name: 'Sector 21-30', status: 'Stable', load: '82%', outage: 'None'},
        {name: 'Industrial Area', status: 'High Load', load: '92%', outage: 'None'},
        {name: 'Commercial Area', status: 'Stable', load: '88%', outage: 'None'}
      ]
    },
    traffic: {
      junctions: [
        {name: 'Sector 17 Plaza', status: 'Heavy', avgSpeed: '15 km/h', signals: '4'},
        {name: 'Madhya Marg', status: 'Moderate', avgSpeed: '25 km/h', signals: '6'},
        {name: 'Panchkula Junction', status: 'Light', avgSpeed: '35 km/h', signals: '3'},
        {name: 'Airport Road', status: 'Heavy', avgSpeed: '18 km/h', signals: '5'},
        {name: 'Railway Crossing', status: 'Moderate', avgSpeed: '22 km/h', signals: '2'}
      ]
    },
    bus: {
      routes: [
        {number: '1A', from: 'Sector 43', to: 'ISBT', frequency: '15 min', status: 'Active'},
        {number: '7', from: 'Manimajra', to: 'Sector 17', frequency: '20 min', status: 'Active'},
        {number: '10', from: 'Panchkula', to: 'Mohali', frequency: '30 min', status: 'Delayed'},
        {number: '15', from: 'Airport', to: 'Sector 17', frequency: '45 min', status: 'Active'},
        {number: '22', from: 'Railway Station', to: 'PU Campus', frequency: '25 min', status: 'Active'}
      ]
    },
    waste: {
      areas: [
        {name: 'Sector 1-10', collected: '85%', pending: '12', nextCollection: 'Tomorrow'},
        {name: 'Sector 11-20', collected: '92%', pending: '5', nextCollection: 'Today'},
        {name: 'Sector 21-30', collected: '78%', pending: '18', nextCollection: 'Tomorrow'},
        {name: 'Industrial Area', collected: '88%', pending: '8', nextCollection: 'Today'},
        {name: 'Commercial Area', collected: '95%', pending: '3', nextCollection: 'Today'}
      ]
    },
    aqi: {
      locations: [
        {name: 'Sector 17', aqi: 152, level: 'Moderate', pm25: '89', pm10: '124'},
        {name: 'Industrial Area', aqi: 189, level: 'Unhealthy', pm25: '112', pm10: '156'},
        {name: 'Rose Garden', aqi: 98, level: 'Good', pm25: '45', pm10: '67'},
        {name: 'Sukhna Lake', aqi: 76, level: 'Good', pm25: '32', pm10: '48'},
        {name: 'Railway Station', aqi: 167, level: 'Unhealthy', pm25: '98', pm10: '134'}
      ]
    },
    repairs: {
      roads: [
        {name: 'Madhya Marg', status: 'In Progress', completion: '65%', priority: 'High'},
        {name: 'Sector 15 Road', status: 'Pending', completion: '0%', priority: 'Medium'},
        {name: 'Panchkula Highway', status: 'Completed', completion: '100%', priority: 'Low'},
        {name: 'Airport Road', status: 'In Progress', completion: '40%', priority: 'High'},
        {name: 'Sector 22 Inner Roads', status: 'Pending', completion: '0%', priority: 'Medium'}
      ]
    }
  };
  
  const data = defaultData[moduleName] || {};
  console.log(`Returning default data for ${moduleName}:`, data);
  return data;
}

function generateModuleEditor(moduleName, data) {
  switch(moduleName) {
    case 'water':
      return generateWaterEditor(data);
    case 'electricity':
      return generateElectricityEditor(data);
    case 'traffic':
      return generateTrafficEditor(data);
    case 'bus':
      return generateBusEditor(data);
    case 'waste':
      return generateWasteEditor(data);
    case 'aqi':
      return generateAQIEditor(data);
    case 'repairs':
      return generateRepairsEditor(data);
    default:
      return '<p>No editor available for this module</p>';
  }
}

function generateWaterEditor(data) {
  return `
    <div class="data-table-editable">
      <table class="data-table">
        <thead>
          <tr>
            <th>Zone Name</th>
            <th>Water Level (%)</th>
            <th>Pressure</th>
            <th>Supply Hours</th>
            <th>Issues</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.zones.map((zone, index) => `
            <tr>
              <td><input type="text" value="${zone.name}" data-field="name" data-index="${index}" data-type="zones"></td>
              <td><input type="number" value="${zone.pct}" min="0" max="100" data-field="pct" data-index="${index}" data-type="zones"></td>
              <td>
                <select data-field="pressure" data-index="${index}" data-type="zones">
                  <option value="Good" ${zone.pressure === 'Good' ? 'selected' : ''}>Good</option>
                  <option value="Normal" ${zone.pressure === 'Normal' ? 'selected' : ''}>Normal</option>
                  <option value="Low" ${zone.pressure === 'Low' ? 'selected' : ''}>Low</option>
                  <option value="Critical" ${zone.pressure === 'Critical' ? 'selected' : ''}>Critical</option>
                </select>
              </td>
              <td><input type="text" value="${zone.supply}" data-field="supply" data-index="${index}" data-type="zones"></td>
              <td><input type="text" value="${zone.issue}" data-field="issue" data-index="${index}" data-type="zones"></td>
              <td><button type="button" class="btn-sm btn-danger" onclick="removeDataRow('water', 'zones', ${index})">Remove</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <button type="button" class="btn-primary" onclick="addDataRow('water', 'zones')">Add Zone</button>
    </div>
  `;
}

function generateElectricityEditor(data) {
  return `
    <div class="data-table-editable">
      <table class="data-table">
        <thead>
          <tr>
            <th>Area Name</th>
            <th>Status</th>
            <th>Load (%)</th>
            <th>Outage Info</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.areas.map((area, index) => `
            <tr>
              <td><input type="text" value="${area.name}" data-field="name" data-index="${index}" data-type="areas"></td>
              <td>
                <select data-field="status" data-index="${index}" data-type="areas">
                  <option value="Stable" ${area.status === 'Stable' ? 'selected' : ''}>Stable</option>
                  <option value="Maintenance" ${area.status === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
                  <option value="High Load" ${area.status === 'High Load' ? 'selected' : ''}>High Load</option>
                  <option value="Outage" ${area.status === 'Outage' ? 'selected' : ''}>Outage</option>
                </select>
              </td>
              <td><input type="number" value="${area.load}" min="0" max="100" data-field="load" data-index="${index}" data-type="areas"></td>
              <td><input type="text" value="${area.outage}" data-field="outage" data-index="${index}" data-type="areas"></td>
              <td><button type="button" class="btn-sm btn-danger" onclick="removeDataRow('electricity', 'areas', ${index})">Remove</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <button type="button" class="btn-primary" onclick="addDataRow('electricity', 'areas')">Add Area</button>
    </div>
  `;
}

function generateTrafficEditor(data) {
  return `
    <div class="data-table-editable">
      <table class="data-table">
        <thead>
          <tr>
            <th>Junction Name</th>
            <th>Traffic Status</th>
            <th>Avg Speed (km/h)</th>
            <th>Signals</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.junctions.map((junction, index) => `
            <tr>
              <td><input type="text" value="${junction.name}" data-field="name" data-index="${index}" data-type="junctions"></td>
              <td>
                <select data-field="status" data-index="${index}" data-type="junctions">
                  <option value="Light" ${junction.status === 'Light' ? 'selected' : ''}>Light</option>
                  <option value="Moderate" ${junction.status === 'Moderate' ? 'selected' : ''}>Moderate</option>
                  <option value="Heavy" ${junction.status === 'Heavy' ? 'selected' : ''}>Heavy</option>
                  <option value="Congested" ${junction.status === 'Congested' ? 'selected' : ''}>Congested</option>
                </select>
              </td>
              <td><input type="number" value="${junction.avgSpeed}" min="0" max="80" data-field="avgSpeed" data-index="${index}" data-type="junctions"></td>
              <td><input type="number" value="${junction.signals}" min="1" max="10" data-field="signals" data-index="${index}" data-type="junctions"></td>
              <td><button type="button" class="btn-sm btn-danger" onclick="removeDataRow('traffic', 'junctions', ${index})">Remove</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <button type="button" class="btn-primary" onclick="addDataRow('traffic', 'junctions')">Add Junction</button>
    </div>
  `;
}

function generateBusEditor(data) {
  return `
    <div class="data-table-editable">
      <table class="data-table">
        <thead>
          <tr>
            <th>Route Number</th>
            <th>From</th>
            <th>To</th>
            <th>Frequency</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.routes.map((route, index) => `
            <tr>
              <td><input type="text" value="${route.number}" data-field="number" data-index="${index}" data-type="routes"></td>
              <td><input type="text" value="${route.from}" data-field="from" data-index="${index}" data-type="routes"></td>
              <td><input type="text" value="${route.to}" data-field="to" data-index="${index}" data-type="routes"></td>
              <td><input type="text" value="${route.frequency}" data-field="frequency" data-index="${index}" data-type="routes"></td>
              <td>
                <select data-field="status" data-index="${index}" data-type="routes">
                  <option value="Active" ${route.status === 'Active' ? 'selected' : ''}>Active</option>
                  <option value="Delayed" ${route.status === 'Delayed' ? 'selected' : ''}>Delayed</option>
                  <option value="Cancelled" ${route.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                  <option value="Maintenance" ${route.status === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
                </select>
              </td>
              <td><button type="button" class="btn-sm btn-danger" onclick="removeDataRow('bus', 'routes', ${index})">Remove</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <button type="button" class="btn-primary" onclick="addDataRow('bus', 'routes')">Add Route</button>
    </div>
  `;
}

function generateWasteEditor(data) {
  return `
    <div class="data-table-editable">
      <table class="data-table">
        <thead>
          <tr>
            <th>Area Name</th>
            <th>Collected (%)</th>
            <th>Pending</th>
            <th>Next Collection</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.areas.map((area, index) => `
            <tr>
              <td><input type="text" value="${area.name}" data-field="name" data-index="${index}" data-type="areas"></td>
              <td><input type="number" value="${area.collected}" min="0" max="100" data-field="collected" data-index="${index}" data-type="areas"></td>
              <td><input type="number" value="${area.pending}" min="0" data-field="pending" data-index="${index}" data-type="areas"></td>
              <td>
                <select data-field="nextCollection" data-index="${index}" data-type="areas">
                  <option value="Today" ${area.nextCollection === 'Today' ? 'selected' : ''}>Today</option>
                  <option value="Tomorrow" ${area.nextCollection === 'Tomorrow' ? 'selected' : ''}>Tomorrow</option>
                  <option value="This Week" ${area.nextCollection === 'This Week' ? 'selected' : ''}>This Week</option>
                  <option value="Scheduled" ${area.nextCollection === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
                </select>
              </td>
              <td><button type="button" class="btn-sm btn-danger" onclick="removeDataRow('waste', 'areas', ${index})">Remove</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <button type="button" class="btn-primary" onclick="addDataRow('waste', 'areas')">Add Area</button>
    </div>
  `;
}

function generateAQIEditor(data) {
  return `
    <div class="data-table-editable">
      <table class="data-table">
        <thead>
          <tr>
            <th>Location Name</th>
            <th>AQI Value</th>
            <th>AQI Level</th>
            <th>PM2.5</th>
            <th>PM10</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.locations.map((location, index) => `
            <tr>
              <td><input type="text" value="${location.name}" data-field="name" data-index="${index}" data-type="locations"></td>
              <td><input type="number" value="${location.aqi}" min="0" max="500" data-field="aqi" data-index="${index}" data-type="locations"></td>
              <td>
                <select data-field="level" data-index="${index}" data-type="locations">
                  <option value="Good" ${location.level === 'Good' ? 'selected' : ''}>Good</option>
                  <option value="Moderate" ${location.level === 'Moderate' ? 'selected' : ''}>Moderate</option>
                  <option value="Unhealthy" ${location.level === 'Unhealthy' ? 'selected' : ''}>Unhealthy</option>
                  <option value="Very Unhealthy" ${location.level === 'Very Unhealthy' ? 'selected' : ''}>Very Unhealthy</option>
                  <option value="Hazardous" ${location.level === 'Hazardous' ? 'selected' : ''}>Hazardous</option>
                </select>
              </td>
              <td><input type="number" value="${location.pm25}" min="0" data-field="pm25" data-index="${index}" data-type="locations"></td>
              <td><input type="number" value="${location.pm10}" min="0" data-field="pm10" data-index="${index}" data-type="locations"></td>
              <td><button type="button" class="btn-sm btn-danger" onclick="removeDataRow('aqi', 'locations', ${index})">Remove</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <button type="button" class="btn-primary" onclick="addDataRow('aqi', 'locations')">Add Location</button>
    </div>
  `;
}

function generateRepairsEditor(data) {
  return `
    <div class="data-table-editable">
      <table class="data-table">
        <thead>
          <tr>
            <th>Road Name</th>
            <th>Status</th>
            <th>Completion (%)</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.roads.map((road, index) => `
            <tr>
              <td><input type="text" value="${road.name}" data-field="name" data-index="${index}" data-type="roads"></td>
              <td>
                <select data-field="status" data-index="${index}" data-type="roads">
                  <option value="Pending" ${road.status === 'Pending' ? 'selected' : ''}>Pending</option>
                  <option value="In Progress" ${road.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                  <option value="Completed" ${road.status === 'Completed' ? 'selected' : ''}>Completed</option>
                  <option value="On Hold" ${road.status === 'On Hold' ? 'selected' : ''}>On Hold</option>
                </select>
              </td>
              <td><input type="number" value="${road.completion}" min="0" max="100" data-field="completion" data-index="${index}" data-type="roads"></td>
              <td>
                <select data-field="priority" data-index="${index}" data-type="roads">
                  <option value="Low" ${road.priority === 'Low' ? 'selected' : ''}>Low</option>
                  <option value="Medium" ${road.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                  <option value="High" ${road.priority === 'High' ? 'selected' : ''}>High</option>
                  <option value="Critical" ${road.priority === 'Critical' ? 'selected' : ''}>Critical</option>
                </select>
              </td>
              <td><button type="button" class="btn-sm btn-danger" onclick="removeDataRow('repairs', 'roads', ${index})">Remove</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <button type="button" class="btn-primary" onclick="addDataRow('repairs', 'roads')">Add Road</button>
    </div>
  `;
}

function saveModuleData() {
  const selectedModule = document.getElementById('moduleSelector').value;
  if (!selectedModule) {
    alert('Please select a module first');
    return;
  }

  // Get current module data
  let moduleData = getModuleData(selectedModule);
  
  // Collect all form data and update moduleData
  const inputs = document.querySelectorAll('#moduleDataEditor input, #moduleDataEditor select');
  
  inputs.forEach(input => {
    const fieldType = input.dataset.type;
    const fieldIndex = parseInt(input.dataset.index);
    const fieldName = input.dataset.field;
    
    // Check if the data structure exists
    if (moduleData && moduleData[fieldType] && moduleData[fieldType][fieldIndex] !== undefined) {
      // Convert number inputs to numbers
      let value = input.value;
      if (input.type === 'number') {
        value = parseFloat(value) || 0;
      }
      
      moduleData[fieldType][fieldIndex][fieldName] = value;
      console.log(`Updated ${fieldType}[${fieldIndex}].${fieldName} = ${value}`);
    }
  });

  // Save to localStorage
  localStorage.setItem(`moduleData_${selectedModule}`, JSON.stringify(moduleData));
  
  // Log the action
  logActivity('admin', getCurrentUser().username, `Updated ${selectedModule} module data`);
  
  alert('Module data saved successfully!');
  console.log('Saved module data:', moduleData);
}

function addDataRow(moduleName, dataType) {
  const moduleData = getModuleData(moduleName);
  
  // Create new row template based on data type
  let newRow;
  switch(dataType) {
    case 'zones':
      newRow = {name: 'New Zone', pct: 50, pressure: 'Normal', supply: '6h/day', issue: ''};
      break;
    case 'areas':
      newRow = {name: 'New Area', status: 'Stable', load: '50%', outage: 'None'};
      break;
    case 'junctions':
      newRow = {name: 'New Junction', status: 'Moderate', avgSpeed: '25', signals: '4'};
      break;
    case 'routes':
      newRow = {number: 'New', from: 'Start Point', to: 'End Point', frequency: '30 min', status: 'Active'};
      break;
    case 'locations':
      newRow = {name: 'New Location', aqi: 100, level: 'Moderate', pm25: '50', pm10: '75'};
      break;
    case 'roads':
      newRow = {name: 'New Road', status: 'Pending', completion: '0', priority: 'Medium'};
      break;
  }
  
  moduleData[dataType].push(newRow);
  localStorage.setItem(`moduleData_${moduleName}`, JSON.stringify(moduleData));
  loadModuleData(); // Refresh the editor
}

function removeDataRow(moduleName, dataType, index) {
  if (confirm('Are you sure you want to remove this row?')) {
    const moduleData = getModuleData(moduleName);
    moduleData[dataType].splice(index, 1);
    localStorage.setItem(`moduleData_${moduleName}`, JSON.stringify(moduleData));
    loadModuleData(); // Refresh the editor
  }
}

function addNewModule() {
  const moduleName = prompt('Enter new module name:');
  if (moduleName) {
    alert(`Module "${moduleName}" added successfully - Feature coming soon!`);
    loadModules();
  }
}

function refreshModuleDisplay() {
  const selectedModule = document.getElementById('moduleSelector').value;
  if (selectedModule) {
    alert(`Module display refreshed! Changes will be visible when users view the ${selectedModule} module.`);
    
    // Force reload of the module to show updated data
    const moduleFrame = document.getElementById('moduleFrame');
    if (moduleFrame && window[`render_${selectedModule}`]) {
      console.log(`Refreshing ${selectedModule} module display`);
      window[`render_${selectedModule}`](moduleFrame);
    }
  }
}

function getModuleTitle(moduleName) {
  const titles = {
    water: 'Water Supply',
    electricity: 'Electricity',
    traffic: 'Traffic',
    bus: 'Bus Routes',
    waste: 'Waste Management',
    aqi: 'Air Quality',
    repairs: 'Road Repairs'
  };
  return titles[moduleName] || moduleName;
}
