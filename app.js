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
        return { success: true, message: 'Registration successful!' };
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
        return { success: true, message: `Welcome, ${user.name}!` };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    hashPassword(password) {
       (password) {
        let hash let hash = 0;
        for = 0;
        for (let i =  (let i = 00; i; i < password.length; i++) {
            const < password.length; i++) {
            char = password const char = password.charCode.charCodeAt(iAt(i);
            hash =);
            hash = ((hash ((hash <<  << 5)5) - hash - hash) + char;
) + char;
            hash            hash = hash & hash;
 = hash & hash;
               }
        }
        return hash return hash.toString();
.toString();
    }
    }
}

const db =}

const new UserDatabase db = new UserDatabase();

();

// DOM// DOM Elements
 Elements
const modalconst modal = document.getElementById(' = document.getElementById('authModalauthModal');
const');
const loginForm loginForm = document = document.getElementById('loginForm');
const.getElementById('loginForm');
const registerForm registerForm = document = document.getElementById.getElementById('registerForm('registerForm');
const');
const modalTitle = document.getElementById(' modalTitle = document.getElementById('modalTitle');
constmodalTitle');
const userProfile = document userProfile = document.getElementById('userProfile.getElementById('');
constuserProfile userNameDisplay');
const userNameDisplay = document.getElementById('userNameDisplay');
const login = document.getElementById('userNameDisplay');
const loginBtn = document.querySelectorBtn = document.querySelector('.login('.login-btn');
const register-btn');
const registerBtn = document.querySelector('.register-btn');
Btn = document.querySelector('.register-btn');
const pages = document.querySelectorAllconst pages = document('.page.querySelectorAll('.page');
const');
const navLinks = document navLinks.querySelectorAll = document.querySelectorAll('.nav-center('.nav a');
const-center a');
const toast = toast = document.getElementById document.getElementById('toast');
('toast');
const toastconst toastMessage =Message = document.getElementById document.getElementById('toastMessage('toastMessage');

//');

// Check login status
document.addEventListener Check login status
('DOMdocument.addEventListener('DOMContentLoadedContentLoaded', () => {
', () => {
    updateAuthUI    updateAuthUI();
    
   ();
    
    if if (window.location.hash (window.location.hash) {
) {
        const targetId        const targetId = window = window.location.hash.location.hash.substring(1);
        switchPage(targetId);
.substring(1);
        switchPage(targetId);
    }
    }
});

function updateAuth});

function updateAuthUI() {
    if (UI() {
    if (db.isdb.isLoggedInLoggedIn()) {
()) {
        login        loginBtn.classListBtn.classList.add('.add('hidden');
hidden');
        register        registerBtn.classListBtn.classList.add('.add('hidden');
        userProfile.classListhidden');
        userProfile.classList.remove('.remove('hidden');
        userNameDisplay.textContent =hidden');
        userNameDisplay.textContent = db.current db.currentUser.name;
   User.name;
    } else {
        } else {
        loginBtn.classList.remove loginBtn('hidden.classList.remove('hidden');
       ');
        registerBtn registerBtn.classList.remove('hidden.classList.remove('hidden');
       ');
        userProfile userProfile.classList.add('hidden.classList.add('hidden');
   ');
    }
}

 }
}

//// Modal functions Modal functions
function openModal
function openModal(type)(type) {
    {
    modal modal.classList.add('.classList.add('show');
    document.body.style.overflow = 'hidden';
show');
    document.body.style.overflow = 'hidden';
    
    if (type ===    
    if (type === 'login 'login') {
') {
        modal        modalTitle.textTitle.textContent = 'LoginContent =';
        loginForm 'Login';
       .classList.add loginForm.classList.add('active('active-form');
-form');
        register        registerForm.classListForm.classList.remove('.remove('active-formactive-form');
    } else');
    {
        } else {
        modalTitle modalTitle.textContent = '.textContent = 'Register';
        registerRegister';
       Form.classList.add(' registerForm.classList.add('active-formactive-form');
       ');
        loginForm loginForm.classList.remove.classList.remove('active('active-form');
    }
}

-form');
    }
}

functionfunction closeModal closeModal() {
() {
    modal    modal.classList.remove.classList.remove('show');
   ('show document.body');
    document.body.style..style.overflow =overflow = 'auto 'auto';
}

';
}

function switchfunction switchModal(typeModal(type) {
    if) {
    if (type (type === === ' 'login') {
       login') modalTitle {
        modal.textContent = 'Title.textContent = 'Login';
Login';
        loginForm.classList        loginForm.classList.add('active-form.add('');
       active-form');
        registerForm registerForm.classList.remove.classList.remove('active('active-form');
    }-form');
    } else {
 else {
        modal        modalTitle.textTitle.textContent =Content = 'Register 'Register';
        registerForm';
        registerForm.classList.classList.add.add('active-form');
('active-form');
        loginForm.classList        loginForm.classList.remove('active-form.remove('active');
    }
}

-form');
    }
}

// Handle Login
function handleLogin(event) {
    event.preventDefault// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
();
    
    const email =    const document.getElementById('login email = document.getElementById('loginEmail').value;
Email').value;
    const    const password = document.getElementById password =('login document.getElementById('loginPassword').Password').value;

    constvalue;

 result =    const result = db.login db.login(email, password(email, password);
    
);
    
       if (result.success) {
        showToast(result if (result.success) {
        showToast(result.message);
        close.message);
        closeModal();
Modal();
        update        updateAuthUI();
       AuthUI();
        document.getElementById document.getElementById('login('loginEmail').value = '';
        document.getElementByIdEmail').value = '';
        document.getElementById('login('loginPassword').value = '';
    } else {
        showToast(result.message, 'Password').value = '';
    } else {
        showToast(result.message, 'error');
    }
}

// Handle Register
function handleRegistererror');
    }
}

// Handle Register
function handleRegister(event) {
   (event) {
    event event.preventDefault();
    
.preventDefault();
    
    const    const name = document.getElementById name = document.getElementById('reg('regName').value;
    constName').value;
    const email = email = document.getElementById(' document.getElementById('regEmail').regEmail').value;
    constvalue;
    const password password = document.getElementById('reg = document.getElementById('regPassword').Password').value;
    constvalue;
    const confirmPassword confirmPassword = document = document.getElementById('regConfirm.getElementById('regConfirmPassword').value;

Password').value;

    if    if ( (password !== confirmPassword)password !== confirm {
       Password) {
        showToast showToast('Pass('Passwords dowords do not match!', 'error not match!',');
        'error');
        return;
 return;
    }

    }

    if    if (password.length (password.length < 6) {
 < 6) {
        showToast('Password must        showToast('Password must be at be at least  least 66 characters characters!', 'error!', 'error');
       ');
        return;
    }

 return;
    }

       const result const result = = db.register db.register({ name({ name, email, email, password, password });
    
 });
    
    if (result    if (result.success) {
       .success) {
        showToast showToast(result.message(result.message);
       );
        switchModal switchModal('login');
       ('login');
        document.getElementById('reg document.getElementById('regName').Name').value =value = '';
        '';
        document.getElementById document.getElementById('regEmail').('regEmail').valuevalue = '';
        = '';
        document.getElementById document.getElementById('reg('regPassword').value =Password').value = '';
        '';
        document.getElementById document.getElementById('reg('regConfirmPasswordConfirmPassword').value').value = '';
 = '';
    }    } else {
 else {
        show        showToast(resultToast(result.message,.message, ' 'error');
   error');
    }
}

 }
}

// Log// Logoutout

function logoutfunction logout() {
() {
    db.logout    db.logout();
    updateAuthUI();
    showToast('();
    updateAuthUI();
    showToast('Logged outLogged out successfully! successfully!');
}

');
}

// Switch// Switch pages
 pages
function switchfunction switchPage(pagePage(pageIdId)) {
    {
    pages.forEach pages.forEach(page =>(page => {
        page.classList {
        page.classList.remove('.remove('active-pageactive-page');
       ');
        if ( if (page.idpage.id === pageId) === pageId) {
            {
            page.classList page.classList.add('.add('active-pageactive-page');
        }
    });

   ');
        }
    });

    navLinks navLinks.forEach(link =>.forEach(link => {
        {
        link.classList.remove(' link.classList.removeactive');
('active');
        if        if (link.getAttribute('href') === `#${pageId}`) {
 (link.getAttribute('href') === `#${pageId}`) {
            link            link.classList.add('active');
       .classList.add('active');
        }
    });
}

 }
    });
}

// Handle// Handle purchase purchase/download/download
function handlePurchase
function handlePurchase(plan(plan) {
) {
    if (!db    if (!db.isLogged.isLoggedIn()) {
       In()) showToast {
        showToast('Please('Please login to login to purchase! purchase!',', 'error');
        open 'error');
        openModal('Modal('login');
login');
        return        return;
   ;
    }
    showToast }
    showToast(`Selected ${plan} plan!`);
}

(`Selected ${plan} plan!`);
}

function handleDownload(version) {
   function handleDownload(version) {
    if (! if (!db.isLoggedIn()) {
db.isLoggedIn()) {
        show        showToast('Toast('Please loginPlease login to download!', 'error');
        to download!', ' openModal('login');
        return;
    }
error');
        openModal('login');
        return;
    }
    showToast(`    showDownloading ${version} versionToast(`Downloading ${version} version...`);
}

//...`);
}

// Toast
function show Toast
function showToast(message, typeToast(message, type = ' = 'success') {
   success') {
    toastMessage toastMessage.textContent.textContent = message = message;
    toast.class;
    toast.className =Name = 'toast ' show';
toast show';
    
       
    setTimeout(() => {
 setTimeout(() => {
        toast.classList.remove('show');
    }, 3000        toast.classList.remove('show');
    }, 3000);
}

// Navigation
nav);
}

// Navigation
navLinks.forEachLinks.forEach(link(link => {
    link => {
    link.addEventListener('.addEventListener('click',click', (e) (e) => {
        => {
        e.preventDefault e.preventDefault();
       ();
        const targetId = const targetId = link.get link.getAttribute('Attribute('href').href').substring(1substring(1);
       );
        switchPage switchPage(targetId);
   (targetId);
    });
});

 });
});

// Close// Close modal with modal with Escape key
document Escape key
document.addEventListener('.addEventListener('keydownkeydown', (e)', (e) => {
 => {
    if    if (e.key (e.key === 'Escape' === 'Escape' && modal.classList.contains('show && modal.classList.contains('show')) {
')) {
        closeModal();
        closeModal();
    }
    }
});

//});

// Click outside modal Click outside
modal modal
modal.addEventListener('.addEventListener('clickclick', (e', (e) =>) => {
    {
    if ( if (e.target === modale.target) {
 === modal) {
        close        closeModal();
Modal();
    }
    }
});

//});

// Menu icon click ( Menu iconyou click (you can add can add menu menu functionality later functionality later)
document)
document.querySelector.querySelector('.('.menu-icon').addmenu-icon').addEventListener('click', () =>EventListener('click', () => {
    {
    showToast('Menu coming showToast('Menu coming soon!');
});

// Global functions
window.openModal = openModal;
window.closeModal = closeModal;
window.sw soon!');
});

// Global functions
window.openModal = openModal;
window.closeModal = closeModal;
window.switchModal = switchModal;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.handlePurchase = handlePurchase;
window.handleDownloaditchModal = switchModal;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.handlePurchase = handlePurchase;
window.handleDownload = handleDownload;
