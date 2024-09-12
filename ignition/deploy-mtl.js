const { vars } = require("hardhat/config")

const main = async () => {
  const [deployer] = (await hre.ethers.getSigners())
  const accountBalance = (await deployer.getBalance())

  console.log('Deploying contracts with the account: ', deployer.address)
  console.log('Account balance: ', accountBalance.toString())

  let contractFactory = await hre.ethers.getContractFactory(
    'TokenMantleTestnet'
  )
  let contract = await contractFactory.deploy(vars.get("SEPOLIA_PRIVATE_KEY"))

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