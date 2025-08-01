const hre = require("hardhat");
const { getContractAddress } = require("./get-contract-address");

async function main() {
  // Get contract address from environment variable
  const contractAddress = getContractAddress();
  
  console.log("📋 Loading contract from environment configuration...");
  
  console.log("🔗 Connecting to DonationOrganization contract...");
  console.log(`📍 Contract address: ${contractAddress}`);
  
  // Get contract instance
  const DonationOrganization = await hre.ethers.getContractFactory("DonationOrganization");
  const contract = DonationOrganization.attach(contractAddress);
  
  // Get signer
  const [signer] = await hre.ethers.getSigners();
  console.log(`👤 Using account: ${signer.address}`);
  
  try {
    // Test 1: Read orgCounter
    console.log("\n📊 Testing contract read functions...");
    const orgCounter = await contract.orgCounter();
    console.log(`✅ Current organization counter: ${orgCounter.toString()}`);
    
    // Test 2: Create a test organization
    console.log("\n🏢 Creating test organization...");
    
    // Use deployer as approver for testing
    const [deployer] = await hre.ethers.getSigners();
    const testApprovers = [
      deployer.address, // Use deployer address as approver
      signer.address    // Use signer address as second approver
    ];
    
    const createOrgTx = await contract.createOrganization(
      "Test Organization",
      "Testing deployment on Lisk Sepolia",
      2, // threshold
      testApprovers,
      {
        gasLimit: 500000 // Set gas limit
      }
    );
    
    console.log(`📝 Transaction hash: ${createOrgTx.hash}`);
    console.log("⏳ Waiting for confirmation...");
    
    const receipt = await createOrgTx.wait();
    console.log(`✅ Organization created! Gas used: ${receipt.gasUsed.toString()}`);
    
    // Test 3: Read the created organization
    console.log("\n📖 Reading created organization...");
    const newOrgCounter = await contract.orgCounter();
    console.log(`✅ New organization counter: ${newOrgCounter.toString()}`);
    
    // Get organization details
    const org = await contract.organizations(newOrgCounter);
    console.log(`📋 Organization details:`);
    console.log(`   Name: ${org.name}`);
    console.log(`   Purpose: ${org.purpose}`);
    console.log(`   Threshold: ${org.approvalThreshold}`);
    console.log(`   Super Admin: ${org.superAdmin}`);
    console.log(`   Exists: ${org.exists}`);
    
    // Get approvers
    const approvers = await contract.getApprovers(newOrgCounter);
    console.log(`   Approvers: ${approvers.join(", ")}`);
    
    console.log("\n🎉 Contract interaction test completed successfully!");
    
  } catch (error) {
    console.error("❌ Contract interaction failed:");
    console.error(error.message);
    
    // Check if it's a gas estimation error
    if (error.message.includes("gas")) {
      console.log("\n💡 Tip: Try increasing gas limit or check contract state");
    }
    
    // Check if it's a revert error
    if (error.message.includes("revert")) {
      console.log("\n💡 Tip: Check contract requirements and input parameters");
    }
  }
}

main()
  .then(() => {
    console.log("\n✅ Script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:");
    console.error(error);
    process.exit(1);
  });