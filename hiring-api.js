// Hiring Platform API and Database Manager
class HiringAPI {
    constructor() {
        this.baseURL = 'https://api.innovatorsofhonour.com';
        this.jobs = JSON.parse(localStorage.getItem('hiring_jobs') || '[]');
        this.applications = JSON.parse(localStorage.getItem('hiring_applications') || '[]');
        this.users = JSON.parse(localStorage.getItem('hiring_users') || '[]');
        this.aiAgent = new AIHiringAgent();
    }

    // Job Management
    async postJob(jobData) {
        const job = {
            id: Date.now(),
            ...jobData,
            postedAt: new Date().toISOString(),
            applications: [],
            status: 'active',
            views: 0
        };
        
        this.jobs.push(job);
        this.saveToStorage();
        
        // AI processing for job optimization
        await this.aiAgent.optimizeJobPosting(job);
        
        return { success: true, jobId: job.id, job };
    }

    async getJobs(filters = {}) {
        let filteredJobs = this.jobs.filter(job => job.status === 'active');
        
        if (filters.category) {
            filteredJobs = filteredJobs.filter(job => 
                job.category.toLowerCase().includes(filters.category.toLowerCase())
            );
        }
        
        if (filters.location) {
            filteredJobs = filteredJobs.filter(job => 
                job.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }
        
        if (filters.salary) {
            filteredJobs = filteredJobs.filter(job => 
                parseInt(job.salary.replace(/\D/g, '')) >= parseInt(filters.salary)
            );
        }
        
        return filteredJobs.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    }

    async getJobById(jobId) {
        return this.jobs.find(job => job.id === parseInt(jobId));
    }

    // Application Management
    async submitApplication(applicationData) {
        const application = {
            id: Date.now(),
            ...applicationData,
            submittedAt: new Date().toISOString(),
            status: 'pending',
            aiScore: 0
        };
        
        this.applications.push(application);
        
        // Update job applications count
        const job = this.jobs.find(j => j.id === parseInt(applicationData.jobId));
        if (job) {
            job.applications.push(application.id);
        }
        
        this.saveToStorage();
        
        // AI processing for application matching
        const aiAnalysis = await this.aiAgent.analyzeApplication(application, job);
        application.aiScore = aiAnalysis.score;
        application.aiInsights = aiAnalysis.insights;
        
        // Send notifications
        await this.sendApplicationNotifications(application, job);
        
        return { success: true, applicationId: application.id, aiScore: aiAnalysis.score };
    }

    async getApplicationsForJob(jobId) {
        return this.applications.filter(app => app.jobId === parseInt(jobId));
    }

    async getApplicationsForUser(userEmail) {
        return this.applications.filter(app => app.email === userEmail);
    }

    // AI-powered matching and notifications
    async sendApplicationNotifications(application, job) {
        // Notify recruiter
        const recruiterEmail = {
            to: job.contactEmail,
            subject: `New Application: ${job.title}`,
            body: `
                New application received for ${job.title}
                
                Candidate: ${application.fullName}
                Email: ${application.email}
                Phone: ${application.phone}
                AI Match Score: ${application.aiScore}/100
                
                Key Insights: ${application.aiInsights}
                
                View full application: ${window.location.origin}/hiring.html?job=${job.id}&app=${application.id}
            `
        };
        
        // Notify candidate
        const candidateEmail = {
            to: application.email,
            subject: `Application Received: ${job.title}`,
            body: `
                Thank you for applying to ${job.title} at ${job.company}
                
                Your application has been received and is being reviewed.
                AI Match Score: ${application.aiScore}/100
                
                Next Steps: The hiring team will review your application and contact you within 3-5 business days.
                
                Contact: ${job.contactEmail} | ${job.contactPhone}
            `
        };
        
        await this.sendEmail(recruiterEmail);
        await this.sendEmail(candidateEmail);
    }

    async sendEmail(emailData) {
        // Simulate email sending - integrate with actual email service
        console.log('Sending email:', emailData);
        return { success: true };
    }

    // Follow-up and connection management
    async getConnectionRecommendations(userEmail, userType = 'candidate') {
        const connections = [];
        
        if (userType === 'candidate') {
            // Find relevant recruiters
            const userApps = this.applications.filter(app => app.email === userEmail);
            for (const app of userApps) {
                const job = this.jobs.find(j => j.id === parseInt(app.jobId));
                if (job && app.aiScore > 70) {
                    connections.push({
                        type: 'recruiter',
                        name: job.contactPerson,
                        email: job.contactEmail,
                        phone: job.contactPhone,
                        company: job.company,
                        position: job.title,
                        matchScore: app.aiScore,
                        reason: 'High compatibility match'
                    });
                }
            }
        } else {
            // Find relevant candidates
            const recruiterJobs = this.jobs.filter(job => job.contactEmail === userEmail);
            for (const job of recruiterJobs) {
                const jobApps = this.applications.filter(app => app.jobId === job.id);
                for (const app of jobApps) {
                    if (app.aiScore > 70) {
                        connections.push({
                            type: 'candidate',
                            name: app.fullName,
                            email: app.email,
                            phone: app.phone,
                            position: job.title,
                            matchScore: app.aiScore,
                            reason: 'Top candidate match'
                        });
                    }
                }
            }
        }
        
        return connections.sort((a, b) => b.matchScore - a.matchScore);
    }

    saveToStorage() {
        localStorage.setItem('hiring_jobs', JSON.stringify(this.jobs));
        localStorage.setItem('hiring_applications', JSON.stringify(this.applications));
        localStorage.setItem('hiring_users', JSON.stringify(this.users));
    }
}

// AI Hiring Agent for automation
class AIHiringAgent {
    constructor() {
        this.apiKey = 'demo_openai_key';
    }

    async optimizeJobPosting(job) {
        // Simulate AI optimization
        const optimizations = {
            suggestedKeywords: ['innovative', 'collaborative', 'growth-oriented'],
            salaryBenchmark: this.getSalaryBenchmark(job.category),
            improvementTips: [
                'Add specific technical requirements',
                'Include company culture highlights',
                'Mention growth opportunities'
            ]
        };
        
        job.aiOptimizations = optimizations;
        return optimizations;
    }

    async analyzeApplication(application, job) {
        // Simulate AI analysis
        let score = Math.floor(Math.random() * 40) + 60; // 60-100 range
        
        const insights = [
            'Strong technical background',
            'Good cultural fit indicators',
            'Relevant experience in similar roles'
        ];
        
        // Boost score based on keywords
        const keywords = ['innovation', 'leadership', 'blockchain', 'ai', 'startup'];
        const coverLetterLower = application.coverLetter.toLowerCase();
        
        keywords.forEach(keyword => {
            if (coverLetterLower.includes(keyword)) {
                score += 2;
            }
        });
        
        return {
            score: Math.min(score, 100),
            insights: insights.join(', ')
        };
    }

    getSalaryBenchmark(category) {
        const benchmarks = {
            'Software Development': '$80,000 - $150,000',
            'Data Science': '$90,000 - $160,000',
            'Product Management': '$100,000 - $180,000',
            'Marketing': '$60,000 - $120,000',
            'Sales': '$70,000 - $140,000'
        };
        
        return benchmarks[category] || '$60,000 - $120,000';
    }
}

// Data Visualization Manager
class HiringDataViz {
    constructor(api) {
        this.api = api;
    }

    async generateJobStats() {
        const jobs = await this.api.getJobs();
        const applications = this.api.applications;
        
        return {
            totalJobs: jobs.length,
            totalApplications: applications.length,
            avgApplicationsPerJob: applications.length / Math.max(jobs.length, 1),
            topCategories: this.getTopCategories(jobs),
            applicationTrends: this.getApplicationTrends(applications)
        };
    }

    getTopCategories(jobs) {
        const categories = {};
        jobs.forEach(job => {
            categories[job.category] = (categories[job.category] || 0) + 1;
        });
        
        return Object.entries(categories)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([category, count]) => ({ category, count }));
    }

    getApplicationTrends(applications) {
        const trends = {};
        applications.forEach(app => {
            const date = new Date(app.submittedAt).toDateString();
            trends[date] = (trends[date] || 0) + 1;
        });
        
        return Object.entries(trends)
            .sort(([a], [b]) => new Date(a) - new Date(b))
            .slice(-7); // Last 7 days
    }
}

// Initialize global instances
const hiringAPI = new HiringAPI();
const hiringDataViz = new HiringDataViz(hiringAPI);

window.HiringAPI = HiringAPI;
window.hiringAPI = hiringAPI;
window.hiringDataViz = hiringDataViz;