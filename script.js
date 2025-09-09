// Modern JavaScript with Professional UI/UX Interactions

class UIManager {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.loadSolutions();
    }

    init() {
        this.showLoadingScreen();
        this.setupIntersectionObserver();
        this.setupCounterAnimations();
        this.setupTiltEffect();
        this.initHiringPlatform();
    }

    // Loading Screen
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingProgress = document.querySelector('.loading-progress');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    this.animateHeroElements();
                }, 500);
            }
            loadingProgress.style.width = `${progress}%`;
        }, 100);
    }

    // Hero Animation
    animateHeroElements() {
        const heroElements = [
            '.hero-badge',
            '.hero-title',
            '.hero-subtitle',
            '.hero-stats',
            '.hero-actions'
        ];

        heroElements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                setTimeout(() => {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(30px)';
                    element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    
                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    });
                }, index * 200);
            }
        });
    }

    // Navigation
    setupEventListeners() {
        // Mobile Navigation
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        navToggle?.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Smooth Scrolling
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Close mobile menu
                    navMenu?.classList.remove('active');
                    navToggle?.classList.remove('active');
                }
            });
        });

        // Navbar Scroll Effect
        window.addEventListener('scroll', this.handleNavbarScroll.bind(this));

        // Wallet Connection
        const walletBtn = document.getElementById('wallet-btn');
        walletBtn?.addEventListener('click', this.connectWallet.bind(this));

        // Button Interactions
        this.setupButtonInteractions();
    }

    handleNavbarScroll() {
        const navbar = document.getElementById('navbar');
        const scrolled = window.scrollY > 100;
        
        navbar?.classList.toggle('scrolled', scrolled);
    }

    // Wallet Integration
    async connectWallet() {
        const walletBtn = document.getElementById('wallet-btn');
        const walletText = walletBtn?.querySelector('span');
        
        if (!window.ethereum) {
            this.showToast('Please install MetaMask to connect your wallet', 'error');
            return;
        }

        try {
            walletBtn?.classList.add('loading');
            walletText.textContent = 'Connecting...';

            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            
            if (accounts.length > 0) {
                const address = accounts[0];
                const shortAddress = `${address.substring(0, 6)}...${address.substring(38)}`;
                
                walletBtn?.classList.remove('loading');
                walletBtn?.classList.add('connected');
                walletText.textContent = shortAddress;
                
                this.showToast('Wallet connected successfully!', 'success');
                
                // Initialize blockchain manager
                if (window.blockchainManager) {
                    await window.blockchainManager.init();
                }
            }
        } catch (error) {
            console.error('Wallet connection error:', error);
            walletBtn?.classList.remove('loading');
            walletText.textContent = 'Connect Wallet';
            this.showToast('Failed to connect wallet', 'error');
        }
    }

    // Button Interactions
    setupButtonInteractions() {
        // Join Community Button
        document.getElementById('join-community')?.addEventListener('click', () => {
            this.showToast('Redirecting to community page...', 'info');
            setTimeout(() => {
                window.location.href = 'community.html';
            }, 1000);
        });

        // Explore Solutions Button
        document.getElementById('explore-solutions')?.addEventListener('click', () => {
            window.location.href = 'solutions.html';
        });

        // Join Now Button
        document.getElementById('join-now')?.addEventListener('click', () => {
            this.showToast('Opening registration form...', 'info');
        });
        
        // Hiring Platform Buttons
        document.getElementById('post-job-btn')?.addEventListener('click', () => {
            if (window.hiringApp) {
                window.hiringApp.showPostJobForm();
            } else {
                this.showToast('Loading hiring platform...', 'info');
            }
        });
        
        document.getElementById('view-applications-btn')?.addEventListener('click', () => {
            if (window.hiringApp) {
                window.hiringApp.showApplications();
            } else {
                this.showToast('Loading hiring platform...', 'info');
            }
        });
    }

    // Counter Animations
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current) + (target >= 100 ? '+' : '');
            }, 16);
        };

        // Intersection Observer for counters
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // Intersection Observer for Animations
    setupIntersectionObserver() {
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

        // Observe elements with data-aos attribute
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    }

    // Tilt Effect for Cards
    setupTiltEffect() {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    // Load Solutions Preview
    async loadSolutions() {
        const showcase = document.getElementById('solutions-showcase');
        if (!showcase) return;

        try {
            // Get solutions from blockchain or use mock data
            let solutions = [];
            if (window.blockchainManager) {
                solutions = await window.blockchainManager.getSolutionsForSale();
            } else {
                solutions = this.getMockSolutions();
            }

            // Display first 3 solutions
            const featuredSolutions = solutions.slice(0, 3);
            showcase.innerHTML = featuredSolutions.map(solution => this.createSolutionCard(solution)).join('');
            
            // Add click handlers
            showcase.querySelectorAll('.solution-card').forEach((card, index) => {
                card.addEventListener('click', () => {
                    this.showToast(`Opening ${featuredSolutions[index].title}...`, 'info');
                    setTimeout(() => {
                        window.location.href = 'solutions.html';
                    }, 1000);
                });
            });
            
        } catch (error) {
            console.error('Error loading solutions:', error);
            showcase.innerHTML = '<p>Unable to load solutions at this time.</p>';
        }
    }

    createSolutionCard(solution) {
        const icons = {
            'Healthcare': 'fa-heartbeat',
            'Sustainability': 'fa-leaf',
            'FinTech': 'fa-coins',
            'Blockchain': 'fa-link',
            'AI/ML': 'fa-brain',
            'Education': 'fa-graduation-cap'
        };

        return `
            <div class="solution-card" data-aos="fade-up">
                <div class="solution-image">
                    <i class="fas ${icons[solution.category] || 'fa-lightbulb'}"></i>
                </div>
                <div class="solution-content">
                    <h3>${solution.title}</h3>
                    <p>${solution.description}</p>
                    <div class="solution-meta">
                        <span class="solution-category">${solution.category}</span>
                        <span class="solution-price">${solution.price} ETH</span>
                    </div>
                </div>
            </div>
        `;
    }

    initHiringPlatform() {
        this.loadFeaturedJobs();
    }
    
    loadFeaturedJobs() {
        const jobsGrid = document.getElementById('jobs-grid');
        if (!jobsGrid) return;
        
        const featuredJobs = [
            {
                id: 1,
                title: 'Senior AI Engineer',
                company: 'TechCorp Africa',
                location: 'Nairobi, Kenya',
                type: 'Full-time',
                salary: '$80K - $120K',
                description: 'Lead AI development for financial services with cutting-edge ML technologies.',
                requirements: ['Python', 'TensorFlow', 'AWS'],
                posted: '2 days ago'
            },
            {
                id: 2,
                title: 'Blockchain Developer',
                company: 'CryptoStart',
                location: 'Remote',
                type: 'Full-time',
                salary: '$60K - $90K',
                description: 'Build DApps and smart contracts for our DeFi platform.',
                requirements: ['Solidity', 'Web3', 'React'],
                posted: '1 week ago'
            },
            {
                id: 3,
                title: 'Full Stack Developer',
                company: 'EduTech Innovations',
                location: 'Remote',
                type: 'Full-time',
                salary: '$50K - $70K',
                description: 'Build scalable web applications for educational platforms.',
                requirements: ['React', 'Node.js', 'MongoDB'],
                posted: '5 days ago'
            }
        ];
        
        jobsGrid.innerHTML = featuredJobs.map(job => `
            <div class="job-card" data-job-id="${job.id}" data-aos="fade-up">
                <div class="job-header">
                    <div class="company-logo">
                        <i class="fas fa-building"></i>
                    </div>
                    <div class="job-info">
                        <h4>${job.title}</h4>
                        <p class="company">${job.company}</p>
                        <p class="location">
                            <i class="fas fa-map-marker-alt"></i> ${job.location}
                        </p>
                    </div>
                    <div class="job-salary">${job.salary}</div>
                </div>
                <div class="job-description">
                    <p>${job.description}</p>
                </div>
                <div class="job-tags">
                    ${job.requirements.map(req => `<span class="tag">${req}</span>`).join('')}
                </div>
                <div class="job-meta">
                    <span><i class="fas fa-clock"></i> ${job.posted}</span>
                    <span><i class="fas fa-briefcase"></i> ${job.type}</span>
                </div>
                <div class="job-actions">
                    <button class="btn btn-primary" onclick="uiManager.applyToJob(${job.id})">
                        <i class="fas fa-paper-plane"></i>
                        Apply Now
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    applyToJob(jobId) {
        if (window.hiringApp) {
            window.hiringApp.applyToJob(jobId);
        } else {
            this.showToast('Please visit the hiring page to apply', 'info');
            setTimeout(() => {
                window.location.href = 'hiring.html';
            }, 1000);
        }
    }

    getMockSolutions() {
        return [
            {
                title: 'AI Healthcare Diagnostic',
                description: 'Revolutionary AI platform for medical diagnosis with 95% accuracy',
                category: 'Healthcare',
                price: '0.5'
            },
            {
                title: 'Blockchain Carbon Credits',
                description: 'Transparent carbon credit trading platform for sustainable business',
                category: 'Sustainability',
                price: '0.3'
            },
            {
                title: 'DeFi Lending Protocol',
                description: 'Decentralized lending platform with automated yield optimization',
                category: 'FinTech',
                price: '0.8'
            }
        ];
    }

    // Toast Notifications
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
            <button class="toast-close">&times;</button>
        `;

        container.appendChild(toast);

        // Show toast
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto remove
        const autoRemove = setTimeout(() => {
            this.removeToast(toast);
        }, 5000);

        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.removeToast(toast);
        });
    }

    removeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }

    // Utility Methods
    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Performance Optimization
class PerformanceOptimizer {
    constructor() {
        this.setupLazyLoading();
        this.preloadCriticalResources();
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
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

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    preloadCriticalResources() {
        const criticalResources = [
            'solutions.html',
            'community.html'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = resource;
            document.head.appendChild(link);
        });
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI Manager
    window.uiManager = new UIManager();
    
    // Initialize Performance Optimizer
    window.performanceOptimizer = new PerformanceOptimizer();
    
    // Initialize Blockchain Manager if available
    if (window.BlockchainManager) {
        window.blockchainManager = new window.BlockchainManager();
    }
    
    console.log('🚀 Innovators of Honour - Application Initialized');
});

// Service Worker Registration
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

// Export for global access
window.UIManager = UIManager;
window.PerformanceOptimizer = PerformanceOptimizer;