require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const {
  ETHERSCAN_API_KEY,
  INFURA_RINKEBY_URL,
  INFURA_KOVAN_URL,
} = require("./apiKeys");
const { PRIVATE_KEY } = require("./ethPrivateAccounts");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
  networks: {
    rinkeby: {
      url: INFURA_RINKEBY_URL,
      accounts: PRIVATE_KEY.map((account) => account.privateKey),
    },
    kovan: {
      url: INFURA_KOVAN_URL,
      accounts: PRIVATE_KEY.map((account) => account.privateKey),
    },
    sokol: {
      url: "https://sokol.poa.network",
      chainId: 77,
      gasPrice: 20000000000,
      accounts: PRIVATE_KEY.map((account) => account.privateKey),
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  paths: {
    sources: "./src/contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
