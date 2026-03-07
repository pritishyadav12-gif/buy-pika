// User Database Class
class UserDatabase {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        
        // Add demo user
        if (!this.users.find(u => u.email === 'demo@example.com')) {
            this.users.push({
                id: 1,
                name: 'Demo User',
                email: 'demo@example.com',
                password: this.hashPassword('demo123'),
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('users', JSON.stringify(this.users));
        }
    }

    register(userData) {
        const existingUser = this.users.find(u => u.email === userData.email);
        if (existingUser) {
            return { success: false, message: 'Email already registered!' };
        }

        const newUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            password: this.hashPassword(userData.password),
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        return { success: true, message: 'Registration successful! Please login.' };
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            return { success: false, message: 'User not found!' };
        }

        if (user.password !== this.hashPassword(password)) {
            return { success: false, message: 'Invalid password!' };
        }

        this.currentUser = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        return { success: true, message: `Welcome back, ${user.name}!` };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

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
const modal = document.getElementById('authModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const modalTitle = document.getElementById('modalTitle');
const userProfile = document.getElementById('userProfile');
const userNameDisplay = document.getElementById('userNameDisplay');
const loginBtn = document.querySelector('.login-btn');
const registerBtn = document.querySelector('.register-btn');
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-links a');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Check login status on load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    
    // Handle hash navigation
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        switchPage(targetId);
    }

    createParticles();
});

// Update auth UI based on login status
function updateAuthUI() {
    if (db.isLoggedIn()) {
        loginBtn.classList.add('hidden');
        registerBtn.classList.add('hidden');
        userProfile.classList.remove('hidden');
        userNameDisplay.textContent = db.currentUser.name;
    } else {
        loginBtn.classList.remove('hidden');
        registerBtn.classList.remove('hidden');
        userProfile.classList.add('hidden');
    }
}

// Modal functions
function openModal(type) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    if (type === 'login') {
        modalTitle.textContent = 'Login';
        loginForm.classList.add('active-form');
        registerForm.classList.remove('active-form');
    } else {
        modalTitle.textContent = 'Register';
        registerForm.classList.add('active-form');
        loginForm.classList.remove('active-form');
    }
}

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function switchModal(type) {
    if (type === 'login') {
        modalTitle.textContent = 'Login';
        loginForm.classList.add('active-form');
        registerForm.classList.remove('active-form');
    } else {
        modalTitle.textContent = 'Register';
        registerForm.classList.add('active-form');
        loginForm.classList.remove('active-form');
    }
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showToast('Please fill in all fields!', 'error');
        return;
    }

    const result = db.login(email, password);
    
    if (result.success) {
        showToast(result.message, 'success');
        closeModal();
        updateAuthUI();
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
    } else {
        showToast(result.message, 'error');
    }
}

// Handle Register
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

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

    const result = db.register({ name, email, password });
    
    if (result.success) {
        showToast(result.message, 'success');
        switchModal('login');
        document.getElementById('regName').value = '';
        document.getElementById('regEmail').value = '';
        document.getElementById('regPassword').value = '';
        document.getElementById('regConfirmPassword').value = '';
    } else {
        showToast(result.message, 'error');
    }
}

// Logout
function logout() {
    db.logout();
    updateAuthUI();
    showToast('Logged out successfully!', 'success');
}

// Switch pages
function switchPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active-page');
        if (page.id === pageId) {
            page.classList.add('active-page');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${pageId}`) {
            link.classList.add('active');
        }
    });
}

// Handle purchase
function handlePurchase(plan) {
    if (!db.isLoggedIn()) {
        showToast('Please login to purchase!', 'error');
        openModal('login');
        return;
    }
    showToast(`Thank you for your interest in ${plan} plan!`, 'success');
}

// Handle download
function handleDownload(version) {
    if (!db.isLoggedIn()) {
        showToast('Please login to download!', 'error');
        openModal('login');
        return;
    }
    showToast(`Starting download for ${version} version...`, 'success');
}

// Forgot password
function forgotPassword() {
    showToast('Demo: Password reset link would be sent to your email!', 'info');
}

// Toast notification
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Create particles
function createParticles() {
    const particlesContainer = document.querySelector('.hero-particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = Math.random() * 3 + 2 + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particlesContainer.appendChild(particle);
    }
}

// Add particles CSS
const style = document.createElement('style');
style.textContent = `
    .hero-particles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 1;
    }

    .particle {
        position: absolute;
        width: 2px;
        height: 2px;
        background: var(--gold);
        border-radius: 50%;
        opacity: 0.3;
        animation: floatParticle linear infinite;
    }

    @keyframes floatParticle {
        0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 0.3;
        }
        90% {
            opacity: 0.3;
        }
        100% {
            transform: translateY(-100px) translateX(100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Navigation click handlers
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        switchPage(targetId);
    });
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
    }
});

// Click outside modal to close
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Make functions globally available
window.openModal = openModal;
window.closeModal = closeModal;
window.switchModal = switchModal;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.handlePurchase = handlePurchase;
window.handleDownload = handleDownload;
window.forgotPassword = forgotPassword;