// Authentication System
class AuthManager {
    constructor() {
        this.users = this.initializeUsers();
        this.currentUser = this.getCurrentUser();
    }

    initializeUsers() {
        const defaultUsers = [
            {
                id: 1,
                name: 'HR Manager',
                email: 'hr@company.com',
                password: this.hashPassword('password123'),
                role: 'hr'
            },
            {
                id: 2,
                name: 'John Doe',
                email: 'john@email.com',
                password: this.hashPassword('password123'),
                role: 'applicant'
            },
            {
                id: 3,
                name: 'Jane Smith',
                email: 'jane@email.com',
                password: this.hashPassword('password123'),
                role: 'applicant'
            }
        ];

        const stored = localStorage.getItem('users');
        return stored ? JSON.parse(stored) : defaultUsers;
    }

    hashPassword(password) {
        // Simple hash for demo - use bcrypt in production
        return btoa(password + 'salt');
    }

    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email);
        if (!user || !this.verifyPassword(password, user.password)) {
            throw new Error('Invalid email or password');
        }

        const session = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(session));
        this.currentUser = session;
        return session;
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        window.location.href = 'login.html';
    }

    getCurrentUser() {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    requireRole(role) {
        if (!this.requireAuth() || !this.hasRole(role)) {
            this.showUnauthorized();
            return false;
        }
        return true;
    }

    showUnauthorized() {
        alert('Access denied. You do not have permission to view this page.');
        window.location.href = 'index.html';
    }
}

// Application Data Manager
class ApplicationManager {
    constructor() {
        this.applications = this.initializeApplications();
    }

    initializeApplications() {
        const defaultApps = [
            {
                id: 1,
                applicantId: 2,
                applicantName: 'John Doe',
                email: 'john@email.com',
                resumeLink: 'https://example.com/resume1.pdf',
                applicationDate: '2025-01-15',
                jobTitle: 'Senior AI Engineer',
                status: 'pending'
            },
            {
                id: 2,
                applicantId: 3,
                applicantName: 'Jane Smith',
                email: 'jane@email.com',
                resumeLink: 'https://example.com/resume2.pdf',
                applicationDate: '2025-01-14',
                jobTitle: 'Blockchain Developer',
                status: 'pending'
            }
        ];

        const stored = localStorage.getItem('applications');
        return stored ? JSON.parse(stored) : defaultApps;
    }

    getApplicationsForUser(userId, role) {
        if (role === 'hr') {
            return this.applications;
        } else if (role === 'applicant') {
            return this.applications.filter(app => app.applicantId === userId);
        }
        return [];
    }

    addApplication(application) {
        application.id = Date.now();
        this.applications.push(application);
        localStorage.setItem('applications', JSON.stringify(this.applications));
    }
}

// Global instances
const authManager = new AuthManager();
const applicationManager = new ApplicationManager();

// Login handler
function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
        const user = authManager.login(email, password);
        showNotification('Login successful!', 'success');
        
        setTimeout(() => {
            window.location.href = 'view-applications.html';
        }, 1000);
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Logout handler
function logout() {
    authManager.logout();
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#FFD700'};
        color: ${type === 'error' ? '#fff' : type === 'success' ? '#fff' : '#000'};
        padding: 1rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => document.body.removeChild(notification), 3000);
}

// Export for use in other files
window.authManager = authManager;
window.applicationManager = applicationManager;