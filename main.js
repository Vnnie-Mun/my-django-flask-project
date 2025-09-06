// API Base URL
const API_BASE = '/api';

// Utility functions
function showLoading(element) {
    element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    element.disabled = true;
}

function hideLoading(element, originalText) {
    element.innerHTML = originalText;
    element.disabled = false;
}

function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        color: white;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
    `;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Smooth scrolling for navigation links
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

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(255, 215, 0, 0.2)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.program-card, .solution-card, .course-category, .stat-item, .job-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Counter animation for stats
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        const suffix = element.textContent.includes('+') ? '+' : 
                      element.textContent.includes('%') ? '%' : '';
        element.textContent = Math.floor(current) + suffix;
    }, 20);
};

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statItems = entry.target.querySelectorAll('.stat-item h3, .hiring-stat h3, .investor-stats h4');
            statItems.forEach(item => {
                const text = item.textContent;
                const number = parseInt(text.replace(/[^\d]/g, ''));
                if (number) {
                    item.textContent = '0' + text.replace(/\d+/g, '');
                    animateCounter(item, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stats, .hiring, .investors').forEach(section => {
    statsObserver.observe(section);
});

// API Functions
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Solutions API
async function loadSolutions(filters = {}) {
    try {
        const params = new URLSearchParams(filters);
        const solutions = await fetchAPI(`/solutions?${params}`);
        return solutions;
    } catch (error) {
        showMessage('Failed to load solutions', 'error');
        return [];
    }
}

async function submitSolution(solutionData) {
    try {
        const result = await fetchAPI('/solutions', {
            method: 'POST',
            body: JSON.stringify(solutionData)
        });
        showMessage('Solution submitted successfully!');
        return result;
    } catch (error) {
        showMessage('Failed to submit solution', 'error');
        throw error;
    }
}

// Jobs API
async function loadJobs(filters = {}) {
    try {
        const params = new URLSearchParams(filters);
        const jobs = await fetchAPI(`/jobs?${params}`);
        return jobs;
    } catch (error) {
        showMessage('Failed to load jobs', 'error');
        return [];
    }
}

async function submitJob(jobData) {
    try {
        const result = await fetchAPI('/jobs', {
            method: 'POST',
            body: JSON.stringify(jobData)
        });
        showMessage('Job posted successfully!');
        return result;
    } catch (error) {
        showMessage('Failed to post job', 'error');
        throw error;
    }
}

// Events API
async function registerForEvent(eventId, registrationType = 'standard') {
    try {
        const result = await fetchAPI('/register-event', {
            method: 'POST',
            body: JSON.stringify({
                event_id: eventId,
                type: registrationType
            })
        });
        showMessage('Registration successful!');
        return result;
    } catch (error) {
        showMessage('Registration failed', 'error');
        throw error;
    }
}

// Pitch Application API
async function submitPitchApplication(applicationData) {
    try {
        const result = await fetchAPI('/pitch-application', {
            method: 'POST',
            body: JSON.stringify(applicationData)
        });
        showMessage('Pitch application submitted successfully!');
        return result;
    } catch (error) {
        showMessage('Failed to submit application', 'error');
        throw error;
    }
}

// Search API
async function searchContent(query, category = 'all') {
    try {
        const params = new URLSearchParams({ q: query, category });
        const results = await fetchAPI(`/search?${params}`);
        return results;
    } catch (error) {
        showMessage('Search failed', 'error');
        return {};
    }
}

// Form Handlers
function handleJobSearch() {
    const searchInput = document.querySelector('.job-search-input');
    const locationInput = document.querySelector('.location-input');
    
    if (searchInput && locationInput) {
        const query = searchInput.value;
        const location = locationInput.value;
        
        // Redirect to hiring page with search parameters
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (location) params.set('location', location);
        
        window.location.href = `/hiring?${params}`;
    }
}

function handleSolutionSubmit() {
    window.location.href = '/mint-nft';
}

function handleInvestorRegistration() {
    window.location.href = '/investors#join-investors';
}

function handleFellowshipRegistration() {
    window.location.href = '/community#next-fellowship';
}

function handleUdemyAccess() {
    window.open('https://login.gale.com/oauth2/ausjkkn80o3gOb4aj696/v1/authorize?scope=openid+email+profile&response_type=id_token&redirect_uri=https%3A%2F%2Flink.gale.com%2Fapps%2Foauth2%2Fokta&state=aHR0cHM6Ly9saW5rLmdhbGUuY29tL2FwcHMvdWRlbXkvaWRwVXNlcj9wPVVERU1ZJnRhcmdldFBhdGg9JnU9dHhzaHJwdWIxMDAxMDAmZGV0ZWN0ZWRVc2VyPW1VbE5YQUZlcXZLTmR1dFlUV1ZKSlElM0QlM0QmdHo9QW1lcmljYS9DaGljYWdvJnBpdT1odHRwcyUzQSUyRiUyRmxpbmsuZ2FsZS5jb20&nonce=1726947127122&client_id=0oajgjpamQThTX8Ea696&response_mode=form_post', '_blank');
}

function joinWhatsApp() {
    window.open('https://chat.whatsapp.com/LuiZfvuj5E2At8FsIJTces', '_blank');
}

function joinInstagram() {
    window.open('https://www.instagram.com/ioh_254___/', '_blank');
}

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,2}[\s\-]?[\d]{3,14}$/;
    return re.test(phone);
}

function showValidationMessage(input, message) {
    hideValidationMessage(input);
    const errorMsg = document.createElement('small');
    errorMsg.textContent = message;
    errorMsg.style.color = '#ef4444';
    errorMsg.style.display = 'block';
    errorMsg.style.marginTop = '0.25rem';
    errorMsg.className = 'validation-error';
    input.parentNode.appendChild(errorMsg);
}

function hideValidationMessage(input) {
    const existing = input.parentNode.querySelector('.validation-error');
    if (existing) {
        existing.remove();
    }
}

// Initialize form validation
function initializeFormValidation() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#ef4444';
                showValidationMessage(this, 'Please enter a valid email address');
            } else {
                this.style.borderColor = '#FFD700';
                hideValidationMessage(this);
            }
        });
    });
    
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                this.style.borderColor = '#ef4444';
                showValidationMessage(this, 'Please enter a valid phone number');
            } else {
                this.style.borderColor = '#FFD700';
                hideValidationMessage(this);
            }
        });
    });
}

// File upload handling
function initializeFileValidation() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const maxSize = 10 * 1024 * 1024; // 10MB
                if (file.size > maxSize) {
                    showMessage('File size must be less than 10MB', 'error');
                    this.value = '';
                    return;
                }
                
                // Show file name
                const fileName = document.createElement('small');
                fileName.textContent = `Selected: ${file.name}`;
                fileName.style.color = '#FFD700';
                fileName.style.display = 'block';
                fileName.style.marginTop = '0.5rem';
                
                // Remove existing file name display
                const existing = this.parentNode.querySelector('small:last-child');
                if (existing && existing.textContent.startsWith('Selected:')) {
                    existing.remove();
                }
                
                this.parentNode.appendChild(fileName);
            }
        });
    });
}

// Auto-save form data
function initializeAutoSave() {
    if (window.location.pathname.includes('pitch-application')) {
        const formInputs = document.querySelectorAll('.pitch-form input, .pitch-form select, .pitch-form textarea');
        formInputs.forEach(input => {
            // Load saved data
            const savedValue = localStorage.getItem(`pitch_form_${input.name || input.id}`);
            if (savedValue && input.type !== 'file') {
                input.value = savedValue;
            }
            
            // Save data on change
            input.addEventListener('change', function() {
                if (this.type !== 'file') {
                    localStorage.setItem(`pitch_form_${this.name || this.id}`, this.value);
                }
            });
        });
    }
}

// Initialize search functionality
function initializeSearch() {
    const searchInputs = document.querySelectorAll('input[type="search"], .search-input');
    searchInputs.forEach(input => {
        input.addEventListener('input', debounce(async (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length > 2) {
                try {
                    const results = await searchContent(query);
                    displaySearchResults(results, e.target);
                } catch (error) {
                    console.error('Search error:', error);
                }
            }
        }, 300));
    });
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Display search results
function displaySearchResults(results, inputElement) {
    // Remove existing results
    const existingResults = document.querySelector('.search-results');
    if (existingResults) {
        existingResults.remove();
    }
    
    if (Object.keys(results).length === 0) return;
    
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'search-results';
    resultsDiv.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 8px;
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    Object.entries(results).forEach(([category, items]) => {
        if (items.length > 0) {
            const categoryDiv = document.createElement('div');
            categoryDiv.innerHTML = `
                <div style="padding: 0.5rem 1rem; background: #333; color: #FFD700; font-weight: 600; text-transform: capitalize;">
                    ${category}
                </div>
            `;
            
            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.style.cssText = `
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid #333;
                    cursor: pointer;
                    transition: background 0.2s;
                `;
                itemDiv.innerHTML = `
                    <div style="color: #f5f5f5; font-weight: 500;">${item.title}</div>
                    <div style="color: #ccc; font-size: 0.875rem;">${item.description || item.company || item.instructor || ''}</div>
                `;
                
                itemDiv.addEventListener('mouseenter', () => {
                    itemDiv.style.background = 'rgba(255, 215, 0, 0.1)';
                });
                
                itemDiv.addEventListener('mouseleave', () => {
                    itemDiv.style.background = 'transparent';
                });
                
                itemDiv.addEventListener('click', () => {
                    // Navigate to appropriate page based on category
                    let url = '/';
                    switch (category) {
                        case 'solutions':
                            url = `/solutions#solution-${item.id}`;
                            break;
                        case 'jobs':
                            url = `/hiring#job-${item.id}`;
                            break;
                        case 'courses':
                            url = `/learn#course-${item.id}`;
                            break;
                    }
                    window.location.href = url;
                });
                
                categoryDiv.appendChild(itemDiv);
            });
            
            resultsDiv.appendChild(categoryDiv);
        }
    });
    
    // Position results relative to input
    inputElement.parentNode.style.position = 'relative';
    inputElement.parentNode.appendChild(resultsDiv);
    
    // Close results when clicking outside
    document.addEventListener('click', function closeResults(e) {
        if (!inputElement.parentNode.contains(e.target)) {
            resultsDiv.remove();
            document.removeEventListener('click', closeResults);
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFormValidation();
    initializeFileValidation();
    initializeAutoSave();
    initializeSearch();
    
    // Add hover effects to cards
    document.querySelectorAll('.program-card, .solution-card, .course-category, .job-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Handle form submissions
    const pitchForm = document.querySelector('.pitch-form');
    if (pitchForm) {
        pitchForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            try {
                await submitPitchApplication(data);
                this.reset();
                localStorage.clear(); // Clear auto-saved data
            } catch (error) {
                console.error('Submission error:', error);
            }
        });
    }
    
    // Handle job search form
    const jobSearchForm = document.querySelector('.job-search-form');
    if (jobSearchForm) {
        jobSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleJobSearch();
        });
    }
    
    // Handle solution view tracking
    document.querySelectorAll('.solution-card').forEach((card, index) => {
        card.addEventListener('click', async () => {
            try {
                await fetchAPI(`/solution/${index + 1}/view`, { method: 'POST' });
            } catch (error) {
                console.error('View tracking error:', error);
            }
        });
    });
});

// Performance optimization
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Export functions for global use
window.IoH = {
    handleJobSearch,
    handleSolutionSubmit,
    handleInvestorRegistration,
    handleFellowshipRegistration,
    handleUdemyAccess,
    joinWhatsApp,
    joinInstagram,
    loadSolutions,
    loadJobs,
    submitSolution,
    submitJob,
    registerForEvent,
    submitPitchApplication,
    searchContent
};