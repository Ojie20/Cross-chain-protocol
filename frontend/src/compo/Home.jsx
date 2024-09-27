import { useState} from "react";
import { tokenAddress, contractAbi, bridgeTokenAddress, bridgeAbi, tokenContractB } from "../contracts/contractUtils.js";
import { ethers } from 'ethers'

const Home = () => {
    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState("");
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [bridgeDirection, setBridgeDirection] = useState("ethToPolygon");
    const [walletAddress, setWalletAddress] = useState("");

     const handleBridgeDirection = (direction) => {
       setBridgeDirection(direction);
     };

    const connectWallet = async () => {
        if (!window.ethereum) return alert("Please install MetaMask!");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
        const signer = provider.getSigner();
        const address = await signer.getAddress()
        console.log(address)
        setAddress(address)
        const contract = new ethers.Contract(tokenAddress, contractAbi, signer);
        console.log(contract);
    }

    const getBalance = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
           tokenAddress,
           contractAbi,
            provider
         );
         const balance = await contract.balanceOf(address);
         setBalance(ethers.utils.formatUnits(balance, 18));
    }

    const transferToken = async() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(tokenAddress, contractAbi, signer);
        const amountToSend = ethers.utils.parseUnits(amount, 18);
        const transferTx = await contract.transfer(recipient, amountToSend);
        await transferTx.wait();
        alert("Transaction successful")
    }

    const truncateAddress = (address) => {
      return address.slice(0, 6) + "..." + address.slice(-4);
    }

    // approve and lock
    const handleBridge = async () => {
      if(!amount || !walletAddress) {
        alert("Please enter amount and connect your wallet");
        return;
      }
     try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      let tokenContractAddress = bridgeDirection === 'ethToPolygon' ? tokenAddress : bridgeTokenAddress;

      const  tokenContract = new ethers.Contract(tokenContractAddress, contractAbi, signer);

      let approvetx = await tokenContract.approve(bridgeTokenAddress, ethers.utils.parseUnits(amount, 18));
      await approvetx.wait();
      alert('Approval successfull! Now locking tokens')

      const bridgeContract = new ethers.Contract(bridgeTokenAddress, bridgeAbi, signer);

      console.log('bridgeContract:', bridgeContract); // Log the bridgeContract instance
    console.log('bridgeAbi:', bridgeAbi); // Log the bridgeAbi

    if (!bridgeContract.lock) {
      console.error('lock function not found in bridgeContract');
      return;
    }

      let lockTx = await bridgeContract.lockTokens(tokenAddress, ethers.utils.parseUnits(amount, 18), 137);
      await lockTx.wait();
      alert('Tokens locked successfully')
      await handleUnlock(walletAddress, amount);

     } catch (error) {
      console.error("Error in bridging", error);
     }
    }

    const handleUnlock = async () => {
      if(!amount || !walletAddress) {
        alert("Please enter amount and connect your wallet");
        return;
      }
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bridgeContract = new ethers.Contract(bridgeTokenAddress, bridgeAbi, signer);

        let unlockTx = await bridgeContract.unlock(tokenContractB, ethers.utils.parseUnits(amount, 18));
        await unlockTx.wait();
        alert('Tokens unlocked successfully')
        } catch (error) {
          console.error("Error in unlocking", error);
        }
    }


  return (
    <div>
      <div>
        {/* TOP Buttons */}
        <div>
          <button
            onClick={() => handleBridgeDirection("ethToPolygon")}
            className={bridgeDirection === "ethToPolygon" ? "active" : ""}
          >
            ETH to Polygon
          </button>

          <button
            onClick={() => handleBridgeDirection("polygonToEth")}
            className={bridgeDirection === "polygonToEth" ? "active" : ""}
          >
            Polygon to ETH
          </button>

          {/* Show the current bridge direction */}
          <p>
            Selected:{" "}
            {bridgeDirection === "ethToPolygon"
              ? "ETH to Polygon"
              : "Polygon to ETH"}
          </p>
        </div>


        {/* middle */}

        <button onClick={connectWallet}>
          {
            walletAddress ? `Connected : ${truncateAddress(address)}` : 'Connect Wallet'
          }
        </button>

        <button onClick={getBalance}>Balance</button>
        {balance && <p>Balance: {balance}</p>}

      </div>
          {/* input */}
      <div>
        <input 
        type="number" 
        placeholder={bridgeDirection === 'ethToPolygon' ? 'ETH' : 'MATIC'} 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} />

        <p>Amount: {amount}</p>
      </div>

      {/* bridge btn */}
      <div>
        <button
          onClick={handleBridge}
        >
          {
            bridgeDirection === 'ethToPolygon' ? 'Bridge to Polygon' : 'Bridge to Ethereum'
            
          }
        </button>
        <button onClick={handleUnlock}>
          Unlock
        </button>
      </div>

      <div>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Recipient Address"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <button onClick={transferToken}>Transfer</button>

      </div>
    </div>
  );
};

export default Home;
