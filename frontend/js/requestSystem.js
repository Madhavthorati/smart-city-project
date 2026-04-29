// Request System for User Requests
class RequestSystem {
    constructor() {
        this.requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
        this.init();
    }

    init() {
        // Add request buttons to all modules
        this.addRequestButtonsToModules();
    }

    // Add request buttons to module interfaces
    addRequestButtonsToModules() {
        // Wait for modules to load
        setTimeout(() => {
            this.addRequestButtonToWaterModule();
            this.addRequestButtonToElectricityModule();
            this.addRequestButtonToTrafficModule();
            this.addRequestButtonToBusModule();
            this.addRequestButtonToWasteModule();
            this.addRequestButtonToAQIModule();
            this.addRequestButtonToRepairsModule();
        }, 1000);
    }

    // Add request button to Water Module
    addRequestButtonToWaterModule() {
        const waterModule = document.querySelector('.module-title:contains("Water")');
        if (waterModule) {
            const requestBtn = document.createElement('button');
            requestBtn.className = 'request-btn';
            requestBtn.innerHTML = '📝 Report Issue';
            requestBtn.onclick = () => this.showModuleRequestDialog('water', 'Water Supply');
            waterModule.parentElement.appendChild(requestBtn);
        }
    }

    // Create a new request
    createRequest(type, module, description, priority = 'medium', location = '') {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Please login to submit a request');
            return false;
        }

        const request = {
            id: this.generateRequestId(),
            userId: currentUser.id,
            username: currentUser.username,
            email: currentUser.email,
            mobile: currentUser.mobile,
            type: type,
            module: module,
            description: description,
            location: location,
            priority: priority,
            status: 'pending',
            adminResponse: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.requests.push(request);
        this.saveRequests();
        this.logActivity('request', currentUser.username, `Created ${type} request for ${module}`);
        
        return request;
    }

    // Show module-specific request dialog
    showModuleRequestDialog(module, moduleTitle) {
        const modal = document.createElement('div');
        modal.className = 'request-modal';
        
        const requestTypes = this.getModuleRequestTypes(module);
        const locationOptions = this.getModuleLocationOptions(module);
        
        modal.innerHTML = `
            <div class="request-modal-content">
                <div class="request-modal-header">
                    <h3>📝 Submit ${moduleTitle} Request</h3>
                    <button class="close-btn" onclick="closeRequestDialog()">&times;</button>
                </div>
                <form id="moduleRequestForm" onsubmit="submitModuleRequest(event, '${module}', '${moduleTitle}')">
                    <div class="form-group">
                        <label for="requestType">Request Type</label>
                        <select id="requestType" name="type" required>
                            <option value="">Select type...</option>
                            ${requestTypes.map(type => `<option value="${type.value}">${type.label}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="requestLocation">Location</label>
                        <select id="requestLocation" name="location" required>
                            <option value="">Select location...</option>
                            ${locationOptions.map(loc => `<option value="${loc}">${loc}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="requestDescription">Problem Description</label>
                        <textarea id="requestDescription" name="description" required 
                                  placeholder="Please describe the issue in detail..." 
                                  rows="4"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="requestPriority">Priority</label>
                        <select id="requestPriority" name="priority" required>
                            <option value="low">Low - Minor issue</option>
                            <option value="medium" selected>Medium - Moderate issue</option>
                            <option value="high">High - Urgent issue</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="closeRequestDialog()">Cancel</button>
                        <button type="submit" class="btn-primary">Submit Request</button>
                    </div>
                </form>
            </div>
        `;

        // Add modal styles if not already added
        this.addModalStyles();
        document.body.appendChild(modal);
    }

    // Get request types for specific module
    getModuleRequestTypes(module) {
        const types = {
            water: [
                {value: 'water_shortage', label: 'Water Shortage'},
                {value: 'low_pressure', label: 'Low Water Pressure'},
                {value: 'contamination', label: 'Water Contamination'},
                {value: 'leakage', label: 'Water Leakage'},
                {value: 'supply_timing', label: 'Supply Timing Issue'},
                {value: 'quality_issue', label: 'Water Quality Issue'},
                {value: 'connection_issue', label: 'Connection Problem'},
                {value: 'other', label: 'Other Issue'}
            ],
            electricity: [
                {value: 'power_outage', label: 'Power Outage'},
                {value: 'voltage_issue', label: 'Voltage Fluctuation'},
                {value: 'billing_issue', label: 'Billing Issue'},
                {value: 'connection_request', label: 'New Connection'},
                {value: 'safety_hazard', label: 'Safety Hazard'},
                {value: 'street_light', label: 'Street Light Issue'},
                {value: 'other', label: 'Other Issue'}
            ],
            traffic: [
                {value: 'traffic_jam', label: 'Traffic Jam'},
                {value: 'signal_issue', label: 'Traffic Signal Issue'},
                {value: 'road_damage', label: 'Road Damage'},
                {value: 'parking_issue', label: 'Parking Problem'},
                {value: 'accident', label: 'Accident Report'},
                {value: 'signage_issue', label: 'Signage Issue'},
                {value: 'other', label: 'Other Issue'}
            ],
            bus: [
                {value: 'bus_delay', label: 'Bus Delay'},
                {value: 'route_issue', label: 'Route Issue'},
                {value: 'driver_behavior', label: 'Driver Behavior'},
                {value: 'bus_condition', label: 'Bus Condition'},
                {value: 'schedule_issue', label: 'Schedule Issue'},
                {value: 'safety_issue', label: 'Safety Concern'},
                {value: 'other', label: 'Other Issue'}
            ],
            waste: [
                {value: 'garbage_not_collected', label: 'Garbage Not Collected'},
                {value: 'collection_delay', label: 'Collection Delay'},
                {value: 'bin_overflow', label: 'Bin Overflow'},
                {value: 'illegal_dumping', label: 'Illegal Dumping'},
                {value: 'sewer_issue', label: 'Sewer Issue'},
                {value: 'recycling_issue', label: 'Recycling Issue'},
                {value: 'other', label: 'Other Issue'}
            ],
            aqi: [
                {value: 'air_pollution', label: 'Air Pollution'},
                {value: 'industrial_emission', label: 'Industrial Emission'},
                {value: 'vehicle_pollution', label: 'Vehicle Pollution'},
                {value: 'construction_dust', label: 'Construction Dust'},
                {value: 'burning_issue', label: 'Burning Issue'},
                {value: 'health_concern', label: 'Health Concern'},
                {value: 'other', label: 'Other Issue'}
            ],
            repairs: [
                {value: 'pothole', label: 'Pothole Repair'},
                {value: 'road_damage', label: 'Road Damage'},
                {value: 'street_light', label: 'Street Light Repair'},
                {value: 'drainage_issue', label: 'Drainage Issue'},
                {value: 'footpath_repair', label: 'Footpath Repair'},
                {value: 'traffic_sign', label: 'Traffic Sign Repair'},
                {value: 'other', label: 'Other Issue'}
            ]
        };
        
        return types[module] || [{value: 'other', label: 'Other Issue'}];
    }

    // Get location options for specific module
    getModuleLocationOptions(module) {
        const locations = {
            water: [
                'Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 5',
                'Sector 6', 'Sector 7', 'Sector 8', 'Sector 9', 'Sector 10',
                'Sector 11', 'Sector 12', 'Sector 13', 'Sector 14', 'Sector 15',
                'Sector 16', 'Sector 17', 'Sector 18', 'Sector 19', 'Sector 20',
                'Sector 21', 'Sector 22', 'Sector 23', 'Sector 24', 'Sector 25',
                'Sector 26', 'Sector 27', 'Sector 28', 'Sector 29', 'Sector 30',
                'Industrial Area', 'Commercial Area', 'Residential Area', 'Other'
            ],
            electricity: [
                'Sector 1-10', 'Sector 11-20', 'Sector 21-30', 'Industrial Area',
                'Commercial Area', 'Residential Area', 'Market Area', 'Hospital Area',
                'Educational Institution', 'Government Office', 'Public Park', 'Other'
            ],
            traffic: [
                'Sector 17 Plaza', 'Madhya Marg', 'Panchkula Junction', 'Airport Road',
                'Railway Crossing', 'Gandhi Chowk', 'Bus Stand', 'ISBT', 'Market Area',
                'School Zone', 'Hospital Area', 'Industrial Area', 'Other'
            ],
            bus: [
                'Sector 43 Bus Stand', 'Sector 17 Bus Stand', 'ISBT', 'Panchkula Bus Stand',
                'Mohali Bus Stand', 'Airport Bus Stand', 'Railway Station', 'Market Area',
                'Residential Sector', 'Industrial Area', 'Educational Institute', 'Other'
            ],
            waste: [
                'Sector 1-10', 'Sector 11-20', 'Sector 21-30', 'Industrial Area',
                'Commercial Area', 'Market Area', 'Residential Area', 'Public Park',
                'Hospital Area', 'Educational Institute', 'Government Office', 'Other'
            ],
            aqi: [
                'Sector 17', 'Industrial Area', 'Rose Garden', 'Sukhna Lake',
                'Railway Station', 'Market Area', 'Residential Area', 'Commercial Area',
                'Educational Institute', 'Hospital Area', 'Public Park', 'Other'
            ],
            repairs: [
                'Madhya Marg', 'Sector 15 Road', 'Panchkula Highway', 'Airport Road',
                'Sector 22 Inner Roads', 'Gandhi Chowk', 'Market Area Roads',
                'Residential Roads', 'Industrial Roads', 'Footpaths', 'Other'
            ]
        };
        
        return locations[module] || ['Other'];
    }

    // Add modal styles
    addModalStyles() {
        if (!document.getElementById('requestModalStyles')) {
            const styles = document.createElement('style');
            styles.id = 'requestModalStyles';
            styles.textContent = `
                .request-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .request-modal-content {
                    background: var(--surface);
                    border-radius: 12px;
                    padding: 24px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: var(--shadow-lg);
                }
                .request-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .request-modal-header h3 {
                    margin: 0;
                    color: var(--text);
                }
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: var(--text3);
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .close-btn:hover {
                    color: var(--text);
                }
                .form-group {
                    margin-bottom: 16px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 500;
                    color: var(--text);
                }
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid var(--border);
                    border-radius: 6px;
                    font-size: 14px;
                    font-family: inherit;
                }
                .form-group textarea {
                    resize: vertical;
                    min-height: 100px;
                }
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: var(--accent);
                    box-shadow: 0 0 0 3px rgba(26, 111, 219, 0.1);
                }
                .form-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    margin-top: 20px;
                }
                .btn-secondary {
                    background: var(--surface2);
                    color: var(--text);
                    border: 1px solid var(--border);
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                }
                .btn-secondary:hover {
                    background: var(--border);
                }
                .request-btn {
                    background: var(--accent);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-size: 12px;
                    cursor: pointer;
                    margin-left: 8px;
                    transition: all 0.3s ease;
                }
                .request-btn:hover {
                    background: var(--blue);
                    transform: translateY(-1px);
                }
            `;
            document.head.appendChild(styles);
        }
    }

    // Get all requests
    getAllRequests() {
        return this.requests;
    }

    // Get requests by module
    getRequestsByModule(module) {
        return this.requests.filter(r => r.module === module);
    }

    // Get requests by status
    getRequestsByStatus(status) {
        return this.requests.filter(r => r.status === status);
    }

    // Update request status and add admin response
    updateRequestWithResponse(requestId, status, adminResponse, adminUsername) {
        const requestIndex = this.requests.findIndex(r => r.id === requestId);
        if (requestIndex !== -1) {
            this.requests[requestIndex].status = status;
            this.requests[requestIndex].adminResponse = adminResponse;
            this.requests[requestIndex].updatedAt = new Date().toISOString();
            this.requests[requestIndex].respondedBy = adminUsername;
            
            this.saveRequests();
            this.logActivity('admin', adminUsername, `Responded to request ${requestId}`);
            
            // Send notification to user (in real app, this would be email/SMS)
            this.notifyUser(this.requests[requestIndex]);
            
            return true;
        }
        return false;
    }

    // Notify user about admin response
    notifyUser(request) {
        // In a real application, this would send email/SMS
        // For now, we'll store the notification in localStorage
        const notifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
        notifications.push({
            userId: request.userId,
            requestId: request.id,
            message: `Admin has responded to your ${request.module} request: ${request.adminResponse}`,
            createdAt: new Date().toISOString(),
            read: false
        });
        localStorage.setItem('userNotifications', JSON.stringify(notifications));
        
        console.log(`Notification sent to user ${request.username}: ${request.adminResponse}`);
    }

    // Save requests to localStorage
    saveRequests() {
        localStorage.setItem('userRequests', JSON.stringify(this.requests));
    }

    // Generate unique request ID
    generateRequestId() {
        return 'REQ_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Log activity
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

// Global request system instance
let requestSystem;

// Initialize request system
function initRequestSystem() {
    requestSystem = new RequestSystem();
}

// Close request dialog
function closeRequestDialog() {
    const modal = document.querySelector('.request-modal');
    if (modal) {
        modal.remove();
    }
}

// Submit module request
function submitModuleRequest(event, module, moduleTitle) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const type = formData.get('type');
    const location = formData.get('location');
    const description = formData.get('description');
    const priority = formData.get('priority');

    const request = requestSystem.createRequest(type, module, description, priority, location);
    
    if (request) {
        alert(`Request submitted successfully! Request ID: ${request.id}`);
        closeRequestDialog();
        
        // Show notification in the UI
        showNotification('Request submitted successfully', 'success');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const styles = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.background = 'var(--green)';
    } else if (type === 'error') {
        notification.style.background = 'var(--red)';
    } else {
        notification.style.background = 'var(--blue)';
    }
    
    notification.style.cssText = styles;
    
    // Add animation
    if (!document.getElementById('notificationStyles')) {
        const animationStyles = document.createElement('style');
        animationStyles.id = 'notificationStyles';
        animationStyles.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(animationStyles);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add request buttons to modules dynamically - SIMPLE VERSION
function addRequestButtonsToAllModules() {
    console.log('=== SIMPLE MODULE BUTTON ADDITION ===');
    
    // Wait for modules to load
    setTimeout(() => {
        // Remove ALL existing buttons first
        document.querySelectorAll('.request-btn').forEach(btn => btn.remove());
        console.log('Removed all existing buttons');
        
        // Simple approach: Find module headers and add buttons
        const moduleHeaders = document.querySelectorAll('.module-title, .module-header h3, .module-header h4, h3, h4');
        console.log(`Found ${moduleHeaders.length} headers to check`);
        
        let buttonsAdded = 0;
        
        moduleHeaders.forEach((header, index) => {
            const text = header.textContent || header.innerText || '';
            console.log(`Header ${index}: "${text}"`);
            
            // Skip if button already exists
            if (header.parentElement && header.parentElement.querySelector('.request-btn')) {
                console.log('Button already exists in this parent');
                return;
            }
            
            // Create button for any module header found
            if (text.trim().length > 0) {
                let module = 'general';
                let title = 'General Request';
                
                // Determine module type
                if (text.toLowerCase().includes('water')) {
                    module = 'water';
                    title = 'Water Supply';
                } else if (text.toLowerCase().includes('electric')) {
                    module = 'electricity';
                    title = 'Electricity';
                } else if (text.toLowerCase().includes('traffic')) {
                    module = 'traffic';
                    title = 'Traffic';
                } else if (text.toLowerCase().includes('bus')) {
                    module = 'bus';
                    title = 'Bus Routes';
                } else if (text.toLowerCase().includes('waste')) {
                    module = 'waste';
                    title = 'Waste Management';
                } else if (text.toLowerCase().includes('air') || text.toLowerCase().includes('aqi')) {
                    module = 'aqi';
                    title = 'Air Quality';
                } else if (text.toLowerCase().includes('road') || text.toLowerCase().includes('repair')) {
                    module = 'repairs';
                    title = 'Road Repairs';
                }
                
                // Create the button
                const btn = document.createElement('button');
                btn.className = 'request-btn';
                btn.innerHTML = '📝 Report Issue';
                btn.style.cssText = `
                    background: var(--accent);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    margin-left: 12px;
                    margin-top: 8px;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.3s ease;
                `;
                
                btn.onclick = () => {
                    console.log(`Button clicked for module: ${module} (${title})`);
                    if (requestSystem) {
                        requestSystem.showModuleRequestDialog(module, title);
                    } else {
                        alert('Request system not ready. Please try again.');
                    }
                };
                
                // Add button
                if (header.parentElement) {
                    header.parentElement.appendChild(btn);
                } else {
                    header.insertAdjacentElement('afterend', btn);
                }
                
                buttonsAdded++;
                console.log(`✅ Added button for: ${title} (module: ${module})`);
            }
        });
        
        console.log(`=== TOTAL BUTTONS ADDED: ${buttonsAdded} ===`);
        
        // If no buttons added, add to main content area
        if (buttonsAdded === 0) {
            console.log('No headers found, adding to main content...');
            addRequestButtonToMainContent();
        }
    }, 3000);
}

// Add request button to main content area (fallback)
function addRequestButtonToMainContent() {
    const mainContent = document.querySelector('.module-frame, #moduleFrame, .fade-in');
    if (mainContent && !mainContent.querySelector('.request-btn')) {
        const btn = document.createElement('button');
        btn.className = 'request-btn';
        btn.innerHTML = '📝 Report Issue';
        btn.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--accent);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 9999;
            transition: all 0.3s ease;
        `;
        
        btn.onclick = () => {
            console.log('Fallback button clicked');
            if (typeof showGenericRequestDialog === 'function') {
                showGenericRequestDialog();
            } else {
                alert('Request dialog not available. Please refresh the page.');
            }
        };
        
        document.body.appendChild(btn);
        console.log('✅ Added fallback request button to main content');
    }
}

// Add buttons to all module containers (fallback method)
function addButtonsToAllModuleContainers() {
    const containers = document.querySelectorAll('.module-header, [class*="module"], [class*="Module"]');
    console.log(`Found ${containers.length} module containers for fallback`);
    
    containers.forEach((container, index) => {
        if (container.querySelector('.request-btn')) {
            return;
        }
        
        const text = container.textContent;
        console.log(`Container ${index}: "${text}"`);
        
        let module = null;
        let title = null;
        
        if (text.includes('Water')) {
            module = 'water';
            title = 'Water Supply';
        } else if (text.includes('Electricity')) {
            module = 'electricity';
            title = 'Electricity';
        } else if (text.includes('Traffic')) {
            module = 'traffic';
            title = 'Traffic';
        } else if (text.includes('Bus')) {
            module = 'bus';
            title = 'Bus Routes';
        } else if (text.includes('Waste')) {
            module = 'waste';
            title = 'Waste Management';
        } else if (text.includes('Air') || text.includes('AQI')) {
            module = 'aqi';
            title = 'Air Quality';
        } else if (text.includes('Road') || text.includes('Repair')) {
            module = 'repairs';
            title = 'Road Repairs';
        }
        
        if (module) {
            const btn = document.createElement('button');
            btn.className = 'request-btn module-specific';
            btn.innerHTML = '📝 Report Issue';
            btn.onclick = () => {
                if (requestSystem) {
                    requestSystem.showModuleRequestDialog(module, title);
                } else {
                    alert('Request system not ready. Please try again.');
                }
            };
            
            container.appendChild(btn);
            console.log(`Fallback: Added button to ${title}`);
        }
    });
}

// Add module-specific request button
function addModuleSpecificButton(header, module, moduleTitle) {
    // Check if button already exists
    const existingBtn = header.parentElement.querySelector('.request-btn');
    if (existingBtn) {
        return; // Button already added
    }
    
    const btn = document.createElement('button');
    btn.className = 'request-btn module-specific';
    btn.innerHTML = '📝 Report Issue';
    btn.onclick = () => {
        if (requestSystem) {
            requestSystem.showModuleRequestDialog(module, moduleTitle);
        } else {
            alert('Request system not ready. Please try again.');
        }
    };
    
    // Add button with proper alignment
    const container = header.parentElement;
    
    // If parent has module-header class, add button inside it
    if (container.classList.contains('module-header')) {
        container.appendChild(btn);
    } else {
        // Otherwise, add after the header with proper spacing
        header.insertAdjacentElement('afterend', btn);
    }
    
    console.log(`Added module-specific button to ${moduleTitle}`);
}

// Helper function to add request button with proper styling
function addRequestButton(header, module, moduleTitle) {
    // Check if button already exists
    const existingBtn = header.parentElement.querySelector('.request-btn');
    if (existingBtn) {
        return; // Button already added
    }
    
    const btn = document.createElement('button');
    btn.className = 'request-btn';
    btn.innerHTML = '📝 Report Issue';
    btn.onclick = () => {
        if (requestSystem) {
            requestSystem.showModuleRequestDialog(module, moduleTitle);
        } else {
            alert('Request system not ready. Please try again.');
        }
    };
    
    // Add button with proper alignment
    const container = header.parentElement;
    
    // If parent has module-header class, add button inside it
    if (container.classList.contains('module-header')) {
        container.appendChild(btn);
    } else {
        // Otherwise, add after the header with proper spacing
        header.insertAdjacentElement('afterend', btn);
    }
    
    console.log(`Added request button to ${moduleTitle}`);
}

// Add floating request button as backup
function addFloatingRequestButton() {
    // Check if button already exists
    if (document.getElementById('floatingRequestBtn')) {
        return;
    }
    
    const floatingBtn = document.createElement('button');
    floatingBtn.id = 'floatingRequestBtn';
    floatingBtn.innerHTML = '📝 Report Issue';
    floatingBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--accent);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 9999;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    
    floatingBtn.onmouseover = () => {
        floatingBtn.style.transform = 'translateY(-2px)';
        floatingBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
    };
    
    floatingBtn.onmouseout = () => {
        floatingBtn.style.transform = 'translateY(0)';
        floatingBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    };
    
    floatingBtn.onclick = () => {
        if (typeof showGenericRequestDialog === 'function') {
            showGenericRequestDialog();
        } else {
            alert('Request dialog not available. Please refresh the page.');
        }
    };
    
    document.body.appendChild(floatingBtn);
    console.log('Floating request button added');
}

// Alternative method to add buttons
function addButtonsToAllModules() {
    const modules = document.querySelectorAll('[class*="module"], [class*="Module"], [class*="container"], [class*="content"]');
    console.log(`Found ${modules.length} module containers`);
    
    modules.forEach((module, index) => {
        // Skip if already has button
        if (module.querySelector('.request-btn')) {
            return;
        }
        
        // Add a generic request button
        const btn = document.createElement('button');
        btn.className = 'request-btn';
        btn.innerHTML = '📝 Report Issue';
        btn.onclick = () => {
            // Show a generic request dialog
            showGenericRequestDialog();
        };
        
        // Add button to module
        module.appendChild(btn);
        console.log(`Added generic button to module ${index}`);
    });
}

// ... (rest of the code remains the same)
function showGenericRequestDialog() {
    const modal = document.createElement('div');
    modal.className = 'request-modal';
    modal.innerHTML = `
        <div class="request-modal-content">
            <div class="request-modal-header">
                <h3>📝 Submit Request</h3>
                <button class="close-btn" onclick="closeRequestDialog()">&times;</button>
            </div>
            <form id="genericRequestForm" onsubmit="submitGenericRequest(event)">
                <div class="form-group">
                    <label for="requestModule">Module</label>
                    <select id="requestModule" name="module" required>
                        <option value="">Select module...</option>
                        <option value="water">Water Supply</option>
                        <option value="electricity">Electricity</option>
                        <option value="traffic">Traffic</option>
                        <option value="bus">Bus Routes</option>
                        <option value="waste">Waste Management</option>
                        <option value="aqi">Air Quality</option>
                        <option value="repairs">Road Repairs</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="requestType">Request Type</label>
                    <select id="requestType" name="type" required>
                        <option value="">Select type...</option>
                        <option value="complaint">Complaint</option>
                        <option value="service">Service Request</option>
                        <option value="information">Information</option>
                        <option value="emergency">Emergency</option>
                        <option value="suggestion">Suggestion</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="requestLocation">Location</label>
                    <input type="text" id="requestLocation" name="location" required 
                           placeholder="Enter your location (Sector, Area, etc.)">
                </div>
                <div class="form-group">
                    <label for="requestDescription">Problem Description</label>
                    <textarea id="requestDescription" name="description" required 
                              placeholder="Please describe the issue in detail..." 
                              rows="4"></textarea>
                </div>
                <div class="form-group">
                    <label for="requestPriority">Priority</label>
                    <select id="requestPriority" name="priority" required>
                        <option value="low">Low - Minor issue</option>
                        <option value="medium" selected>Medium - Moderate issue</option>
                        <option value="high">High - Urgent issue</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeRequestDialog()">Cancel</button>
                    <button type="submit" class="btn-primary">Submit Request</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Submit generic request
function submitGenericRequest(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const module = formData.get('module');
    const type = formData.get('type');
    const location = formData.get('location');
    const description = formData.get('description');
    const priority = formData.get('priority');

    const request = requestSystem.createRequest(type, module, description, priority, location);
    
    if (request) {
        alert(`Request submitted successfully! Request ID: ${request.id}`);
        closeRequestDialog();
        showNotification('Request submitted successfully', 'success');
    }
}

// Helper function to add request button
function addRequestButton(header, module, moduleTitle) {
    // Check if button already exists
    const existingBtn = header.parentElement.querySelector('.request-btn');
    if (existingBtn) {
        return; // Button already added
    }
    
    const btn = document.createElement('button');
    btn.className = 'request-btn';
    btn.innerHTML = '📝 Report Issue';
    btn.onclick = () => {
        if (requestSystem) {
            requestSystem.showModuleRequestDialog(module, moduleTitle);
        } else {
            alert('Request system not ready. Please try again.');
        }
    };
    
    // Add button after the module title
    header.parentElement.appendChild(btn);
    console.log(`Added request button to ${moduleTitle}`);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initRequestSystem();
    
    // Note: Request buttons are now integrated into each module file
    // No need for dynamic button addition
    console.log('Request system initialized - buttons are in modules');
});

// Global helper function for manual button addition
window.addRequestButtons = function() {
    console.log('Manually adding request buttons...');
    addRequestButtonsToAllModules();
};

// Global function to show request dialog manually
window.showRequestDialog = function(module, title) {
    if (requestSystem) {
        requestSystem.showModuleRequestDialog(module, title);
    } else {
        alert('Request system not initialized');
    }
};

// Global function to show generic request dialog
window.submitRequest = function() {
    console.log('Opening request dialog...');
    if (typeof showGenericRequestDialog === 'function') {
        showGenericRequestDialog();
    } else {
        alert('Request dialog not available. Please refresh the page.');
    }
};

// Add keyboard shortcut for request submission
document.addEventListener('keydown', function(event) {
    // Ctrl+R to open request dialog
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        if (typeof showGenericRequestDialog === 'function') {
            showGenericRequestDialog();
        }
    }
});
