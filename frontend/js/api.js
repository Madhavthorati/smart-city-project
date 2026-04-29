// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Get authentication headers
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Authentication methods
  async login(email, password) {
    const response = await this.post('/auth/login', { email, password });
    this.setToken(response.token);
    return response;
  }

  async register(userData) {
    const response = await this.post('/auth/register', userData);
    this.setToken(response.token);
    return response;
  }

  async verifyToken() {
    return this.get('/auth/verify');
  }

  // Request methods
  async getRequests() {
    return this.get('/requests');
  }

  async getAllRequests() {
    return this.get('/requests/all');
  }

  async createRequest(requestData) {
    return this.post('/requests', requestData);
  }

  async updateRequest(requestId, updateData) {
    return this.put(`/requests/${requestId}`, updateData);
  }

  async deleteRequest(requestId) {
    return this.delete(`/requests/${requestId}`);
  }

  async getNotifications() {
    return this.get('/requests/notifications');
  }

  async markNotificationRead(notificationId) {
    return this.put(`/requests/notifications/${notificationId}/read`);
  }

  // User methods
  async getUserProfile() {
    return this.get('/users/profile');
  }

  async updateUserProfile(userData) {
    return this.put('/users/profile', userData);
  }

  async changePassword(currentPassword, newPassword) {
    return this.put('/users/password', { currentPassword, newPassword });
  }

  async deleteUserAccount() {
    return this.delete('/users/account');
  }

  // Admin methods
  async getAdminStats() {
    return this.get('/admin/stats');
  }

  async getAllUsers() {
    return this.get('/admin/users');
  }

  async updateUserStatus(userId, isActive) {
    return this.put(`/admin/users/${userId}/status`, { isActive });
  }

  async deleteUser(userId) {
    return this.delete(`/admin/users/${userId}`);
  }

  async getActivityLogs(limit = 50, offset = 0) {
    return this.get(`/admin/logs?limit=${limit}&offset=${offset}`);
  }

  async exportData(type) {
    return this.get(`/admin/export/${type}`);
  }

  async setupAdmin(adminData) {
    return this.post('/admin/setup', adminData);
  }

  // Module methods
  async getModules() {
    return this.get('/modules');
  }

  async getModule(moduleId) {
    return this.get(`/modules/${moduleId}`);
  }

  async getModuleRequestTypes(moduleId) {
    return this.get(`/modules/${moduleId}/request-types`);
  }

  async getModuleStats(moduleId) {
    return this.get(`/modules/${moduleId}/stats`);
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }

  // Clear authentication
  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  // Check if authenticated
  isAuthenticated() {
    return !!this.token;
  }
}

// Create global API service instance
const apiService = new ApiService();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApiService;
} else {
  window.ApiService = ApiService;
  window.api = apiService;
}
