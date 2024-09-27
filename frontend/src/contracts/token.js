import Web3 from "web3";
import { tokenAddress, contractAbi } from "./contractUtils";

export default class Token {
  constructor(provider, tokenAddress) {
    this.web3 = new Web3(provider);
    this.contract = new this.web3.eth.Contract(contractAbi, tokenAddress);
  }

  async getBalance(address) {
    const balance = await this.contract.methods.balanceOf(address).call();
    return this.web3.utils.fromWei(balance, "ether")
  }

  async transfer(fromAddress, toAddress, amount) {
    const weiAmount = this.web3.utils.toWei(amount, "ether")
    const tx = await this.contract.methods.transfer(toAddress, weiAmount).send({
      from: fromAddress,
    });
    return tx;
  }
};

