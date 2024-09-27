import { useState } from "react";
import { ethers } from "ethers";
import {
  bridgeAbi,
  bridgeTokenAddress,
  contractAbi,
  tokenAddress,
} from "../contracts/contractUtils.js";

const Approve = () => {
  const [tokenAmount, setTokenAmount] = useState("");
  const [chainId, setChainId] = useState("");

  const tokenContractAddress = tokenAddress;
  const tokenContractAbi = contractAbi;
  const bridgeContractAddress = bridgeTokenAddress;
  const abi = bridgeAbi;

  const approveToken = async () => {
    if (!window.ethereum) return console.log("No wallet found");

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    try {
      const tokenContract = new ethers.Contract(
        tokenContractAddress,
        tokenContractAbi,
        signer
      );
      const amountToApprove = ethers.utils.parseUnits(tokenAmount, 18);
      const tx = await tokenContract.approve(
        bridgeTokenAddress,
        amountToApprove
      );
      await tx.wait();
      console.log("Approval Successful");

      await lockTokens(amountToApprove, chainId);
    } catch (error) {
      console.error("Error approving tokens", error);
    }
  };

  const lockTokens = async (amountToApprove, chainId) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    try {
      const bridgeContract = new ethers.Contract(
        bridgeContractAddress,
        abi,
        signer
      );
      const tx = await bridgeContract.lockTokens(amountToApprove, chainId);
      await tx.wait();
      console.log("Tokens locked");
    } catch (error) {
      console.error("Error locking", error);
    }
  };

  return (
    <div>
      <h1>Approve and Lock Tokens</h1>
      <input
        type="text"
        placeholder="Token Amount"
        value={tokenAmount}
        onChange={(e) => setTokenAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="destination"
        value={chainId}
        onChange={(e) => setChainId(e.target.value)}
      />
      <button onClick={approveToken}>Approve and Lock</button>
    </div>
  );
};

export default Approve;
