const { expect } = require("chai");
const hre = require("hardhat");

describe("JacksonToken", function () {
  it("Should Deploy the token", async function (){
    const initialSupply = 10000000
    const JacksonToken = hre.ethers.deployContract("JacksonToken", [initialSupply])
  });
})