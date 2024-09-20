// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SourceBridge {
    IERC20 public token;
    address public admin;
    
    event TokensLocked(
        address indexed user,
        uint256 amount,
        uint256 targetChainId,
        bytes32 transactionId
    );

    constructor(address _token) {
        token = IERC20(_token);  // Token to be transferred cross-chain
        admin = msg.sender;
    }

    // Lock tokens to begin the cross-chain transfer process
    function lockTokens(uint256 _amount, uint256 _targetChainId) external {
        require(_amount > 0, "Amount must be greater than 0");

        // Transfer tokens from user to the bridge contract
        token.transferFrom(msg.sender, address(this), _amount);

        // Generate unique transaction ID
        bytes32 transactionId = keccak256(
            abi.encodePacked(msg.sender, _amount, block.timestamp)
        );

        // Emit event for Chainlink Oracle to capture
        emit TokensLocked(msg.sender, _amount, _targetChainId, transactionId);
    }
}
