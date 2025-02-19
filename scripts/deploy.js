const hre = require("hardhat");

async function main() {
    const FileStorage = await hre.ethers.getContractFactory("FileStorage");
    const fileStorage = await FileStorage.deploy();
    
    // Wait for deployment to complete
    await fileStorage.waitForDeployment();
    
    // Get the contract address
    console.log("FileStorage deployed to:", await fileStorage.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });