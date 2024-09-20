// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DestinationBridge is ChainlinkClient {
    ERC20 public token;
    address public admin;

    mapping(bytes32 => bool) public processedTransactions;

    event TokensUnlocked(address indexed user, uint256 amount, bytes32 transactionId);

    constructor(address _token) {
        token = ERC20(_token); // Token contract address on destination chain
        admin = msg.sender;
        _setPublicChainlinkToken();
    }

    // Function to unlock or mint tokens after Chainlink Oracle relays data
    function unlockTokens(
        address _recipient,
        uint256 _amount,
        bytes32 _transactionId
    ) public onlyAdmin {
        require(!processedTransactions[_transactionId], "Transaction already processed");

        // Mark this transaction as processed
        processedTransactions[_transactionId] = true;

        // Mint or transfer tokens to the user on the destination chain
        token.transfer(_recipient, _amount);

        emit TokensUnlocked(_recipient, _amount, _transactionId);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    // Example Chainlink function to fulfill relayed request (data from Oracle)
    function fulfillUnlockRequest(bytes32 requestId, address user, uint256 amount, bytes32 transactionId) public recordChainlinkFulfillment(requestId) {
        unlockTokens(user, amount, transactionId);
    }
}
