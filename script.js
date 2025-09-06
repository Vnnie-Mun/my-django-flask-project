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
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

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
document.querySelectorAll('.program-card, .solution-card, .course-category, .stat-item').forEach(el => {
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
        element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
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

// Form handling functions
function handleJobSearch() {
    window.open('hiring.html#jobs', '_self');
}

function handleSolutionSubmit() {
    window.location.href = 'mint-nft.html';
}

function handleInvestorRegistration() {
    window.open('investors.html#join-investors', '_self');
}

function handleFellowshipRegistration() {
    window.open('community.html#next-fellowship', '_self');
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

// Add event listeners for interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to cards
    document.querySelectorAll('.program-card, .solution-card, .course-category').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Add click handlers for buttons
    document.querySelectorAll('.btn').forEach(btn => {
        if (!btn.href || btn.href === '#' || btn.getAttribute('href') === '#') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const text = btn.textContent.toLowerCase();
                
                if (text.includes('find jobs')) {
                    handleJobSearch();
                } else if (text.includes('post a job') || text.includes('post job')) {
                    window.open('hiring.html#post-job', '_self');
                } else if (text.includes('submit solution')) {
                    window.open('mint-nft.html', '_self');
                } else if (text.includes('explore solutions')) {
                    window.open('solutions.html#browse', '_self');
                } else if (text.includes('become an investor') || text.includes('join as investor')) {
                    handleInvestorRegistration();
                } else if (text.includes('register') || text.includes('join next')) {
                    handleFellowshipRegistration();
                } else if (text.includes('submit pitch')) {
                    window.open('pitch-application.html', '_self');
                } else if (text.includes('start learning') || text.includes('learn more') || text.includes('enroll') || text.includes('explore courses') || text.includes('access') || text.includes('view details') || text.includes('browse') || text.includes('watch') || text.includes('try demo') || text.includes('free resources') || text.includes('start path') || text.includes('view schedule') || text.includes('join session') || text.includes('access guides') || text.includes('browse code') || text.includes('join forum')) {
                    handleUdemyAccess();
                } else if (text.includes('join our programs')) {
                    window.open('programs.html', '_self');
                } else if (text.includes('view pitch')) {
                    window.open('investors.html#pitch-events', '_self');
                } else if (text.includes('explore groups')) {
                    window.open('community.html#community-groups', '_self');
                } else if (text.includes('submit solution') || text.includes('submit your solution') || text.includes('mint solution') || text.includes('create nft')) {
                    window.location.href = 'mint-nft.html';
                } else {
                    // Default action for unhandled buttons
                    console.log('Button clicked:', text);
                }
            });
        }
    });

    // Social media links
    document.querySelectorAll('.social-links a').forEach(link => {
        if (link.querySelector('.fa-whatsapp')) {
            link.href = 'https://chat.whatsapp.com/LuiZfvuj5E2At8FsIJTces';
            link.target = '_blank';
        } else if (link.querySelector('.fa-instagram')) {
            link.href = 'https://www.instagram.com/ioh_254___/';
            link.target = '_blank';
        }
    });
});

// Lazy loading for images (if any are added later)
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Search functionality (placeholder)
function initializeSearch() {
    const searchInputs = document.querySelectorAll('input[type="search"]');
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            console.log('Searching for:', query);
        });
    });
}

// Pitch application form handling
function handlePitchApplication() {
    const pitchForm = document.querySelector('.pitch-form');
    if (pitchForm) {
        pitchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            const formActions = document.querySelector('.form-actions');
            const successMessage = document.createElement('div');
            successMessage.style.cssText = `
                background: rgba(16, 185, 129, 0.1);
                border: 1px solid #10b981;
                color: #10b981;
                padding: 1rem;
                border-radius: 8px;
                margin-top: 1rem;
                text-align: center;
            `;
            successMessage.innerHTML = `
                <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
                Application submitted successfully! We'll review your pitch and contact you within 5 business days.
            `;
            
            formActions.appendChild(successMessage);
            
            // Disable submit button
            const submitBtn = pitchForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Application Submitted';
            submitBtn.style.background = '#10b981';
        });
    }
}

// File upload validation
function initializeFileValidation() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const maxSize = 10 * 1024 * 1024; // 10MB
                if (file.size > maxSize) {
                    alert('File size must be less than 10MB');
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

// Form validation helpers
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

// Real-time form validation
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

// Auto-save form data
function initializeAutoSave() {
    if (window.location.pathname.includes('pitch-application.html')) {
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

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
    handlePitchApplication();
    initializeFileValidation();
    initializeFormValidation();
    initializeAutoSave();
    
    // Add loading states for buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 2000);
            }
        });
    });
});

// Performance optimization
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    const criticalImages = [];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

// Service worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}