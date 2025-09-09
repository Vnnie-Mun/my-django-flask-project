// Enhanced Hiring Platform Application Manager with Full API Integration
class HiringApp {
    constructor() {
        this.currentView = 'jobs';
        this.api = window.hiringAPI;
        this.dataViz = window.hiringDataViz;
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadJobs();
        this.setupUserSession();
    }

    setupUserSession() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!this.currentUser) {
            this.currentUser = {
                email: 'user@example.com',
                name: 'Demo User',
                type: 'candidate'
            };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    setupEventListeners() {
        // View switching
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-view]')) {
                this.switchView(e.target.dataset.view);
            }
        });

        // Job search and filters
        const searchInput = document.getElementById('jobSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterJobs(e.target.value);
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterJobsByCategory(e.target.value);
            });
        }

        // Location filter
        const locationFilter = document.getElementById('locationFilter');
        if (locationFilter) {
            locationFilter.addEventListener('change', (e) => {
                this.filterJobsByLocation(e.target.value);
            });
        }

        // Job posting form
        const postJobForm = document.getElementById('postJobForm');
        if (postJobForm) {
            postJobForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleJobPost(e.target);
            });
        }

        // Job application form
        const applyForm = document.getElementById('jobApplicationForm');
        if (applyForm) {
            applyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleJobApplication(e.target);
            });
        }

        // Apply button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.apply-btn')) {
                const jobId = e.target.dataset.jobId;
                this.showApplicationModal(jobId);
            }
        });

        // Contact buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.contact-btn')) {
                const email = e.target.dataset.email;
                const phone = e.target.dataset.phone;
                this.showContactOptions(email, phone);
            }
        });

        // Dashboard and analytics
        document.addEventListener('click', (e) => {
            if (e.target.matches('.view-dashboard')) {
                this.showDashboard();
            }
            if (e.target.matches('.view-connections')) {
                this.showConnections();
            }
        });
    }

    async loadJobs() {
        const jobsGrid = document.getElementById('jobsGrid');
        if (!jobsGrid) return;

        jobsGrid.innerHTML = '<div class="loading-spinner">Loading jobs...</div>';
        
        try {
            const jobs = await this.api.getJobs();
            this.displayJobs(jobs);
            this.updateJobStats(jobs);
        } catch (error) {
            console.error('Error loading jobs:', error);
            jobsGrid.innerHTML = '<div class="error-message">Failed to load jobs. Please try again.</div>';
        }
    }

    async updateJobStats(jobs) {
        const stats = await this.dataViz.generateJobStats();
        const statsContainer = document.querySelector('.hiring-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat-item">
                    <div class="stat-number">${stats.totalJobs}</div>
                    <div class="stat-label">Active Jobs</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${stats.totalApplications}</div>
                    <div class="stat-label">Applications</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${Math.round(stats.avgApplicationsPerJob)}</div>
                    <div class="stat-label">Avg per Job</div>
                </div>
            `;
        }
    }

    async handleJobPost(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Posting Job...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const jobData = {
                title: formData.get('title'),
                company: formData.get('company'),
                location: formData.get('location'),
                category: formData.get('category'),
                type: formData.get('type'),
                salary: formData.get('salary'),
                description: formData.get('description'),
                requirements: formData.get('requirements'),
                contactEmail: formData.get('contactEmail'),
                contactPhone: formData.get('contactPhone'),
                contactPerson: formData.get('contactPerson')
            };

            const result = await this.api.postJob(jobData);
            
            if (result.success) {
                this.showToast('Job posted successfully! AI optimization applied.', 'success');
                form.reset();
                this.closeModal('postJobModal');
                await this.loadJobs();
                
                // Show AI insights
                if (result.job.aiOptimizations) {
                    setTimeout(() => {
                        this.showAIInsights(result.job.aiOptimizations);
                    }, 2000);
                }
            }
        } catch (error) {
            console.error('Error posting job:', error);
            this.showToast('Failed to post job. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleJobApplication(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting Application...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const applicationData = {
                jobId: formData.get('jobId'),
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                coverLetter: formData.get('coverLetter'),
                resume: formData.get('resume')
            };

            const result = await this.api.submitApplication(applicationData);
            
            if (result.success) {
                this.showToast(`Application submitted! AI Match Score: ${result.aiScore}/100`, 'success');
                form.reset();
                this.closeModal('applicationModal');
                await this.loadJobs();
                
                // Show follow-up connections after delay
                setTimeout(async () => {
                    await this.showConnectionRecommendations('candidate');
                }, 3000);
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            this.showToast('Failed to submit application. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async showConnectionRecommendations(userType) {
        try {
            const connections = await this.api.getConnectionRecommendations(this.currentUser.email, userType);
            
            if (connections.length === 0) {
                this.showToast('No connection recommendations available at this time.', 'info');
                return;
            }

            const modal = this.createModal('connectionsModal', 'Connection Recommendations');
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-network-wired"></i> AI-Powered Connection Recommendations</h3>
                        <button class="close-modal" onclick="hiringApp.closeModal('connectionsModal')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="connections-intro">
                            <p>Based on your applications and AI analysis, here are your top connection recommendations:</p>
                        </div>
                        
                        <div class="connections-grid">
                            ${connections.map(conn => `
                                <div class="connection-card">
                                    <div class="connection-header">
                                        <div class="connection-avatar">
                                            <i class="fas fa-user-circle"></i>
                                        </div>
                                        <div class="connection-info">
                                            <h4>${conn.name}</h4>
                                            <p class="connection-role">${conn.company ? conn.company + ' - ' : ''}${conn.position}</p>
                                            <div class="match-score">
                                                <span class="score-label">AI Match:</span>
                                                <span class="score-value">${conn.matchScore}/100</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="connection-reason">
                                        <p><i class="fas fa-lightbulb"></i> ${conn.reason}</p>
                                    </div>
                                    
                                    <div class="connection-actions">
                                        <button class="btn btn-primary btn-sm" onclick="hiringApp.sendConnectionEmail('${conn.email}', '${conn.name}', '${conn.position}')">
                                            <i class="fas fa-envelope"></i> Send Email
                                        </button>
                                        <button class="btn btn-secondary btn-sm" onclick="hiringApp.callContact('${conn.phone}', '${conn.name}')">
                                            <i class="fas fa-phone"></i> Call
                                        </button>
                                        <button class="btn btn-outline btn-sm" onclick="hiringApp.scheduleFollowUp('${conn.email}', '${conn.name}')">
                                            <i class="fas fa-calendar"></i> Schedule
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="connections-footer">
                            <button class="btn btn-success" onclick="hiringApp.exportConnections()">
                                <i class="fas fa-download"></i> Export Contacts
                            </button>
                            <button class="btn btn-info" onclick="hiringApp.scheduleFollowUpReminders()">
                                <i class="fas fa-bell"></i> Set Reminders
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            modal.style.display = 'flex';
        } catch (error) {
            console.error('Error loading connections:', error);
            this.showToast('Failed to load connection recommendations.', 'error');
        }
    }

    async sendConnectionEmail(email, name, position) {
        const subject = encodeURIComponent(`Connection Request - ${position}`);
        const body = encodeURIComponent(`Dear ${name},\n\nI hope this message finds you well. I recently applied for the ${position} position and our AI matching system identified you as a valuable connection.\n\nI would love to connect and learn more about the opportunity and your experience with the company. I believe my background and passion for innovation align well with your team's goals.\n\nWould you be available for a brief call or coffee chat this week?\n\nBest regards,\n${this.currentUser.name}\n${this.currentUser.email}`);
        
        window.open(`mailto:${email}?subject=${subject}&body=${body}`);
        this.showToast('Professional email template opened', 'success');
        
        // Track email sent
        this.trackInteraction('email_sent', { recipient: email, type: 'connection' });
    }

    callContact(phone, name) {
        if (phone) {
            window.open(`tel:${phone}`);
            this.showToast(`Calling ${name}...`, 'info');
            this.trackInteraction('call_initiated', { recipient: phone, name });
        } else {
            this.showToast('Phone number not available', 'error');
        }
    }

    scheduleFollowUp(email, name) {
        const modal = this.createModal('scheduleModal', 'Schedule Follow-up');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Schedule Follow-up with ${name}</h3>
                    <button class="close-modal" onclick="hiringApp.closeModal('scheduleModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="scheduleForm">
                        <div class="form-group">
                            <label>Follow-up Date</label>
                            <input type="date" name="followUpDate" required min="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="form-group">
                            <label>Reminder Time</label>
                            <input type="time" name="reminderTime" required>
                        </div>
                        <div class="form-group">
                            <label>Notes</label>
                            <textarea name="notes" placeholder="Add any notes for this follow-up..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Schedule Reminder</button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        modal.querySelector('#scheduleForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveFollowUpReminder(email, name, new FormData(e.target));
        });
    }

    saveFollowUpReminder(email, name, formData) {
        const reminder = {
            id: Date.now(),
            contact: { email, name },
            date: formData.get('followUpDate'),
            time: formData.get('reminderTime'),
            notes: formData.get('notes'),
            status: 'pending'
        };
        
        const reminders = JSON.parse(localStorage.getItem('followUpReminders') || '[]');
        reminders.push(reminder);
        localStorage.setItem('followUpReminders', JSON.stringify(reminders));
        
        this.showToast('Follow-up reminder scheduled successfully!', 'success');
        this.closeModal('scheduleModal');
    }

    trackInteraction(type, data) {
        const interactions = JSON.parse(localStorage.getItem('userInteractions') || '[]');
        interactions.push({
            type,
            data,
            timestamp: new Date().toISOString(),
            userId: this.currentUser.email
        });
        localStorage.setItem('userInteractions', JSON.stringify(interactions));
    }

    async showDashboard() {
        const modal = this.createModal('dashboardModal', 'Hiring Dashboard');
        const stats = await this.dataViz.generateJobStats();
        
        modal.innerHTML = `
            <div class="modal-content dashboard-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-chart-bar"></i> Hiring Analytics Dashboard</h3>
                    <button class="close-modal" onclick="hiringApp.closeModal('dashboardModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="dashboard-stats">
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-briefcase"></i></div>
                            <div class="stat-info">
                                <div class="stat-number">${stats.totalJobs}</div>
                                <div class="stat-label">Total Jobs</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-users"></i></div>
                            <div class="stat-info">
                                <div class="stat-number">${stats.totalApplications}</div>
                                <div class="stat-label">Applications</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
                            <div class="stat-info">
                                <div class="stat-number">${Math.round(stats.avgApplicationsPerJob)}</div>
                                <div class="stat-label">Avg per Job</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dashboard-charts">
                        <div class="chart-section">
                            <h4>Top Categories</h4>
                            <div class="category-chart">
                                ${stats.topCategories.map(cat => `
                                    <div class="category-bar">
                                        <span class="category-name">${cat.category}</span>
                                        <div class="bar-container">
                                            <div class="bar" style="width: ${(cat.count / stats.totalJobs) * 100}%"></div>
                                            <span class="bar-value">${cat.count}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="chart-section">
                            <h4>Application Trends (Last 7 Days)</h4>
                            <div class="trend-chart">
                                ${stats.applicationTrends.map(([date, count]) => `
                                    <div class="trend-item">
                                        <span class="trend-date">${new Date(date).toLocaleDateString()}</span>
                                        <div class="trend-bar">
                                            <div class="bar" style="width: ${(count / Math.max(...stats.applicationTrends.map(([,c]) => c))) * 100}%"></div>
                                            <span class="trend-value">${count}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    showAIInsights(optimizations) {
        const modal = this.createModal('aiInsightsModal', 'AI Job Optimization');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-robot"></i> AI Optimization Results</h3>
                    <button class="close-modal" onclick="hiringApp.closeModal('aiInsightsModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="ai-insights">
                        <div class="insight-section">
                            <h4><i class="fas fa-tags"></i> Suggested Keywords</h4>
                            <div class="keyword-tags">
                                ${optimizations.suggestedKeywords.map(keyword => 
                                    `<span class="keyword-tag">${keyword}</span>`
                                ).join('')}
                            </div>
                        </div>
                        
                        <div class="insight-section">
                            <h4><i class="fas fa-dollar-sign"></i> Salary Benchmark</h4>
                            <p class="salary-benchmark">${optimizations.salaryBenchmark}</p>
                        </div>
                        
                        <div class="insight-section">
                            <h4><i class="fas fa-lightbulb"></i> Improvement Tips</h4>
                            <ul class="improvement-tips">
                                ${optimizations.improvementTips.map(tip => 
                                    `<li>${tip}</li>`
                                ).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    async filterJobs(searchTerm) {
        const jobs = await this.api.getJobs();
        const filteredJobs = jobs.filter(job => 
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.displayJobs(filteredJobs);
    }

    async filterJobsByCategory(category) {
        const filters = category === 'all' ? {} : { category };
        const jobs = await this.api.getJobs(filters);
        this.displayJobs(jobs);
    }

    async filterJobsByLocation(location) {
        const filters = location === 'all' ? {} : { location };
        const jobs = await this.api.getJobs(filters);
        this.displayJobs(jobs);
    }

    displayJobs(jobs) {
        const jobsGrid = document.getElementById('jobsGrid');
        if (!jobsGrid) return;

        if (jobs.length === 0) {
            jobsGrid.innerHTML = '<div class="no-jobs">No jobs found matching your criteria.</div>';
            return;
        }

        jobsGrid.innerHTML = jobs.map(job => `
            <div class="job-card" data-job-id="${job.id}">
                <div class="job-header">
                    <div class="job-title-company">
                        <h3 class="job-title">${job.title}</h3>
                        <p class="job-company">${job.company}</p>
                    </div>
                    <div class="job-meta">
                        <span class="job-type">${job.type}</span>
                        <span class="job-location"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                        ${job.aiOptimizations ? '<span class="ai-optimized"><i class="fas fa-robot"></i> AI Optimized</span>' : ''}
                    </div>
                </div>
                
                <div class="job-details">
                    <div class="job-salary">
                        <i class="fas fa-dollar-sign"></i> ${job.salary}
                    </div>
                    <div class="job-category">
                        <i class="fas fa-tag"></i> ${job.category}
                    </div>
                </div>
                
                <div class="job-description">
                    <p>${job.description.substring(0, 150)}...</p>
                </div>
                
                <div class="job-footer">
                    <div class="job-stats">
                        <span class="applications-count">
                            <i class="fas fa-users"></i> ${job.applications ? job.applications.length : 0} applications
                        </span>
                        <span class="posted-date">
                            <i class="fas fa-clock"></i> ${this.formatDate(job.postedAt)}
                        </span>
                        <span class="job-views">
                            <i class="fas fa-eye"></i> ${job.views || 0} views
                        </span>
                    </div>
                    <div class="job-actions">
                        <button class="btn btn-outline contact-btn" 
                                data-email="${job.contactEmail}" 
                                data-phone="${job.contactPhone}">
                            <i class="fas fa-envelope"></i> Contact
                        </button>
                        <button class="btn btn-primary apply-btn" data-job-id="${job.id}">
                            <i class="fas fa-paper-plane"></i> Apply Now
                        </button>
                        ${this.currentUser.type === 'recruiter' ? `
                            <button class="btn btn-secondary view-applications" data-job-id="${job.id}">
                                <i class="fas fa-list"></i> View Applications
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners for new buttons
        document.querySelectorAll('.view-applications').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showJobApplications(e.target.dataset.jobId);
            });
        });
    }

    async showJobApplications(jobId) {
        const applications = await this.api.getApplicationsForJob(parseInt(jobId));
        const job = await this.api.getJobById(parseInt(jobId));
        
        const modal = this.createModal('applicationsModal', `Applications for ${job.title}`);
        modal.innerHTML = `
            <div class="modal-content applications-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-users"></i> Applications for ${job.title}</h3>
                    <button class="close-modal" onclick="hiringApp.closeModal('applicationsModal')">&times;</button>
                </div>
                <div class="modal-body">
                    ${applications.length === 0 ? 
                        '<p class="no-applications">No applications received yet.</p>' :
                        `<div class="applications-list">
                            ${applications.map(app => `
                                <div class="application-card">
                                    <div class="application-header">
                                        <div class="applicant-info">
                                            <h4>${app.fullName}</h4>
                                            <p>${app.email} | ${app.phone}</p>
                                        </div>
                                        <div class="application-meta">
                                            <span class="ai-score">AI Score: ${app.aiScore || 'N/A'}/100</span>
                                            <span class="application-date">${this.formatDate(app.submittedAt)}</span>
                                        </div>
                                    </div>
                                    <div class="application-content">
                                        <p><strong>Cover Letter:</strong></p>
                                        <p class="cover-letter">${app.coverLetter.substring(0, 200)}...</p>
                                        ${app.aiInsights ? `<p class="ai-insights"><i class="fas fa-robot"></i> ${app.aiInsights}</p>` : ''}
                                    </div>
                                    <div class="application-actions">
                                        <button class="btn btn-primary btn-sm" onclick="hiringApp.contactApplicant('${app.email}', '${app.fullName}', '${job.title}')">
                                            <i class="fas fa-envelope"></i> Contact
                                        </button>
                                        <button class="btn btn-secondary btn-sm" onclick="hiringApp.scheduleInterview('${app.id}', '${app.fullName}')">
                                            <i class="fas fa-calendar"></i> Schedule Interview
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>`
                    }
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    contactApplicant(email, name, jobTitle) {
        const subject = encodeURIComponent(`Interview Opportunity - ${jobTitle}`);
        const body = encodeURIComponent(`Dear ${name},\n\nThank you for your application for the ${jobTitle} position. We were impressed with your background and would like to schedule an interview.\n\nPlease let us know your availability for the coming week.\n\nBest regards,\nHiring Team`);
        
        window.open(`mailto:${email}?subject=${subject}&body=${body}`);
        this.showToast('Interview email template opened', 'success');
    }

    exportConnections() {
        const connections = JSON.parse(localStorage.getItem('userConnections') || '[]');
        const csvContent = "data:text/csv;charset=utf-8," + 
            "Name,Email,Phone,Company,Position,Match Score\n" +
            connections.map(conn => 
                `${conn.name},${conn.email},${conn.phone},${conn.company || ''},${conn.position},${conn.matchScore}`
            ).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "hiring_connections.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('Connections exported successfully!', 'success');
    }

    scheduleFollowUpReminders() {
        const reminders = JSON.parse(localStorage.getItem('followUpReminders') || '[]');
        const pendingReminders = reminders.filter(r => r.status === 'pending');
        
        if (pendingReminders.length === 0) {
            this.showToast('No pending reminders to schedule.', 'info');
            return;
        }
        
        // Set up browser notifications
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showToast(`${pendingReminders.length} follow-up reminders activated!`, 'success');
                    this.setupReminderNotifications(pendingReminders);
                }
            });
        }
    }

    setupReminderNotifications(reminders) {
        reminders.forEach(reminder => {
            const reminderTime = new Date(`${reminder.date}T${reminder.time}`);
            const now = new Date();
            const timeUntilReminder = reminderTime.getTime() - now.getTime();
            
            if (timeUntilReminder > 0) {
                setTimeout(() => {
                    new Notification('Follow-up Reminder', {
                        body: `Time to follow up with ${reminder.contact.name}`,
                        icon: '/favicon.ico'
                    });
                }, timeUntilReminder);
            }
        });
    }

    showApplicationModal(jobId) {
        const modal = this.createModal('applicationModal', 'Apply for Job');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-paper-plane"></i> Submit Application</h3>
                    <button class="close-modal" onclick="hiringApp.closeModal('applicationModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="jobApplicationForm">
                        <input type="hidden" name="jobId" value="${jobId}">
                        <div class="form-group">
                            <label>Full Name *</label>
                            <input type="text" name="fullName" required>
                        </div>
                        <div class="form-group">
                            <label>Email *</label>
                            <input type="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label>Phone *</label>
                            <input type="tel" name="phone" required>
                        </div>
                        <div class="form-group">
                            <label>Cover Letter *</label>
                            <textarea name="coverLetter" rows="6" required placeholder="Tell us why you're perfect for this role..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Resume/CV *</label>
                            <input type="file" name="resume" accept=".pdf,.doc,.docx" required>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i> Submit Application
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        modal.querySelector('#jobApplicationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleJobApplication(e.target);
        });
    }

    showContactOptions(email, phone) {
        const modal = this.createModal('contactModal', 'Contact Options');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-address-book"></i> Contact Options</h3>
                    <button class="close-modal" onclick="hiringApp.closeModal('contactModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="contact-options">
                        <button class="btn btn-primary contact-option" onclick="window.open('mailto:${email}')">
                            <i class="fas fa-envelope"></i>
                            <span>Send Email</span>
                            <small>${email}</small>
                        </button>
                        <button class="btn btn-secondary contact-option" onclick="window.open('tel:${phone}')">
                            <i class="fas fa-phone"></i>
                            <span>Call Now</span>
                            <small>${phone}</small>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    createModal(id, title) {
        // Remove existing modal if it exists
        const existingModal = document.getElementById(id);
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = id;
        modal.className = 'modal';
        modal.style.display = 'none';
        
        return modal;
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    switchView(view) {
        this.currentView = view;
        
        // Update active tab
        document.querySelectorAll('[data-view]').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Show/hide content sections
        document.querySelectorAll('.view-section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(`${view}View`).style.display = 'block';
    }
}

// Initialize the hiring app when the page loads
if (typeof window !== 'undefined') {
    // Wait for API to be loaded
    if (window.hiringAPI) {
        window.hiringApp = new HiringApp();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            window.hiringApp = new HiringApp();
        });
    }
}