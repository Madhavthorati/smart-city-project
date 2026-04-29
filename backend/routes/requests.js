const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// In-memory storage (replace with database later)
let requests = [];
let notifications = [];
let nextRequestId = 1;
let nextNotificationId = 1;

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all requests (for authenticated user)
router.get('/', authenticateToken, (req, res) => {
  const userRequests = requests.filter(req => req.userId === req.user.userId);
  res.json(userRequests);
});

// Get all requests (for admin)
router.get('/all', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  res.json(requests);
});

// Create new request
router.post('/', authenticateToken, (req, res) => {
  try {
    const { module, type, description, priority, location } = req.body;
    
    if (!module || !type || !description) {
      return res.status(400).json({ error: 'Module, type, and description are required' });
    }
    
    const request = {
      id: `REQ-${String(nextRequestId++).padStart(3, '0')}`,
      userId: req.user.userId,
      username: req.user.email, // This would come from user data in real implementation
      email: req.user.email,
      mobile: '', // This would come from user profile
      module,
      type,
      description,
      priority: priority || 'medium',
      location: location || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    requests.push(request);
    
    // Create notification for admin (in real app, this would be sent to actual admin users)
    const notification = {
      id: `NOTIF-${String(nextNotificationId++).padStart(3, '0')}`,
      userId: 'admin', // Special admin notification
      requestId: request.id,
      message: `New ${module} request submitted: ${type}`,
      type: 'new_request',
      read: false,
      createdAt: new Date().toISOString()
    };
    
    notifications.push(notification);
    
    res.status(201).json({
      message: 'Request submitted successfully',
      request
    });
    
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// Update request (admin response)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { adminResponse, status, respondedBy } = req.body;
    const requestId = req.params.id;
    
    const requestIndex = requests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Only admin or request owner can update
    if (req.user.role !== 'admin' && requests[requestIndex].userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Update request
    if (adminResponse !== undefined) {
      requests[requestIndex].adminResponse = adminResponse;
      requests[requestIndex].respondedBy = respondedBy || 'Admin';
      requests[requestIndex].responseDate = new Date().toISOString();
    }
    
    if (status !== undefined) {
      requests[requestIndex].status = status;
    }
    
    requests[requestIndex].updatedAt = new Date().toISOString();
    
    // Create notification for user if admin responded
    if (adminResponse && req.user.role === 'admin') {
      const notification = {
        id: `NOTIF-${String(nextNotificationId++).padStart(3, '0')}`,
        userId: requests[requestIndex].userId,
        requestId: requestId,
        message: `Admin has responded to your ${requests[requestIndex].module} request`,
        type: 'admin_response',
        read: false,
        createdAt: new Date().toISOString()
      };
      
      notifications.push(notification);
    }
    
    res.json({
      message: 'Request updated successfully',
      request: requests[requestIndex]
    });
    
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ error: 'Failed to update request' });
  }
});

// Delete request
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const requestId = req.params.id;
    
    const requestIndex = requests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Only admin or request owner can delete
    if (req.user.role !== 'admin' && requests[requestIndex].userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    requests.splice(requestIndex, 1);
    
    res.json({ message: 'Request deleted successfully' });
    
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({ error: 'Failed to delete request' });
  }
});

// Get user notifications
router.get('/notifications', authenticateToken, (req, res) => {
  const userNotifications = notifications.filter(notif => notif.userId === req.user.userId);
  res.json(userNotifications);
});

// Mark notification as read
router.put('/notifications/:id/read', authenticateToken, (req, res) => {
  try {
    const notificationId = req.params.id;
    
    const notificationIndex = notifications.findIndex(
      notif => notif.id === notificationId && notif.userId === req.user.userId
    );
    
    if (notificationIndex === -1) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    notifications[notificationIndex].read = true;
    
    res.json({ message: 'Notification marked as read' });
    
  } catch (error) {
    console.error('Mark notification error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

module.exports = router;
