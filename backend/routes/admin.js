const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// In-memory storage (shared with other routes)
let users = [];
let requests = [];
let activityLogs = [];
let nextLogId = 1;

// Middleware to verify admin token
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Get admin statistics
router.get('/stats', authenticateAdmin, (req, res) => {
  try {
    const stats = {
      totalRequests: requests.length,
      pendingRequests: requests.filter(req => req.status === 'pending').length,
      inProgressRequests: requests.filter(req => req.status === 'in-progress').length,
      resolvedRequests: requests.filter(req => req.status === 'resolved').length,
      rejectedRequests: requests.filter(req => req.status === 'rejected').length,
      totalUsers: users.length,
      activeUsers: users.filter(user => user.isActive).length,
      recentActivity: activityLogs.slice(-10).reverse()
    };
    
    res.json(stats);
    
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// Get all users
router.get('/users', authenticateAdmin, (req, res) => {
  try {
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json(usersWithoutPasswords);
    
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Suspend/activate user
router.put('/users/:id/status', authenticateAdmin, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { isActive } = req.body;
    
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    users[userIndex].isActive = isActive;
    
    // Log activity
    const log = {
      id: `LOG-${String(nextLogId++).padStart(3, '0')}`,
      user: 'Admin',
      action: isActive ? 'Activated user' : 'Suspended user',
      details: `User ID: ${userId}, Email: ${users[userIndex].email}`,
      timestamp: new Date().toISOString()
    };
    
    activityLogs.push(log);
    
    res.json({
      message: `User ${isActive ? 'activated' : 'suspended'} successfully`,
      user: users[userIndex]
    });
    
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Delete user
router.delete('/users/:id', authenticateAdmin, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't allow deleting admin users
    if (users[userIndex].role === 'admin') {
      return res.status(400).json({ error: 'Cannot delete admin users' });
    }
    
    const deletedUser = users[userIndex];
    
    // Delete user's requests
    requests = requests.filter(req => req.userId !== userId);
    
    // Delete user's notifications
    // (notifications would be filtered out in the notifications route)
    
    users.splice(userIndex, 1);
    
    // Log activity
    const log = {
      id: `LOG-${String(nextLogId++).padStart(3, '0')}`,
      user: 'Admin',
      action: 'Deleted user',
      details: `User ID: ${userId}, Email: ${deletedUser.email}`,
      timestamp: new Date().toISOString()
    };
    
    activityLogs.push(log);
    
    res.json({ message: 'User deleted successfully' });
    
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get activity logs
router.get('/logs', authenticateAdmin, (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const paginatedLogs = activityLogs
      .reverse()
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.json({
      logs: paginatedLogs,
      total: activityLogs.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Failed to get activity logs' });
  }
});

// Export data
router.get('/export/:type', authenticateAdmin, (req, res) => {
  try {
    const { type } = req.params;
    
    let data = [];
    let filename = '';
    
    switch (type) {
      case 'users':
        data = users.map(user => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });
        filename = 'users-export.json';
        break;
        
      case 'requests':
        data = requests;
        filename = 'requests-export.json';
        break;
        
      case 'logs':
        data = activityLogs;
        filename = 'logs-export.json';
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid export type' });
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.json(data);
    
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Create admin user (if none exists)
router.post('/setup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if admin already exists
    const existingAdmin = users.find(user => user.role === 'admin');
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin user already exists' });
    }
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const admin = {
      id: users.length + 1,
      name: name.trim(),
      email: email.toLowerCase(),
      mobile: '',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    users.push(admin);
    
    // Log setup
    const log = {
      id: `LOG-${String(nextLogId++).padStart(3, '0')}`,
      user: 'System',
      action: 'Admin setup',
      details: `Admin user created: ${admin.email}`,
      timestamp: new Date().toISOString()
    };
    
    activityLogs.push(log);
    
    const { password: _, ...adminWithoutPassword } = admin;
    
    res.status(201).json({
      message: 'Admin user created successfully',
      admin: adminWithoutPassword
    });
    
  } catch (error) {
    console.error('Admin setup error:', error);
    res.status(500).json({ error: 'Failed to create admin user' });
  }
});

module.exports = router;
