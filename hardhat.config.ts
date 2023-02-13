import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
  networks: {
    mumbai: {
      url: process.env.MUMBAI_ALCHEMY_KEY,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
};

export default config;
