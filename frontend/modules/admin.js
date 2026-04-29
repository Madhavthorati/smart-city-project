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
                  <th>Email</th>
                  <th>Mobile</th>
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

// Helper function to get request type label
function getRequestTypeLabel(type, module) {
  const typeLabels = {
    // Water module types
    'water-shortage': 'Water Shortage',
    'low-pressure': 'Low Pressure',
    'contamination': 'Water Contamination',
    'leakage': 'Water Leakage',
    'supply-timing': 'Supply Timing Issue',
    'quality-issue': 'Water Quality Issue',
    'connection-issue': 'Connection Issue',
    
    // Electricity module types
    'power-outage': 'Power Outage',
    'voltage-issue': 'Voltage Issue',
    'billing-problem': 'Billing Problem',
    'connection-problem': 'Connection Problem',
    'meter-issue': 'Meter Issue',
    
    // Traffic module types
    'traffic-jam': 'Traffic Jam',
    'signal-issue': 'Signal Issue',
    'road-damage': 'Road Damage',
    'accident': 'Accident',
    'parking-issue': 'Parking Issue',
    
    // Bus module types
    'bus-delay': 'Bus Delay',
    'route-issue': 'Route Issue',
    'driver-behavior': 'Driver Behavior',
    'bus-condition': 'Bus Condition',
    'schedule-issue': 'Schedule Issue',
    
    // Waste module types
    'garbage-collection': 'Garbage Collection',
    'bin-overflow': 'Bin Overflow',
    'illegal-dumping': 'Illegal Dumping',
    'collection-timing': 'Collection Timing',
    
    // AQI module types
    'air-pollution': 'Air Pollution',
    'industrial-emissions': 'Industrial Emissions',
    'health-concern': 'Health Concern',
    'burning-issue': 'Burning Issue',
    
    // Repairs module types
    'pothole': 'Pothole',
    'road-damage': 'Road Damage',
    'street-light': 'Street Light Issue',
    'drainage-issue': 'Drainage Issue',
    'signage-issue': 'Signage Issue',
    
    // General types
    'complaint': 'Complaint',
    'service': 'Service Request',
    'information': 'Information',
    'emergency': 'Emergency',
    'suggestion': 'Suggestion'
  };
  
  return typeLabels[type] || type || 'General';
}

// Load requests table
function loadRequests() {
  const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
  const requestsTable = document.getElementById('requestsTableBody');
  
  if (requests.length === 0) {
    requestsTable.innerHTML = `
      <tr>
        <td colspan="11" style="text-align: center; padding: 40px; color: var(--text3);">
          <div>
            <h3>No requests yet</h3>
            <p>Users haven't submitted any requests yet.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  requestsTable.innerHTML = requests.map(request => `
    <tr>
      <td><code>${request.id}</code></td>
      <td>${request.username}</td>
      <td>${request.email}</td>
      <td>${request.mobile}</td>
      <td><span class="module-badge">${request.module}</span></td>
      <td>${getRequestTypeLabel(request.type, request.module)}</td>
      <td><strong>${request.location || 'N/A'}</strong></td>
      <td><div class="description-text">${request.description}</div></td>
      <td><span class="priority-badge ${request.priority}">${request.priority}</span></td>
      <td><span class="status-badge ${(request.status || 'pending').replace(' ', '-')}">${request.status || 'Pending'}</span></td>
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

// Respond to request
function respondToRequest(requestId) {
  const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
  const request = requests.find(r => r.id === requestId);
  
  if (!request) {
    alert('Request not found');
    return;
  }
  
  // Create modal for admin response
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;
  
  modal.innerHTML = `
    <div class="modal-content" style="
      background: var(--surface);
      padding: 24px;
      border-radius: 12px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    ">
      <div class="modal-header">
        <h3>📝 Respond to Request</h3>
        <button class="close-btn" onclick="closeResponseModal()" style="
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: var(--text3);
        ">&times;</button>
      </div>
      
      <div class="request-details" style="margin: 20px 0;">
        <p><strong>Request ID:</strong> ${request.id}</p>
        <p><strong>User:</strong> ${request.username} (${request.email})</p>
        <p><strong>Module:</strong> ${request.module}</p>
        <p><strong>Type:</strong> ${getRequestTypeLabel(request.type, request.module)}</p>
        <p><strong>Location:</strong> ${request.location || 'N/A'}</p>
        <p><strong>Description:</strong> ${request.description}</p>
        <p><strong>Priority:</strong> <span class="priority-badge ${request.priority}">${request.priority}</span></p>
        <p><strong>Status:</strong> <span class="status-badge ${(request.status || 'pending').replace(' ', '-')}">${request.status || 'Pending'}</span></p>
      </div>
      
      <form id="responseForm" onsubmit="submitAdminResponse(event, '${requestId}')">
        <div class="form-group">
          <label for="adminResponse">Your Response:</label>
          <textarea id="adminResponse" name="response" required 
                    placeholder="Enter your response to the user..." 
                    rows="4" style="
                      width: 100%;
                      padding: 12px;
                      border: 1px solid var(--border);
                      border-radius: 6px;
                      font-size: 14px;
                      resize: vertical;
                    "></textarea>
        </div>
        
        <div class="form-group">
          <label for="updateStatus">Update Status:</label>
          <select id="updateStatus" name="status" style="
            width: 100%;
            padding: 12px;
            border: 1px solid var(--border);
            border-radius: 6px;
            font-size: 14px;
          ">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div class="form-actions" style="
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 20px;
        ">
          <button type="button" class="btn-secondary" onclick="closeResponseModal()" style="
            padding: 10px 20px;
            border: 1px solid var(--border);
            background: var(--surface);
            color: var(--text);
            border-radius: 6px;
            cursor: pointer;
          ">Cancel</button>
          <button type="submit" class="btn-primary" style="
            padding: 10px 20px;
            background: var(--accent);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
          ">Submit Response</button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Set current status
  const statusSelect = document.getElementById('updateStatus');
  if (statusSelect) {
    statusSelect.value = request.status;
  }
  
  // Add global function to close modal
  window.closeResponseModal = function() {
    modal.remove();
  };
}

// Submit admin response
function submitAdminResponse(event, requestId) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const response = formData.get('response');
  const newStatus = formData.get('status');
  
  const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) {
    alert('Request not found');
    return;
  }
  
  // Update request
  requests[requestIndex].adminResponse = response;
  requests[requestIndex].respondedBy = 'Admin';
  requests[requestIndex].responseDate = new Date().toISOString();
  requests[requestIndex].status = newStatus;
  requests[requestIndex].updatedAt = new Date().toISOString();
  
  // Save to localStorage
  localStorage.setItem('userRequests', JSON.stringify(requests));
  
  // Create notification for user
  const notifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
  notifications.push({
    id: 'notif_' + Date.now(),
    userId: requests[requestIndex].userId,
    requestId: requestId,
    message: `Admin has responded to your ${requests[requestIndex].module} request. Status: ${newStatus}`,
    type: 'admin_response',
    read: false,
    createdAt: new Date().toISOString()
  });
  localStorage.setItem('userNotifications', JSON.stringify(notifications));
  
  // Log activity
  const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
  logs.push({
    id: 'log_' + Date.now(),
    user: 'Admin',
    action: 'Responded to request',
    details: `Request ID: ${requestId}, Status: ${newStatus}`,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('activityLogs', JSON.stringify(logs));
  
  // Close modal and refresh
  closeResponseModal();
  loadRequests();
  loadAdminStats(); // Refresh admin statistics
  
  alert('Response submitted successfully!');
}

// Update request status (for Update button)
function updateRequestStatus(requestId) {
  const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
  const request = requests.find(r => r.id === requestId);
  
  if (!request) {
    alert('Request not found');
    return;
  }
  
  // Create modal for status update
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;
  
  modal.innerHTML = `
    <div class="modal-content" style="
      background: var(--surface);
      padding: 24px;
      border-radius: 12px;
      max-width: 500px;
      width: 90%;
    ">
      <div class="modal-header">
        <h3>🔄 Update Request Status</h3>
        <button class="close-btn" onclick="closeStatusModal()" style="
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: var(--text3);
        ">&times;</button>
      </div>
      
      <div class="request-details" style="margin: 20px 0;">
        <p><strong>Request ID:</strong> ${request.id}</p>
        <p><strong>User:</strong> ${request.username}</p>
        <p><strong>Module:</strong> ${request.module}</p>
        <p><strong>Type:</strong> ${getRequestTypeLabel(request.type, request.module)}</p>
        <p><strong>Current Status:</strong> <span class="status-badge ${(request.status || 'pending').replace(' ', '-')}">${request.status || 'Pending'}</span></p>
        ${request.adminResponse ? `<p><strong>Last Response:</strong> ${request.adminResponse}</p>` : ''}
      </div>
      
      <form id="statusUpdateForm" onsubmit="submitStatusUpdate(event, '${requestId}')">
        <div class="form-group">
          <label for="newStatus">New Status:</label>
          <select id="newStatus" name="status" required style="
            width: 100%;
            padding: 12px;
            border: 1px solid var(--border);
            border-radius: 6px;
            font-size: 14px;
          ">
            <option value="">Select status...</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="additionalResponse">Additional Response (Optional):</label>
          <textarea id="additionalResponse" name="additionalResponse" 
                    placeholder="Add any additional comments..." 
                    rows="3" style="
                      width: 100%;
                      padding: 12px;
                      border: 1px solid var(--border);
                      border-radius: 6px;
                      font-size: 14px;
                      resize: vertical;
                    "></textarea>
        </div>
        
        <div class="form-actions" style="
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 20px;
        ">
          <button type="button" class="btn-secondary" onclick="closeStatusModal()" style="
            padding: 10px 20px;
            border: 1px solid var(--border);
            background: var(--surface);
            color: var(--text);
            border-radius: 6px;
            cursor: pointer;
          ">Cancel</button>
          <button type="submit" class="btn-primary" style="
            padding: 10px 20px;
            background: var(--accent);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
          ">Update Status</button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add global function to close modal
  window.closeStatusModal = function() {
    modal.remove();
  };
}

// Submit status update
function submitStatusUpdate(event, requestId) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const newStatus = formData.get('status');
  const additionalResponse = formData.get('additionalResponse');
  
  const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) {
    alert('Request not found');
    return;
  }
  
  // Update request
  requests[requestIndex].status = newStatus;
  requests[requestIndex].updatedAt = new Date().toISOString();
  
  if (additionalResponse) {
    requests[requestIndex].adminResponse = (requests[requestIndex].adminResponse || '') + '\n\n' + additionalResponse;
    requests[requestIndex].respondedBy = 'Admin';
    requests[requestIndex].responseDate = new Date().toISOString();
  }
  
  // Save to localStorage
  localStorage.setItem('userRequests', JSON.stringify(requests));
  
  // Create notification for user
  const notifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
  notifications.push({
    id: 'notif_' + Date.now(),
    userId: requests[requestIndex].userId,
    requestId: requestId,
    message: `Your ${requests[requestIndex].module} request status has been updated to: ${newStatus}`,
    type: 'status_update',
    read: false,
    createdAt: new Date().toISOString()
  });
  localStorage.setItem('userNotifications', JSON.stringify(notifications));
  
  // Log activity
  const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
  logs.push({
    id: 'log_' + Date.now(),
    user: 'Admin',
    action: 'Updated request status',
    details: `Request ID: ${requestId}, New Status: ${newStatus}`,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('activityLogs', JSON.stringify(logs));
  
  // Close modal and refresh
  closeStatusModal();
  loadRequests();
  loadAdminStats(); // Refresh admin statistics
  
  alert('Request status updated successfully!');
}
