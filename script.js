// ===== script.js =====

class PikaPayment {
    constructor() {
        this.backendUrl = window.CONFIG.BACKEND_URL;
        this.initElements();
        this.initEventListeners();
        this.checkBackendHealth();
    }

    initElements() {
        this.buyMonthly = document.getElementById('buyMonthly');
        this.buyLifetime = document.getElementById('buyLifetime');
        this.paymentStatus = document.getElementById('paymentStatus');
        this.statusContent = document.getElementById('statusContent');
        this.statusHeader = document.querySelector('.status-header span');
    }

    initEventListeners() {
        this.buyMonthly.addEventListener('click', () => this.handlePayment('monthly'));
        this.buyLifetime.addEventListener('click', () => this.handlePayment('lifetime'));
    }

    async checkBackendHealth() {
        try {
            const response = await fetch(`${this.backendUrl}/health`);
            const data = await response.json();
            if (data.status === 'OK') {
                this.showToast('✅ Connected to payment server', 'success');
            }
        } catch (error) {
            console.log('Backend health check failed (normal if not deployed yet)');
        }
    }

    async handlePayment(planType) {
        const plan = window.CONFIG.PLANS[planType.toUpperCase()];
        if (!plan) return;

        const button = planType === 'monthly' ? this.buyMonthly : this.buyLifetime;
        const originalText = button.textContent;

        try {
            button.disabled = true;
            button.textContent = 'Processing...';
            button.classList.add('loading');

            const orderId = `${plan.orderPrefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            this.updatePaymentStatus('info', '⏳ Creating payment request...');

            const response = await fetch(`${this.backendUrl}/create-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: plan.amount,
                    order_id: orderId,
                    planType: plan.type,
                    description: `Pika Injection ${plan.type} - Order ${orderId}`
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Payment creation failed');
            }

            if (data.success) {
                this.updatePaymentStatus('success', data);
                this.showToast('✅ Payment created successfully!', 'success');
                
                if (data.payment_url) {
                    window.open(data.payment_url, '_blank');
                }
            } else {
                throw new Error(data.error || 'Unknown error');
            }

        } catch (error) {
            console.error('Payment error:', error);
            this.updatePaymentStatus('error', error.message);
            this.showToast('❌ ' + error.message, 'error');
        } finally {
            button.disabled = false;
            button.textContent = originalText;
            button.classList.remove('loading');
        }
    }

    updatePaymentStatus(type, data) {
        if (!this.paymentStatus || !this.statusContent) return;

        this.paymentStatus.classList.remove('success', 'error');
        
        if (type === 'success') {
            this.paymentStatus.classList.add('success');
            this.statusHeader.textContent = '✅ Payment Ready';
            
            const paymentData = data.data || data;
            const paymentUrl = data.payment_url || paymentData.payment_url;
            
            let html = `
                <strong>Payment created!</strong><br>
                Track ID: ${paymentData.trackId || 'N/A'}<br>
                Amount: $${data.data?.amount || 'N/A'}<br>
                Status: ${paymentData.message || 'pending'}<br>
            `;
            
            if (paymentUrl) {
                html += `<br><a href="${paymentUrl}" target="_blank" class="payment-link">🔗 Click to Pay</a>`;
            }
            
            this.statusContent.innerHTML = html;
            
        } else if (type === 'error') {
            this.paymentStatus.classList.add('error');
            this.statusHeader.textContent = '❌ Error';
            this.statusContent.textContent = data;
        } else {
            this.statusHeader.textContent = '⏳ Processing';
            this.statusContent.textContent = data;
        }
    }

    showToast(message, type = 'info') {
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PikaPayment();
});