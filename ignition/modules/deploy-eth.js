const hre = require("hardhat");

const main = async () => {
  const [deployer] = await hre.ethers.getSigners()
  const accountBalance = await deployer.getBalance()
  console.log('Deploying contracts with account: ', deployer.address)
  console.log('Account balance: ', accountBalance.toString())

  let contractFactory = await hre.ethers.getContractFactory('ERC20Token')
  let contract = await contractFactory.deploy(
    1000000
  )

  await contract.deployed()

  console.log(
    'contract TokenMantleTestnet deployed to address: ',
    contract.address
  )
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

runMain()