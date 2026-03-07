// User database (stored in localStorage)
class UserDatabase {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
    }

    // Register new user
    register(userData) {
        // Check if user already exists
        const existingUser = this.users.find(user => user.email === userData.email);
        if (existingUser) {
            return { success: false, message: 'User already exists!' };
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            password: this.hashPassword(userData.password),
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        return { success: true, message: 'Registration successful!' };
    }

    // Login user
    login(email, password) {
        const user = this.users.find(u => u.email === email);
        if (!user) {
            return { success: false, message: 'User not found!' };
        }

        if (user.password !== this.hashPassword(password)) {
            return { success: false, message: 'Invalid password!' };
        }

        // Store current user session
        const userSession = {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        };
        localStorage.setItem('currentUser', JSON.stringify(userSession));

        return { success: true, message: 'Login successful!', user: userSession };
    }

    // Logout user
    logout() {
        localStorage.removeItem('currentUser');
    }

    // Check if user is logged in
    isLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    }

    // Get current user
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    // Simple hash function (for demo purposes only)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }
}

// Initialize database
const db = new UserDatabase();

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginContainer = document.querySelector('.login-form');
const registerContainer = document.querySelector('.register-form');
const dashboard = document.getElementById('dashboard');
const authContainer = document.querySelector('.auth-container');
const featuresSection = document.querySelector('.features-section');
const toast = document.getElementById('toast');

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    if (db.isLoggedIn()) {
        showDashboard();
    }
    updateNavActiveState();
});

// Toggle between login and register forms
function toggleForms() {
    loginContainer.classList.toggle('active-form');
    registerContainer.classList.toggle('active-form');
}

// Make toggleForms globally available
window.toggleForms = toggleForms;

// Handle Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Validation
    if (!email || !password) {
        showToast('Please fill in all fields!', 'error');
        return;
    }

    // Attempt login
    const result = db.login(email, password);
    
    if (result.success) {
        showToast(result.message, 'success');
        loginForm.reset();
        showDashboard();
    } else {
        showToast(result.message, 'error');
    }
});

// Handle Register
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields!', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match!', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters!', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showToast('Please enter a valid email!', 'error');
        return;
    }

    // Attempt registration
    const result = db.register({ name, email, password });
    
    if (result.success) {
        showToast(result.message, 'success');
        registerForm.reset();
        // Switch to login form
        setTimeout(() => {
            toggleForms();
        }, 2000);
    } else {
        showToast(result.message, 'error');
    }
});

// Logout function
function logout() {
    db.logout();
    showToast('Logged out successfully!', 'success');
    
    // Hide dashboard and show auth
    dashboard.classList.add('hidden');
    authContainer.style.display = 'block';
    featuresSection.style.display = 'block';
    loginContainer.classList.add('active-form');
    registerContainer.classList.remove('active-form');
    
    updateNavActiveState();
}

// Make logout globally available
window.logout = logout;

// Show dashboard
function showDashboard() {
    const user = db.getCurrentUser();
    if (!user) return;

    // Update dashboard with user info
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    
    const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('memberSince').textContent = memberSince;

    // Show dashboard and hide auth
    dashboard.classList.remove('hidden');
    authContainer.style.display = 'none';
    featuresSection.style.display = 'none';
    
    updateNavActiveState();
}

// Show toast notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Validate email format
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Update navigation active state
function updateNavActiveState() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const isLoggedIn = db.isLoggedIn();
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#home') {
            link.classList.add('active');
        }
    });
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add input animations
document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Press Esc to clear forms
    if (e.key === 'Escape') {
        loginForm.reset();
        registerForm.reset();
    }
});