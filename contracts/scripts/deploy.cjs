const hre = require('hardhat');

async function main() {
    const spaces = await hre.ethers.deployContract('Web3Spaces');
    await spaces.waitForDeployment();
    console.log(`Web3 Spaces deployed to ${spaces.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});