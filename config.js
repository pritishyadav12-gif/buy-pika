// ===== config.js =====
// Update this with your actual backend URL after deploying
const CONFIG = {
    // For local development:
    // BACKEND_URL: 'http://localhost:3000/api',
    
    // For Vercel deployment (change to your actual URL):
    BACKEND_URL: 'https://your-pika-api.vercel.app/api',
    
    // For Netlify deployment:
    // BACKEND_URL: 'https://your-pika-api.netlify.app/.netlify/functions',
    
    PLANS: {
        MONTHLY: {
            amount: 29,
            type: 'Monthly',
            orderPrefix: 'PIKA-MTH'
        },
        LIFETIME: {
            amount: 199,
            type: 'Lifetime',
            orderPrefix: 'PIKA-LT'
        }
    }
};

// Make it available globally
window.CONFIG = CONFIG;