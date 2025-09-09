// Programs Platform Application
class ProgramsApp {
    constructor() {
        this.programs = [];
        this.cohorts = [];
        this.applications = [];
        this.userProfile = null;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadPrograms();
        await this.loadCohorts();
        this.updateStats();
    }

    setupEventListeners() {
        // Hero buttons
        document.getElementById('explore-programs')?.addEventListener('click', () => {
            document.querySelector('.programs-overview')?.scrollIntoView({ behavior: 'smooth' });
        });
        
        document.getElementById('apply-now')?.addEventListener('click', () => {
            window.open('https://login.gale.com/oauth2/ausjkkn80o3gOb4aj696/v1/authorize?scope=openid+email+profile&response_type=id_token&redirect_uri=https%3A%2F%2Flink.gale.com%2Fapps%2Foauth2%2Fokta&state=aHR0cHM6Ly9saW5rLmdhbGUuY29tL2FwcHMvdWRlbXkvaWRwVXNlcj9wPVVERU1ZJnRhcmdldFBhdGg9JnU9dHhzaHJwdWIxMDAxMDAmZGV0ZWN0ZWRVc2VyPW1VbE5YQUZlcXZLTmR1dFlUV1ZKSlElM0QlM0QmdHo9QW1lcmljYS9DaGljYWdvJnBpdT1odHRwcyUzQSUyRiUyRmxpbmsuZ2FsZS5jb20&nonce=1726947127122&client_id=0oajgjpamQThTX8Ea696&response_mode=form_post', '_blank');
            this.showToast('Redirecting to learning platform...', 'info');
        });
        
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(link.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    async loadPrograms() {
        // Mock programs data
        this.programs = [
            {
                id: 'bootcamp',
                name: 'Tech Bootcamps',
                description: 'Intensive training in cutting-edge technologies with hands-on projects and industry mentorship.',
                duration: '12-16 weeks',
                format: 'Hybrid',
                maxStudents: 25,
                features: [
                    'Full-Stack Development',
                    'AI & Machine Learning',
                    'Blockchain Development',
                    'Mobile App Development'
                ],
                tracks: [
                    {
                        name: 'Full-Stack Development',
                        duration: '12 weeks',
                        technologies: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
                        projects: 3
                    },
                    {
                        name: 'AI & Machine Learning',
                        duration: '16 weeks',
                        technologies: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas'],
                        projects: 4
                    },
                    {
                        name: 'Blockchain Development',
                        duration: '14 weeks',
                        technologies: ['Solidity', 'Web3.js', 'Ethereum', 'IPFS', 'React'],
                        projects: 3
                    }
                ],
                prerequisites: [
                    'Basic computer literacy',
                    'High school diploma or equivalent',
                    'Strong motivation to learn',
                    'Commitment to full-time study'
                ],
                outcomes: [
                    '95% job placement rate',
                    'Average salary increase of 250%',
                    'Portfolio of 3-4 real-world projects',
                    'Industry-recognized certificate'
                ]
            },
            {
                id: 'mentorship',
                name: 'Mentorship Program',
                description: 'Connect with industry leaders and experienced professionals for personalized guidance.',
                duration: '6 months',
                format: 'Virtual & In-person',
                maxStudents: 50,
                features: [
                    'One-on-One Sessions',
                    'Career Guidance',
                    'Network Building',
                    'Skill Development'
                ],
                mentorAreas: [
                    'Software Engineering',
                    'Product Management',
                    'Data Science',
                    'Entrepreneurship',
                    'Design & UX',
                    'DevOps & Cloud'
                ],
                benefits: [
                    'Personalized career roadmap',
                    'Industry insights and trends',
                    'Professional network expansion',
                    'Skill gap identification',
                    'Interview preparation',
                    'Leadership development'
                ]
            },
            {
                id: 'innovation-hub',
                name: 'Innovation Hub',
                description: 'Collaborative space for developing groundbreaking solutions with funding support.',
                duration: '3-6 months',
                format: 'Hybrid',
                maxStudents: 30,
                features: [
                    'Project Incubation',
                    'Resource Access',
                    'Funding Support',
                    'Expert Mentorship'
                ],
                focusAreas: [
                    'HealthTech Solutions',
                    'FinTech Innovation',
                    'AgriTech Development',
                    'EdTech Platforms',
                    'Sustainability Tech',
                    'Blockchain Applications'
                ],
                support: [
                    'Up to $10K seed funding',
                    'Co-working space access',
                    'Technical infrastructure',
                    'Legal and business support',
                    'Investor connections',
                    'Go-to-market strategy'
                ]
            }
        ];
    }

    async loadCohorts() {
        // Mock cohorts data
        this.cohorts = [
            {
                id: 'fullstack-march',
                programId: 'bootcamp',
                name: 'Full-Stack Development Bootcamp',
                startDate: new Date('2025-03-15'),
                endDate: new Date('2025-06-15'),
                status: 'enrolling',
                spotsTotal: 25,
                spotsAvailable: 8,
                schedule: 'Mon-Fri, 9AM-5PM EAT',
                format: 'Hybrid (Online + In-person)',
                instructor: 'Sarah Johnson',
                instructorBio: 'Senior Full-Stack Developer with 8+ years at Google and Meta'
            },
            {
                id: 'ai-ml-april',
                programId: 'bootcamp',
                name: 'AI & Machine Learning Intensive',
                startDate: new Date('2025-04-01'),
                endDate: new Date('2025-07-01'),
                status: 'starting-soon',
                spotsTotal: 20,
                spotsAvailable: 12,
                schedule: 'Tue/Thu, 6PM-9PM EAT',
                format: 'Online',
                instructor: 'Dr. Michael Chen',
                instructorBio: 'AI Research Scientist, former Microsoft Research'
            },
            {
                id: 'blockchain-may',
                programId: 'bootcamp',
                name: 'Blockchain Development Program',
                startDate: new Date('2025-05-15'),
                endDate: new Date('2025-08-15'),
                status: 'applications-open',
                spotsTotal: 15,
                spotsAvailable: 15,
                schedule: 'Weekends, 10AM-4PM EAT',
                format: 'Hybrid',
                instructor: 'Alex Oduya',
                instructorBio: 'Blockchain Architect, built DeFi protocols with $100M+ TVL'
            }
        ];
    }

    viewProgram(programId) {
        const program = this.programs.find(p => p.id === programId);
        if (!program) return;
        
        this.showProgramModal(program);
    }

    showProgramModal(program) {
        const modal = this.createModal(`
            <div class="program-modal">
                <div class="modal-header">
                    <h2>${program.name}</h2>
                    <p>${program.description}</p>
                </div>
                
                <div class="program-details">
                    <div class="detail-grid">
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <div>
                                <h4>Duration</h4>
                                <p>${program.duration}</p>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-laptop"></i>
                            <div>
                                <h4>Format</h4>
                                <p>${program.format}</p>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-users"></i>
                            <div>
                                <h4>Class Size</h4>
                                <p>Max ${program.maxStudents} students</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                ${program.tracks ? `
                    <div class="program-section">
                        <h3>Available Tracks</h3>
                        <div class="tracks-grid">
                            ${program.tracks.map(track => `
                                <div class="track-card">
                                    <h4>${track.name}</h4>
                                    <p><strong>Duration:</strong> ${track.duration}</p>
                                    <p><strong>Technologies:</strong> ${track.technologies.join(', ')}</p>
                                    <p><strong>Projects:</strong> ${track.projects} hands-on projects</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${program.mentorAreas ? `
                    <div class="program-section">
                        <h3>Mentorship Areas</h3>
                        <div class="areas-grid">
                            ${program.mentorAreas.map(area => `
                                <div class="area-tag">${area}</div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${program.focusAreas ? `
                    <div class="program-section">
                        <h3>Focus Areas</h3>
                        <div class="areas-grid">
                            ${program.focusAreas.map(area => `
                                <div class="area-tag">${area}</div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="program-section">
                    <h3>What You'll Gain</h3>
                    <ul class="benefits-list">
                        ${(program.outcomes || program.benefits || program.support).map(item => `
                            <li><i class="fas fa-check"></i> ${item}</li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
                    <button class="btn btn-primary" onclick="programsApp.applyToProgram('${program.id}')">Apply Now</button>
                </div>
            </div>
        `);
    }

    applyToCohort(cohortId) {
        const cohort = this.cohorts.find(c => c.id === cohortId);
        if (!cohort) return;
        
        this.showApplicationModal(cohort);
    }

    applyToProgram(programId) {
        const program = this.programs.find(p => p.id === programId);
        if (!program) return;
        
        // Find available cohorts for this program
        const availableCohorts = this.cohorts.filter(c => 
            c.programId === programId && c.spotsAvailable > 0
        );
        
        if (availableCohorts.length === 0) {
            this.showToast('No cohorts currently available for this program. Please check back later.', 'info');
            return;
        }
        
        // If only one cohort, apply directly
        if (availableCohorts.length === 1) {
            this.showApplicationModal(availableCohorts[0]);
        } else {
            // Show cohort selection
            this.showCohortSelectionModal(program, availableCohorts);
        }
    }

    showCohortSelectionModal(program, cohorts) {
        const modal = this.createModal(`
            <div class="cohort-selection-modal">
                <div class="modal-header">
                    <h3>Choose Your Cohort</h3>
                    <p>Select from available ${program.name} cohorts</p>
                </div>
                
                <div class="cohorts-list">
                    ${cohorts.map(cohort => `
                        <div class="cohort-option" onclick="programsApp.selectCohort('${cohort.id}')">
                            <div class="cohort-info">
                                <h4>${cohort.name}</h4>
                                <p><i class="fas fa-calendar"></i> ${cohort.startDate.toLocaleDateString()} - ${cohort.endDate.toLocaleDateString()}</p>
                                <p><i class="fas fa-clock"></i> ${cohort.schedule}</p>
                                <p><i class="fas fa-laptop"></i> ${cohort.format}</p>
                            </div>
                            <div class="cohort-availability">
                                <span class="spots-available">${cohort.spotsAvailable} spots left</span>
                                <div class="availability-bar">
                                    <div class="availability-fill" style="width: ${((cohort.spotsTotal - cohort.spotsAvailable) / cohort.spotsTotal) * 100}%"></div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                </div>
            </div>
        `);
    }

    selectCohort(cohortId) {
        // Close selection modal
        document.querySelector('.modal-overlay')?.remove();
        
        // Show application modal for selected cohort
        const cohort = this.cohorts.find(c => c.id === cohortId);
        if (cohort) {
            this.showApplicationModal(cohort);
        }
    }

    showApplicationModal(cohort) {
        const program = this.programs.find(p => p.id === cohort.programId);
        
        const modal = this.createModal(`
            <div class="application-modal">
                <div class="modal-header">
                    <h3>Apply to ${cohort.name}</h3>
                    <div class="cohort-summary">
                        <p><i class="fas fa-calendar"></i> ${cohort.startDate.toLocaleDateString()} - ${cohort.endDate.toLocaleDateString()}</p>
                        <p><i class="fas fa-clock"></i> ${cohort.schedule}</p>
                        <p><i class="fas fa-user"></i> Instructor: ${cohort.instructor}</p>
                    </div>
                </div>
                
                <form class="application-form" id="application-form">
                    <div class="form-section">
                        <h4>Personal Information</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label>First Name *</label>
                                <input type="text" name="firstName" required>
                            </div>
                            <div class="form-group">
                                <label>Last Name *</label>
                                <input type="text" name="lastName" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Email Address *</label>
                                <input type="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label>Phone Number *</label>
                                <input type="tel" name="phone" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Location (City, Country) *</label>
                            <input type="text" name="location" required>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Background & Experience</h4>
                        <div class="form-group">
                            <label>Current Education Level *</label>
                            <select name="education" required>
                                <option value="">Select education level</option>
                                <option value="high-school">High School</option>
                                <option value="some-college">Some College</option>
                                <option value="bachelors">Bachelor's Degree</option>
                                <option value="masters">Master's Degree</option>
                                <option value="phd">PhD</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Current Employment Status *</label>
                            <select name="employment" required>
                                <option value="">Select status</option>
                                <option value="student">Student</option>
                                <option value="employed">Employed</option>
                                <option value="unemployed">Unemployed</option>
                                <option value="freelancer">Freelancer</option>
                                <option value="entrepreneur">Entrepreneur</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Programming Experience</label>
                            <select name="experience">
                                <option value="none">No experience</option>
                                <option value="beginner">Beginner (< 1 year)</option>
                                <option value="intermediate">Intermediate (1-3 years)</option>
                                <option value="advanced">Advanced (3+ years)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Relevant Skills/Technologies (if any)</label>
                            <textarea name="skills" rows="3" placeholder="List any programming languages, frameworks, or technologies you know..."></textarea>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Motivation & Goals</h4>
                        <div class="form-group">
                            <label>Why do you want to join this program? *</label>
                            <textarea name="motivation" rows="4" required placeholder="Tell us about your motivation and what you hope to achieve..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Career Goals *</label>
                            <textarea name="goals" rows="3" required placeholder="What are your career goals after completing this program?"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Time Commitment</label>
                            <div class="checkbox-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" name="commitment" value="full-time" required>
                                    I can commit to the full-time schedule and requirements of this program
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="commitment" value="attendance">
                                    I understand the attendance requirements and will prioritize program activities
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Additional Information</h4>
                        <div class="form-group">
                            <label>How did you hear about us?</label>
                            <select name="referral">
                                <option value="">Select source</option>
                                <option value="website">Website</option>
                                <option value="social-media">Social Media</option>
                                <option value="friend">Friend/Colleague</option>
                                <option value="event">Event/Workshop</option>
                                <option value="search">Google Search</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Additional Comments</label>
                            <textarea name="comments" rows="3" placeholder="Any additional information you'd like to share..."></textarea>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Submit Application</button>
                    </div>
                </form>
            </div>
        `);
        
        modal.querySelector('#application-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitApplication(cohort.id, new FormData(e.target));
            modal.remove();
        });
    }

    async submitApplication(cohortId, formData) {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const application = {
                id: Date.now(),
                cohortId: cohortId,
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                location: formData.get('location'),
                education: formData.get('education'),
                employment: formData.get('employment'),
                experience: formData.get('experience'),
                skills: formData.get('skills'),
                motivation: formData.get('motivation'),
                goals: formData.get('goals'),
                commitment: formData.getAll('commitment'),
                referral: formData.get('referral'),
                comments: formData.get('comments'),
                submittedAt: new Date(),
                status: 'pending'
            };
            
            this.applications.push(application);
            
            // Update cohort availability
            const cohort = this.cohorts.find(c => c.id === cohortId);
            if (cohort && cohort.spotsAvailable > 0) {
                cohort.spotsAvailable -= 1;
            }
            
            this.showToast('Application submitted successfully! You will receive a confirmation email and hear back within 5 business days.', 'success');
            
            // Show next steps
            setTimeout(() => {
                this.showNextStepsModal();
            }, 2000);
            
        } catch (error) {
            console.error('Application error:', error);
            this.showToast('Failed to submit application. Please try again.', 'error');
        }
    }

    showNextStepsModal() {
        const modal = this.createModal(`
            <div class="next-steps-modal">
                <div class="modal-header">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Application Submitted!</h3>
                    <p>Here's what happens next:</p>
                </div>
                
                <div class="steps-list">
                    <div class="step-item">
                        <div class="step-number">1</div>
                        <div class="step-text">
                            <h4>Application Review</h4>
                            <p>Our admissions team will review your application within 2-3 business days</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">2</div>
                        <div class="step-text">
                            <h4>Interview Invitation</h4>
                            <p>If selected, you'll receive an email to schedule a brief interview</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">3</div>
                        <div class="step-text">
                            <h4>Skills Assessment</h4>
                            <p>Complete a short skills assessment to help us understand your current level</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">4</div>
                        <div class="step-text">
                            <h4>Final Decision</h4>
                            <p>You'll receive our decision within 5 business days of your interview</p>
                        </div>
                    </div>
                </div>
                
                <div class="contact-info">
                    <p><strong>Questions?</strong> Contact our admissions team at <a href="mailto:admissions@innovatorsofhonour.com">admissions@innovatorsofhonour.com</a></p>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">Got it!</button>
                </div>
            </div>
        `);
    }

    learnMore(cohortId) {
        const cohort = this.cohorts.find(c => c.id === cohortId);
        if (!cohort) return;
        
        const program = this.programs.find(p => p.id === cohort.programId);
        
        const modal = this.createModal(`
            <div class="cohort-details-modal">
                <div class="modal-header">
                    <h3>${cohort.name}</h3>
                    <p>Detailed information about this cohort</p>
                </div>
                
                <div class="cohort-info">
                    <div class="info-grid">
                        <div class="info-item">
                            <i class="fas fa-calendar"></i>
                            <div>
                                <h4>Duration</h4>
                                <p>${cohort.startDate.toLocaleDateString()} - ${cohort.endDate.toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <div>
                                <h4>Schedule</h4>
                                <p>${cohort.schedule}</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-laptop"></i>
                            <div>
                                <h4>Format</h4>
                                <p>${cohort.format}</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-users"></i>
                            <div>
                                <h4>Availability</h4>
                                <p>${cohort.spotsAvailable} of ${cohort.spotsTotal} spots available</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="instructor-info">
                    <h4>Your Instructor</h4>
                    <div class="instructor-card">
                        <div class="instructor-photo">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="instructor-details">
                            <h5>${cohort.instructor}</h5>
                            <p>${cohort.instructorBio}</p>
                        </div>
                    </div>
                </div>
                
                ${program.tracks ? `
                    <div class="curriculum-preview">
                        <h4>What You'll Learn</h4>
                        <div class="curriculum-items">
                            ${program.tracks[0].technologies.map(tech => `
                                <div class="curriculum-item">
                                    <i class="fas fa-check"></i>
                                    <span>${tech}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}\n                \n                <div class=\"modal-actions\">\n                    <button class=\"btn btn-secondary\" onclick=\"this.closest('.modal-overlay').remove()\">Close</button>\n                    <button class=\"btn btn-primary\" onclick=\"programsApp.applyToCohort('${cohort.id}')\">Apply Now</button>\n                </div>\n            </div>\n        `);\n    }\n\n    startApplication() {\n        // Show program selection modal\n        const modal = this.createModal(`\n            <div class=\"program-selection-modal\">\n                <div class=\"modal-header\">\n                    <h3>Start Your Application</h3>\n                    <p>Choose the program that best fits your goals</p>\n                </div>\n                \n                <div class=\"programs-list\">\n                    ${this.programs.map(program => `\n                        <div class=\"program-option\" onclick=\"programsApp.applyToProgram('${program.id}')\">\n                            <div class=\"program-icon\">\n                                <i class=\"fas fa-${program.id === 'bootcamp' ? 'code' : program.id === 'mentorship' ? 'handshake' : 'rocket'}\"></i>\n                            </div>\n                            <div class=\"program-info\">\n                                <h4>${program.name}</h4>\n                                <p>${program.description}</p>\n                                <div class=\"program-meta\">\n                                    <span><i class=\"fas fa-clock\"></i> ${program.duration}</span>\n                                    <span><i class=\"fas fa-laptop\"></i> ${program.format}</span>\n                                </div>\n                            </div>\n                            <div class=\"program-arrow\">\n                                <i class=\"fas fa-chevron-right\"></i>\n                            </div>\n                        </div>\n                    `).join('')}\n                </div>\n                \n                <div class=\"modal-actions\">\n                    <button class=\"btn btn-secondary\" onclick=\"this.closest('.modal-overlay').remove()\">Cancel</button>\n                </div>\n            </div>\n        `);\n    }\n\n    // Footer link functions\n    viewRequirements() {\n        this.showInfoModal('Program Requirements', `\n            <div class=\"requirements-info\">\n                <h4>General Requirements</h4>\n                <ul>\n                    <li>High school diploma or equivalent</li>\n                    <li>Basic computer literacy</li>\n                    <li>Strong motivation to learn</li>\n                    <li>Commitment to program schedule</li>\n                    <li>English proficiency (intermediate level)</li>\n                </ul>\n                \n                <h4>Technical Requirements</h4>\n                <ul>\n                    <li>Personal computer (Windows, Mac, or Linux)</li>\n                    <li>Reliable internet connection</li>\n                    <li>Webcam and microphone for virtual sessions</li>\n                    <li>Ability to install software and development tools</li>\n                </ul>\n                \n                <h4>Time Commitment</h4>\n                <ul>\n                    <li>Full-time programs: 40+ hours per week</li>\n                    <li>Part-time programs: 15-20 hours per week</li>\n                    <li>Weekend programs: 12-16 hours per week</li>\n                    <li>Additional time for homework and projects</li>\n                </ul>\n            </div>\n        `);\n    }\n\n    viewScholarships() {\n        this.showInfoModal('Scholarships & Financial Aid', `\n            <div class=\"scholarships-info\">\n                <h4>Available Scholarships</h4>\n                \n                <div class=\"scholarship-item\">\n                    <h5>Merit-Based Scholarship</h5>\n                    <p>Up to 50% tuition reduction for exceptional candidates</p>\n                    <ul>\n                        <li>Based on application strength and interview performance</li>\n                        <li>Limited to top 10% of applicants</li>\n                        <li>Requires maintaining 90%+ attendance</li>\n                    </ul>\n                </div>\n                \n                <div class=\"scholarship-item\">\n                    <h5>Need-Based Financial Aid</h5>\n                    <p>Sliding scale tuition based on financial circumstances</p>\n                    <ul>\n                        <li>Income verification required</li>\n                        <li>Up to 70% tuition reduction available</li>\n                        <li>Payment plan options available</li>\n                    </ul>\n                </div>\n                \n                <div class=\"scholarship-item\">\n                    <h5>Women in Tech Scholarship</h5>\n                    <p>Supporting female representation in technology</p>\n                    <ul>\n                        <li>25% tuition reduction for qualifying female applicants</li>\n                        <li>Additional mentorship and networking opportunities</li>\n                        <li>Career placement support</li>\n                    </ul>\n                </div>\n                \n                <p><strong>How to Apply:</strong> Scholarship applications are included in the main application form. Financial aid decisions are made during the admissions process.</p>\n            </div>\n        `);\n    }\n\n    viewCurriculum() {\n        this.showInfoModal('Curriculum Overview', `\n            <div class=\"curriculum-info\">\n                <h4>Our Learning Approach</h4>\n                <p>Our curriculum is designed around project-based learning, industry best practices, and real-world applications.</p>\n                \n                <h4>Core Components</h4>\n                <div class=\"curriculum-components\">\n                    <div class=\"component\">\n                        <h5><i class=\"fas fa-book\"></i> Theoretical Foundation</h5>\n                        <p>Solid understanding of fundamental concepts and principles</p>\n                    </div>\n                    <div class=\"component\">\n                        <h5><i class=\"fas fa-code\"></i> Hands-on Practice</h5>\n                        <p>Extensive coding exercises and practical implementations</p>\n                    </div>\n                    <div class=\"component\">\n                        <h5><i class=\"fas fa-project-diagram\"></i> Real Projects</h5>\n                        <p>Build portfolio-worthy projects with real-world applications</p>\n                    </div>\n                    <div class=\"component\">\n                        <h5><i class=\"fas fa-users\"></i> Team Collaboration</h5>\n                        <p>Work in teams using industry-standard collaboration tools</p>\n                    </div>\n                </div>\n                \n                <h4>Assessment Methods</h4>\n                <ul>\n                    <li>Project-based assessments (60%)</li>\n                    <li>Peer code reviews (20%)</li>\n                    <li>Technical presentations (15%)</li>\n                    <li>Participation and engagement (5%)</li>\n                </ul>\n            </div>\n        `);\n    }\n\n    viewInstructors() {\n        this.showInfoModal('Our Instructors', `\n            <div class=\"instructors-info\">\n                <h4>Meet Our Expert Team</h4>\n                <p>Learn from industry professionals with years of real-world experience</p>\n                \n                <div class=\"instructors-grid\">\n                    <div class=\"instructor-profile\">\n                        <div class=\"instructor-photo\">\n                            <i class=\"fas fa-user\"></i>\n                        </div>\n                        <div class=\"instructor-details\">\n                            <h5>Sarah Johnson</h5>\n                            <p class=\"title\">Senior Full-Stack Developer</p>\n                            <p class=\"experience\">8+ years at Google and Meta</p>\n                            <p class=\"specialties\">React, Node.js, System Design</p>\n                        </div>\n                    </div>\n                    \n                    <div class=\"instructor-profile\">\n                        <div class=\"instructor-photo\">\n                            <i class=\"fas fa-user\"></i>\n                        </div>\n                        <div class=\"instructor-details\">\n                            <h5>Dr. Michael Chen</h5>\n                            <p class=\"title\">AI Research Scientist</p>\n                            <p class=\"experience\">Former Microsoft Research</p>\n                            <p class=\"specialties\">Machine Learning, Deep Learning, NLP</p>\n                        </div>\n                    </div>\n                    \n                    <div class=\"instructor-profile\">\n                        <div class=\"instructor-photo\">\n                            <i class=\"fas fa-user\"></i>\n                        </div>\n                        <div class=\"instructor-details\">\n                            <h5>Alex Oduya</h5>\n                            <p class=\"title\">Blockchain Architect</p>\n                            <p class=\"experience\">Built DeFi protocols with $100M+ TVL</p>\n                            <p class=\"specialties\">Solidity, Web3, Smart Contracts</p>\n                        </div>\n                    </div>\n                </div>\n                \n                <h4>Teaching Philosophy</h4>\n                <p>Our instructors believe in:</p>\n                <ul>\n                    <li>Learning by doing - hands-on, project-based approach</li>\n                    <li>Individual attention - small class sizes for personalized feedback</li>\n                    <li>Industry relevance - curriculum updated with latest trends</li>\n                    <li>Continuous support - available for questions and guidance</li>\n                </ul>\n            </div>\n        `);\n    }\n\n    viewFAQ() {\n        this.showInfoModal('Frequently Asked Questions', `\n            <div class=\"faq-info\">\n                <div class=\"faq-item\">\n                    <h5>Do I need prior programming experience?</h5>\n                    <p>No prior experience is required for most of our programs. We start with fundamentals and build up progressively. However, some advanced programs may have prerequisites.</p>\n                </div>\n                \n                <div class=\"faq-item\">\n                    <h5>What is the time commitment?</h5>\n                    <p>Full-time bootcamps require 40+ hours per week. Part-time programs typically need 15-20 hours per week. We also offer weekend-only options for working professionals.</p>\n                </div>\n                \n                <div class=\"faq-item\">\n                    <h5>Do you provide job placement assistance?</h5>\n                    <p>Yes! We have a dedicated career services team that helps with resume building, interview preparation, and connecting you with our hiring partners.</p>\n                </div>\n                \n                <div class=\"faq-item\">\n                    <h5>What if I can't keep up with the pace?</h5>\n                    <p>We provide additional support through office hours, peer tutoring, and one-on-one sessions with instructors. Our goal is to ensure every student succeeds.</p>\n                </div>\n                \n                <div class=\"faq-item\">\n                    <h5>Are the programs available online?</h5>\n                    <p>We offer hybrid (online + in-person), fully online, and in-person options depending on the program. All online sessions are interactive with live instruction.</p>\n                </div>\n                \n                <div class=\"faq-item\">\n                    <h5>What equipment do I need?</h5>\n                    <p>You'll need a computer (Windows, Mac, or Linux), reliable internet connection, and basic peripherals like webcam and microphone for virtual sessions.</p>\n                </div>\n                \n                <div class=\"faq-item\">\n                    <h5>Do you offer refunds?</h5>\n                    <p>We offer a full refund within the first week of the program if you're not satisfied. After that, refunds are prorated based on remaining program duration.</p>\n                </div>\n            </div>\n        `);\n    }\n\n    contactAdmissions() {\n        this.showContactModal('Contact Admissions', 'Get in touch with our admissions team for questions about programs and applications');\n    }\n\n    scheduleCall() {\n        this.showScheduleModal();\n    }\n\n    showScheduleModal() {\n        const modal = this.createModal(`\n            <div class=\"schedule-modal\">\n                <div class=\"modal-header\">\n                    <h3>Schedule a Call</h3>\n                    <p>Book a 15-minute call with our admissions team to discuss your goals and find the right program</p>\n                </div>\n                \n                <form class=\"schedule-form\" id=\"schedule-form\">\n                    <div class=\"form-group\">\n                        <label>Full Name *</label>\n                        <input type=\"text\" name=\"name\" required>\n                    </div>\n                    \n                    <div class=\"form-group\">\n                        <label>Email Address *</label>\n                        <input type=\"email\" name=\"email\" required>\n                    </div>\n                    \n                    <div class=\"form-group\">\n                        <label>Phone Number *</label>\n                        <input type=\"tel\" name=\"phone\" required>\n                    </div>\n                    \n                    <div class=\"form-group\">\n                        <label>Preferred Program</label>\n                        <select name=\"program\">\n                            <option value=\"\">Select a program</option>\n                            <option value=\"bootcamp\">Tech Bootcamps</option>\n                            <option value=\"mentorship\">Mentorship Program</option>\n                            <option value=\"innovation-hub\">Innovation Hub</option>\n                            <option value=\"general\">General Information</option>\n                        </select>\n                    </div>\n                    \n                    <div class=\"form-group\">\n                        <label>Preferred Time</label>\n                        <select name=\"timePreference\">\n                            <option value=\"\">Select preferred time</option>\n                            <option value=\"morning\">Morning (9AM - 12PM EAT)</option>\n                            <option value=\"afternoon\">Afternoon (12PM - 5PM EAT)</option>\n                            <option value=\"evening\">Evening (5PM - 8PM EAT)</option>\n                        </select>\n                    </div>\n                    \n                    <div class=\"form-group\">\n                        <label>Questions or Topics to Discuss</label>\n                        <textarea name=\"questions\" rows=\"3\" placeholder=\"What would you like to discuss during the call?\"></textarea>\n                    </div>\n                    \n                    <div class=\"form-actions\">\n                        <button type=\"button\" class=\"btn btn-secondary\" onclick=\"this.closest('.modal-overlay').remove()\">Cancel</button>\n                        <button type=\"submit\" class=\"btn btn-primary\">Schedule Call</button>\n                    </div>\n                </form>\n            </div>\n        `);\n        \n        modal.querySelector('#schedule-form').addEventListener('submit', (e) => {\n            e.preventDefault();\n            this.submitScheduleRequest(new FormData(e.target));\n            modal.remove();\n        });\n    }\n\n    async submitScheduleRequest(formData) {\n        try {\n            // Simulate API call\n            await new Promise(resolve => setTimeout(resolve, 1000));\n            \n            this.showToast('Call scheduled successfully! You will receive a calendar invitation within 24 hours.', 'success');\n            \n        } catch (error) {\n            console.error('Schedule error:', error);\n            this.showToast('Failed to schedule call. Please try again.', 'error');\n        }\n    }\n\n    getHelp() {\n        this.showContactModal('Help Center', 'Get help with programs, applications, or technical issues');\n    }\n\n    showContactModal(title, description) {\n        const modal = this.createModal(`\n            <div class=\"contact-modal\">\n                <div class=\"modal-header\">\n                    <h3>${title}</h3>\n                    <p>${description}</p>\n                </div>\n                \n                <form class=\"contact-form\" id=\"contact-form\">\n                    <div class=\"form-group\">\n                        <label>Your Name *</label>\n                        <input type=\"text\" name=\"name\" required>\n                    </div>\n                    \n                    <div class=\"form-group\">\n                        <label>Email Address *</label>\n                        <input type=\"email\" name=\"email\" required>\n                    </div>\n                    \n                    <div class=\"form-group\">\n                        <label>Subject *</label>\n                        <input type=\"text\" name=\"subject\" required>\n                    </div>\n                    \n                    <div class=\"form-group\">\n                        <label>Message *</label>\n                        <textarea name=\"message\" rows=\"5\" required placeholder=\"Please describe your question or issue in detail...\"></textarea>\n                    </div>\n                    \n                    <div class=\"form-actions\">\n                        <button type=\"button\" class=\"btn btn-secondary\" onclick=\"this.closest('.modal-overlay').remove()\">Cancel</button>\n                        <button type=\"submit\" class=\"btn btn-primary\">Send Message</button>\n                    </div>\n                </form>\n            </div>\n        `);\n        \n        modal.querySelector('#contact-form').addEventListener('submit', (e) => {\n            e.preventDefault();\n            this.submitContactForm(new FormData(e.target));\n            modal.remove();\n        });\n    }\n\n    async submitContactForm(formData) {\n        try {\n            // Simulate API call\n            await new Promise(resolve => setTimeout(resolve, 1000));\n            \n            this.showToast('Message sent successfully! We will respond within 24 hours.', 'success');\n            \n        } catch (error) {\n            console.error('Contact error:', error);\n            this.showToast('Failed to send message. Please try again.', 'error');\n        }\n    }\n\n    showInfoModal(title, content) {\n        const modal = this.createModal(`\n            <div class=\"info-modal\">\n                <div class=\"modal-header\">\n                    <h3>${title}</h3>\n                </div>\n                <div class=\"modal-content\">\n                    ${content}\n                </div>\n                <div class=\"modal-actions\">\n                    <button class=\"btn btn-primary\" onclick=\"this.closest('.modal-overlay').remove()\">Close</button>\n                </div>\n            </div>\n        `);\n    }\n\n    updateStats() {\n        // Update any dynamic stats on the page\n        const totalStudents = this.cohorts.reduce((sum, cohort) => sum + (cohort.spotsTotal - cohort.spotsAvailable), 0);\n        const totalGraduates = 450; // Mock data\n        const placementRate = 95; // Mock data\n        \n        // Update stats if elements exist\n        const statsElements = {\n            '.stat-number[data-stat=\"students\"]': totalStudents,\n            '.stat-number[data-stat=\"graduates\"]': totalGraduates,\n            '.stat-number[data-stat=\"placement\"]': placementRate + '%'\n        };\n        \n        Object.entries(statsElements).forEach(([selector, value]) => {\n            const element = document.querySelector(selector);\n            if (element) {\n                element.textContent = value;\n            }\n        });\n    }\n\n    createModal(content) {\n        const modal = document.createElement('div');\n        modal.className = 'modal-overlay';\n        modal.innerHTML = `\n            <div class=\"modal-container\">\n                <div class=\"modal-content\">\n                    ${content}\n                </div>\n            </div>\n        `;\n        \n        document.body.appendChild(modal);\n        document.body.style.overflow = 'hidden';\n        \n        // Close on backdrop click\n        modal.addEventListener('click', (e) => {\n            if (e.target === modal) {\n                modal.remove();\n                document.body.style.overflow = '';\n            }\n        });\n        \n        return modal;\n    }\n\n    showToast(message, type = 'info') {\n        const container = document.getElementById('toast-container') || this.createToastContainer();\n        \n        const toast = document.createElement('div');\n        toast.className = `toast ${type}`;\n        \n        const icons = {\n            success: 'fa-check-circle',\n            error: 'fa-exclamation-circle',\n            info: 'fa-info-circle'\n        };\n\n        toast.innerHTML = `\n            <i class=\"fas ${icons[type] || icons.info}\"></i>\n            <span>${message}</span>\n            <button class=\"toast-close\">&times;</button>\n        `;\n\n        container.appendChild(toast);\n\n        requestAnimationFrame(() => {\n            toast.classList.add('show');\n        });\n\n        const autoRemove = setTimeout(() => {\n            this.removeToast(toast);\n        }, 5000);\n\n        toast.querySelector('.toast-close').addEventListener('click', () => {\n            clearTimeout(autoRemove);\n            this.removeToast(toast);\n        });\n    }\n\n    createToastContainer() {\n        const container = document.createElement('div');\n        container.id = 'toast-container';\n        container.className = 'toast-container';\n        document.body.appendChild(container);\n        return container;\n    }\n\n    removeToast(toast) {\n        toast.classList.remove('show');\n        setTimeout(() => {\n            toast.remove();\n        }, 300);\n    }\n}\n\n// Initialize Programs App\ndocument.addEventListener('DOMContentLoaded', () => {\n    window.programsApp = new ProgramsApp();\n    console.log('🚀 Programs Platform - Application Initialized');\n});