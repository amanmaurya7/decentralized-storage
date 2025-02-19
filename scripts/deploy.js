const hre = require("hardhat");

async function main() {
    const FileStorage = await hre.ethers.getContractFactory("FileStorage");
    const fileStorage = await FileStorage.deploy();

    await fileStorage.deployed();

    console.log("FileStorage deployed to:", fileStorage.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });