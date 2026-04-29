// Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.tempUserData = null;
        this.generatedOTP = null;
        this.otpExpiry = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                console.log('User already logged in:', this.currentUser.username);
                
                // Verify user still exists in users database
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const userExists = users.find(u => u.id === this.currentUser.id);
                
                if (userExists) {
                    // User exists, redirect to main app
                    console.log('User verified, redirecting to main app');
                    window.location.href = 'index.html';
                } else {
                    // User doesn't exist in database, clear session
                    console.log('User not found in database, clearing session');
                    this.logout();
                }
            } catch (error) {
                console.error('Error parsing saved user data:', error);
                this.logout();
            }
        } else {
            console.log('No saved user found, showing login form');
        }
        
        // Setup OTP input auto-focus (though OTP is removed)
        // this.setupOTPInputs();
    }

    setupOTPInputs() {
        const otpInputs = document.querySelectorAll('.otp-input');
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
        });
    }

    // Form switching functions
    showLogin() {
        this.hideAllForms();
        document.getElementById('loginForm').classList.add('active');
        this.clearMessages();
    }

    showSignup() {
        this.hideAllForms();
        document.getElementById('signupForm').classList.add('active');
        this.clearMessages();
    }

    showOTP(mobile) {
        // Removed - no longer needed
    }

    hideAllForms() {
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
    }

    // Message display functions
    showMessage(formId, message, type = 'error') {
        this.clearMessages();
        const form = document.getElementById(formId);
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;
        form.insertBefore(messageDiv, form.querySelector('form'));
    }

    clearMessages() {
        document.querySelectorAll('.error-message, .success-message').forEach(msg => {
            msg.remove();
        });
    }

    // Login functionality
    async handleLogin(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');

        console.log('Login attempt for username:', username);

        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.classList.add('loading');

        try {
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            console.log('Total users in database:', users.length);
            
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                // Successful login
                console.log('Login successful for user:', user.username);
                
                this.currentUser = user;
                
                // Save to localStorage with verification
                const userSession = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    mobile: user.mobile,
                    createdAt: user.createdAt,
                    loginTime: new Date().toISOString()
                };
                
                localStorage.setItem('currentUser', JSON.stringify(userSession));
                console.log('User session saved:', userSession);
                
                this.showMessage('loginForm', 'Login successful! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                console.log('Login failed: Invalid credentials');
                this.showMessage('loginForm', 'Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('loginForm', 'Login failed. Please try again.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('loading');
        }
    }

    // Enhanced validation function
    validateUserData(userData) {
        const errors = [];

        // Username validation
        if (userData.username.length < 6) {
            errors.push('Username must be at least 6 characters long');
        }
        if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
            errors.push('Username can only contain letters, numbers, and underscores');
        }

        // Email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(userData.email)) {
            errors.push('Please enter a valid email address');
        }

        // Mobile number validation
        if (!/^[0-9]{10}$/.test(userData.mobile)) {
            errors.push('Mobile number must be exactly 10 digits');
        }
        if (!/^[6-9]/.test(userData.mobile)) {
            errors.push('Mobile number must start with 6, 7, 8, or 9');
        }

        // Password validation
        if (userData.password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(userData.password)) {
            errors.push('Password must contain at least one special character (!@#$%^&* etc.)');
        }
        if (!/(?=.*[a-z])/.test(userData.password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/(?=.*[A-Z])/.test(userData.password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/(?=.*[0-9])/.test(userData.password)) {
            errors.push('Password must contain at least one number');
        }

        return errors;
    }

    // Signup functionality
    async handleSignup(event) {
        event.preventDefault();
        console.log('Signup form submitted'); // Debug log
        
        const formData = new FormData(event.target);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            mobile: formData.get('mobile'),
            password: formData.get('password')
        };
        
        console.log('User data:', userData); // Debug log

        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating account...';
        submitBtn.classList.add('loading');

        try {
            // Validate user data
            const validationErrors = this.validateUserData(userData);
            console.log('Validation errors:', validationErrors); // Debug log
            
            if (validationErrors.length > 0) {
                this.showMessage('signupForm', validationErrors.join('<br>'));
                return;
            }

            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const existingUser = users.find(u => 
                u.username === userData.username || 
                u.email === userData.email || 
                u.mobile === userData.mobile
            );

            if (existingUser) {
                if (existingUser.username === userData.username) {
                    this.showMessage('signupForm', 'Username already exists');
                } else if (existingUser.email === userData.email) {
                    this.showMessage('signupForm', 'Email already registered');
                } else {
                    this.showMessage('signupForm', 'Mobile number already registered');
                }
                return;
            }

            // Create new user directly (no OTP)
            const newUser = {
                ...userData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                isVerified: true
            };
            
            console.log('Creating new user:', newUser);
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            console.log('Users database updated. Total users:', users.length);

            // Auto-login after successful signup
            this.currentUser = newUser;
            
            // Save session with same format as login
            const userSession = {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                mobile: newUser.mobile,
                createdAt: newUser.createdAt,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userSession));
            console.log('User session saved after signup:', userSession);

            this.showMessage('signupForm', 'Account created successfully! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error('Signup error:', error); // Debug log
            this.showMessage('signupForm', 'Signup failed. Please try again.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('loading');
        }
    }

    
    // Logout functionality
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// Global functions for HTML onclick handlers
let authSystem;

// Debug function to check localStorage status
function checkLocalStorageStatus() {
    console.log('=== LocalStorage Status ===');
    console.log('Users:', JSON.parse(localStorage.getItem('users') || '[]'));
    console.log('Current User:', JSON.parse(localStorage.getItem('currentUser') || 'null'));
    console.log('User Requests:', JSON.parse(localStorage.getItem('userRequests') || '[]'));
    console.log('Activity Logs:', JSON.parse(localStorage.getItem('activityLogs') || '[]'));
    console.log('========================');
}

// Clear all data (for testing)
function clearAllData() {
    if (confirm('This will clear ALL user data. Are you sure?')) {
        localStorage.clear();
        console.log('All localStorage data cleared');
        location.reload();
    }
}

function showLogin() {
    authSystem.showLogin();
}

function showSignup() {
    authSystem.showSignup();
}

function handleLogin(event) {
    authSystem.handleLogin(event);
}

function handleSignup(event) {
    authSystem.handleSignup(event);
}

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    authSystem = new AuthSystem();
    
    // Add debug functions to window for console access
    window.checkLocalStorageStatus = checkLocalStorageStatus;
    window.clearAllData = clearAllData;
    
    console.log('Auth system initialized');
    console.log('Debug functions available: checkLocalStorageStatus(), clearAllData()');
});
