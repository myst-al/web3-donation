const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment to Lisk Sepolia...");
  
  // Get network info
  const network = await hre.ethers.provider.getNetwork();
  console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);
  
  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 Deploying with account: ${deployer.address}`);
  
  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${hre.ethers.formatEther(balance)} ETH`);
  
  if (balance === 0n) {
    throw new Error("❌ Insufficient balance for deployment");
  }
  
  console.log("\n📄 Deploying DonationOrganization contract...");
  
  // Deploy contract
  const DonationOrganization = await hre.ethers.getContractFactory("DonationOrganization");
  const donationOrgDeployment = await DonationOrganization.deploy();
  
  console.log("⏳ Waiting for deployment transaction...");
  const donationOrg = await donationOrgDeployment.waitForDeployment();
  
  // Get transaction receipt
  const txReceipt = await hre.ethers.provider.getTransactionReceipt(donationOrgDeployment.deploymentTransaction().hash);
  const contractAddress = await donationOrg.getAddress();
  
  console.log("\n✅ Deployment successful!");
  console.log(`📍 Contract address: ${contractAddress}`);
  console.log(`🔗 Transaction hash: ${donationOrgDeployment.deploymentTransaction().hash}`);
  console.log(`⛽ Gas used: ${txReceipt.gasUsed.toString()}`);
  
  // Skip waiting for confirmations since waitForTransaction is not implemented
  console.log("\n✅ Contract confirmed on blockchain");
  console.log("ℹ️ Note: Skipped waiting for additional confirmations due to provider limitations");
  
  // Verify contract on explorer (if supported)
  if (network.chainId === 4202) { // Lisk Sepolia
    console.log("\n🔍 Contract deployed on Lisk Sepolia");
    console.log(`🌐 View on Lisk Sepolia Explorer: https://sepolia-blockscout.lisk.com/address/${contractAddress}`);
  }
  
  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    contractAddress: contractAddress,
    transactionHash: donationOrgDeployment.deploymentTransaction().hash,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    gasUsed: txReceipt.gasUsed.toString()
  };
  
  // Save deployment information to file
  const fs = require('fs');
  const path = require('path');
  
  // Create deployments directory if it doesn't exist
  const deploymentDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir);
  }

  // Save deployment info to a JSON file
  const deploymentPath = path.join(deploymentDir, `${network.name}-deployment.json`);
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`💾 Deployment info saved to: ${deploymentPath}`);

  console.log("\n📋 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => {
    console.log("\n🎉 Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exitCode = 1;
  });