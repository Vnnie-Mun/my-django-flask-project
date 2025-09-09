// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title SolutionNFT - Enhanced NFT Marketplace for Innovators of Honour
 * @dev Bulletproof smart contract for minting and trading solution NFTs
 */
contract SolutionNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard, Pausable {
    
    struct Solution {
        uint256 tokenId;
        address creator;
        string title;
        string description;
        string category;
        uint256 price;
        bool isForSale;
        string coverImageHash;
        string solutionFileHash;
        uint256 createdAt;
        uint256 views;
        uint256 purchases;
    }
    
    // State variables
    uint256 private _tokenIdCounter;
    uint256 public platformFeePercentage = 250; // 2.5%
    address public platformFeeRecipient;
    
    // Mappings
    mapping(uint256 => Solution) public solutions;
    mapping(uint256 => uint256) public royalties; // tokenId => royalty percentage (basis points)
    mapping(address => uint256[]) public creatorSolutions;
    mapping(string => bool) public categoryExists;
    
    // Arrays for enumeration
    uint256[] public solutionsForSale;
    string[] public validCategories;
    
    // Events
    event SolutionMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string title,
        string category,
        uint256 price
    );
    
    event SolutionPurchased(
        uint256 indexed tokenId,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );
    
    event SolutionViewed(uint256 indexed tokenId, address indexed viewer);
    event PriceUpdated(uint256 indexed tokenId, uint256 newPrice);
    event SaleStatusChanged(uint256 indexed tokenId, bool isForSale);
    
    constructor(address _platformFeeRecipient) 
        ERC721("Innovators of Honour Solutions", "IOHS") 
        Ownable(msg.sender)
    {
        platformFeeRecipient = _platformFeeRecipient;
        
        // Initialize valid categories
        validCategories = ["AI/ML", "Blockchain", "Healthcare", "Education", "FinTech", "Sustainability", "IoT", "Other"];
        for (uint i = 0; i < validCategories.length; i++) {
            categoryExists[validCategories[i]] = true;
        }
    }
    
    /**
     * @dev Mint a new solution NFT
     */
    function mintSolution(
        string memory title,
        string memory description,
        string memory category,
        uint256 price,
        string memory coverImageHash,
        string memory solutionFileHash,
        string memory tokenURI
    ) public whenNotPaused nonReentrant returns (uint256) {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(categoryExists[category], "Invalid category");
        require(price > 0, "Price must be greater than 0");
        require(bytes(coverImageHash).length > 0, "Cover image hash required");
        require(bytes(solutionFileHash).length > 0, "Solution file hash required");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Create solution struct
        solutions[tokenId] = Solution({
            tokenId: tokenId,
            creator: msg.sender,
            title: title,
            description: description,
            category: category,
            price: price,
            isForSale: true,
            coverImageHash: coverImageHash,
            solutionFileHash: solutionFileHash,
            createdAt: block.timestamp,
            views: 0,
            purchases: 0
        });
        
        // Set default royalty (5%)
        royalties[tokenId] = 500;
        
        // Add to creator's solutions
        creatorSolutions[msg.sender].push(tokenId);
        
        // Add to solutions for sale
        solutionsForSale.push(tokenId);
        
        emit SolutionMinted(tokenId, msg.sender, title, category, price);
        
        return tokenId;
    }
    
    /**
     * @dev Purchase a solution NFT
     */
    function purchaseSolution(uint256 tokenId) 
        public 
        payable 
        whenNotPaused 
        nonReentrant 
    {
        require(_exists(tokenId), "Solution does not exist");
        require(solutions[tokenId].isForSale, "Solution not for sale");
        require(msg.value >= solutions[tokenId].price, "Insufficient payment");
        require(msg.sender != ownerOf(tokenId), "Cannot buy your own solution");
        
        address seller = ownerOf(tokenId);
        uint256 price = solutions[tokenId].price;
        
        // Calculate fees
        uint256 platformFee = (price * platformFeePercentage) / 10000;
        uint256 royaltyFee = 0;
        
        // Calculate royalty if not original creator
        if (seller != solutions[tokenId].creator) {
            royaltyFee = (price * royalties[tokenId]) / 10000;
        }
        
        uint256 sellerAmount = price - platformFee - royaltyFee;
        
        // Transfer NFT
        _transfer(seller, msg.sender, tokenId);
        
        // Update solution status
        solutions[tokenId].isForSale = false;
        solutions[tokenId].purchases++;
        
        // Remove from solutions for sale
        _removeSolutionFromSale(tokenId);
        
        // Transfer payments
        if (platformFee > 0) {
            payable(platformFeeRecipient).transfer(platformFee);
        }
        
        if (royaltyFee > 0) {
            payable(solutions[tokenId].creator).transfer(royaltyFee);
        }
        
        payable(seller).transfer(sellerAmount);
        
        // Refund excess payment
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
        
        emit SolutionPurchased(tokenId, msg.sender, seller, price);
    }
    
    /**
     * @dev Record a view for analytics
     */
    function viewSolution(uint256 tokenId) public {
        require(_exists(tokenId), "Solution does not exist");
        solutions[tokenId].views++;
        emit SolutionViewed(tokenId, msg.sender);
    }
    
    /**
     * @dev Update solution price (only owner)
     */
    function updatePrice(uint256 tokenId, uint256 newPrice) public {
        require(_exists(tokenId), "Solution does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(newPrice > 0, "Price must be greater than 0");
        
        solutions[tokenId].price = newPrice;
        emit PriceUpdated(tokenId, newPrice);
    }
    
    /**
     * @dev Toggle sale status (only owner)
     */
    function toggleSaleStatus(uint256 tokenId) public {
        require(_exists(tokenId), "Solution does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        
        bool newStatus = !solutions[tokenId].isForSale;
        solutions[tokenId].isForSale = newStatus;
        
        if (newStatus) {
            solutionsForSale.push(tokenId);
        } else {
            _removeSolutionFromSale(tokenId);
        }
        
        emit SaleStatusChanged(tokenId, newStatus);
    }
    
    /**
     * @dev Get all solutions for sale
     */
    function getSolutionsForSale() public view returns (Solution[] memory) {
        uint256 count = 0;
        
        // Count active solutions for sale
        for (uint256 i = 0; i < solutionsForSale.length; i++) {
            if (solutions[solutionsForSale[i]].isForSale) {
                count++;
            }
        }
        
        Solution[] memory activeSolutions = new Solution[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < solutionsForSale.length; i++) {
            if (solutions[solutionsForSale[i]].isForSale) {
                activeSolutions[index] = solutions[solutionsForSale[i]];
                index++;
            }
        }
        
        return activeSolutions;
    }
    
    /**
     * @dev Get solutions by creator
     */
    function getSolutionsByCreator(address creator) public view returns (uint256[] memory) {
        return creatorSolutions[creator];
    }
    
    /**
     * @dev Get solution details
     */
    function getSolution(uint256 tokenId) public view returns (Solution memory) {
        require(_exists(tokenId), "Solution does not exist");
        return solutions[tokenId];
    }
    
    /**
     * @dev Get valid categories
     */
    function getValidCategories() public view returns (string[] memory) {
        return validCategories;
    }
    
    /**
     * @dev Emergency functions (only owner)
     */
    function pause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
    
    function updatePlatformFee(uint256 newFeePercentage) public onlyOwner {
        require(newFeePercentage <= 1000, "Fee cannot exceed 10%");
        platformFeePercentage = newFeePercentage;
    }
    
    function updatePlatformFeeRecipient(address newRecipient) public onlyOwner {
        require(newRecipient != address(0), "Invalid recipient");
        platformFeeRecipient = newRecipient;
    }
    
    function addCategory(string memory category) public onlyOwner {
        require(!categoryExists[category], "Category already exists");
        categoryExists[category] = true;
        validCategories.push(category);
    }
    
    /**
     * @dev Emergency withdrawal (only owner)
     */
    function emergencyWithdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Internal function to remove solution from sale array
     */
    function _removeSolutionFromSale(uint256 tokenId) internal {
        for (uint256 i = 0; i < solutionsForSale.length; i++) {
            if (solutionsForSale[i] == tokenId) {
                solutionsForSale[i] = solutionsForSale[solutionsForSale.length - 1];
                solutionsForSale.pop();
                break;
            }
        }
    }
    
    /**
     * @dev Override required functions
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    /**
     * @dev Get contract statistics
     */
    function getStats() public view returns (
        uint256 totalSolutions,
        uint256 solutionsForSaleCount,
        uint256 totalViews,
        uint256 totalPurchases
    ) {
        totalSolutions = _tokenIdCounter;
        solutionsForSaleCount = 0;
        totalViews = 0;
        totalPurchases = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter; i++) {
            if (solutions[i].isForSale) {
                solutionsForSaleCount++;
            }
            totalViews += solutions[i].views;
            totalPurchases += solutions[i].purchases;
        }
    }
}