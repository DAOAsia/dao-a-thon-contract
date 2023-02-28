import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  gasReporter: {
    enabled: true,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    // apiKey: process.env.POLYGONSCAN_API_KEY,
  },
  networks: {
    goerli: {
      url: process.env.GOERLI_ALCHEMY_KEY,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    mumbai: {
      url: process.env.MUMBAI_ALCHEMY_KEY,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
};

export default config;
