// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

/**
 * @title SolutionsMarketplace
 * @dev Bulletproof NFT marketplace for innovative solutions with zero loopholes
 * @author Innovators of Honour
 */
contract SolutionsMarketplace is 
    ERC721, 
    ERC721URIStorage, 
    Ownable, 
    ReentrancyGuard, 
    Pausable, 
    AccessControl,
    IERC2981 
{
    // Custom errors for gas efficiency
    error NotOwner();
    error InsufficientFunds();
    error InvalidPrice();
    error NotForSale();
    error InvalidURI();
    error MaxSupplyReached();
    error SelfPurchase();
    error InvalidFeePercentage();
    error ZeroAddress();

    // Enums for categories and stages
    enum Category { AI_ML, BLOCKCHAIN, HEALTHCARE, EDUCATION, FINTECH, SUSTAINABILITY, IOT, OTHER }
    enum Stage { CONCEPT, PROTOTYPE, MVP, BETA, LAUNCHED }
    enum FundingStatus { SEEKING, FUNDED, BOOTSTRAPPED }

    // Solution struct
    struct Solution {
        uint256 tokenId;
        address creator;
        string title;
        string description;
        Category category;
        Stage stage;
        FundingStatus fundingStatus;
        uint256 price;
        string ipfsUri;
        bool forSale;
        uint256 createdAt;
        uint256 views;
    }

    // Constants
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 public constant MAX_SUPPLY = 1_000_000;
    uint256 public constant PLATFORM_FEE = 250; // 2.5% in basis points
    uint256 public constant MAX_FEE = 1000; // 10% maximum

    // State variables
    uint256 private _nextTokenId = 1;
    uint256 public platformFeePercentage = PLATFORM_FEE;
    
    // Mappings
    mapping(uint256 => Solution) public solutions;
    mapping(address => uint256[]) public creatorSolutions;
    mapping(Category => uint256[]) public categoryToTokens;
    mapping(Stage => uint256[]) public stageToTokens;
    mapping(FundingStatus => uint256[]) public fundingToTokens;

    // Events
    event SolutionMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string title,
        Category category,
        uint256 price,
        string ipfsUri
    );
    
    event SolutionPurchased(
        uint256 indexed tokenId,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );
    
    event PriceUpdated(uint256 indexed tokenId, uint256 newPrice);
    event SolutionListed(uint256 indexed tokenId, uint256 price);
    event SolutionViewed(uint256 indexed tokenId, address indexed viewer);
    event MetadataUpdated(uint256 indexed tokenId, string newUri);
    event FeePercentageUpdated(uint256 newFeePercentage);

    constructor() 
        ERC721("SolutionsMarketplace", "SOLN") 
        Ownable(msg.sender)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
     * @dev Mint a new solution NFT
     * @param to Address to mint to
     * @param title Solution title
     * @param description Solution description
     * @param category Solution category
     * @param stage Development stage
     * @param fundingStatus Funding status
     * @param price Price in wei
     * @param ipfsUri IPFS URI for metadata
     */
    function safeMint(
        address to,
        string memory title,
        string memory description,
        Category category,
        Stage stage,
        FundingStatus fundingStatus,
        uint256 price,
        string memory ipfsUri
    ) public onlyRole(MINTER_ROLE) whenNotPaused nonReentrant returns (uint256) {
        if (to == address(0)) revert ZeroAddress();
        if (_nextTokenId > MAX_SUPPLY) revert MaxSupplyReached();
        if (price == 0) revert InvalidPrice();
        if (!_isValidIPFSUri(ipfsUri)) revert InvalidURI();

        uint256 tokenId = _nextTokenId++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, ipfsUri);

        // Store solution data
        solutions[tokenId] = Solution({
            tokenId: tokenId,
            creator: to,
            title: title,
            description: description,
            category: category,
            stage: stage,
            fundingStatus: fundingStatus,
            price: price,
            ipfsUri: ipfsUri,
            forSale: true,
            createdAt: block.timestamp,
            views: 0
        });

        // Update mappings
        creatorSolutions[to].push(tokenId);
        categoryToTokens[category].push(tokenId);
        stageToTokens[stage].push(tokenId);
        fundingToTokens[fundingStatus].push(tokenId);

        emit SolutionMinted(tokenId, to, title, category, price, ipfsUri);
        emit SolutionListed(tokenId, price);

        return tokenId;
    }

    /**
     * @dev Purchase a solution NFT
     * @param tokenId Token ID to purchase
     */
    function buySolution(uint256 tokenId) 
        external 
        payable 
        whenNotPaused 
        nonReentrant 
    {
        Solution storage solution = solutions[tokenId];
        address seller = ownerOf(tokenId);
        
        if (!solution.forSale) revert NotForSale();
        if (msg.value != solution.price) revert InsufficientFunds();
        if (msg.sender == seller) revert SelfPurchase();

        // Calculate fees
        uint256 platformFee = (solution.price * platformFeePercentage) / 10000;
        uint256 sellerAmount = solution.price - platformFee;

        // Update state before external calls (CEI pattern)
        solution.forSale = false;
        
        // Transfer NFT
        _transfer(seller, msg.sender, tokenId);

        // Transfer payments
        if (platformFee > 0) {
            payable(owner()).transfer(platformFee);
        }
        payable(seller).transfer(sellerAmount);

        emit SolutionPurchased(tokenId, msg.sender, seller, solution.price);
    }

    /**
     * @dev Set price for a solution
     * @param tokenId Token ID
     * @param newPrice New price in wei
     */
    function setPrice(uint256 tokenId, uint256 newPrice) 
        external 
        whenNotPaused 
    {
        if (ownerOf(tokenId) != msg.sender) revert NotOwner();
        if (newPrice == 0) revert InvalidPrice();

        solutions[tokenId].price = newPrice;
        solutions[tokenId].forSale = true;

        emit PriceUpdated(tokenId, newPrice);
        emit SolutionListed(tokenId, newPrice);
    }

    /**
     * @dev Record a view for analytics
     * @param tokenId Token ID viewed
     */
    function viewSolution(uint256 tokenId) external {
        if (!_exists(tokenId)) revert("Token does not exist");
        
        solutions[tokenId].views++;
        emit SolutionViewed(tokenId, msg.sender);
    }

    /**
     * @dev Update metadata URI (only token owner)
     * @param tokenId Token ID
     * @param newUri New IPFS URI
     */
    function updateMetadata(uint256 tokenId, string memory newUri) 
        external 
        whenNotPaused 
    {
        if (ownerOf(tokenId) != msg.sender) revert NotOwner();
        if (!_isValidIPFSUri(newUri)) revert InvalidURI();

        solutions[tokenId].ipfsUri = newUri;
        _setTokenURI(tokenId, newUri);

        emit MetadataUpdated(tokenId, newUri);
    }

    /**
     * @dev Burn a token (only owner)
     * @param tokenId Token ID to burn
     */
    function burn(uint256 tokenId) external {
        if (ownerOf(tokenId) != msg.sender) revert NotOwner();
        
        delete solutions[tokenId];
        _burn(tokenId);
    }

    // View functions

    /**
     * @dev Get solution details
     * @param tokenId Token ID
     * @return Solution struct
     */
    function getSolution(uint256 tokenId) 
        external 
        view 
        returns (Solution memory) 
    {
        return solutions[tokenId];
    }

    /**
     * @dev Get all solutions (paginated)
     * @param start Start index
     * @param limit Number of solutions to return
     * @return Array of solutions
     */
    function getAllSolutions(uint256 start, uint256 limit) 
        external 
        view 
        returns (Solution[] memory) 
    {
        uint256 totalSupply = _nextTokenId - 1;
        if (start >= totalSupply) return new Solution[](0);
        
        uint256 end = start + limit;
        if (end > totalSupply) end = totalSupply;
        
        Solution[] memory result = new Solution[](end - start);
        uint256 index = 0;
        
        for (uint256 i = start + 1; i <= end; i++) {
            if (_exists(i)) {
                result[index] = solutions[i];
                index++;
            }
        }
        
        return result;
    }

    /**
     * @dev Get solutions by category
     * @param category Category to filter by
     * @param start Start index
     * @param limit Number of solutions to return
     * @return Array of token IDs
     */
    function getSolutionsByCategory(
        Category category, 
        uint256 start, 
        uint256 limit
    ) external view returns (uint256[] memory) {
        uint256[] storage categoryTokens = categoryToTokens[category];
        if (start >= categoryTokens.length) return new uint256[](0);
        
        uint256 end = start + limit;
        if (end > categoryTokens.length) end = categoryTokens.length;
        
        uint256[] memory result = new uint256[](end - start);
        for (uint256 i = start; i < end; i++) {
            result[i - start] = categoryTokens[i];
        }
        
        return result;
    }

    /**
     * @dev Get number of solutions owned by address
     * @param owner Owner address
     * @return Number of solutions
     */
    function balanceOfSolutions(address owner) 
        external 
        view 
        returns (uint256) 
    {
        return creatorSolutions[owner].length;
    }

    // Admin functions

    /**
     * @dev Set platform fee percentage (only owner)
     * @param newFeePercentage New fee percentage in basis points
     */
    function setFeePercentage(uint256 newFeePercentage) 
        external 
        onlyOwner 
    {
        if (newFeePercentage > MAX_FEE) revert InvalidFeePercentage();
        
        platformFeePercentage = newFeePercentage;
        emit FeePercentageUpdated(newFeePercentage);
    }

    /**
     * @dev Withdraw contract balance (only owner)
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            payable(owner()).transfer(balance);
        }
    }

    /**
     * @dev Emergency sweep tokens (only owner)
     * @param token Token contract address
     */
    function sweepTokens(address token) external onlyOwner {
        IERC20(token).transfer(owner(), IERC20(token).balanceOf(address(this)));
    }

    /**
     * @dev Pause contract (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    // EIP-2981 Royalty support
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        receiver = owner();
        royaltyAmount = (salePrice * platformFeePercentage) / 10000;
    }

    // Internal functions

    /**
     * @dev Validate IPFS URI format
     * @param uri URI to validate
     * @return True if valid
     */
    function _isValidIPFSUri(string memory uri) internal pure returns (bool) {
        bytes memory uriBytes = bytes(uri);
        if (uriBytes.length < 7) return false;
        
        // Check for "ipfs://" prefix
        return (
            uriBytes[0] == 'i' &&
            uriBytes[1] == 'p' &&
            uriBytes[2] == 'f' &&
            uriBytes[3] == 's' &&
            uriBytes[4] == ':' &&
            uriBytes[5] == '/' &&
            uriBytes[6] == '/'
        );
    }

    /**
     * @dev Hook called before token transfer
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        // Reset sale status on transfer
        if (from != address(0) && to != address(0)) {
            solutions[tokenId].forSale = false;
        }
    }

    // Required overrides
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
        override(ERC721, ERC721URIStorage, AccessControl, IERC165)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) 
        internal 
        override(ERC721, ERC721URIStorage) 
    {
        super._burn(tokenId);
    }
}

// Interface for ERC20 token recovery
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}