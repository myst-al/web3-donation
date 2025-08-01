const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment to Lisk Sepolia Testnet...");
  console.log("=".repeat(50));
  
  // Validate network
  const network = await hre.ethers.provider.getNetwork();
  console.log(`🔍 Detected network chainId: ${network.chainId}`);
  
  if (Number(network.chainId) !== 4202) {
    throw new Error(`❌ Wrong network! Expected Lisk Sepolia (4202), got ${network.chainId}`);
  }
  
  console.log(`📡 Network: Lisk Sepolia (Chain ID: ${network.chainId})`);
  console.log(`🔗 RPC URL: https://rpc.sepolia-api.lisk.com`);
  
  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 Deployer address: ${deployer.address}`);
  
  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const balanceInEth = hre.ethers.formatEther(balance);
  console.log(`💰 Balance: ${balanceInEth} ETH`);
  
  if (balance < hre.ethers.parseEther("0.01")) {
    console.log("⚠️  Warning: Low balance detected!");
    console.log("💡 Get Lisk Sepolia ETH from: https://sepolia-faucet.lisk.com/");
  }
  
  if (balance === 0n) {
    throw new Error("❌ Insufficient balance for deployment");
  }
  
  console.log("\n📄 Compiling contracts...");
  await hre.run("compile");
  
  console.log("📄 Deploying DonationOrganization contract...");
  
  // Get contract factory
  const DonationOrganization = await hre.ethers.getContractFactory("DonationOrganization");
  
  // Estimate gas
  const deploymentData = DonationOrganization.interface.encodeDeploy([]);
  const estimatedGas = await hre.ethers.provider.estimateGas({
    data: deploymentData
  });
  const gasPrice = await hre.ethers.provider.getFeeData();
  const estimatedCost = estimatedGas * gasPrice.gasPrice;
  
  console.log(`⛽ Estimated gas: ${estimatedGas.toString()}`);
  console.log(`💸 Estimated cost: ${hre.ethers.formatEther(estimatedCost)} ETH`);
  
  // Deploy contract
  console.log("\n🚀 Deploying contract...");
  const donationOrgDeployment = await DonationOrganization.deploy({
    gasLimit: 500000n // Set fixed gas limit higher than minimum required (391260)
  });
  
  console.log(`📝 Transaction hash: ${donationOrgDeployment.deploymentTransaction().hash}`);
  console.log("⏳ Waiting for deployment confirmation...");
  
  const donationOrg = await donationOrgDeployment.waitForDeployment();
  
  // Get transaction receipt
  const txReceipt = await hre.ethers.provider.getTransactionReceipt(donationOrgDeployment.deploymentTransaction().hash);
  
  console.log("\n✅ Contract deployed successfully!");
  console.log(`📍 Contract address: ${await donationOrg.getAddress()}`);
  console.log(`🧾 Gas used: ${txReceipt.gasUsed.toString()}`);
  console.log(`💰 Deployment cost: ${hre.ethers.formatEther(txReceipt.gasUsed * txReceipt.gasPrice)} ETH`);
  
  // Skip waiting for confirmations since waitForTransaction is not implemented
  console.log("\n✅ Contract confirmed on blockchain");
  console.log("ℹ️ Note: Skipped waiting for additional confirmations due to provider limitations");
  
  // Get contract address
  const contractAddress = await donationOrg.getAddress();
  
  // Create deployment record
  const deploymentRecord = {
    contractName: "DonationOrganization",
    contractAddress: contractAddress,
    transactionHash: donationOrgDeployment.deploymentTransaction().hash,
    network: "liskSepolia",
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    blockNumber: txReceipt.blockNumber.toString(),
    gasUsed: txReceipt.gasUsed.toString(),
    gasPrice: txReceipt.gasPrice.toString(),
    deploymentCost: hre.ethers.formatEther(txReceipt.gasUsed * txReceipt.gasPrice),
    timestamp: new Date().toISOString(),
    explorerUrl: `https://sepolia-blockscout.lisk.com/address/${contractAddress}`
  };
  
  // Save deployment record
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  const deploymentFile = path.join(deploymentsDir, `lisk-sepolia-${Date.now()}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentRecord, null, 2));
  
  console.log("\n📋 Deployment Summary:");
  console.log("=".repeat(50));
  console.log(JSON.stringify(deploymentRecord, null, 2));
  
  console.log("\n🔗 Useful Links:");
  console.log(`📊 Contract on Explorer: ${deploymentRecord.explorerUrl}`);
  console.log(`🔍 Transaction: https://sepolia-blockscout.lisk.com/tx/${donationOrgDeployment.deploymentTransaction().hash}`);
  console.log(`💧 Lisk Sepolia Faucet: https://sepolia-faucet.lisk.com/`);
  
  console.log(`\n💾 Deployment record saved to: ${deploymentFile}`);
  
  // Test basic contract functionality
  console.log("\n🧪 Testing basic contract functionality...");
  try {
    const orgCounter = await donationOrg.orgCounter();
    console.log(`✅ Contract is responsive. Current org counter: ${orgCounter.toString()}`);
  } catch (error) {
    console.log("⚠️  Warning: Could not test contract functionality:", error.message);
  }
}

main()
  .then(() => {
    console.log("\n🎉 Deployment completed successfully!");
    console.log("🚀 Your DonationOrganization contract is now live on Lisk Sepolia!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exitCode = 1;
  });