// Investor Platform JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeInvestorPlatform();
});

function initializeInvestorPlatform() {
    console.log('Investor platform initialized');
}

// Smooth scroll to events section
function scrollToEvents() {
    document.getElementById('events').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Event registration
function registerEvent(eventId) {
    showNotification('Registration successful! Check your email for event details.', 'success');
    console.log('Registered for event:', eventId);
}

// Submit pitch for event
function submitPitch(eventId) {
    showNotification('Pitch submission form opened. Complete your application to participate.', 'info');
    console.log('Submit pitch for event:', eventId);
}

// View pitch deck
function viewPitch(companyId) {
    showNotification('Opening pitch deck viewer...', 'info');
    console.log('Viewing pitch for:', companyId);
    
    // Simulate opening pitch deck
    setTimeout(() => {
        showNotification('Pitch deck loaded successfully', 'success');
    }, 1500);
}

// Contact founders
function contactFounders(companyId) {
    showNotification('Connecting you with founders...', 'info');
    console.log('Contacting founders of:', companyId);
    
    // Simulate contact process
    setTimeout(() => {
        showNotification('Contact request sent! Founders will reach out within 24 hours.', 'success');
    }, 2000);
}

// Open investor modal
function openInvestorModal() {
    document.getElementById('investorModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close investor modal
function closeInvestorModal() {
    document.getElementById('investorModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Submit investor application
function submitInvestorApplication(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const applicationData = {
        name: formData.get('name'),
        email: formData.get('email'),
        experience: formData.get('experience'),
        investmentRange: formData.get('investmentRange'),
        focusAreas: [],
        background: formData.get('background')
    };
    
    // Get selected focus areas
    const checkboxes = event.target.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        applicationData.focusAreas.push(checkbox.value);
    });
    
    console.log('Investor application submitted:', applicationData);
    
    showNotification('Application submitted successfully! We will review and contact you within 5 business days.', 'success');
    
    // Close modal and reset form
    closeInvestorModal();
    event.target.reset();
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: -400px;
        background: rgba(0, 0, 0, 0.9);
        color: #fff;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        border-left: 4px solid ${getNotificationColor(type)};
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 3000;
        transition: all 0.3s ease;
        backdrop-filter: blur(20px);
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 350px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.right = '20px';
    }, 100);
    
    // Hide notification
    setTimeout(() => {
        notification.style.right = '-400px';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#4CAF50';
        case 'error': return '#f44336';
        case 'warning': return '#ff9800';
        default: return '#FFD700';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('investorModal');
    if (event.target === modal) {
        closeInvestorModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeInvestorModal();
    }
});

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states to buttons
function addLoadingState(button, duration = 2000) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, duration);
}

// Enhanced button interactions
document.addEventListener('click', function(event) {
    if (event.target.matches('.btn-primary, .btn-secondary, .btn-outline')) {
        addLoadingState(event.target, 1000);
    }
});

// Form validation
function validateInvestorForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#f44336';
            isValid = false;
        } else {
            field.style.borderColor = 'rgba(255, 215, 0, 0.3)';
        }
    });
    
    return isValid;
}

// Real-time form validation
document.addEventListener('input', function(event) {
    if (event.target.matches('input, select, textarea')) {
        if (event.target.value.trim()) {
            event.target.style.borderColor = 'rgba(255, 215, 0, 0.3)';
        }
    }
});

// Initialize tooltips and enhanced interactions
function initializeEnhancements() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.stat-card, .event-card, .opportunity-card, .success-card, .benefit-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Call initialization
initializeEnhancements();