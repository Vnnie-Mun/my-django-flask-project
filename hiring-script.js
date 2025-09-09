// Hiring Platform JavaScript
let currentFilter = 'all';
let currentJobs = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    loadJobs();
});

// Filter functionality
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            filterJobs();
        });
    });
}

// Search jobs
function searchJobs() {
    const jobQuery = document.getElementById('jobSearch').value;
    const locationQuery = document.getElementById('locationSearch').value;
    
    if (!jobQuery && !locationQuery) {
        showNotification('Please enter search criteria', 'warning');
        return;
    }
    
    showNotification('Searching for jobs...', 'info');
    
    // Simulate search
    setTimeout(() => {
        showNotification('Found 25 matching jobs', 'success');
        filterJobs();
    }, 1000);
}

// Filter jobs
function filterJobs() {
    const jobCards = document.querySelectorAll('.job-card');
    
    jobCards.forEach(card => {
        if (currentFilter === 'all') {
            card.style.display = 'block';
        } else {
            // Simple filter logic - in real app, this would check job data
            card.style.display = 'block';
        }
    });
}

// Apply to job
function applyJob(jobId) {
    document.getElementById('applicationModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Open post job modal
function openPostJobModal() {
    document.getElementById('postJobModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modals
function closeModal() {
    document.getElementById('applicationModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function closePostJobModal() {
    document.getElementById('postJobModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Load more jobs
function loadMoreJobs() {
    showNotification('Loading more jobs...', 'info');
    
    // Simulate loading
    setTimeout(() => {
        showNotification('Loaded 10 more jobs', 'success');
    }, 1000);
}

// Load jobs data
function loadJobs() {
    // In real app, this would fetch from API
    currentJobs = [
        {
            id: 'ai-engineer',
            title: 'Senior AI Engineer',
            company: 'TechCorp Africa',
            location: 'Nairobi, Kenya',
            salary: '$80K - $120K',
            type: 'full-time'
        },
        {
            id: 'blockchain-dev',
            title: 'Blockchain Developer',
            company: 'CryptoStart',
            location: 'Remote',
            salary: '$60K - $90K',
            type: 'full-time'
        }
    ];
}

// Form submissions
document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('application-form')) {
        e.preventDefault();
        submitApplication();
    } else if (e.target.classList.contains('job-form')) {
        e.preventDefault();
        submitJobPost();
    }
});

function submitApplication() {
    showNotification('Application submitted successfully!', 'success');
    closeModal();
    
    // Reset form
    document.querySelector('.application-form').reset();
}

function submitJobPost() {
    showNotification('Job posted successfully!', 'success');
    closePostJobModal();
    
    // Reset form
    document.querySelector('.job-form').reset();
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Mobile menu toggle
document.querySelector('.mobile-menu').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const applicationModal = document.getElementById('applicationModal');
    const postJobModal = document.getElementById('postJobModal');
    
    if (e.target === applicationModal) {
        closeModal();
    } else if (e.target === postJobModal) {
        closePostJobModal();
    }
});

// Smooth scrolling for anchor links
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