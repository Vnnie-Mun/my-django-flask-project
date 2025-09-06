// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SolutionNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter;
    
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
    }
    
    mapping(uint256 => Solution) public solutions;
    mapping(address => uint256[]) public creatorSolutions;
    mapping(string => bool) public usedHashes;
    
    event SolutionMinted(uint256 indexed tokenId, address indexed creator, string title, uint256 price);
    event SolutionPurchased(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price);
    event SolutionPriceUpdated(uint256 indexed tokenId, uint256 newPrice);
    
    constructor() ERC721("InnovatorsOfHonour", "IOH") {}
    
    function mintSolution(
        string memory title,
        string memory description,
        string memory category,
        uint256 price,
        string memory coverImageHash,
        string memory solutionFileHash,
        string memory tokenURI
    ) public returns (uint256) {
        require(!usedHashes[solutionFileHash], "Solution already exists");
        require(price > 0, "Price must be greater than 0");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
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
            createdAt: block.timestamp
        });
        
        creatorSolutions[msg.sender].push(tokenId);
        usedHashes[solutionFileHash] = true;
        
        emit SolutionMinted(tokenId, msg.sender, title, price);
        return tokenId;
    }
    
    function purchaseSolution(uint256 tokenId) public payable nonReentrant {
        require(_exists(tokenId), "Solution does not exist");
        require(solutions[tokenId].isForSale, "Solution not for sale");
        require(msg.value >= solutions[tokenId].price, "Insufficient payment");
        require(ownerOf(tokenId) != msg.sender, "Cannot buy your own solution");
        
        address seller = ownerOf(tokenId);
        uint256 price = solutions[tokenId].price;
        
        _transfer(seller, msg.sender, tokenId);
        solutions[tokenId].isForSale = false;
        
        uint256 platformFee = (price * 5) / 100;
        uint256 sellerAmount = price - platformFee;
        
        payable(seller).transfer(sellerAmount);
        payable(owner()).transfer(platformFee);
        
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
        
        emit SolutionPurchased(tokenId, msg.sender, seller, price);
    }
    
    function updatePrice(uint256 tokenId, uint256 newPrice) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(newPrice > 0, "Price must be greater than 0");
        
        solutions[tokenId].price = newPrice;
        solutions[tokenId].isForSale = true;
        
        emit SolutionPriceUpdated(tokenId, newPrice);
    }
    
    function getAllSolutions() public view returns (Solution[] memory) {
        Solution[] memory allSolutions = new Solution[](_tokenIdCounter);
        for (uint256 i = 0; i < _tokenIdCounter; i++) {
            allSolutions[i] = solutions[i];
        }
        return allSolutions;
    }
    
    function getSolutionsForSale() public view returns (Solution[] memory) {
        uint256 forSaleCount = 0;
        for (uint256 i = 0; i < _tokenIdCounter; i++) {
            if (solutions[i].isForSale) {
                forSaleCount++;
            }
        }
        
        Solution[] memory forSaleSolutions = new Solution[](forSaleCount);
        uint256 index = 0;
        for (uint256 i = 0; i < _tokenIdCounter; i++) {
            if (solutions[i].isForSale) {
                forSaleSolutions[index] = solutions[i];
                index++;
            }
        }
        return forSaleSolutions;
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}