// User Dashboard Module
function render_userDashboard(el) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    el.innerHTML = `
      <div style="padding: 40px; text-align: center; color: var(--text3);">
        <h2>Please login to view your dashboard</h2>
        <button onclick="window.location.href='login.html'" style="background: var(--accent); color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; margin-top: 20px;">Login</button>
      </div>
    `;
    return;
  }

  el.innerHTML = `
    <div class="fade-in">
      <div class="breadcrumb">Smart City / <span>User Dashboard</span></div>
      <div class="module-header">
        <div class="module-title">👤 My Dashboard</div>
        <div class="module-subtitle">Welcome back, ${currentUser.username}!</div>
      </div>
      
      <!-- User Stats -->
      <div class="grid-4" style="margin-bottom:16px">
        <div class="stat-card" style="--stat-color:var(--blue)">
          <div class="stat-label">My Requests</div>
          <div class="stat-value" style="color:var(--blue)" id="myRequestsCount">0</div>
          <div class="stat-sub">Total submitted</div>
        </div>
        <div class="stat-card" style="--stat-color:var(--green)">
          <div class="stat-label">Resolved</div>
          <div class="stat-value" style="color:var(--green)" id="resolvedCount">0</div>
          <div class="stat-sub">Completed requests</div>
        </div>
        <div class="stat-card" style="--stat-color:var(--orange)">
          <div class="stat-label">Pending</div>
          <div class="stat-value" style="color:var(--orange)" id="pendingCount">0</div>
          <div class="stat-sub">Awaiting response</div>
        </div>
        <div class="stat-card" style="--stat-color:var(--purple)">
          <div class="stat-label">In Progress</div>
          <div class="stat-value" style="color:var(--purple)" id="inProgressCount">0</div>
          <div class="stat-sub">Being handled</div>
        </div>
      </div>

      <!-- User Navigation Tabs -->
      <div class="admin-tabs">
        <button class="admin-tab active" onclick="showUserSection('myRequests')">📋 My Requests</button>
        <button class="admin-tab" onclick="showUserSection('notifications')">🔔 Notifications</button>
        <button class="admin-tab" onclick="showUserSection('profile')">👤 My Profile</button>
      </div>

      <!-- My Requests Section -->
      <div id="myRequestsSection" class="admin-section active">
        <div class="section-header">
          <h3>My Requests</h3>
          <div class="section-controls">
            <select class="filter-select" id="myRequestFilter" onchange="filterMyRequests()">
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button class="btn-primary" onclick="exportMyRequests()">📥 Export</button>
          </div>
        </div>
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Request ID</th>
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
            <tbody id="myRequestsTableBody">
              <!-- User requests will be populated here -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Notifications Section -->
      <div id="notificationsSection" class="admin-section">
        <div class="section-header">
          <h3>Notifications</h3>
          <button class="btn-primary" onclick="markAllNotificationsRead()">Mark All Read</button>
        </div>
        <div class="notifications-container" id="notificationsContainer">
          <!-- Notifications will be populated here -->
        </div>
      </div>

      <!-- Profile Section -->
      <div id="profileSection" class="admin-section">
        <div class="section-header">
          <h3>My Profile</h3>
          <button class="btn-primary" onclick="editProfile()">✏️ Edit Profile</button>
        </div>
        <div class="profile-card">
          <div class="profile-info">
            <div class="profile-field">
              <label>Username:</label>
              <span>${currentUser.username}</span>
            </div>
            <div class="profile-field">
              <label>Email:</label>
              <span>${currentUser.email}</span>
            </div>
            <div class="profile-field">
              <label>Mobile:</label>
              <span>${currentUser.mobile}</span>
            </div>
            <div class="profile-field">
              <label>Member Since:</label>
              <span>${new Date(currentUser.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div class="profile-actions">
            <button class="btn-secondary" onclick="changePassword()">🔐 Change Password</button>
            <button class="btn-danger" onclick="deleteAccount()">🗑️ Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize user dashboard
  initializeUserDashboard();
}

// Initialize user dashboard
function initializeUserDashboard() {
  loadUserStats();
  loadUserRequests();
  loadUserNotifications();
}

// Load user statistics
function loadUserStats() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
  const userRequests = requests.filter(r => r.userId === currentUser.id);
  
  document.getElementById('myRequestsCount').textContent = userRequests.length;
  document.getElementById('resolvedCount').textContent = userRequests.filter(r => r.status === 'resolved').length;
  document.getElementById('pendingCount').textContent = userRequests.filter(r => r.status === 'pending').length;
  document.getElementById('inProgressCount').textContent = userRequests.filter(r => r.status === 'in-progress').length;
}

// Load user requests
function loadUserRequests() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
  const userRequests = requests.filter(r => r.userId === currentUser.id);
  const tbody = document.getElementById('myRequestsTableBody');
  
  if (userRequests.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 40px; color: var(--text3);">
          <div>
            <h3>No requests yet</h3>
            <p>You haven't submitted any requests. Go to any module and click "📝 Report Issue" to submit your first request.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = userRequests.map(request => `
    <tr>
      <td><code>${request.id}</code></td>
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
            <small>${new Date(request.updatedAt).toLocaleDateString()}</small>
          </div>` : 
          '<span class="no-response">No response yet</span>'
        }
      </td>
      <td>
        <button class="btn-sm btn-info" onclick="viewMyRequestDetails('${request.id}')">View</button>
        ${request.status === 'resolved' ? 
          `<button class="btn-sm btn-success" onclick="reopenRequest('${request.id}')">Reopen</button>` : 
          `<button class="btn-sm btn-danger" onclick="cancelRequest('${request.id}')">Cancel</button>`
        }
      </td>
    </tr>
  `).join('');
}

// Load user notifications
function loadUserNotifications() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const notifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
  const userNotifications = notifications.filter(n => n.userId === currentUser.id);
  const container = document.getElementById('notificationsContainer');
  
  if (userNotifications.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text3);">
        <h3>No notifications</h3>
        <p>You'll see admin responses and updates here.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = userNotifications.map(notification => `
    <div class="notification-item ${notification.read ? 'read' : 'unread'}">
      <div class="notification-content">
        <div class="notification-message">${notification.message}</div>
        <div class="notification-time">${new Date(notification.createdAt).toLocaleString()}</div>
      </div>
      <button class="btn-sm btn-secondary" onclick="markNotificationRead('${notification.id}')">Mark Read</button>
    </div>
  `).join('');
}

// Show user section
function showUserSection(section) {
  // Hide all sections
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  
  // Show selected section
  document.getElementById(section + 'Section').classList.add('active');
  event.target.classList.add('active');
}

// Filter user requests
function filterMyRequests() {
  const filter = document.getElementById('myRequestFilter').value;
  const rows = document.querySelectorAll('#myRequestsTableBody tr');
  
  rows.forEach(row => {
    if (filter === 'all') {
      row.style.display = '';
    } else {
      const status = row.querySelector('.status-badge').textContent.toLowerCase();
      row.style.display = status === filter ? '' : 'none';
    }
  });
}

// View request details
function viewMyRequestDetails(requestId) {
  const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
  const request = requests.find(r => r.id === requestId);
  if (request) {
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
              <small>Responded on: ${new Date(request.updatedAt).toLocaleString()}</small>
            </div>
          ` : '<p><em>No admin response yet</em></p>'}
        </div>
        <div class="form-actions">
          <button class="btn-secondary" onclick="closeRequestDialog()">Close</button>
          ${request.status === 'resolved' ? 
            `<button class="btn-primary" onclick="reopenRequest('${request.id}')">Reopen Request</button>` : 
            request.status === 'pending' ? 
            `<button class="btn-danger" onclick="cancelRequest('${request.id}')">Cancel Request</button>` : ''
          }
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
}

// Reopen request
function reopenRequest(requestId) {
  const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex !== -1) {
    requests[requestIndex].status = 'pending';
    requests[requestIndex].updatedAt = new Date().toISOString();
    localStorage.setItem('userRequests', JSON.stringify(requests));
    
    alert('Request reopened successfully!');
    closeRequestDialog();
    loadUserRequests();
    loadUserStats();
  }
}

// Cancel request
function cancelRequest(requestId) {
  if (confirm('Are you sure you want to cancel this request?')) {
    const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
    const requestIndex = requests.findIndex(r => r.id === requestId);
    
    if (requestIndex !== -1) {
      requests[requestIndex].status = 'cancelled';
      requests[requestIndex].updatedAt = new Date().toISOString();
      localStorage.setItem('userRequests', JSON.stringify(requests));
      
      alert('Request cancelled successfully!');
      closeRequestDialog();
      loadUserRequests();
      loadUserStats();
    }
  }
}

// Mark notification as read
function markNotificationRead(notificationId) {
  const notifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
  const notificationIndex = notifications.findIndex(n => n.id === notificationId);
  
  if (notificationIndex !== -1) {
    notifications[notificationIndex].read = true;
    localStorage.setItem('userNotifications', JSON.stringify(notifications));
    loadUserNotifications();
  }
}

// Mark all notifications as read
function markAllNotificationsRead() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const notifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
  
  notifications.forEach(notification => {
    if (notification.userId === currentUser.id) {
      notification.read = true;
    }
  });
  
  localStorage.setItem('userNotifications', JSON.stringify(notifications));
  loadUserNotifications();
}

// Export user requests
function exportMyRequests() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
  const userRequests = requests.filter(r => r.userId === currentUser.id);
  
  if (userRequests.length === 0) {
    alert('No requests to export');
    return;
  }
  
  const csv = convertToCSV(userRequests);
  downloadCSV(csv, 'my_requests.csv');
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

// Profile functions
function editProfile() {
  alert('Profile editing - Feature coming soon!');
}

function changePassword() {
  alert('Password change - Feature coming soon!');
}

function deleteAccount() {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone and will delete all your requests and data.')) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Remove user from users list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.filter(u => u.id !== currentUser.id);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Remove user's requests
    const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
    const updatedRequests = requests.filter(r => r.userId !== currentUser.id);
    localStorage.setItem('userRequests', JSON.stringify(updatedRequests));
    
    // Remove user's notifications
    const notifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
    const updatedNotifications = notifications.filter(n => n.userId !== currentUser.id);
    localStorage.setItem('userNotifications', JSON.stringify(updatedNotifications));
    
    // Logout and redirect
    localStorage.removeItem('currentUser');
    alert('Your account has been deleted successfully.');
    window.location.href = 'login.html';
  }
}

// Helper functions
function convertToCSV(data) {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    }).join(',');
  });
  
  return csvHeaders + '\n' + csvRows.join('\n');
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
