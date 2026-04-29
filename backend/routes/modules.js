const express = require('express');
const router = express.Router();

// Module data (in real app, this would come from database or external APIs)
const moduleData = {
  water: {
    name: 'Water Supply',
    icon: 'water',
    description: 'Water supply monitoring and management',
    requestTypes: [
      { id: 'water-shortage', label: 'Water Shortage' },
      { id: 'low-pressure', label: 'Low Pressure' },
      { id: 'contamination', label: 'Water Contamination' },
      { id: 'leakage', label: 'Water Leakage' },
      { id: 'supply-timing', label: 'Supply Timing Issue' },
      { id: 'quality-issue', label: 'Water Quality Issue' },
      { id: 'connection-issue', label: 'Connection Issue' }
    ]
  },
  electricity: {
    name: 'Electricity',
    icon: 'bolt',
    description: 'Electricity grid monitoring and management',
    requestTypes: [
      { id: 'power-outage', label: 'Power Outage' },
      { id: 'voltage-issue', label: 'Voltage Issue' },
      { id: 'billing-problem', label: 'Billing Problem' },
      { id: 'connection-problem', label: 'Connection Problem' },
      { id: 'meter-issue', label: 'Meter Issue' }
    ]
  },
  traffic: {
    name: 'Traffic',
    icon: 'traffic',
    description: 'Traffic monitoring and management',
    requestTypes: [
      { id: 'traffic-jam', label: 'Traffic Jam' },
      { id: 'signal-issue', label: 'Signal Issue' },
      { id: 'road-damage', label: 'Road Damage' },
      { id: 'accident', label: 'Accident' },
      { id: 'parking-issue', label: 'Parking Issue' }
    ]
  },
  bus: {
    name: 'Bus Routes',
    icon: 'bus',
    description: 'Public transportation monitoring',
    requestTypes: [
      { id: 'bus-delay', label: 'Bus Delay' },
      { id: 'route-issue', label: 'Route Issue' },
      { id: 'driver-behavior', label: 'Driver Behavior' },
      { id: 'bus-condition', label: 'Bus Condition' },
      { id: 'schedule-issue', label: 'Schedule Issue' }
    ]
  },
  waste: {
    name: 'Waste Management',
    icon: 'trash',
    description: 'Waste collection and management',
    requestTypes: [
      { id: 'garbage-collection', label: 'Garbage Collection' },
      { id: 'bin-overflow', label: 'Bin Overflow' },
      { id: 'illegal-dumping', label: 'Illegal Dumping' },
      { id: 'collection-timing', label: 'Collection Timing' }
    ]
  },
  aqi: {
    name: 'Air Quality',
    icon: 'wind',
    description: 'Air quality monitoring',
    requestTypes: [
      { id: 'air-pollution', label: 'Air Pollution' },
      { id: 'industrial-emissions', label: 'Industrial Emissions' },
      { id: 'health-concern', label: 'Health Concern' },
      { id: 'burning-issue', label: 'Burning Issue' }
    ]
  },
  repairs: {
    name: 'Road Repairs',
    icon: 'wrench',
    description: 'Road maintenance and repairs',
    requestTypes: [
      { id: 'pothole', label: 'Pothole' },
      { id: 'road-damage', label: 'Road Damage' },
      { id: 'street-light', label: 'Street Light Issue' },
      { id: 'drainage-issue', label: 'Drainage Issue' },
      { id: 'signage-issue', label: 'Signage Issue' }
    ]
  }
};

// Get all available modules
router.get('/', (req, res) => {
  try {
    const modules = Object.keys(moduleData).map(key => ({
      id: key,
      name: moduleData[key].name,
      icon: moduleData[key].icon,
      description: moduleData[key].description
    }));
    
    res.json(modules);
    
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({ error: 'Failed to get modules' });
  }
});

// Get specific module details
router.get('/:id', (req, res) => {
  try {
    const moduleId = req.params.id;
    
    if (!moduleData[moduleId]) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    res.json({
      id: moduleId,
      ...moduleData[moduleId]
    });
    
  } catch (error) {
    console.error('Get module error:', error);
    res.status(500).json({ error: 'Failed to get module details' });
  }
});

// Get module request types
router.get('/:id/request-types', (req, res) => {
  try {
    const moduleId = req.params.id;
    
    if (!moduleData[moduleId]) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    res.json(moduleData[moduleId].requestTypes);
    
  } catch (error) {
    console.error('Get request types error:', error);
    res.status(500).json({ error: 'Failed to get request types' });
  }
});

// Get module statistics (for admin dashboard)
router.get('/:id/stats', (req, res) => {
  try {
    const moduleId = req.params.id;
    
    if (!moduleData[moduleId]) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    // In a real application, these would come from actual request data
    const mockStats = {
      totalRequests: Math.floor(Math.random() * 100) + 20,
      pendingRequests: Math.floor(Math.random() * 20) + 5,
      inProgressRequests: Math.floor(Math.random() * 15) + 3,
      resolvedRequests: Math.floor(Math.random() * 50) + 10,
      rejectedRequests: Math.floor(Math.random() * 10) + 2,
      averageResponseTime: Math.floor(Math.random() * 48) + 12, // hours
      satisfactionRate: Math.floor(Math.random() * 20) + 75 // percentage
    };
    
    res.json({
      moduleId,
      ...mockStats
    });
    
  } catch (error) {
    console.error('Get module stats error:', error);
    res.status(500).json({ error: 'Failed to get module statistics' });
  }
});

module.exports = router;
