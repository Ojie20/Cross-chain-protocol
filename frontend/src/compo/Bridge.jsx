import React, { useState } from 'react';
import { ethers } from 'ethers';

function Bridge() {
  const [bridgeDirection, setBridgeDirection] = useState('ethToPolygon'); // Default: ETH to Polygon
  const [walletAddress, setWalletAddress] = useState(''); // For storing wallet address

  // Function to handle bridge direction
  const handleBridgeDirection = (direction) => {
    setBridgeDirection(direction);
  };

  // Function to connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []); // Request wallet connection
        setWalletAddress(accounts[0]); // Store the connected wallet address
      } catch (error) {
        console.error('Error connecting wallet', error);
      }
    } else {
      alert('Please install MetaMask');
    }
  };

  // Function to truncate wallet address for display
  const truncateAddress = (address) => {
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  return (
    <div>
      {/* Buttons for selecting bridge direction */}
      <button
        onClick={() => handleBridgeDirection('ethToPolygon')}
        className={bridgeDirection === 'ethToPolygon' ? 'active' : ''}
      >
        ETH to Polygon
      </button>

      <button
        onClick={() => handleBridgeDirection('polygonToEth')}
        className={bridgeDirection === 'polygonToEth' ? 'active' : ''}
      >
        Polygon to ETH
      </button>

      {/* Show the current bridge direction */}
      <p>Selected: {bridgeDirection === 'ethToPolygon' ? 'ETH to Polygon' : 'Polygon to ETH'}</p>

      {/* Connect Wallet button */}
      <button onClick={connectWallet}>
        {walletAddress ? Connected: ${truncateAddress(walletAddress)} : 'Connect Wallet'}
      </button>
    </div>
  );
}

export default Bridge;
