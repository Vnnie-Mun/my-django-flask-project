// Investor Platform Application
class InvestorsApp {
    constructor() {
        this.pitchEvents = [];
        this.startups = [];
        this.investorProfile = null;
        this.registeredEvents = [];
        this.investments = [];
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadPitchEvents();
        await this.loadStartups();
        this.renderPitchEvents();
        this.renderStartups();
        this.updateStats();
    }

    setupEventListeners() {
        // Event registration buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-primary') && e.target.textContent.includes('Register')) {
                const eventCard = e.target.closest('.pitch-event-card');
                const eventId = eventCard?.dataset.eventId || 1;
                this.registerForEvent(eventId);
            }
            
            if (e.target.textContent.includes('Submit Pitch')) {
                window.location.href = 'pitch-application.html';
            }
            
            if (e.target.textContent.includes('View Full Pitch')) {
                const startupCard = e.target.closest('.startup-card');
                const startupId = startupCard?.dataset.startupId;
                if (startupId) this.viewStartupPitch(startupId);
            }
            
            if (e.target.textContent.includes('Contact Founders')) {
                const startupCard = e.target.closest('.startup-card');
                const startupId = startupCard?.dataset.startupId;
                if (startupId) this.contactFounders(startupId);
            }
        });
        
        // Investor application form
        const investorForm = document.querySelector('.investment-form');
        investorForm?.addEventListener('submit', (e) => this.submitInvestorApplication(e));
        
        // Navigation buttons
        document.querySelectorAll('.hero-buttons .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const href = btn.getAttribute('href');
                if (href && href.startsWith('#')) {
                    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    async loadPitchEvents() {
        // Mock pitch events data
        this.pitchEvents = [
            {
                id: 1,
                title: 'Q1 Innovation Showcase 2025',
                description: '20 carefully selected startups will pitch their innovative solutions to a panel of leading VCs, angel investors, and industry experts.',
                date: new Date('2025-01-25T14:00:00'),
                location: 'Virtual Event + Live Stream',
                capacity: 200,
                registered: 156,
                categories: ['AI/ML', 'FinTech', 'HealthTech', 'Sustainability'],
                featured: true,
                highlights: [
                    '20 startup pitches (5 minutes each)',
                    'Live Q&A with founders',
                    'Investor networking session',
                    'Awards for best pitches'
                ]
            },
            {
                id: 2,
                title: 'Q2 African Innovation Summit',
                description: 'Special focus on African-led innovations addressing continental challenges. Featuring solutions in agriculture, education, financial inclusion, and infrastructure.',
                date: new Date('2025-04-15T13:00:00'),
                location: 'Nairobi + Virtual',
                capacity: 150,
                registered: 45,
                categories: ['AgriTech', 'EdTech', 'Financial Inclusion'],
                featured: false,
                highlights: [
                    'Focus on African innovations',
                    'Government partnerships',
                    'Impact investment focus',
                    'Cultural networking events'
                ]
            }
        ];
    }

    async loadStartups() {
        // Mock startup data
        this.startups = [
            {
                id: 1,
                name: 'MediAI Diagnostics',
                tagline: 'AI-powered medical diagnosis for remote areas',
                location: 'Nairobi, Kenya',
                description: 'Revolutionary AI platform that analyzes medical images with 95% accuracy, enabling early disease detection in underserved communities across Africa.',
                category: 'HealthTech',
                fundingStage: 'Seed',
                seeking: '$500K',
                equity: '15%',
                valuation: '$2M',
                tags: ['AI/ML', 'Healthcare', 'B2B'],
                traction: [
                    '5 pilot hospitals deployed',
                    '1,000+ diagnoses completed',
                    'Partnership with Ministry of Health'
                ],
                founders: [
                    { name: 'Dr. Sarah Kimani', role: 'CEO', background: 'Medical Doctor & AI Researcher' },
                    { name: 'James Ochieng', role: 'CTO', background: 'Former Google AI Engineer' }
                ],
                metrics: {
                    revenue: '$50K ARR',
                    users: '500+ healthcare workers',
                    growth: '40% MoM'
                }
            },
            {
                id: 2,
                name: 'GreenChain Solutions',
                tagline: 'Blockchain carbon credit marketplace',
                location: 'Cape Town, South Africa',
                description: 'Transparent blockchain platform enabling businesses to trade verified carbon credits, supporting Africa\'s transition to sustainable energy.',
                category: 'Sustainability',
                fundingStage: 'Series A',
                seeking: '$1.2M',
                equity: '20%',
                valuation: '$6M',
                tags: ['Blockchain', 'Sustainability', 'B2B'],
                traction: [
                    '$500K ARR achieved',
                    '50+ corporate clients',
                    '2M tons CO2 credits traded'
                ],
                founders: [
                    { name: 'Michael van der Merwe', role: 'CEO', background: 'Former McKinsey Consultant' },
                    { name: 'Amara Okafor', role: 'CTO', background: 'Blockchain Developer' }
                ],
                metrics: {
                    revenue: '$500K ARR',
                    users: '50+ enterprises',
                    growth: '25% MoM'
                }
            },
            {
                id: 3,
                name: 'EduConnect Africa',
                tagline: 'Offline-first educational platform',
                location: 'Lagos, Nigeria',
                description: 'Mobile-first educational platform providing offline-capable learning resources for students across Africa with limited internet access.',
                category: 'EdTech',
                fundingStage: 'Seed',
                seeking: '$250K',
                equity: '12%',
                valuation: '$2.1M',
                tags: ['EdTech', 'Mobile', 'B2C'],
                traction: [
                    '10,000+ active students',
                    'Partnership with 20 schools',
                    '85% course completion rate'
                ],
                founders: [
                    { name: 'Adaora Okonkwo', role: 'CEO', background: 'Former Teacher & EdTech Expert' },
                    { name: 'Kemi Adeleke', role: 'CPO', background: 'UX Designer' }
                ],
                metrics: {
                    revenue: '$25K ARR',
                    users: '10,000+ students',
                    growth: '60% MoM'
                }
            }
        ];
    }

    renderPitchEvents() {
        const eventsGrid = document.querySelector('.events-grid');
        if (!eventsGrid) return;
        
        eventsGrid.innerHTML = this.pitchEvents.map(event => this.renderEventCard(event)).join('');
    }

    renderEventCard(event) {
        const date = new Date(event.date);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const year = date.getFullYear();
        const time = date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        return `
            <div class="pitch-event-card ${event.featured ? 'featured' : ''}" data-event-id="${event.id}">
                ${event.featured ? '<div class="event-badge">Next Event</div>' : ''}
                <div class="event-header">
                    <div class="event-date-card">
                        <span class="day">${day}</span>
                        <span class="month">${month}</span>
                        <span class="year">${year}</span>
                    </div>
                    <div class="event-info">
                        <h3>${event.title}</h3>
                        <p class="event-time">
                            <i class="fas fa-clock"></i>
                            ${time} EAT
                        </p>
                        <p class="event-location">
                            <i class="fas fa-${event.location.includes('Virtual') ? 'video' : 'map-marker-alt'}"></i>
                            ${event.location}
                        </p>
                    </div>
                </div>
                <div class="event-description">
                    <p>${event.description}</p>
                </div>
                ${event.highlights ? `
                    <div class="event-highlights">
                        <h4>Event Highlights:</h4>
                        <ul>
                            ${event.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                <div class="event-categories">
                    ${event.categories.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                </div>
                <div class="event-actions">
                    <button class="btn btn-primary">Register as Investor</button>
                    <button class="btn btn-outline">Submit Pitch</button>
                </div>
                <div class="event-capacity">
                    <div class="capacity-bar">
                        <div class="capacity-fill" style="width: ${(event.registered / event.capacity) * 100}%"></div>
                    </div>
                    <span>${event.registered}/${event.capacity} registered</span>
                </div>
            </div>
        `;
    }

    renderStartups() {
        const startupsGrid = document.querySelector('.startups-grid');
        if (!startupsGrid) return;
        
        startupsGrid.innerHTML = this.startups.map(startup => this.renderStartupCard(startup)).join('');
    }

    renderStartupCard(startup) {
        const icons = {
            'HealthTech': 'fa-heartbeat',
            'Sustainability': 'fa-leaf',
            'EdTech': 'fa-graduation-cap',
            'FinTech': 'fa-coins',
            'AgriTech': 'fa-seedling'
        };
        
        return `
            <div class="startup-card" data-startup-id="${startup.id}">
                <div class="startup-header">
                    <div class="startup-logo">
                        <i class="fas ${icons[startup.category] || 'fa-rocket'}"></i>
                    </div>
                    <div class="startup-info">
                        <h3>${startup.name}</h3>
                        <p class="startup-tagline">${startup.tagline}</p>
                        <div class="startup-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${startup.location}
                        </div>
                    </div>
                    <div class="funding-status">
                        <span class="status-badge ${startup.fundingStage.toLowerCase().replace(' ', '-')}">${startup.fundingStage}</span>
                    </div>
                </div>
                <div class="startup-description">
                    <p>${startup.description}</p>
                </div>
                <div class="startup-metrics">
                    <div class="metric">
                        <span class="metric-value">${startup.seeking}</span>
                        <span class="metric-label">Seeking</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">${startup.equity}</span>
                        <span class="metric-label">Equity</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">${startup.valuation}</span>
                        <span class="metric-label">Valuation</span>
                    </div>
                </div>
                <div class="startup-tags">
                    ${startup.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="startup-traction">
                    <h5>Key Traction:</h5>
                    <ul>
                        ${startup.traction.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="startup-actions">
                    <button class="btn btn-primary">View Full Pitch</button>
                    <button class="btn btn-outline">Contact Founders</button>
                </div>
            </div>
        `;
    }

    async registerForEvent(eventId) {
        const event = this.pitchEvents.find(e => e.id == eventId);
        if (!event) return;
        
        if (this.registeredEvents.includes(eventId)) {
            this.showToast('You are already registered for this event', 'info');
            return;
        }
        
        // Show registration modal
        this.showEventRegistrationModal(event);
    }

    showEventRegistrationModal(event) {
        const modal = this.createModal(`
            <div class="event-registration-modal">
                <h3>Register for ${event.title}</h3>
                <p class="event-details">${new Date(event.date).toLocaleDateString()} • ${event.location}</p>
                
                <form class="registration-form" id="event-registration-form">
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Email Address *</label>
                        <input type="email" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Company/Organization</label>
                        <input type="text" name="company">
                    </div>
                    
                    <div class="form-group">
                        <label>Investment Experience *</label>
                        <select name="experience" required>
                            <option value="">Select experience level</option>
                            <option value="first-time">First-time investor</option>
                            <option value="some">Some experience (1-5 investments)</option>
                            <option value="experienced">Experienced (5+ investments)</option>
                            <option value="professional">Professional investor/VC</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Investment Range *</label>
                        <select name="investmentRange" required>
                            <option value="">Select investment range</option>
                            <option value="5k-25k">$5K - $25K</option>
                            <option value="25k-100k">$25K - $100K</option>
                            <option value="100k-500k">$100K - $500K</option>
                            <option value="500k+">$500K+</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Areas of Interest</label>
                        <div class="checkbox-group">
                            ${event.categories.map(cat => `
                                <label class="checkbox-label">
                                    <input type="checkbox" name="interests" value="${cat}">
                                    ${cat}
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Register for Event</button>
                    </div>
                </form>
            </div>
        `);
        
        modal.querySelector('#event-registration-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitEventRegistration(event.id, new FormData(e.target));
            modal.remove();
        });
    }

    async submitEventRegistration(eventId, formData) {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const registration = {
                eventId: eventId,
                name: formData.get('name'),
                email: formData.get('email'),
                company: formData.get('company'),
                experience: formData.get('experience'),
                investmentRange: formData.get('investmentRange'),
                interests: formData.getAll('interests'),
                registeredAt: new Date()
            };
            
            this.registeredEvents.push(eventId);
            
            // Update event registration count
            const event = this.pitchEvents.find(e => e.id == eventId);
            if (event) {
                event.registered += 1;
                this.renderPitchEvents();
            }
            
            this.showToast('Registration successful! You will receive event details and startup information via email.', 'success');
            
        } catch (error) {
            console.error('Registration error:', error);
            this.showToast('Registration failed. Please try again.', 'error');
        }
    }

    async viewStartupPitch(startupId) {
        const startup = this.startups.find(s => s.id == startupId);
        if (!startup) return;
        
        this.showStartupPitchModal(startup);
    }

    showStartupPitchModal(startup) {
        const modal = this.createModal(`
            <div class="startup-pitch-modal">
                <div class="pitch-header">
                    <h2>${startup.name}</h2>
                    <p class="tagline">${startup.tagline}</p>
                    <div class="startup-meta">
                        <span class="location"><i class="fas fa-map-marker-alt"></i> ${startup.location}</span>
                        <span class="stage">${startup.fundingStage}</span>
                    </div>
                </div>
                
                <div class="pitch-content">
                    <div class="pitch-section">
                        <h3>The Problem</h3>
                        <p>${startup.description}</p>
                    </div>
                    
                    <div class="pitch-section">
                        <h3>Funding Details</h3>
                        <div class="funding-grid">
                            <div class="funding-item">
                                <span class="label">Seeking:</span>
                                <span class="value">${startup.seeking}</span>
                            </div>
                            <div class="funding-item">
                                <span class="label">Equity:</span>
                                <span class="value">${startup.equity}</span>
                            </div>
                            <div class="funding-item">
                                <span class="label">Valuation:</span>
                                <span class="value">${startup.valuation}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="pitch-section">
                        <h3>Key Metrics</h3>
                        <div class="metrics-grid">
                            <div class="metric-item">
                                <span class="label">Revenue:</span>
                                <span class="value">${startup.metrics.revenue}</span>
                            </div>
                            <div class="metric-item">
                                <span class="label">Users:</span>
                                <span class="value">${startup.metrics.users}</span>
                            </div>
                            <div class="metric-item">
                                <span class="label">Growth:</span>
                                <span class="value">${startup.metrics.growth}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="pitch-section">
                        <h3>Traction</h3>
                        <ul class="traction-list">
                            ${startup.traction.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="pitch-section">
                        <h3>Founding Team</h3>
                        <div class="founders-grid">
                            ${startup.founders.map(founder => `
                                <div class="founder-card">
                                    <h4>${founder.name}</h4>
                                    <p class="role">${founder.role}</p>
                                    <p class="background">${founder.background}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="pitch-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
                    <button class="btn btn-primary" onclick="investorsApp.expressInterest(${startup.id})">Express Interest</button>
                </div>
            </div>
        `);
    }

    async contactFounders(startupId) {
        const startup = this.startups.find(s => s.id == startupId);
        if (!startup) return;
        
        this.showContactModal(startup);
    }

    showContactModal(startup) {
        const modal = this.createModal(`
            <div class="contact-modal">
                <h3>Contact ${startup.name} Founders</h3>
                <p>Send a message to the founding team</p>
                
                <form class="contact-form" id="contact-form">
                    <div class="form-group">
                        <label>Your Name *</label>
                        <input type="text" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Email Address *</label>
                        <input type="email" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Company/Fund</label>
                        <input type="text" name="company">
                    </div>
                    
                    <div class="form-group">
                        <label>Investment Interest *</label>
                        <select name="interest" required>
                            <option value="">Select interest level</option>
                            <option value="exploring">Just exploring</option>
                            <option value="interested">Interested in learning more</option>
                            <option value="serious">Serious investment consideration</option>
                            <option value="ready">Ready to discuss terms</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Message *</label>
                        <textarea name="message" rows="4" required placeholder="Tell the founders about your interest and any specific questions you have..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Send Message</button>
                    </div>
                </form>
            </div>
        `);
        
        modal.querySelector('#contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendFounderMessage(startup.id, new FormData(e.target));
            modal.remove();
        });
    }

    async sendFounderMessage(startupId, formData) {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const message = {
                startupId: startupId,
                name: formData.get('name'),
                email: formData.get('email'),
                company: formData.get('company'),
                interest: formData.get('interest'),
                message: formData.get('message'),
                sentAt: new Date()
            };
            
            this.showToast('Message sent successfully! The founders will respond within 48 hours.', 'success');
            
        } catch (error) {
            console.error('Message error:', error);
            this.showToast('Failed to send message. Please try again.', 'error');
        }
    }

    async expressInterest(startupId) {
        const startup = this.startups.find(s => s.id == startupId);
        if (!startup) return;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.showToast(`Interest expressed in ${startup.name}! The founders will be notified.`, 'success');
            
            // Close modal
            document.querySelector('.modal-overlay')?.remove();
            
        } catch (error) {
            console.error('Interest error:', error);
            this.showToast('Failed to express interest. Please try again.', 'error');
        }
    }

    async submitInvestorApplication(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const applicationData = {
            name: formData.get('name'),
            email: formData.get('email'),
            experience: formData.get('experience'),
            investmentRange: formData.get('investmentRange'),
            focusAreas: formData.getAll('interests') || [],
            background: formData.get('background'),
            submittedAt: new Date()
        };
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.investorProfile = applicationData;
            
            e.target.reset();
            this.showToast('Investor application submitted successfully! We will review your application and contact you within 5 business days.', 'success');
            
        } catch (error) {
            console.error('Application error:', error);
            this.showToast('Failed to submit application. Please try again.', 'error');
        }
    }

    updateStats() {
        const stats = [
            { selector: '.stat-card:nth-child(1) .stat-number', value: '$5.2M+' },
            { selector: '.stat-card:nth-child(2) .stat-number', value: '25' },
            { selector: '.stat-card:nth-child(3) .stat-number', value: '80+' },
            { selector: '.stat-card:nth-child(4) .stat-number', value: '92%' }
        ];
        
        stats.forEach(stat => {
            const element = document.querySelector(stat.selector);
            if (element) {
                element.textContent = stat.value;
            }
        });
    }

    createModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container">
                <div class="modal-content">
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        });
        
        return modal;
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container') || this.createToastContainer();
        
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

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        const autoRemove = setTimeout(() => {
            this.removeToast(toast);
        }, 5000);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.removeToast(toast);
        });
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    removeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
}

// Initialize Investors App
document.addEventListener('DOMContentLoaded', () => {
    window.investorsApp = new InvestorsApp();
    console.log('🚀 Investor Platform - Application Initialized');
});