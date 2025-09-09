// Smart Logic Engine - MeTTa-inspired logical automation for all platform pages
class SmartLogicEngine {
    constructor() {
        this.rules = new Map();
        this.facts = new Map();
        this.inferences = new Map();
        this.init();
    }

    init() {
        this.setupLogicalRules();
        this.setupFactBase();
        this.startInferenceEngine();
    }

    // Logical Rules Setup (MeTTa reduction rules)
    setupLogicalRules() {
        // Solutions Marketplace Logic
        this.addRule('solution-purchase-logic', (solution, user) => {
            if (!user.walletConnected) return { action: 'connect-wallet', priority: 'high' };
            if (parseFloat(user.balance) < parseFloat(solution.price)) return { action: 'insufficient-funds', priority: 'high' };
            if (solution.isOwned) return { action: 'already-owned', priority: 'medium' };
            return { action: 'proceed-purchase', priority: 'high' };
        });

        // Hiring Platform Logic
        this.addRule('job-application-logic', (job, candidate) => {
            const matchScore = this.calculateJobMatch(job, candidate);
            if (matchScore < 30) return { action: 'suggest-skill-improvement', priority: 'medium' };
            if (matchScore < 60) return { action: 'partial-match-warning', priority: 'low' };
            if (candidate.hasApplied) return { action: 'already-applied', priority: 'medium' };
            return { action: 'proceed-application', priority: 'high', matchScore };
        });

        // Learning Platform Logic
        this.addRule('course-recommendation-logic', (userProfile, courses) => {
            const recommendations = courses.filter(course => {
                const skillGap = this.analyzeSkillGap(userProfile.skills, course.skills);
                const difficultyMatch = this.matchDifficulty(userProfile.level, course.difficulty);
                return skillGap > 0.3 && difficultyMatch > 0.7;
            });
            return { action: 'show-recommendations', courses: recommendations, priority: 'medium' };
        });

        // Community Engagement Logic
        this.addRule('engagement-optimization', (userActivity, communityEvents) => {
            const engagementScore = this.calculateEngagementScore(userActivity);
            if (engagementScore < 0.3) return { action: 'boost-engagement', suggestions: this.getEngagementSuggestions() };
            if (engagementScore > 0.8) return { action: 'leadership-opportunity', priority: 'high' };
            return { action: 'maintain-engagement', priority: 'low' };
        });

        // Investment Platform Logic
        this.addRule('investor-matching-logic', (startup, investors) => {
            const matches = investors.filter(investor => {
                const sectorMatch = investor.sectors.includes(startup.sector);
                const stageMatch = investor.stages.includes(startup.stage);
                const locationMatch = this.checkLocationCompatibility(investor.location, startup.location);
                return sectorMatch && stageMatch && locationMatch;
            });
            return { action: 'show-matches', matches, priority: 'high' };
        });

        // Smart Navigation Logic
        this.addRule('navigation-optimization', (currentPage, userGoals) => {
            const nextBestAction = this.inferNextBestAction(currentPage, userGoals);
            return { action: 'suggest-navigation', suggestion: nextBestAction, priority: 'low' };
        });
    }

    // Fact Base Setup
    setupFactBase() {
        this.facts.set('user-preferences', {
            categories: ['Blockchain', 'AI', 'Sustainability'],
            priceRange: [0, 1],
            experienceLevel: 'intermediate'
        });

        this.facts.set('platform-state', {
            activeUsers: 0,
            totalJobs: 0,
            totalSolutions: 0,
            systemHealth: 'good'
        });

        this.facts.set('market-conditions', {
            demandCategories: ['AI', 'Blockchain', 'Sustainability'],
            averagePrices: { 'AI': 0.6, 'Blockchain': 0.8, 'Sustainability': 0.4 },
            trendingSkills: ['Machine Learning', 'Smart Contracts', 'Carbon Credits']
        });
    }

    // Inference Engine
    startInferenceEngine() {
        setInterval(() => {
            this.runInferenceRound();
        }, 5000); // Run every 5 seconds
    }

    runInferenceRound() {
        const currentContext = this.getCurrentContext();
        
        // Apply logical rules to current context
        this.rules.forEach((rule, ruleName) => {
            try {
                const result = rule(currentContext);
                if (result && result.action) {
                    this.executeLogicalAction(result);
                }
            } catch (error) {
                console.warn(`Rule ${ruleName} failed:`, error);
            }
        });
    }

    getCurrentContext() {
        return {
            page: window.location.pathname,
            user: JSON.parse(localStorage.getItem('currentUser') || '{}'),
            timestamp: new Date(),
            platformState: this.facts.get('platform-state'),
            userActivity: this.getUserActivity()
        };
    }

    // Smart Logic Functions
    calculateJobMatch(job, candidate) {
        if (!job.requirements || !candidate.skills) return 0;
        
        const jobSkills = job.requirements.toLowerCase().split(',').map(s => s.trim());
        const candidateSkills = candidate.skills.toLowerCase().split(',').map(s => s.trim());
        
        const matches = jobSkills.filter(skill => 
            candidateSkills.some(cSkill => cSkill.includes(skill) || skill.includes(cSkill))
        );
        
        return (matches.length / jobSkills.length) * 100;
    }

    analyzeSkillGap(userSkills, courseSkills) {
        if (!userSkills || !courseSkills) return 0;
        
        const userSet = new Set(userSkills.map(s => s.toLowerCase()));
        const courseSet = new Set(courseSkills.map(s => s.toLowerCase()));
        
        const gap = [...courseSet].filter(skill => !userSet.has(skill));
        return gap.length / courseSet.size;
    }

    matchDifficulty(userLevel, courseLevel) {
        const levels = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 };
        const userLevelNum = levels[userLevel] || 1;
        const courseLevelNum = levels[courseLevel] || 1;
        
        const diff = Math.abs(userLevelNum - courseLevelNum);
        return Math.max(0, 1 - (diff / 3));
    }

    calculateEngagementScore(userActivity) {
        if (!userActivity) return 0;
        
        const weights = {
            pageViews: 0.2,
            timeSpent: 0.3,
            interactions: 0.3,
            contributions: 0.2
        };
        
        let score = 0;
        Object.entries(weights).forEach(([metric, weight]) => {
            const value = userActivity[metric] || 0;
            const normalizedValue = Math.min(value / 100, 1); // Normalize to 0-1
            score += normalizedValue * weight;
        });
        
        return score;
    }

    checkLocationCompatibility(investorLocation, startupLocation) {
        if (!investorLocation || !startupLocation) return false;
        
        // Simple location matching - can be enhanced with geo-data
        const investorRegions = investorLocation.toLowerCase().split(',');
        const startupRegions = startupLocation.toLowerCase().split(',');
        
        return investorRegions.some(region => 
            startupRegions.some(sRegion => sRegion.includes(region.trim()))
        );
    }

    inferNextBestAction(currentPage, userGoals) {
        const actionMap = {
            '/': { goal: 'explore', suggestion: 'solutions.html' },
            '/solutions.html': { goal: 'learn', suggestion: 'programs.html' },
            '/hiring.html': { goal: 'network', suggestion: 'community.html' },
            '/programs.html': { goal: 'apply', suggestion: 'hiring.html' },
            '/community.html': { goal: 'invest', suggestion: 'investors.html' },
            '/investors.html': { goal: 'create', suggestion: 'solutions.html' }
        };
        
        return actionMap[currentPage] || { goal: 'explore', suggestion: '/' };
    }

    getEngagementSuggestions() {
        return [
            'Join our WhatsApp community for daily updates',
            'Participate in upcoming webinars',
            'Share your project in the community showcase',
            'Connect with other innovators in your field',
            'Contribute to open discussions'
        ];
    }

    getUserActivity() {
        const activity = JSON.parse(localStorage.getItem('userActivity') || '{}');
        return {
            pageViews: activity.pageViews || 0,
            timeSpent: activity.timeSpent || 0,
            interactions: activity.interactions || 0,
            contributions: activity.contributions || 0
        };
    }

    // Action Execution
    executeLogicalAction(result) {
        switch (result.action) {
            case 'connect-wallet':
                this.promptWalletConnection();
                break;
            case 'insufficient-funds':
                this.showInsufficientFundsWarning();
                break;
            case 'suggest-skill-improvement':
                this.suggestSkillImprovement(result.matchScore);
                break;
            case 'show-recommendations':
                this.displayRecommendations(result.courses);
                break;
            case 'boost-engagement':
                this.showEngagementBooster(result.suggestions);
                break;
            case 'show-matches':
                this.displayInvestorMatches(result.matches);
                break;
            case 'suggest-navigation':
                this.showNavigationSuggestion(result.suggestion);
                break;
        }
    }

    promptWalletConnection() {
        if (window.mettaAutomation) {
            window.mettaAutomation.smartNotify(
                'Connect your wallet to purchase solutions',
                'info',
                { critical: true }
            );
        }
    }

    showInsufficientFundsWarning() {
        if (window.mettaAutomation) {
            window.mettaAutomation.smartNotify(
                'Insufficient funds. Please add ETH to your wallet',
                'warning',
                { critical: true }
            );
        }
    }

    suggestSkillImprovement(matchScore) {
        const message = `Job match: ${matchScore}%. Consider improving your skills in the required areas.`;
        if (window.mettaAutomation) {
            window.mettaAutomation.smartNotify(message, 'info', { helpful: true });
        }
    }

    displayRecommendations(courses) {
        if (courses && courses.length > 0) {
            const message = `${courses.length} courses recommended based on your profile`;
            if (window.mettaAutomation) {
                window.mettaAutomation.smartNotify(message, 'success', { helpful: true });
            }
        }
    }

    showEngagementBooster(suggestions) {
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        if (window.mettaAutomation) {
            window.mettaAutomation.queueNotification(
                `Boost your engagement: ${randomSuggestion}`,
                'info',
                { helpful: true }
            );
        }
    }

    displayInvestorMatches(matches) {
        if (matches && matches.length > 0) {
            const message = `${matches.length} potential investors match your startup profile`;
            if (window.mettaAutomation) {
                window.mettaAutomation.queueNotification(message, 'success', { critical: true });
            }
        }
    }

    showNavigationSuggestion(suggestion) {
        const message = `Consider exploring: ${suggestion.suggestion} to ${suggestion.goal}`;
        if (window.mettaAutomation) {
            window.mettaAutomation.queueNotification(message, 'info', { helpful: true });
        }
    }

    // Utility Functions
    addRule(name, rule) {
        this.rules.set(name, rule);
    }

    addFact(key, value) {
        this.facts.set(key, value);
    }

    updateFact(key, updates) {
        const current = this.facts.get(key) || {};
        this.facts.set(key, { ...current, ...updates });
    }

    query(pattern) {
        // Simple pattern matching for facts
        const results = [];
        this.facts.forEach((value, key) => {
            if (key.includes(pattern) || JSON.stringify(value).includes(pattern)) {
                results.push({ key, value });
            }
        });
        return results;
    }

    // Page-specific logic initialization
    initializePageLogic(pageName) {
        switch (pageName) {
            case 'solutions':
                this.initializeSolutionsLogic();
                break;
            case 'hiring':
                this.initializeHiringLogic();
                break;
            case 'programs':
                this.initializeProgramsLogic();
                break;
            case 'community':
                this.initializeCommunityLogic();
                break;
            case 'investors':
                this.initializeInvestorsLogic();
                break;
        }
    }

    initializeSolutionsLogic() {
        // Auto-filter solutions based on user preferences
        const userPrefs = this.facts.get('user-preferences');
        if (userPrefs && window.solutionsApp) {
            setTimeout(() => {
                window.solutionsApp.filterByCategory(userPrefs.categories[0]);
            }, 1000);
        }
    }

    initializeHiringLogic() {
        // Auto-suggest jobs based on user profile
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (user.skills && window.hiringApp) {
            setTimeout(() => {
                window.hiringApp.filterJobs(user.skills.split(',')[0]);
            }, 1000);
        }
    }

    initializeProgramsLogic() {
        // Recommend programs based on skill gaps
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (user.experienceLevel) {
            this.suggestProgramsForLevel(user.experienceLevel);
        }
    }

    initializeCommunityLogic() {
        // Suggest community activities based on engagement
        const activity = this.getUserActivity();
        const engagementScore = this.calculateEngagementScore(activity);
        
        if (engagementScore < 0.5) {
            setTimeout(() => {
                this.showEngagementBooster(this.getEngagementSuggestions());
            }, 2000);
        }
    }

    initializeInvestorsLogic() {
        // Auto-match startups with investors
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (user.type === 'startup' && user.sector) {
            this.findInvestorMatches(user);
        }
    }

    suggestProgramsForLevel(level) {
        const suggestions = {
            'beginner': 'Start with our Fundamentals bootcamp',
            'intermediate': 'Consider our Advanced Skills program',
            'advanced': 'Join our Leadership Development track',
            'expert': 'Become a mentor in our community'
        };
        
        const message = suggestions[level] || suggestions['beginner'];
        if (window.mettaAutomation) {
            window.mettaAutomation.smartNotify(message, 'info', { helpful: true });
        }
    }

    findInvestorMatches(startup) {
        // Simulate investor matching
        const mockMatches = [
            { name: 'TechVentures', focus: startup.sector, stage: startup.stage },
            { name: 'Innovation Capital', focus: startup.sector, stage: startup.stage }
        ];
        
        this.displayInvestorMatches(mockMatches);
    }
}

// Initialize Smart Logic Engine
const smartLogic = new SmartLogicEngine();

// Auto-initialize based on current page
document.addEventListener('DOMContentLoaded', () => {
    const pageName = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    smartLogic.initializePageLogic(pageName);
    
    // Track user activity for logic engine
    let interactions = 0;
    let startTime = Date.now();
    
    document.addEventListener('click', () => {
        interactions++;
        const activity = smartLogic.getUserActivity();
        activity.interactions = interactions;
        localStorage.setItem('userActivity', JSON.stringify(activity));
    });
    
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        const activity = smartLogic.getUserActivity();
        activity.timeSpent += timeSpent;
        activity.pageViews = (activity.pageViews || 0) + 1;
        localStorage.setItem('userActivity', JSON.stringify(activity));
    });
});

// Export for global use
window.SmartLogicEngine = SmartLogicEngine;
window.smartLogic = smartLogic;