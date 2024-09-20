const { expect } = require("chai");
const hre = require("hardhat");

describe("MantleToken", function () {
  it("Should Deploy the token", async function (){
    const initialSupply = 10000000
    const MantleToken = hre.ethers.deployContract("MantleToken", [initialSupply])
    ;(await MantleToken).waitForDeployment
  });
})