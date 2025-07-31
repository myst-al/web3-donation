const hre = require("hardhat");

async function main() {
  const DonationOrganization = await hre.ethers.getContractFactory("DonationOrganization");
  const donationOrg = await DonationOrganization.deploy();
  
  await donationOrg.deployed();
  console.log("DonationOrganization deployed to:", donationOrg.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});