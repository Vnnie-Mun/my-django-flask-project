const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying SolutionsMarketplace...");
    
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying with account:", deployer.address);
    
    // Check balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
    
    // Deploy the contract
    const SolutionsMarketplace = await ethers.getContractFactory("SolutionsMarketplace");
    
    console.log("⏳ Deploying contract...");
    const marketplace = await SolutionsMarketplace.deploy();
    
    await marketplace.waitForDeployment();
    const contractAddress = await marketplace.getAddress();
    
    console.log("✅ SolutionsMarketplace deployed to:", contractAddress);
    
    // Verify deployment
    console.log("🔍 Verifying deployment...");
    const name = await marketplace.name();
    const symbol = await marketplace.symbol();
    const owner = await marketplace.owner();
    const platformFee = await marketplace.platformFeePercentage();
    
    console.log("📋 Contract Details:");
    console.log("   Name:", name);
    console.log("   Symbol:", symbol);
    console.log("   Owner:", owner);
    console.log("   Platform Fee:", platformFee.toString(), "basis points");
    
    // Grant minter role to deployer (already done in constructor)
    const MINTER_ROLE = await marketplace.MINTER_ROLE();
    const hasMinterRole = await marketplace.hasRole(MINTER_ROLE, deployer.address);
    console.log("   Minter Role:", hasMinterRole ? "✅ Granted" : "❌ Not granted");
    
    // Save deployment info
    const deploymentInfo = {
        contractAddress: contractAddress,
        deployer: deployer.address,
        network: await deployer.provider.getNetwork(),
        timestamp: new Date().toISOString(),
        gasUsed: "Estimated ~2.5M gas",
        abi: [
            "function safeMint(address,string,string,uint8,uint8,uint8,uint256,string) returns(uint256)",
            "function buySolution(uint256) payable",
            "function setPrice(uint256,uint256)",
            "function getSolution(uint256) view returns(tuple)",
            "function getAllSolutions(uint256,uint256) view returns(tuple[])",
            "function viewSolution(uint256)",
            "function withdraw()",
            "function pause()",
            "function unpause()",
            "event SolutionMinted(uint256 indexed,address indexed,string,uint8,uint256,string)",
            "event SolutionPurchased(uint256 indexed,address indexed,address indexed,uint256)"
        ]
    };
    
    console.log("\n📄 Deployment Summary:");
    console.log(JSON.stringify(deploymentInfo, null, 2));
    
    console.log("\n🎯 Next Steps:");
    console.log("1. Update frontend blockchain.js with contract address:");
    console.log(`   const contractAddress = "${contractAddress}";`);
    console.log("2. Verify contract on Etherscan (if mainnet/testnet)");
    console.log("3. Test minting and purchasing functions");
    console.log("4. Grant additional minter roles if needed");
    
    return contractAddress;
}

// Handle deployment errors
main()
    .then((address) => {
        console.log(`\n🎉 Deployment successful! Contract: ${address}`);
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });