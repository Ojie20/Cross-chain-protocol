require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const apiKey = process.env.API_KEY
const privateKey = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`,
      accounts: [`0x${privateKey}`],
    },
  },
};
