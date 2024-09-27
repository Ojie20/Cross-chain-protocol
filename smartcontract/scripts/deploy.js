const hre = require("hardhat");

async function main() {
    const tokenAddress = "0x03C7518318DDE9f4B04D0eCDAbA7a41CBE92Cb14";

    const Bridge = await hre.ethers.getContractFactory("Bridge");

    const bridge = await Bridge.deploy(tokenAddress);

    await bridge.waitForDeployment();

    console.log("deployed to:", bridge.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1
})