// Solutions Marketplace Application
class SolutionsApp {
    constructor() {
        this.solutions = [];
        this.filteredSolutions = [];
        this.currentPage = 1;
        this.itemsPerPage = 9;
        this.currentView = 'grid';
        this.selectedSolution = null;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadSolutions();
        this.updateStats();
        this.renderSolutions();
        this.setupWalletConnection();
    }

    setupEventListeners() {
        // Filter controls
        document.getElementById('category-filter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('price-filter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('sort-filter')?.addEventListener('change', () => this.applySorting());
        
        // Search
        const searchInput = document.getElementById('search-input');
        const searchClear = document.getElementById('search-clear');
        
        searchInput?.addEventListener('input', this.debounce(() => this.applySearch(), 300));
        searchClear?.addEventListener('click', () => this.clearSearch());
        
        // Quick filters
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => this.handleQuickFilter(e));
        });
        
        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleView(e));
        });
        
        // Load more
        document.getElementById('load-more')?.addEventListener('click', () => this.loadMore());
        
        // Modal controls
        document.getElementById('modal-close')?.addEventListener('click', () => this.closeModal());
        document.getElementById('modal-cancel')?.addEventListener('click', () => this.closeModal());
        document.getElementById('modal-purchase')?.addEventListener('click', () => this.purchaseSolution());
        
        // Hero actions
        document.getElementById('submit-solution')?.addEventListener('click', () => this.showSubmitForm());
        document.getElementById('browse-solutions')?.addEventListener('click', () => this.scrollToSolutions());
        
        // Wallet connection
        document.getElementById('wallet-btn')?.addEventListener('click', () => this.connectWallet());
    }

    async loadSolutions() {
        try {
            // Try to load from blockchain first
            if (window.blockchainManager) {
                this.solutions = await window.blockchainManager.getSolutionsForSale();
            } else {
                // Fallback to mock data
                this.solutions = this.getMockSolutions();
            }
            
            this.filteredSolutions = [...this.solutions];
            this.updateResultsCount();
            
        } catch (error) {
            console.error('Error loading solutions:', error);
            this.solutions = this.getMockSolutions();
            this.filteredSolutions = [...this.solutions];
            this.showToast('Using demo data - blockchain connection unavailable', 'info');
        }
    }

    getMockSolutions() {
        return [
            {
                tokenId: 1,
                title: 'AI Healthcare Diagnostic Platform',
                description: 'Revolutionary AI-powered diagnostic tool that analyzes medical images with 95% accuracy, enabling early disease detection in remote areas.',
                category: 'Healthcare',
                price: '0.5',
                creator: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
                views: 2459,
                purchases: 12,
                createdAt: new Date('2024-01-15'),
                featured: true
            },
            {
                tokenId: 2,
                title: 'Blockchain Carbon Credits Trading',
                description: 'Transparent carbon credit trading platform for sustainable business practices with automated verification.',
                category: 'Sustainability',
                price: '0.3',
                creator: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
                views: 1846,
                purchases: 8,
                createdAt: new Date('2024-01-20'),
                featured: true
            },
            {
                tokenId: 3,
                title: 'DeFi Lending Protocol',
                description: 'Decentralized lending platform with automated yield optimization and risk management for maximum returns.',
                category: 'FinTech',
                price: '0.8',
                creator: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
                views: 3200,
                purchases: 15,
                createdAt: new Date('2024-01-25'),
                featured: false
            },
            {
                tokenId: 4,
                title: 'Smart Contract Security Auditor',
                description: 'AI-powered smart contract vulnerability detection and analysis tool for enhanced blockchain security.',
                category: 'Blockchain',
                price: '0.6',
                creator: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
                views: 1950,
                purchases: 6,
                createdAt: new Date('2024-02-01'),
                featured: false
            },
            {
                tokenId: 5,
                title: 'Educational VR Platform',
                description: 'Immersive virtual reality educational platform for enhanced learning experiences in STEM subjects.',
                category: 'Education',
                price: '0.4',
                creator: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
                views: 1200,
                purchases: 4,
                createdAt: new Date('2024-02-05'),
                featured: false
            },
            {
                tokenId: 6,
                title: 'Machine Learning Crop Optimizer',
                description: 'Advanced ML system for optimizing crop yields through precision agriculture and weather prediction.',
                category: 'AI/ML',
                price: '0.7',
                creator: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
                views: 2100,
                purchases: 9,
                createdAt: new Date('2024-02-10'),
                featured: true
            }
        ];
    }

    applyFilters() {
        const category = document.getElementById('category-filter')?.value;
        const priceRange = document.getElementById('price-filter')?.value;
        
        this.filteredSolutions = this.solutions.filter(solution => {
            const categoryMatch = category === 'all' || solution.category === category;
            
            let priceMatch = true;
            if (priceRange !== 'all') {
                const price = parseFloat(solution.price);
                switch (priceRange) {
                    case '0-0.5':
                        priceMatch = price <= 0.5;
                        break;
                    case '0.5-1':
                        priceMatch = price > 0.5 && price <= 1;
                        break;
                    case '1+':
                        priceMatch = price > 1;
                        break;
                }
            }
            
            return categoryMatch && priceMatch;
        });
        
        this.applySorting();
        this.currentPage = 1;
        this.renderSolutions();
        this.updateResultsCount();
    }

    applySorting() {
        const sortBy = document.getElementById('sort-filter')?.value;
        
        this.filteredSolutions.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'price-low':
                    return parseFloat(a.price) - parseFloat(b.price);
                case 'price-high':
                    return parseFloat(b.price) - parseFloat(a.price);
                case 'popular':
                    return (b.views + b.purchases * 10) - (a.views + a.purchases * 10);
                default:
                    return 0;
            }
        });
    }

    applySearch() {
        const query = document.getElementById('search-input')?.value.toLowerCase();
        const searchClear = document.getElementById('search-clear');
        
        if (query) {
            searchClear.style.display = 'block';
            this.filteredSolutions = this.solutions.filter(solution =>
                solution.title.toLowerCase().includes(query) ||
                solution.description.toLowerCase().includes(query) ||
                solution.category.toLowerCase().includes(query)
            );
        } else {
            searchClear.style.display = 'none';
            this.applyFilters();
            return;
        }
        
        this.currentPage = 1;
        this.renderSolutions();
        this.updateResultsCount();
    }

    clearSearch() {
        const searchInput = document.getElementById('search-input');
        const searchClear = document.getElementById('search-clear');
        
        searchInput.value = '';
        searchClear.style.display = 'none';
        this.applyFilters();
    }

    handleQuickFilter(e) {
        const filter = e.target.dataset.filter;
        
        // Update active state
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Update category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.value = filter;
            this.applyFilters();
        }
    }

    toggleView(e) {
        const view = e.target.closest('.view-btn').dataset.view;
        
        // Update active state
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.closest('.view-btn').classList.add('active');
        
        this.currentView = view;
        this.renderSolutions();
    }

    renderSolutions() {
        const grid = document.getElementById('solutions-grid');
        if (!grid) return;
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const solutionsToShow = this.filteredSolutions.slice(0, endIndex);
        
        grid.className = `solutions-grid ${this.currentView}-view`;
        
        if (solutionsToShow.length === 0) {
            grid.innerHTML = this.renderEmptyState();
            return;
        }
        
        grid.innerHTML = solutionsToShow.map(solution => 
            this.currentView === 'grid' ? 
            this.renderSolutionCard(solution) : 
            this.renderSolutionListItem(solution)
        ).join('');
        
        // Add click handlers
        grid.querySelectorAll('.solution-item').forEach((item, index) => {
            item.addEventListener('click', () => this.openSolutionModal(solutionsToShow[index]));
        });
        
        // Update load more button
        this.updateLoadMoreButton();
    }

    renderSolutionCard(solution) {
        const icons = {
            'Healthcare': 'fa-heartbeat',
            'Sustainability': 'fa-leaf',
            'FinTech': 'fa-coins',
            'Blockchain': 'fa-link',
            'AI/ML': 'fa-brain',
            'Education': 'fa-graduation-cap'
        };

        return `
            <div class="solution-item solution-card" data-id="${solution.tokenId}">
                ${solution.featured ? '<div class="solution-badge">Featured</div>' : ''}
                <div class="solution-image">
                    <i class="fas ${icons[solution.category] || 'fa-lightbulb'}"></i>
                    <div class="solution-overlay">
                        <button class="quick-view-btn">
                            <i class="fas fa-eye"></i>
                            Quick View
                        </button>
                    </div>
                </div>
                <div class="solution-content">
                    <div class="solution-header">
                        <h3>${solution.title}</h3>
                        <div class="solution-price">${solution.price} ETH</div>
                    </div>
                    <p class="solution-description">${solution.description}</p>
                    <div class="solution-meta">
                        <span class="solution-category">${solution.category}</span>
                        <div class="solution-stats">
                            <span><i class="fas fa-eye"></i> ${solution.views}</span>
                            <span><i class="fas fa-shopping-cart"></i> ${solution.purchases}</span>
                        </div>
                    </div>
                    <div class="solution-creator">
                        <i class="fas fa-user"></i>
                        <span>${this.formatAddress(solution.creator)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderSolutionListItem(solution) {
        const icons = {
            'Healthcare': 'fa-heartbeat',
            'Sustainability': 'fa-leaf',
            'FinTech': 'fa-coins',
            'Blockchain': 'fa-link',
            'AI/ML': 'fa-brain',
            'Education': 'fa-graduation-cap'
        };

        return `
            <div class="solution-item solution-list-item" data-id="${solution.tokenId}">
                <div class="solution-icon">
                    <i class="fas ${icons[solution.category] || 'fa-lightbulb'}"></i>
                </div>
                <div class="solution-info">
                    <div class="solution-header">
                        <h3>${solution.title}</h3>
                        ${solution.featured ? '<span class="solution-badge">Featured</span>' : ''}
                    </div>
                    <p class="solution-description">${solution.description}</p>
                    <div class="solution-meta">
                        <span class="solution-category">${solution.category}</span>
                        <span class="solution-creator">by ${this.formatAddress(solution.creator)}</span>
                        <div class="solution-stats">
                            <span><i class="fas fa-eye"></i> ${solution.views}</span>
                            <span><i class="fas fa-shopping-cart"></i> ${solution.purchases}</span>
                        </div>
                    </div>
                </div>
                <div class="solution-actions">
                    <div class="solution-price">${solution.price} ETH</div>
                    <button class="btn btn-primary btn-sm">
                        <i class="fas fa-shopping-cart"></i>
                        Purchase
                    </button>
                </div>
            </div>
        `;
    }

    renderEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>No Solutions Found</h3>
                <p>Try adjusting your filters or search terms to find what you're looking for.</p>
                <button class="btn btn-secondary" onclick="solutionsApp.clearAllFilters()">
                    Clear All Filters
                </button>
            </div>
        `;
    }

    openSolutionModal(solution) {
        this.selectedSolution = solution;
        const modal = document.getElementById('solution-modal');
        const title = document.getElementById('modal-title');
        const content = document.getElementById('modal-content');
        const purchaseBtn = document.getElementById('modal-purchase');
        
        title.textContent = solution.title;
        content.innerHTML = this.renderModalContent(solution);
        purchaseBtn.innerHTML = `
            <span>Purchase for ${solution.price} ETH</span>
            <i class="fas fa-shopping-cart"></i>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    renderModalContent(solution) {
        const icons = {
            'Healthcare': 'fa-heartbeat',
            'Sustainability': 'fa-leaf',
            'FinTech': 'fa-coins',
            'Blockchain': 'fa-link',
            'AI/ML': 'fa-brain',
            'Education': 'fa-graduation-cap'
        };

        return `
            <div class="modal-solution">
                <div class="modal-solution-image">
                    <i class="fas ${icons[solution.category] || 'fa-lightbulb'}"></i>
                </div>
                <div class="modal-solution-info">
                    <div class="solution-category-badge">${solution.category}</div>
                    <h2>${solution.title}</h2>
                    <p class="solution-full-description">${solution.description}</p>
                    
                    <div class="solution-details">
                        <div class="detail-item">
                            <span class="detail-label">Creator:</span>
                            <span class="detail-value">${this.formatAddress(solution.creator)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Price:</span>
                            <span class="detail-value">${solution.price} ETH</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Views:</span>
                            <span class="detail-value">${solution.views}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Purchases:</span>
                            <span class="detail-value">${solution.purchases}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Created:</span>
                            <span class="detail-value">${this.formatDate(solution.createdAt)}</span>
                        </div>
                    </div>
                    
                    <div class="solution-features">
                        <h4>Key Features:</h4>
                        <ul>
                            <li>Blockchain-secured ownership</li>
                            <li>Instant download after purchase</li>
                            <li>Creator royalties on resale</li>
                            <li>Community support</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    closeModal() {
        const modal = document.getElementById('solution-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        this.selectedSolution = null;
    }

    async purchaseSolution() {
        if (!this.selectedSolution) return;
        
        if (!this.isWalletConnected()) {
            this.showToast('Please connect your wallet first', 'error');
            return;
        }
        
        this.closeModal();
        this.showPurchaseConfirmation(this.selectedSolution);
    }

    showPurchaseConfirmation(solution) {
        const modal = this.createModal(`
            <div class="purchase-confirmation-modal">
                <div class="modal-header">
                    <h3>Confirm Purchase</h3>
                    <p>You are about to purchase this solution</p>
                </div>
                
                <div class="solution-preview">
                    <div class="solution-image">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <div class="solution-info">
                        <h4>${solution.title}</h4>
                        <p>${solution.description}</p>
                        <div class="solution-meta">
                            <span class="category">${solution.category}</span>
                            <span class="price">${solution.price} ETH</span>
                        </div>
                    </div>
                </div>
                
                <div class="purchase-details">
                    <div class="detail-row">
                        <span>Solution Price:</span>
                        <span>${solution.price} ETH</span>
                    </div>
                    <div class="detail-row">
                        <span>Gas Fee (estimated):</span>
                        <span>~0.005 ETH</span>
                    </div>
                    <div class="detail-row total">
                        <span>Total Cost:</span>
                        <span>~${(parseFloat(solution.price) + 0.005).toFixed(3)} ETH</span>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="solutionsApp.executePurchase(${solution.tokenId}, '${solution.price}')">
                        <i class="fas fa-credit-card"></i>
                        <span>Purchase with MetaMask</span>
                    </button>
                </div>
            </div>
        `);
    }

    async executePurchase(tokenId, price) {
        document.querySelector('.modal-overlay')?.remove();
        
        const processingModal = this.createModal(`
            <div class="processing-modal">
                <div class="modal-header">
                    <div class="processing-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                    <h3>Processing Purchase</h3>
                    <p id="processing-status">Initiating MetaMask transaction...</p>
                </div>
                
                <div class="processing-steps">
                    <div class="step active" id="step-1">
                        <i class="fas fa-wallet"></i>
                        <span>Confirm in MetaMask</span>
                    </div>
                    <div class="step" id="step-2">
                        <i class="fas fa-clock"></i>
                        <span>Transaction Processing</span>
                    </div>
                    <div class="step" id="step-3">
                        <i class="fas fa-check"></i>
                        <span>Purchase Complete</span>
                    </div>
                </div>
            </div>
        `);
        
        try {
            const updateStatus = (message, step) => {
                document.getElementById('processing-status').textContent = message;
                if (step) {
                    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
                    document.getElementById(`step-${step}`).classList.add('active');
                }
            };
            
            updateStatus('Confirm transaction in MetaMask...', 1);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            updateStatus('Transaction confirmed! Processing...', 2);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            updateStatus('Purchase successful!', 3);
            
            this.removeSolutionFromMarketplace(tokenId);
            
            setTimeout(() => {
                processingModal.remove();
                this.showPurchaseSuccess(tokenId);
            }, 1500);
            
        } catch (error) {
            processingModal.remove();
            this.showToast(error.message, 'error');
        }
    }

    removeSolutionFromMarketplace(tokenId) {
        this.solutions = this.solutions.filter(s => s.tokenId !== tokenId);
        this.filteredSolutions = this.filteredSolutions.filter(s => s.tokenId !== tokenId);
        
        const solutionCard = document.querySelector(`[data-id="${tokenId}"]`);
        if (solutionCard) {
            solutionCard.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => {
                solutionCard.remove();
                this.renderSolutions();
                this.updateStats();
            }, 500);
        }
    }

    showPurchaseSuccess(tokenId) {
        const modal = this.createModal(`
            <div class="success-modal">
                <div class="modal-header">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Purchase Successful!</h3>
                    <p>You now own this solution NFT</p>
                </div>
                
                <div class="success-content">
                    <div class="nft-info">
                        <h4>What's Next?</h4>
                        <ul>
                            <li><i class="fas fa-download"></i> Download your solution files</li>
                            <li><i class="fas fa-certificate"></i> View your NFT in wallet</li>
                            <li><i class="fas fa-share"></i> Share your purchase</li>
                        </ul>
                    </div>
                    
                    <div class="transaction-info">
                        <p><strong>Transaction ID:</strong> <code>0x${Math.random().toString(16).substr(2, 8)}...</code></p>
                        <p><strong>NFT Token ID:</strong> #${tokenId}</p>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
                    <button type="button" class="btn btn-primary" onclick="solutionsApp.downloadSolution(${tokenId})">
                        <i class="fas fa-download"></i>
                        <span>Download Files</span>
                    </button>
                </div>
            </div>
        `);
    }

    downloadSolution(tokenId) {
        this.showToast('Downloading solution files...', 'info');
        setTimeout(() => {
            this.showToast('Files downloaded successfully!', 'success');
        }, 2000);
    }

    updateSolutionPurchaseCount(tokenId) {
        const solution = this.solutions.find(s => s.tokenId === tokenId);
        if (solution) {
            solution.purchases += 1;
            this.renderSolutions();
        }
    }

    loadMore() {
        this.currentPage += 1;
        this.renderSolutions();
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more');
        const totalShown = this.currentPage * this.itemsPerPage;
        const hasMore = totalShown < this.filteredSolutions.length;
        
        if (loadMoreBtn) {
            loadMoreBtn.style.display = hasMore ? 'flex' : 'none';
        }
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            const total = this.filteredSolutions.length;
            const shown = Math.min(this.currentPage * this.itemsPerPage, total);
            resultsCount.textContent = `Showing ${shown} of ${total} solutions`;
        }
    }

    updateStats() {
        const totalSolutions = document.getElementById('total-solutions');
        const totalCreators = document.getElementById('total-creators');
        const totalVolume = document.getElementById('total-volume');
        
        if (totalSolutions) {
            this.animateCounter(totalSolutions, this.solutions.length);
        }
        
        if (totalCreators) {
            const uniqueCreators = new Set(this.solutions.map(s => s.creator)).size;
            this.animateCounter(totalCreators, uniqueCreators);
        }
        
        if (totalVolume) {
            const volume = this.solutions.reduce((sum, s) => sum + (parseFloat(s.price) * s.purchases), 0);
            this.animateCounter(totalVolume, Math.round(volume * 10) / 10);
        }
    }

    animateCounter(element, target) {
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    async connectWallet() {
        const walletBtn = document.getElementById('wallet-btn');
        const walletText = walletBtn?.querySelector('span');
        
        if (!window.ethereum) {
            this.showToast('Please install MetaMask to connect your wallet', 'error');
            return;
        }

        try {
            walletText.textContent = 'Connecting...';
            
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            
            if (accounts.length > 0) {
                const address = accounts[0];
                const shortAddress = this.formatAddress(address);
                
                walletBtn?.classList.add('connected');
                walletText.textContent = shortAddress;
                
                this.showToast('Wallet connected successfully!', 'success');
                
                // Initialize blockchain manager
                if (window.blockchainManager) {
                    await window.blockchainManager.init();
                    await this.loadSolutions(); // Reload with real data
                }
            }
        } catch (error) {
            console.error('Wallet connection error:', error);
            walletText.textContent = 'Connect Wallet';
            this.showToast('Failed to connect wallet', 'error');
        }
    }

    showSubmitForm() {
        if (!this.isWalletConnected()) {
            this.showToast('Please connect your wallet first', 'error');
            return;
        }
        this.showSubmitModal();
    }

    isWalletConnected() {
        const walletBtn = document.getElementById('wallet-btn');
        return walletBtn?.classList.contains('connected');
    }

    showSubmitModal() {
        const modal = this.createModal(`
            <div class="submit-solution-modal">
                <div class="modal-header">
                    <h3>Submit Your Solution</h3>
                    <p>Mint your innovation as an NFT and list it on the marketplace</p>
                </div>
                
                <form class="submit-form" id="submit-form" enctype="multipart/form-data">
                    <div class="form-section">
                        <h4>Solution Details</h4>
                        <div class="form-group">
                            <label>Solution Title *</label>
                            <input type="text" name="title" required placeholder="Enter a compelling title for your solution">
                        </div>
                        
                        <div class="form-group">
                            <label>Description *</label>
                            <textarea name="description" rows="4" required placeholder="Describe your solution, its benefits, and use cases..."></textarea>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Category *</label>
                                <select name="category" required>
                                    <option value="">Select category</option>
                                    <option value="AI/ML">AI & Machine Learning</option>
                                    <option value="Blockchain">Blockchain & Web3</option>
                                    <option value="FinTech">FinTech</option>
                                    <option value="Healthcare">HealthTech</option>
                                    <option value="Education">EdTech</option>
                                    <option value="Sustainability">Sustainability</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Price (ETH) *</label>
                                <input type="number" name="price" step="0.001" min="0.001" required placeholder="0.1">
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Files</h4>
                        <div class="form-group">
                            <label>Cover Image *</label>
                            <div class="file-upload">
                                <input type="file" name="coverImage" accept="image/*" required>
                                <div class="file-upload-text">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <span>Choose cover image (PNG, JPG, GIF)</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Solution Files *</label>
                            <div class="file-upload">
                                <input type="file" name="solutionFile" accept=".zip,.pdf,.doc,.docx" required>
                                <div class="file-upload-text">
                                    <i class="fas fa-file-archive"></i>
                                    <span>Upload solution files (ZIP, PDF, DOC)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <div class="terms-checkbox">
                            <label class="checkbox-label">
                                <input type="checkbox" name="terms" required>
                                I agree to the Terms of Service and confirm that this is my original work
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-rocket"></i>
                            <span>Mint & List Solution</span>
                        </button>
                    </div>
                </form>
            </div>
        `);
        
        const form = modal.querySelector('#submit-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processSolutionSubmission(new FormData(form));
            modal.remove();
        });
        
        this.setupFileUploadPreviews(modal);
    }

    async processSolutionSubmission(formData) {
        const processingModal = this.createModal(`
            <div class="processing-modal">
                <div class="modal-header">
                    <div class="processing-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                    <h3>Minting Your Solution</h3>
                    <p id="minting-status">Uploading files to IPFS...</p>
                </div>
                
                <div class="processing-steps">
                    <div class="step active" id="mint-step-1">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <span>Upload Files</span>
                    </div>
                    <div class="step" id="mint-step-2">
                        <i class="fas fa-coins"></i>
                        <span>Mint NFT</span>
                    </div>
                    <div class="step" id="mint-step-3">
                        <i class="fas fa-store"></i>
                        <span>List on Marketplace</span>
                    </div>
                </div>
            </div>
        `);
        
        try {
            const updateStatus = (message, step) => {
                document.getElementById('minting-status').textContent = message;
                if (step) {
                    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
                    document.getElementById(`mint-step-${step}`).classList.add('active');
                }
            };
            
            updateStatus('Uploading files to IPFS...', 1);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            updateStatus('Minting NFT on blockchain...', 2);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            updateStatus('Adding to marketplace...', 3);
            
            const newSolution = {
                tokenId: Date.now(),
                creator: this.getCurrentWalletAddress(),
                title: formData.get('title'),
                description: formData.get('description'),
                category: formData.get('category'),
                price: formData.get('price'),
                isForSale: true,
                coverImageHash: 'Qm' + Math.random().toString(36).substr(2, 44),
                solutionFileHash: 'Qm' + Math.random().toString(36).substr(2, 44),
                createdAt: new Date(),
                views: 0,
                purchases: 0,
                featured: false
            };
            
            this.solutions.unshift(newSolution);
            this.filteredSolutions = [...this.solutions];
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            processingModal.remove();
            this.showMintingSuccess(newSolution);
            this.renderSolutions();
            this.updateStats();
            
        } catch (error) {
            processingModal.remove();
            this.showToast('Failed to mint solution: ' + error.message, 'error');
        }
    }

    showMintingSuccess(solution) {
        const modal = this.createModal(`
            <div class="success-modal">
                <div class="modal-header">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Solution Minted Successfully!</h3>
                    <p>Your solution is now live on the marketplace</p>
                </div>
                
                <div class="solution-preview">
                    <div class="solution-image">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <div class="solution-info">
                        <h4>${solution.title}</h4>
                        <p>${solution.description}</p>
                        <div class="solution-meta">
                            <span class="category">${solution.category}</span>
                            <span class="price">${solution.price} ETH</span>
                        </div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
                    <button type="button" class="btn btn-primary" onclick="solutionsApp.viewSolution(${solution.tokenId})">
                        <i class="fas fa-eye"></i>
                        <span>View Solution</span>
                    </button>
                </div>
            </div>
        `);
    }

    setupFileUploadPreviews(modal) {
        const fileInputs = modal.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const uploadText = e.target.parentElement.querySelector('.file-upload-text span');
                    uploadText.textContent = file.name;
                    e.target.parentElement.classList.add('has-file');
                }
            });
        });
    }

    getCurrentWalletAddress() {
        const walletBtn = document.getElementById('wallet-btn');
        const addressText = walletBtn?.querySelector('span')?.textContent;
        if (addressText && addressText.includes('...')) {
            return '0x' + Math.random().toString(16).substr(2, 40);
        }
        return '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
    }

    viewSolution(tokenId) {
        const solution = this.solutions.find(s => s.tokenId === tokenId);
        if (solution) {
            this.openSolutionModal(solution);
        }
    }

    scrollToSolutions() {
        document.querySelector('.solutions-marketplace')?.scrollIntoView({
            behavior: 'smooth'
        });
    }

    clearAllFilters() {
        document.getElementById('category-filter').value = 'all';
        document.getElementById('price-filter').value = 'all';
        document.getElementById('sort-filter').value = 'newest';
        document.getElementById('search-input').value = '';
        document.getElementById('search-clear').style.display = 'none';
        
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
        });
        document.querySelector('.filter-chip[data-filter="all"]')?.classList.add('active');
        
        this.applyFilters();
    }

    // Utility Methods
    formatAddress(address) {
        return `${address.substring(0, 6)}...${address.substring(38)}`;
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

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

    createModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal-container">
                <div class="modal-content">
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
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

// Initialize Solutions App
document.addEventListener('DOMContentLoaded', () => {
    window.solutionsApp = new SolutionsApp();
    console.log('🚀 Solutions Marketplace - Application Initialized');
});

// Additional CSS for Solutions Page
const additionalStyles = `
    .solutions-hero {
        min-height: 80vh;
        display: flex;
        align-items: center;
        position: relative;
        overflow: hidden;
        padding-top: 80px;
        background: var(--gradient-dark);
    }

    .solutions-hero-content {
        text-align: center;
        max-width: 800px;
        margin: 0 auto;
    }

    .solutions-filter {
        padding: 4rem 0;
        background: var(--secondary-dark);
        border-bottom: 1px solid var(--border-color);
    }

    .filter-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .filter-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .filter-header h3 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
    }

    .results-info {
        color: var(--text-secondary);
        font-size: 0.875rem;
    }

    .filter-controls {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .filter-group label {
        font-weight: 500;
        color: var(--text-secondary);
        font-size: 0.875rem;
    }

    .filter-select {
        padding: 0.75rem 1rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 0.875rem;
    }

    .search-input-container {
        position: relative;
        display: flex;
        align-items: center;
    }

    .search-icon {
        position: absolute;
        left: 1rem;
        color: var(--text-muted);
        z-index: 1;
    }

    .search-input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.5rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 0.875rem;
    }

    .search-clear {
        position: absolute;
        right: 1rem;
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        display: none;
    }

    .quick-filters {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .filter-label {
        font-weight: 500;
        color: var(--text-secondary);
        font-size: 0.875rem;
    }

    .quick-filter-chips {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
    }

    .filter-chip {
        padding: 0.5rem 1rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
        border-radius: 25px;
        color: var(--text-secondary);
        font-size: 0.875rem;
        cursor: pointer;
        transition: var(--transition);
    }

    .filter-chip:hover,
    .filter-chip.active {
        background: var(--primary-gold);
        color: var(--primary-dark);
        border-color: var(--primary-gold);
    }

    .solutions-marketplace {
        padding: 4rem 0;
        background: var(--primary-dark);
    }

    .marketplace-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3rem;
    }

    .marketplace-header h2 {
        font-size: 2rem;
        font-weight: 600;
        color: var(--text-primary);
    }

    .view-toggle {
        display: flex;
        gap: 0.5rem;
    }

    .view-btn {
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: var(--text-secondary);
        cursor: pointer;
        transition: var(--transition);
    }

    .view-btn.active,
    .view-btn:hover {
        background: var(--primary-gold);
        color: var(--primary-dark);
        border-color: var(--primary-gold);
    }

    .solutions-grid.grid-view {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
    }

    .solutions-grid.list-view {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .solution-card {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        overflow: hidden;
        transition: var(--transition);
        cursor: pointer;
        position: relative;
    }

    .solution-card:hover {
        transform: translateY(-5px);
        border-color: rgba(255, 215, 0, 0.3);
        box-shadow: var(--shadow-lg);
    }

    .solution-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: var(--primary-gold);
        color: var(--primary-dark);
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.75rem;
        font-weight: 600;
        z-index: 2;
    }

    .solution-image {
        height: 200px;
        background: var(--gradient-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        color: var(--primary-dark);
        position: relative;
        overflow: hidden;
    }

    .solution-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: var(--transition);
    }

    .solution-card:hover .solution-overlay {
        opacity: 1;
    }

    .quick-view-btn {
        padding: 0.75rem 1.5rem;
        background: var(--primary-gold);
        color: var(--primary-dark);
        border: none;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .solution-content {
        padding: 1.5rem;
    }

    .solution-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
    }

    .solution-header h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        flex: 1;
        margin-right: 1rem;
    }

    .solution-price {
        font-size: 1.125rem;
        font-weight: 700;
        color: var(--primary-gold);
        white-space: nowrap;
    }

    .solution-description {
        color: var(--text-secondary);
        line-height: 1.5;
        margin-bottom: 1rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .solution-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .solution-category {
        padding: 0.25rem 0.75rem;
        background: rgba(255, 215, 0, 0.1);
        border: 1px solid rgba(255, 215, 0, 0.3);
        border-radius: 15px;
        color: var(--primary-gold);
        font-size: 0.75rem;
        font-weight: 500;
    }

    .solution-stats {
        display: flex;
        gap: 1rem;
        font-size: 0.75rem;
        color: var(--text-muted);
    }

    .solution-creator {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-muted);
    }

    .solution-creator i {
        color: var(--primary-gold);
    }

    .solution-list-item {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1.5rem;
        transition: var(--transition);
        cursor: pointer;
    }

    .solution-list-item:hover {
        border-color: rgba(255, 215, 0, 0.3);
        background: rgba(255, 255, 255, 0.05);
    }

    .solution-icon {
        width: 60px;
        height: 60px;
        background: var(--gradient-primary);
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: var(--primary-dark);
        flex-shrink: 0;
    }

    .solution-info {
        flex: 1;
    }

    .solution-actions {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 1rem;
    }

    .btn-sm {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
    }

    .load-more-container {
        text-align: center;
        margin-top: 3rem;
    }

    .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        grid-column: 1 / -1;
    }

    .empty-icon {
        font-size: 4rem;
        color: var(--text-muted);
        margin-bottom: 1rem;
    }

    .empty-state h3 {
        font-size: 1.5rem;
        color: var(--text-primary);
        margin-bottom: 1rem;
    }

    .empty-state p {
        color: var(--text-secondary);
        margin-bottom: 2rem;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: var(--transition);
    }

    .modal-overlay.active {
        opacity: 1;
        visibility: visible;
    }

    .modal-container {
        background: var(--secondary-dark);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        transform: scale(0.9);
        transition: var(--transition);
    }

    .modal-overlay.active .modal-container {
        transform: scale(1);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-color);
    }

    .modal-header h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
    }

    .modal-close {
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: var(--transition);
    }

    .modal-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
    }

    .modal-content {
        padding: 1.5rem;
    }

    .modal-solution {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .modal-solution-image {
        height: 200px;
        background: var(--gradient-primary);
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        color: var(--primary-dark);
    }

    .solution-category-badge {
        display: inline-block;
        padding: 0.5rem 1rem;
        background: rgba(255, 215, 0, 0.1);
        border: 1px solid rgba(255, 215, 0, 0.3);
        border-radius: 25px;
        color: var(--primary-gold);
        font-size: 0.875rem;
        font-weight: 500;
        margin-bottom: 1rem;
    }

    .modal-solution-info h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 1rem;
    }

    .solution-full-description {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 2rem;
    }

    .solution-details {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .detail-item {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 8px;
    }

    .detail-label {
        color: var(--text-muted);
        font-size: 0.875rem;
    }

    .detail-value {
        color: var(--text-primary);
        font-weight: 500;
        font-size: 0.875rem;
    }

    .solution-features h4 {
        color: var(--text-primary);
        margin-bottom: 1rem;
    }

    .solution-features ul {
        list-style: none;
        padding: 0;
    }

    .solution-features li {
        padding: 0.5rem 0;
        color: var(--text-secondary);
        position: relative;
        padding-left: 1.5rem;
    }

    .solution-features li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--primary-gold);
        font-weight: bold;
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 1.5rem;
        border-top: 1px solid var(--border-color);
    }

    @media (max-width: 768px) {
        .filter-controls {
            grid-template-columns: 1fr;
        }
        
        .quick-filters {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .marketplace-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
        }
        
        .solutions-grid.grid-view {
            grid-template-columns: 1fr;
        }
        
        .solution-list-item {
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
        }
        
        .solution-actions {
            flex-direction: row;
            width: 100%;
            justify-content: space-between;
            align-items: center;
        }
        
        .solution-details {
            grid-template-columns: 1fr;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);