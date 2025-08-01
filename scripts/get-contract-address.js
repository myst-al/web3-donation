require('dotenv').config();

/**
 * Utility script untuk mendapatkan alamat kontrak dari environment variable
 */
function getContractAddress() {
  const contractAddress = process.env.DONATION_ORGANIZATION_CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.error("❌ DONATION_ORGANIZATION_CONTRACT_ADDRESS tidak ditemukan di file .env");
    console.log("💡 Pastikan Anda sudah menjalankan deployment dan menambahkan alamat kontrak ke .env");
    process.exit(1);
  }
  
  return contractAddress;
}

function getNetworkConfig() {
  return {
    networkName: process.env.NETWORK_NAME || 'liskSepolia',
    chainId: process.env.CHAIN_ID || '4202',
    contractAddress: getContractAddress()
  };
}

// Jika script dijalankan langsung
if (require.main === module) {
  console.log("📋 Informasi Kontrak:");
  console.log("=".repeat(50));
  
  const config = getNetworkConfig();
  console.log(`🌐 Network: ${config.networkName}`);
  console.log(`🔗 Chain ID: ${config.chainId}`);
  console.log(`📍 Contract Address: ${config.contractAddress}`);
  console.log(`🌍 Explorer: https://sepolia-blockscout.lisk.com/address/${config.contractAddress}`);
  
  console.log("\n✅ Alamat kontrak berhasil dimuat dari environment variable!");
}

module.exports = {
  getContractAddress,
  getNetworkConfig
};