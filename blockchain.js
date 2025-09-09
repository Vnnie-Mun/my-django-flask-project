// Web3 Integration for Solution NFT Marketplace
class BlockchainManager {
    constructor() {
        this.web3 = null;
        this.contract = null;
        this.account = null;
        this.contractAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
        this.contractABI = [{
                "inputs": [{ "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "description", "type": "string" }, { "internalType": "string", "name": "category", "type": "string" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "string", "name": "coverImageHash", "type": "string" }, { "internalType": "string", "name": "solutionFileHash", "type": "string" }, { "internalType": "string", "name": "tokenURI", "type": "string" }],
                "name": "mintSolution",
                "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
                "name": "purchaseSolution",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getSolutionsForSale",
                "outputs": [{ "components": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "address", "name": "creator", "type": "address" }, { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "description", "type": "string" }, { "internalType": "string", "name": "category", "type": "string" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "bool", "name": "isForSale", "type": "bool" }, { "internalType": "string", "name": "coverImageHash", "type": "string" }, { "internalType": "string", "name": "solutionFileHash", "type": "string" }, { "internalType": "uint256", "name": "createdAt", "type": "uint256" }], "internalType": "struct SolutionNFT.Solution[]", "name": "", "type": "tuple[]" }],
                "stateMutability": "view",
                "type": "function"
            }
        ];
    }

    async init() {
        if (typeof window.ethereum !== 'undefined') {
            this.web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await this.web3.eth.getAccounts();
                this.account = accounts[0];

                // Check if we're on the correct network (Ethereum mainnet or testnet)
                const networkId = await this.web3.eth.net.getId();
                console.log('Connected to network:', networkId);

                this.contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);

                // Display connection status
                this.showConnectionStatus(true, this.account);
                return true;
            } catch (error) {
                console.error('User denied account access:', error);
                this.showConnectionStatus(false);
                return false;
            }
        } else {
            this.showConnectionStatus(false, null, 'MetaMask not installed');
            return false;
        }
    }

    showConnectionStatus(connected, account = null, message = null) {
        let statusElement = document.getElementById('wallet-status');
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.id = 'wallet-status';
            statusElement.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                padding: 0.75rem 1rem;
                border-radius: 8px;
                font-size: 0.875rem;
                z-index: 1001;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(statusElement);
        }

        if (connected && account) {
            statusElement.innerHTML = `
                <i class="fas fa-wallet" style="margin-right: 0.5rem;"></i>
                Connected: ${account.substring(0, 6)}...${account.substring(38)}
            `;
            statusElement.style.background = 'rgba(16, 185, 129, 0.9)';
            statusElement.style.color = 'white';
            statusElement.style.border = '1px solid #10b981';
        } else {
            statusElement.innerHTML = `
                <i class="fas fa-exclamation-triangle" style="margin-right: 0.5rem;"></i>
                ${message || 'Wallet not connected'}
            `;
            statusElement.style.background = 'rgba(239, 68, 68, 0.9)';
            statusElement.style.color = 'white';
            statusElement.style.border = '1px solid #ef4444';
        }
    }

    async mintSolution(solutionData) {
        if (!this.contract) {
            const connected = await this.init();
            if (!connected) throw new Error('Wallet not connected');
        }

        const priceInWei = this.web3.utils.toWei(solutionData.price.toString(), 'ether');

        try {
            // Estimate gas for minting
            const gasEstimate = await this.contract.methods.mintSolution(
                solutionData.title,
                solutionData.description,
                solutionData.category,
                priceInWei,
                solutionData.coverImageHash,
                solutionData.solutionFileHash,
                solutionData.tokenURI
            ).estimateGas({ from: this.account });

            const gasLimit = Math.floor(gasEstimate * 1.2);

            const result = await this.contract.methods.mintSolution(
                solutionData.title,
                solutionData.description,
                solutionData.category,
                priceInWei,
                solutionData.coverImageHash,
                solutionData.solutionFileHash,
                solutionData.tokenURI
            ).send({
                from: this.account,
                gas: gasLimit
            });

            return result;
        } catch (error) {
            console.error('Error minting solution:', error);
            if (error.message.includes('insufficient funds')) {
                throw new Error('Insufficient ETH for gas fees');
            } else if (error.message.includes('user rejected')) {
                throw new Error('Transaction cancelled by user');
            }
            throw new Error('Minting failed: ' + error.message);
        }
    }

    async purchaseSolution(tokenId, price) {
        if (!this.contract) {
            const connected = await this.init();
            if (!connected) throw new Error('Wallet not connected');
        }

        const priceInWei = this.web3.utils.toWei(price.toString(), 'ether');

        try {
            // Estimate gas first
            const gasEstimate = await this.contract.methods.purchaseSolution(tokenId)
                .estimateGas({ from: this.account, value: priceInWei });

            // Add 20% buffer for gas
            const gasLimit = Math.floor(gasEstimate * 1.2);

            const result = await this.contract.methods.purchaseSolution(tokenId)
                .send({
                    from: this.account,
                    value: priceInWei,
                    gas: gasLimit
                });
            return result;
        } catch (error) {
            console.error('Error purchasing solution:', error);
            if (error.message.includes('insufficient funds')) {
                throw new Error('Insufficient ETH balance for purchase');
            } else if (error.message.includes('user rejected')) {
                throw new Error('Transaction cancelled by user');
            }
            throw new Error('Purchase failed: ' + error.message);
        }
    }

    async getSolutionsForSale() {
        if (!this.contract) {
            const connected = await this.init();
            if (!connected) return this.getMockSolutions();
        }

        try {
            const solutions = await this.contract.methods.getSolutionsForSale().call();
            return solutions.map(solution => ({
                tokenId: solution.tokenId,
                creator: solution.creator,
                title: solution.title,
                description: solution.description,
                category: solution.category,
                price: this.web3.utils.fromWei(solution.price, 'ether'),
                isForSale: solution.isForSale,
                coverImageHash: solution.coverImageHash,
                solutionFileHash: solution.solutionFileHash,
                createdAt: new Date(solution.createdAt * 1000)
            }));
        } catch (error) {
            console.error('Error fetching solutions:', error);
            return this.getMockSolutions();
        }
    }

    getMockSolutions() {
        return [{
                tokenId: 1,
                creator: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
                title: 'AI Healthcare Diagnostic',
                description: 'Revolutionary AI platform for medical diagnosis with 95% accuracy',
                category: 'Healthcare',
                price: '0.5',
                isForSale: true,
                coverImageHash: 'QmDemo1Hash',
                solutionFileHash: 'QmDemo1FileHash',
                createdAt: new Date(),
                views: 2500,
                purchases: 12
            },
            {
                tokenId: 2,
                creator: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
                title: 'Blockchain Carbon Credits',
                description: 'Transparent carbon credit trading platform for sustainable business',
                category: 'Sustainability',
                price: '0.3',
                isForSale: true,
                coverImageHash: 'QmDemo2Hash',
                solutionFileHash: 'QmDemo2FileHash',
                createdAt: new Date(),
                views: 1800,
                purchases: 8
            },
            {
                tokenId: 3,
                creator: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
                title: 'DeFi Lending Protocol',
                description: 'Decentralized lending platform with automated yield optimization',
                category: 'FinTech',
                price: '0.8',
                isForSale: true,
                coverImageHash: 'QmDemo3Hash',
                solutionFileHash: 'QmDemo3FileHash',
                createdAt: new Date(),
                views: 3200,
                purchases: 15
            },
            {
                tokenId: 4,
                creator: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
                title: 'Smart Contract Auditor',
                description: 'AI-powered smart contract vulnerability detection and analysis tool',
                category: 'Blockchain',
                price: '0.6',
                isForSale: true,
                coverImageHash: 'QmDemo4Hash',
                solutionFileHash: 'QmDemo4FileHash',
                createdAt: new Date(),
                views: 1950,
                purchases: 6
            }
        ];
    }
}

// IPFS Integration for file storage
class IPFSManager {
    constructor() {
        this.ipfsGateway = 'https://ipfs.io/ipfs/';
        this.pinataAPI = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
        this.pinataKey = process.env.PINATA_API_KEY || 'demo_key';
    }

    async uploadFile(file) {
        // For demo purposes, use mock hash
        // In production, integrate with actual IPFS service
        return this.generateMockHash(file.name);
    }

    generateMockHash(filename) {
        return 'Qm' + btoa(filename + Date.now()).substring(0, 44);
    }

    getFileUrl(hash) {
        return this.ipfsGateway + hash;
    }
}

// Payment Processing
class PaymentProcessor {
    constructor() {
        this.blockchain = new BlockchainManager();
        this.ipfs = new IPFSManager();
    }

    async processPayment(tokenId, price, onSuccess, onError) {
        try {
            const result = await this.blockchain.purchaseSolution(tokenId, price);
            onSuccess(result);
        } catch (error) {
            onError(error);
        }
    }

    async submitSolution(formData, files, onSuccess, onError) {
        try {
            // Upload files to IPFS
            const coverImageHash = await this.ipfs.uploadFile(files.coverImage);
            const solutionFileHash = await this.ipfs.uploadFile(files.solutionFile);

            // Create metadata
            const metadata = {
                name: formData.title,
                description: formData.description,
                image: this.ipfs.getFileUrl(coverImageHash),
                attributes: [
                    { trait_type: "Category", value: formData.category },
                    { trait_type: "Creator", value: this.blockchain.account },
                    { trait_type: "Created", value: new Date().toISOString() }
                ]
            };

            const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
            const metadataHash = await this.ipfs.uploadFile(metadataBlob);

            // Mint NFT
            const solutionData = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                price: formData.price,
                coverImageHash: coverImageHash,
                solutionFileHash: solutionFileHash,
                tokenURI: this.ipfs.getFileUrl(metadataHash)
            };

            const result = await this.blockchain.mintSolution(solutionData);
            onSuccess(result);
        } catch (error) {
            onError(error);
        }
    }
}

// Initialize global instances
const blockchainManager = new BlockchainManager();
const paymentProcessor = new PaymentProcessor();

// Export for use in other files
window.BlockchainManager = BlockchainManager;
window.PaymentProcessor = PaymentProcessor;
window.blockchainManager = blockchainManager;
window.paymentProcessor = paymentProcessor;