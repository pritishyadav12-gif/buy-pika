// User Database Class
class UserDatabase {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    }

    register(userData) {
        // Check if user exists
        const existingUser = this.users.find(u => u.email === userData.email);
        if (existingUser) {
            return { success: false, message: 'Email already registered!' };
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            password: this.hashPassword(userData.password),
            createdAt: new Date().toISOString(),
            plan: 'free'
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
            email: user.email,
            plan: user.plan
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
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-links a');
const authModal = document.getElementById('authModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const modalTitle = document.getElementById('modalTitle');
const userProfile = document.getElementById('userProfile');
const userNameDisplay = document.getElementById('userNameDisplay');
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

    // Initialize particles
    createParticles();
});

// Navigation
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

// Auth Modal
function showAuthModal(type) {
    authModal.classList.add('show');
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

function closeAuthModal() {
    authModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function switchAuthModal(type) {
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
        closeAuthModal();
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
        switchAuthModal('login');
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

// Update UI based on auth status
function updateAuthUI() {
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    
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

// Toast notification
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Handle Download
function handleDownload(plan) {
    if (!db.isLoggedIn()) {
        showToast('Please login to download!', 'error');
        showAuthModal('login');
        return;
    }
    
    showToast(`Starting download for ${plan} plan...`, 'success');
    // Add actual download logic here
}

// Forgot password
function forgotPassword() {
    showToast('Password reset link sent to your email!', 'success');
}

// Mobile menu
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const navAuth = document.querySelector('.nav-auth');
    
    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
        navAuth.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navAuth.style.display = 'flex';
        navAuth.style.flexDirection = 'column';
    }
}

// Particles animation
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = Math.random() * 3 + 2 + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particlesContainer.appendChild(particle);
    }
}

// Add particles CSS dynamically
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

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        if (targetId && document.getElementById(targetId)) {
            switchPage(targetId);
        }
    });
});

// Handle browser back/forward
window.addEventListener('popstate', () => {
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        switchPage(targetId);
    }
});

// Input animations
document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal.classList.contains('show')) {
        closeAuthModal();
    }
});

// Click outside modal to close
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        closeAuthModal();
    }
});

// Make functions globally available
window.showAuthModal = showAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthModal = switchAuthModal;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.toggleMobileMenu = toggleMobileMenu;
window.handleDownload = handleDownload;
window.forgotPassword = forgotPassword;
