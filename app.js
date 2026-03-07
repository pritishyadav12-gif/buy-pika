// Navigation
document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    const pages = document.querySelectorAll('.page');

    // Add click event to each nav link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Get target page id from href
            const targetId = link.getAttribute('href').substring(1);

            // Remove active class from all links and pages
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active-page'));

            // Add active class to clicked link and target page
            link.classList.add('active');
            document.getElementById(targetId).classList.add('active-page');

            // Update URL without page reload
            history.pushState(null, '', `#${targetId}`);
        });
    });

    // Check if there's a hash in URL on page load
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetLink = document.querySelector(`.nav-links a[href="#${targetId}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
});

// Simple toast function
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Make showToast globally available
window.showToast = showToast;

// Add smooth hover effects
document.querySelectorAll('.feature-card, .pricing-card, .download-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.2)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = 'none';
    });
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetLink = document.querySelector(`.nav-links a[href="#${targetId}"]`);
        if (targetLink) {
            targetLink.click();
        }
    } else {
        // If no hash, go to home
        document.querySelector('.nav-links a[href="#home"]').click();
    }
});

// Add active class based on scroll position (optional)
window.addEventListener('scroll', () => {
    // You can add scroll-based navigation highlighting here if needed
});
