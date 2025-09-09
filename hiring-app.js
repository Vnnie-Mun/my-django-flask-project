// Hiring Platform Application
class HiringApp {
    constructor() {
        this.jobs = [];
        this.filteredJobs = [];
        this.applications = [];
        this.savedJobs = [];
        this.currentUser = null;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadJobs();
        this.renderJobs();
        this.updateStats();
    }

    setupEventListeners() {
        // Search functionality
        const searchBtn = document.querySelector('.search-btn');
        const searchInput = document.querySelector('.job-search-input');
        const locationInput = document.querySelector('.location-input');
        
        searchBtn?.addEventListener('click', () => this.searchJobs());
        searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchJobs();
        });
        
        // Filter functionality
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', () => this.applyFilters());
        });
        
        // Job actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-primary') && e.target.textContent.includes('Apply')) {
                const jobCard = e.target.closest('.job-card, .job-item');
                const jobId = jobCard?.dataset.jobId;
                if (jobId) this.applyToJob(jobId);
            }
            
            if (e.target.closest('.btn-outline') && e.target.textContent.includes('Save')) {
                const jobCard = e.target.closest('.job-card, .job-item');
                const jobId = jobCard?.dataset.jobId;
                if (jobId) this.saveJob(jobId);
            }
        });
        
        // Post job form
        const jobForm = document.querySelector('.job-form');
        jobForm?.addEventListener('submit', (e) => this.submitJob(e));
        
        // Dashboard actions
        document.getElementById('post-job-btn')?.addEventListener('click', () => this.showPostJobForm());
        document.getElementById('view-applications')?.addEventListener('click', () => this.showApplications());
        
        // Navigation buttons
        document.querySelectorAll('.hero-buttons .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const href = btn.getAttribute('href');
                if (href) {
                    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    async loadJobs() {
        // Mock job data - in production, this would fetch from API
        this.jobs = [
            {
                id: 1,
                title: 'Senior AI Engineer',
                company: 'TechCorp Africa',
                location: 'Nairobi, Kenya',
                remote: true,
                type: 'Full-time',
                salary: '$80K - $120K',
                description: 'Lead the development of AI-powered solutions for financial services. Work with cutting-edge ML technologies and mentor junior developers.',
                requirements: ['Python', 'TensorFlow', 'AWS', 'Leadership'],
                posted: '2 days ago',
                applicants: 15,
                featured: true,
                category: 'software'
            },
            {
                id: 2,
                title: 'Blockchain Developer',
                company: 'CryptoStart',
                location: 'Remote Worldwide',
                remote: true,
                type: 'Full-time',
                salary: '$60K - $90K',
                description: 'Build decentralized applications and smart contracts for our DeFi platform. Join a fast-growing startup revolutionizing finance.',
                requirements: ['Solidity', 'Web3', 'React', 'DeFi'],
                posted: '1 week ago',
                applicants: 8,
                featured: false,
                category: 'blockchain'
            },
            {
                id: 3,
                title: 'UX Designer',
                company: 'HealthTech Solutions',
                location: 'Lagos, Nigeria',
                remote: false,
                type: 'Full-time',
                salary: '$45K - $65K',
                description: 'Design intuitive user experiences for healthcare applications. Help us make medical technology more accessible across Africa.',
                requirements: ['Figma', 'User Research', 'Prototyping', 'Healthcare'],
                posted: '3 days ago',
                applicants: 12,
                featured: false,
                category: 'design'
            },
            {
                id: 4,
                title: 'Full Stack Developer',
                company: 'EduTech Innovations',
                location: 'Remote',
                remote: true,
                type: 'Full-time',
                salary: '$50K - $70K',
                description: 'Build scalable web applications for educational platforms serving students across Africa.',
                requirements: ['React', 'Node.js', 'MongoDB', 'AWS'],
                posted: '5 days ago',
                applicants: 23,
                featured: false,
                category: 'software'
            },
            {
                id: 5,
                title: 'Data Scientist',
                company: 'AgriTech Kenya',
                location: 'Nairobi, Kenya',
                remote: false,
                type: 'Full-time',
                salary: '$55K - $75K',
                description: 'Analyze agricultural data to help farmers optimize crop yields and reduce waste.',
                requirements: ['Python', 'Machine Learning', 'SQL', 'Agriculture'],
                posted: '1 week ago',
                applicants: 18,
                featured: false,
                category: 'ai-ml'
            },
            {
                id: 6,
                title: 'Product Manager',
                company: 'FinTech Solutions',
                location: 'Cape Town, South Africa',
                remote: true,
                type: 'Full-time',
                salary: '$65K - $85K',
                description: 'Lead product strategy for mobile payment solutions serving underbanked populations.',
                requirements: ['Strategy', 'Analytics', 'Mobile Payments', 'Leadership'],
                posted: '2 weeks ago',
                applicants: 31,
                featured: false,
                category: 'product'
            }
        ];
        
        this.filteredJobs = [...this.jobs];
    }

    searchJobs() {
        const query = document.querySelector('.job-search-input')?.value.toLowerCase() || '';
        const location = document.querySelector('.location-input')?.value.toLowerCase() || '';
        
        this.filteredJobs = this.jobs.filter(job => {
            const matchesQuery = !query || 
                job.title.toLowerCase().includes(query) ||
                job.company.toLowerCase().includes(query) ||
                job.description.toLowerCase().includes(query) ||
                job.requirements.some(req => req.toLowerCase().includes(query));
                
            const matchesLocation = !location ||
                job.location.toLowerCase().includes(location) ||
                (location === 'remote' && job.remote);
                
            return matchesQuery && matchesLocation;
        });
        
        this.renderJobs();
        this.showToast(`Found ${this.filteredJobs.length} jobs matching your search`, 'info');
    }

    applyFilters() {
        const categoryFilter = document.querySelector('.filter-select')?.value || '';
        const experienceFilter = document.querySelectorAll('.filter-select')[1]?.value || '';
        const typeFilter = document.querySelectorAll('.filter-select')[2]?.value || '';
        
        this.filteredJobs = this.jobs.filter(job => {
            const matchesCategory = !categoryFilter || job.category === categoryFilter;
            const matchesType = !typeFilter || job.type.toLowerCase().replace(' ', '-') === typeFilter;
            
            return matchesCategory && matchesType;
        });
        
        this.renderJobs();
    }

    renderJobs() {
        const jobGrid = document.querySelector('.job-grid');
        const jobList = document.querySelector('.job-list');
        
        if (jobGrid) {
            jobGrid.innerHTML = this.filteredJobs.slice(0, 3).map(job => this.renderJobCard(job)).join('');
        }
        
        if (jobList) {
            jobList.innerHTML = this.filteredJobs.slice(3).map(job => this.renderJobListItem(job)).join('');
        }
    }

    renderJobCard(job) {
        return `
            <div class="job-card ${job.featured ? 'featured' : ''}" data-job-id="${job.id}">
                ${job.featured ? '<div class="job-badge">Featured</div>' : ''}
                <div class="job-header">
                    <div class="company-logo">
                        <i class="fas fa-building"></i>
                    </div>
                    <div class="job-info">
                        <h4>${job.title}</h4>
                        <p class="company">${job.company}</p>
                        <p class="location">
                            <i class="fas fa-map-marker-alt"></i> 
                            ${job.location}${job.remote ? ' (Remote OK)' : ''}
                        </p>
                    </div>
                    <div class="job-salary">
                        ${job.salary}
                    </div>
                </div>
                <div class="job-description">
                    <p>${job.description}</p>
                </div>
                <div class="job-tags">
                    ${job.requirements.slice(0, 4).map(req => `<span class="tag">${req}</span>`).join('')}
                </div>
                <div class="job-meta">
                    <span><i class="fas fa-clock"></i> Posted ${job.posted}</span>
                    <span><i class="fas fa-users"></i> ${job.applicants} applicants</span>
                </div>
                <div class="job-actions">
                    <button class="btn btn-primary">Apply Now</button>
                    <button class="btn btn-outline">Save Job</button>
                </div>
            </div>
        `;
    }

    renderJobListItem(job) {
        return `
            <div class="job-item" data-job-id="${job.id}">
                <div class="job-summary">
                    <h4>${job.title}</h4>
                    <p>${job.company} • ${job.location} • ${job.salary}</p>
                </div>
                <div class="job-quick-info">
                    ${job.requirements.slice(0, 2).map(req => `<span class="tag">${req}</span>`).join('')}
                    <span class="posted-time">${job.posted}</span>
                </div>
                <div class="job-actions">
                    <button class="btn btn-primary btn-sm">Apply</button>
                    <button class="btn btn-outline btn-sm">Save</button>
                </div>
            </div>
        `;
    }

    async applyToJob(jobId) {
        const job = this.jobs.find(j => j.id == jobId);
        if (!job) return;
        
        // Show application modal
        this.showApplicationModal(job);
    }

    showPostJobForm() {
        const modal = this.createModal(`
            <div class="post-job-modal">
                <div class="modal-header">
                    <h3>Post a Job</h3>
                    <p>Find the perfect candidate for your role</p>
                </div>
                
                <form class="job-form" id="job-form">
                    <div class="form-section">
                        <h4>Job Details</h4>
                        <div class="form-group">
                            <label>Job Title *</label>
                            <input type="text" name="title" required placeholder="e.g. Senior Full Stack Developer">
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Company *</label>
                                <input type="text" name="company" required placeholder="Your company name">
                            </div>
                            <div class="form-group">
                                <label>Location *</label>
                                <input type="text" name="location" required placeholder="e.g. Remote, Nairobi, Kenya">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Job Type *</label>
                                <select name="type" required>
                                    <option value="">Select type</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Freelance">Freelance</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Salary Range</label>
                                <input type="text" name="salary" placeholder="e.g. $50,000 - $80,000 per year">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Job Description *</label>
                            <textarea name="description" rows="5" required placeholder="Describe the role, responsibilities, and what you're looking for..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>Required Skills *</label>
                            <input type="text" name="skills" required placeholder="e.g. JavaScript, React, Node.js, MongoDB">
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Contact Information</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Your Name *</label>
                                <input type="text" name="contactName" required placeholder="Hiring manager name">
                            </div>
                            <div class="form-group">
                                <label>Email *</label>
                                <input type="email" name="contactEmail" required placeholder="hiring@company.com">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Phone Number *</label>
                            <input type="tel" name="contactPhone" required placeholder="+254 700 000 000">
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-briefcase"></i>
                            <span>Post Job</span>
                        </button>
                    </div>
                </form>
            </div>
        `);
        
        const form = modal.querySelector('#job-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitJobPosting(new FormData(form));
            modal.remove();
        });
    }

    async submitJobPosting(formData) {
        try {
            const newJob = {
                id: Date.now(),
                title: formData.get('title'),
                company: formData.get('company'),
                location: formData.get('location'),
                type: formData.get('type'),
                salary: formData.get('salary'),
                description: formData.get('description'),
                requirements: formData.get('skills').split(',').map(s => s.trim()),
                contactName: formData.get('contactName'),
                contactEmail: formData.get('contactEmail'),
                contactPhone: formData.get('contactPhone'),
                posted: 'Just now',
                applicants: 0,
                applications: [],
                featured: false,
                category: 'other',
                remote: formData.get('location').toLowerCase().includes('remote')
            };
            
            this.jobs.unshift(newJob);
            this.filteredJobs = [...this.jobs];
            
            this.showToast('Job posted successfully!', 'success');
            this.renderJobs();
            this.updateStats();
            
        } catch (error) {
            this.showToast('Failed to post job. Please try again.', 'error');
        }
    }

    showApplicationModal(job) {
        const modal = this.createModal(`
            <div class="application-modal">
                <div class="modal-header">
                    <h3>Apply for ${job.title}</h3>
                    <p>at ${job.company}</p>
                </div>
                
                <div class="job-summary">
                    <div class="job-info">
                        <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                        <span><i class="fas fa-briefcase"></i> ${job.type}</span>
                        ${job.salary ? `<span><i class="fas fa-dollar-sign"></i> ${job.salary}</span>` : ''}
                    </div>
                </div>
                
                <form class="application-form" id="application-form">
                    <div class="form-section">
                        <h4>Personal Information</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Full Name *</label>
                                <input type="text" name="name" required placeholder="Your full name">
                            </div>
                            <div class="form-group">
                                <label>Email *</label>
                                <input type="email" name="email" required placeholder="your.email@example.com">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Phone Number *</label>
                            <input type="tel" name="phone" required placeholder="+254 700 000 000">
                        </div>
                        
                        <div class="form-group">
                            <label>LinkedIn Profile</label>
                            <input type="url" name="linkedin" placeholder="https://linkedin.com/in/yourprofile">
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Application Details</h4>
                        <div class="form-group">
                            <label>Years of Experience *</label>
                            <select name="experience" required>
                                <option value="">Select experience</option>
                                <option value="0-1">0-1 years</option>
                                <option value="2-3">2-3 years</option>
                                <option value="4-6">4-6 years</option>
                                <option value="7-10">7-10 years</option>
                                <option value="10+">10+ years</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Why are you interested in this role? *</label>
                            <textarea name="interest" rows="4" required placeholder="Tell us why you're excited about this opportunity..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>Cover Letter</label>
                            <textarea name="coverLetter" rows="5" placeholder="Write a brief cover letter explaining why you're the perfect fit..."></textarea>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i>
                            <span>Submit Application</span>
                        </button>
                    </div>
                </form>
            </div>
        `);
        
        const form = modal.querySelector('#application-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitApplication(job.id, new FormData(form));
            modal.remove();
        });
    }

    async submitApplication(jobId, formData) {
        try {
            const application = {
                id: Date.now(),
                jobId: jobId,
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                linkedin: formData.get('linkedin'),
                experience: formData.get('experience'),
                interest: formData.get('interest'),
                coverLetter: formData.get('coverLetter'),
                appliedAt: new Date(),
                status: 'pending'
            };
            
            const job = this.jobs.find(j => j.id == jobId);
            if (job) {
                if (!job.applications) job.applications = [];
                job.applications.push(application);
                job.applicants += 1;
                this.renderJobs();
            }
            
            this.applications.push(application);
            this.showApplicationSuccess(job, application);
            
        } catch (error) {
            this.showToast('Failed to submit application. Please try again.', 'error');
        }
    }

    showApplicationSuccess(job, application) {
        const modal = this.createModal(`
            <div class="success-modal">
                <div class="modal-header">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Application Submitted!</h3>
                    <p>Your application for ${job.title} has been sent</p>
                </div>
                
                <div class="contact-info">
                    <h4>What happens next?</h4>
                    <div class="next-steps">
                        <div class="step">
                            <i class="fas fa-eye"></i>
                            <span>The hiring team will review your application</span>
                        </div>
                        <div class="step">
                            <i class="fas fa-phone"></i>
                            <span>They may contact you at ${application.phone}</span>
                        </div>
                        <div class="step">
                            <i class="fas fa-envelope"></i>
                            <span>Updates will be sent to ${application.email}</span>
                        </div>
                    </div>
                    
                    <div class="employer-contact">
                        <h4>Employer Contact</h4>
                        <div class="contact-details">
                            <p><strong>Contact Person:</strong> ${job.contactName || 'Hiring Manager'}</p>
                            <p><strong>Email:</strong> <a href="mailto:${job.contactEmail || 'hiring@' + job.company.toLowerCase().replace(' ', '') + '.com'}">${job.contactEmail || 'hiring@' + job.company.toLowerCase().replace(' ', '') + '.com'}</a></p>
                            <p><strong>Phone:</strong> <a href="tel:${job.contactPhone || '+254700000000'}">${job.contactPhone || '+254 700 000 000'}</a></p>
                        </div>
                        
                        <div class="contact-actions">
                            <a href="mailto:${job.contactEmail || 'hiring@' + job.company.toLowerCase().replace(' ', '') + '.com'}?subject=Application for ${job.title}&body=Hi ${job.contactName || 'Hiring Manager'},%0D%0A%0D%0AI have submitted my application for the ${job.title} position. I would love to discuss this opportunity further.%0D%0A%0D%0ABest regards,%0D%0A${application.name}%0D%0A${application.phone}" class="btn btn-secondary btn-sm">
                                <i class="fas fa-envelope"></i> Send Email
                            </a>
                            <a href="tel:${job.contactPhone || '+254700000000'}" class="btn btn-primary btn-sm">
                                <i class="fas fa-phone"></i> Call Now
                            </a>
                        </div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">Close</button>
                </div>
            </div>
        `);
    }

    showApplications() {
        const applications = [];
        this.jobs.forEach(job => {
            job.applications?.forEach(app => {
                applications.push({ ...app, jobTitle: job.title, company: job.company, contactPhone: job.contactPhone, contactEmail: job.contactEmail });
            });
        });
        
        const modal = this.createModal(`
            <div class="applications-modal">
                <div class="modal-header">
                    <h3>Job Applications</h3>
                    <p>Manage applications for your posted jobs</p>
                </div>
                
                <div class="applications-list">
                    ${applications.length === 0 ? `
                        <div class="empty-state">
                            <i class="fas fa-inbox"></i>
                            <h4>No Applications Yet</h4>
                            <p>Applications will appear here when candidates apply to your jobs</p>
                        </div>
                    ` : applications.map(app => `
                        <div class="application-item">
                            <div class="application-header">
                                <div class="applicant-info">
                                    <h4>${app.name}</h4>
                                    <p>Applied for ${app.jobTitle} at ${app.company}</p>
                                </div>
                                <div class="application-status">
                                    <span class="status-badge ${app.status}">${app.status}</span>
                                    <span class="application-date">${new Date(app.appliedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            
                            <div class="application-details">
                                <div class="detail-row">
                                    <span><i class="fas fa-envelope"></i> ${app.email}</span>
                                    <span><i class="fas fa-phone"></i> ${app.phone}</span>
                                    <span><i class="fas fa-chart-line"></i> ${app.experience} experience</span>
                                </div>
                                
                                <div class="application-preview">
                                    <p><strong>Interest:</strong> ${app.interest}</p>
                                    ${app.coverLetter ? `<p><strong>Cover Letter:</strong> ${app.coverLetter.substring(0, 150)}...</p>` : ''}
                                </div>
                                
                                <div class="application-actions">
                                    <a href="mailto:${app.email}?subject=Re: Your application for ${app.jobTitle}&body=Hi ${app.name},%0D%0A%0D%0AThank you for your application for the ${app.jobTitle} position.%0D%0A%0D%0ABest regards" class="btn btn-secondary btn-sm">
                                        <i class="fas fa-envelope"></i> Email
                                    </a>
                                    <a href="tel:${app.phone}" class="btn btn-primary btn-sm">
                                        <i class="fas fa-phone"></i> Call
                                    </a>
                                    <button class="btn btn-success btn-sm" onclick="hiringApp.updateApplicationStatus(${app.id}, 'accepted')">
                                        <i class="fas fa-check"></i> Accept
                                    </button>
                                    <button class="btn btn-danger btn-sm" onclick="hiringApp.updateApplicationStatus(${app.id}, 'rejected')">
                                        <i class="fas fa-times"></i> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">Close</button>
                </div>
            </div>
        `);
    }

    updateApplicationStatus(applicationId, status) {
        this.jobs.forEach(job => {
            const app = job.applications?.find(a => a.id === applicationId);
            if (app) {
                app.status = status;
                this.showToast(`Application ${status}!`, 'success');
            }
        });
        
        document.querySelector('.modal-overlay')?.remove();
        this.showApplications();
    }

    async saveJob(jobId) {
        const job = this.jobs.find(j => j.id == jobId);
        if (!job) return;
        
        if (this.savedJobs.includes(jobId)) {
            this.savedJobs = this.savedJobs.filter(id => id !== jobId);
            this.showToast('Job removed from saved jobs', 'info');
        } else {
            this.savedJobs.push(jobId);
            this.showToast(`${job.title} saved to your job list`, 'success');
        }
        
        // Update button text
        const jobCard = document.querySelector(`[data-job-id="${jobId}"]`);
        const saveBtn = jobCard?.querySelector('.btn-outline');
        if (saveBtn) {
            saveBtn.textContent = this.savedJobs.includes(jobId) ? 'Saved' : 'Save Job';
        }
    }

    async submitJob(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const jobData = {
            id: Date.now(),
            title: formData.get('title') || formData.get('job-title'),
            company: formData.get('company') || formData.get('company-name'),
            location: formData.get('location') || formData.get('job-location'),
            type: formData.get('type') || formData.get('job-type'),
            salary: formData.get('salary') || formData.get('salary-range'),
            description: formData.get('description') || formData.get('job-description'),
            requirements: (formData.get('skills') || '').split(',').map(s => s.trim()).filter(s => s),
            remote: formData.has('remote'),
            posted: 'Just now',
            applicants: 0,
            featured: false,
            category: 'other'
        };
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.jobs.unshift(jobData);
            this.filteredJobs = [...this.jobs];
            this.renderJobs();
            this.updateStats();
            
            e.target.reset();
            this.showToast('Job posted successfully! It will be reviewed and published within 24 hours.', 'success');
            
            // Scroll to jobs section
            document.querySelector('#jobs')?.scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error('Job posting error:', error);
            this.showToast('Failed to post job. Please try again.', 'error');
        }
    }

    updateStats() {
        const stats = [
            { selector: '.stat-card:nth-child(1) .stat-number', value: this.jobs.length + '+' },
            { selector: '.stat-card:nth-child(2) .stat-number', value: '1000+' },
            { selector: '.stat-card:nth-child(3) .stat-number', value: '95%' },
            { selector: '.stat-card:nth-child(4) .stat-number', value: '50+' }
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

// Initialize Hiring App
document.addEventListener('DOMContentLoaded', () => {
    window.hiringApp = new HiringApp();
    console.log('🚀 Hiring Platform - Application Initialized');
});