const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// In-memory storage (shared with auth route)
let users = [];

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

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { name, mobile } = req.body;
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update allowed fields
    if (name && name.trim().length >= 2) {
      users[userIndex].name = name.trim();
    }
    
    if (mobile !== undefined) {
      users[userIndex].mobile = mobile;
    }
    
    users[userIndex].updatedAt = new Date().toISOString();
    
    const { password, ...userWithoutPassword } = users[userIndex];
    
    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }
    
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(currentPassword, users[userIndex].password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    
    users[userIndex].password = hashedNewPassword;
    users[userIndex].updatedAt = new Date().toISOString();
    
    res.json({ message: 'Password changed successfully' });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Delete user account
router.delete('/account', authenticateToken, (req, res) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't allow deleting admin accounts
    if (users[userIndex].role === 'admin') {
      return res.status(400).json({ error: 'Cannot delete admin account' });
    }
    
    const deletedUser = users[userIndex];
    
    // Remove user
    users.splice(userIndex, 1);
    
    // In a real application, you would also:
    // - Delete user's requests
    // - Delete user's notifications
    // - Clean up any other related data
    
    res.json({
      message: 'Account deleted successfully',
      user: {
        id: deletedUser.id,
        email: deletedUser.email,
        name: deletedUser.name
      }
    });
    
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Get user's requests count
router.get('/stats', authenticateToken, (req, res) => {
  try {
    // This would typically come from the requests route
    // For now, we'll return basic user stats
    const user = users.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const stats = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: new Date().toISOString() // This would come from login tracking
    };
    
    res.json(stats);
    
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to get user stats' });
  }
});

module.exports = router;
