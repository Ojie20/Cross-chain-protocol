// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract JacksonToken is ERC20,  ERC20Permit {
    constructor(uint256 initialSupply)
        ERC20("JacksonToken", "JTK")
        ERC20Permit("JacksonToken")
    {
        _mint(msg.sender, initialSupply * 10 ** decimals());
        console.log("Tokens are successfully minted %s", initialSupply * 10 ** decimals());
        console.log("Contract deployed! Tokens sent to %s", msg.sender);
    }

    function mint(address to, uint256 amount) public  {
        _mint(to, amount);
    }
}
