// Psychological Enhancement JavaScript for Solutions Marketplace

// Psychological state management
let userSession = {
    viewedSolutions: [],
    explorerBadgeProgress: 0,
    isReturningUser: localStorage.getItem('innovator_return') === 'true',
    walletConnected: false,
    lastActivity: Date.now(),
    scrollEngagementTriggered: false
};

// Initialize psychological elements
function initializePsychologicalElements() {
    // Welcome returning users
    if (userSession.isReturningUser) {
        showWelcomeBackMessage();
    } else {
        localStorage.setItem('innovator_return', 'true');
        showFirstTimeWelcome();
    }
    
    // Set up exit intent detection
    setupExitIntentDetection();
    
    // Initialize progress tracking
    updateExplorerProgress();
    
    // Start psychological triggers
    startLiveActivitySimulation();
    startViewerCountUpdates();
    setupScrollTriggers();
    initializeGamification();
}

// Live activity simulation for social proof
function startLiveActivitySimulation() {
    const activities = [
        'Dr. Amina just minted MediAI Platform',
        'EcoTech earned 0.3 ETH from GreenChain',
        'Student from Lagos purchased EduConnect',
        'Farmer in Kenya saved $500 with AgriBot',
        'Startup raised $50K using PitchDeck AI'
    ];
    
    let activityIndex = 0;
    setInterval(() => {
        const activityItems = document.querySelectorAll('.activity-item span');
        if (activityItems.length > 0) {
            activityItems[activityIndex % activityItems.length].textContent = 
                activities[Math.floor(Math.random() * activities.length)];
            activityIndex++;
        }
    }, 8000);
}

// Dynamic viewer count for social proof
function startViewerCountUpdates() {
    const viewerElement = document.getElementById('live-viewers');
    if (viewerElement) {
        setInterval(() => {
            const count = Math.floor(Math.random() * 8) + 8; // 8-15 viewers
            viewerElement.textContent = `${count} people viewing now`;
        }, 15000);
    }
}

// Scroll-based psychological triggers
function setupScrollTriggers() {
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        
        // Mid-scroll engagement trigger
        if (scrollPercent > 30 && !userSession.scrollEngagementTriggered && !userSession.walletConnected) {
            userSession.scrollEngagementTriggered = true;
            showMidScrollEngagement();
        }
        
        // Update explorer progress
        updateExplorerProgress();
    });
}

// Gamification system
function initializeGamification() {
    const progress = localStorage.getItem('explorer_progress') || 0;
    userSession.explorerBadgeProgress = parseInt(progress);
    updateExplorerBadge();
}

// Welcome messages
function showWelcomeBackMessage() {
    const walletShort = localStorage.getItem('wallet_short') || 'Innovator';
    setTimeout(() => {
        showToast(`Welcome back, ${walletShort}! Your portfolio is growing 📈`, 'success');
    }, 1000);
}

function showFirstTimeWelcome() {
    setTimeout(() => {
        showToast('💡 New here? Connect wallet for personalized recommendations!', 'info');
    }, 3000);
}

// Mid-scroll engagement
function showMidScrollEngagement() {
    showToast('🔥 Loving these solutions? Connect wallet for exclusive access!', 'primary');
}

// Explorer progress tracking
function updateExplorerProgress() {
    const viewedCount = userSession.viewedSolutions.length;
    
    if (viewedCount >= 3 && viewedCount < 5) {
        showToast(`🎯 Explorer Progress: ${viewedCount}/5 solutions viewed!`, 'info');
    } else if (viewedCount >= 5) {
        unlockExplorerBadge();
    }
}

function unlockExplorerBadge() {
    if (userSession.explorerBadgeProgress < 5) {
        userSession.explorerBadgeProgress = 5;
        localStorage.setItem('explorer_progress', '5');
        showConfetti();
        showToast('🏆 Explorer Badge Unlocked! You\'re a true innovator!', 'success');
    }
}

function updateExplorerBadge() {
    const badge = document.getElementById('explorer-badge');
    if (badge && userSession.explorerBadgeProgress >= 5) {
        badge.style.display = 'block';
    }
}

// Exit intent detection
function setupExitIntentDetection() {
    let hasShownExitIntent = false;
    
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !hasShownExitIntent && !userSession.walletConnected) {
            hasShownExitIntent = true;
            showExitIntentModal();
        }
    });
}

function showExitIntentModal() {
    const modal = document.createElement('div');
    modal.className = 'exit-intent-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Wait! Don't miss out! 🚀</h3>
            <p>Join 500+ innovators who've transformed ideas into blockchain assets</p>
            <div class="exit-benefits">
                <div class="benefit">✅ Free wallet setup guide</div>
                <div class="benefit">✅ Personalized solution recommendations</div>
                <div class="benefit">✅ Early access to new innovations</div>
            </div>
            <button class="btn btn-primary" onclick="connectWalletFromModal()">Connect Wallet - It's Free!</button>
            <button class="btn btn-outline" onclick="closeExitModal()">Maybe Later</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    setTimeout(() => modal.classList.add('show'), 100);
    
    // Auto-close after 10 seconds
    setTimeout(() => {
        if (document.body.contains(modal)) {
            closeExitModal();
        }
    }, 10000);
}

function closeExitModal() {
    const modal = document.querySelector('.exit-intent-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

function connectWalletFromModal() {
    closeExitModal();
    document.getElementById('connect-wallet').click();
}

// Toast notification system
function showToast(message, type = 'info') {
    // Limit to 3 toasts max
    const existingToasts = document.querySelectorAll('.toast');
    if (existingToasts.length >= 3) {
        existingToasts[0].remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(toast)) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// Confetti animation for achievements
function showConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-container';
    confetti.innerHTML = '🎉'.repeat(20);
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 3000);
}

// Enhanced filter functions with psychology
function applyPopularFilter(category) {
    // Update visual state
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Apply filter
    document.getElementById('category-filter').value = category;
    filterSolutions();
    
    // Psychological feedback
    showToast(`🎯 Showing ${category} solutions - great choice!`, 'primary');
    
    // Track engagement
    userSession.lastActivity = Date.now();
}

function clearAllFilters() {
    document.getElementById('category-filter').value = 'all';
    document.getElementById('stage-filter').value = 'all';
    document.getElementById('price-filter').value = 'all';
    document.getElementById('solution-search').value = '';
    
    filterSolutions();
    
    document.getElementById('active-filters').style.display = 'none';
    showToast('🔄 Filters cleared - showing all solutions', 'info');
}

// Enhanced solution viewing with psychology
function trackSolutionView(solutionId, title) {
    if (!userSession.viewedSolutions.includes(solutionId)) {
        userSession.viewedSolutions.push(solutionId);
        
        // Update explorer progress
        const viewedCount = userSession.viewedSolutions.length;
        
        if (viewedCount === 1) {
            showToast('🎯 Great start! View 4 more for Explorer Badge', 'info');
        } else if (viewedCount === 3) {
            showToast('🔥 Almost there! 2 more for Explorer Badge', 'primary');
        } else if (viewedCount === 5) {
            unlockExplorerBadge();
        }
        
        // Show personalized recommendations after 3 views
        if (viewedCount === 3 && !userSession.walletConnected) {
            setTimeout(() => {
                showToast('💡 Connect wallet for AI-powered recommendations based on your interests!', 'primary');
            }, 2000);
        }
    }
}

// Enhanced purchase flow with psychology
function enhancedPurchaseFlow(tokenId, price, title) {
    // Pre-purchase confidence building
    if (!userSession.walletConnected) {
        showToast('🔒 Connect wallet first to secure your purchase', 'info');
        return;
    }
    
    // Show purchase preview
    showPurchasePreview(tokenId, price, title);
}

function showPurchasePreview(tokenId, price, title) {
    const modal = document.createElement('div');
    modal.className = 'purchase-preview-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>🛡️ Secure Purchase Preview</h3>
            <div class="purchase-details">
                <div class="detail-row">
                    <span>Solution:</span>
                    <span>${title}</span>
                </div>
                <div class="detail-row">
                    <span>Price:</span>
                    <span>${price} ETH</span>
                </div>
                <div class="detail-row">
                    <span>Platform Fee:</span>
                    <span>${(price * 0.025).toFixed(4)} ETH (2.5%)</span>
                </div>
                <div class="detail-row total">
                    <span>Total:</span>
                    <span>${price} ETH</span>
                </div>
            </div>
            <div class="purchase-benefits">
                <div class="benefit">✅ Instant ownership transfer</div>
                <div class="benefit">✅ Blockchain-verified authenticity</div>
                <div class="benefit">✅ Creator royalties support innovation</div>
            </div>
            <div class="purchase-actions">
                <button class="btn btn-primary" onclick="confirmPurchase(${tokenId}, ${price})">
                    🚀 Confirm Purchase
                </button>
                <button class="btn btn-outline" onclick="closePurchasePreview()">
                    Review More
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
}

function confirmPurchase(tokenId, price) {
    closePurchasePreview();
    
    // Show processing state
    showToast('⏳ Processing your purchase...', 'info');
    
    // Call original purchase function
    if (typeof purchaseNFT === 'function') {
        purchaseNFT(tokenId, price);
    } else if (typeof purchaseSolution === 'function') {
        purchaseSolution(tokenId, price);
    }
}

function closePurchasePreview() {
    const modal = document.querySelector('.purchase-preview-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// MetaMask installation prompt with psychology
function showMetaMaskInstallPrompt() {
    const modal = document.createElement('div');
    modal.className = 'metamask-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>🦊 MetaMask Required</h3>
            <p>To join the Honour Circle and start trading solutions, you'll need MetaMask wallet.</p>
            <div class="metamask-benefits">
                <div class="benefit">🔒 Secure blockchain transactions</div>
                <div class="benefit">💰 Direct ETH payments</div>
                <div class="benefit">🎯 Personalized experience</div>
                <div class="benefit">🎁 Free setup guide included</div>
            </div>
            <div class="modal-actions">
                <a href="https://metamask.io/download/" target="_blank" class="btn btn-primary">
                    Install MetaMask (Free)
                </a>
                <button class="btn btn-outline" onclick="this.parentElement.parentElement.parentElement.remove()">
                    Maybe Later
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
}

// Results count update with psychology
function updateResultsCount() {
    const visibleCards = document.querySelectorAll('.solution-card:not([style*="display: none"])').length;
    const countElement = document.getElementById('results-count');
    
    if (countElement) {
        if (visibleCards === 0) {
            countElement.textContent = 'No solutions found - try different filters';
            countElement.style.color = '#ef4444';
        } else {
            countElement.textContent = `Showing ${visibleCards} solution${visibleCards !== 1 ? 's' : ''}`;
            countElement.style.color = '#FFD700';
        }
    }
}

// Enhanced search with psychology
function enhancedSearch() {
    const query = document.getElementById('solution-search').value.toLowerCase();
    
    if (query.length > 0) {
        showToast(`🔍 Searching for "${query}"...`, 'info');
    }
    
    // Call original search function
    if (typeof searchSolutions === 'function') {
        searchSolutions();
    }
    
    // Update results count
    setTimeout(updateResultsCount, 100);
}

// Initialize psychology when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializePsychologicalElements();
    
    // Override search function
    const searchInput = document.getElementById('solution-search');
    if (searchInput) {
        searchInput.oninput = enhancedSearch;
    }
    
    // Add click tracking to solution cards
    document.addEventListener('click', (e) => {
        const solutionCard = e.target.closest('.solution-card');
        if (solutionCard) {
            const title = solutionCard.querySelector('h3')?.textContent;
            const tokenId = Math.random(); // Replace with actual token ID
            trackSolutionView(tokenId, title);
        }
    });
});

// Export functions for global use
window.psychologyEnhancements = {
    showToast,
    showConfetti,
    trackSolutionView,
    enhancedPurchaseFlow,
    applyPopularFilter,
    clearAllFilters,
    updateResultsCount
};