const ethers = require('ethers')


async function main() {

    const jsonAbi = require("../artifacts/contracts/Web3Spaces.sol/Web3Spaces.json").abi;

    const iface = new ethers.Interface(jsonAbi);
    console.log(iface.format(ethers.utils.FormatTypes.full));

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});