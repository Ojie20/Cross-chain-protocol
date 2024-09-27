// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

//key concept ===== Mint/lock =========== Burn/release

contract Bridge {
    
    IERC20 public token;
    mapping (address => uint256) public lockedTokens;

    event TokensLocked(address indexed user, uint256 amount, uint256 destinationChainId);
    
    event TokensReleasedOnPolygon(address indexed user, uint256 amount);

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    function lockTokens(uint256 amount, uint256 destinationChainId) external {
        require(amount > 0, "Amount must be greater than zero");

        //transfer from user to pool
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer Failed");

        //add to lockedTokens
        lockedTokens[msg.sender] += amount;

        //log
        emit TokensLocked(msg.sender, amount, destinationChainId);
    }

    //release token
    function releaseTokens(address user, uint256 amount) external {
        require(lockedTokens[user] >= amount, "Insuffiecient Locked tokens");

        lockedTokens[user] -= amount;

        require(token.transfer(user, amount), "Transfer Failed");

           emit TokensReleasedOnPolygon(user, amount);

    }

}