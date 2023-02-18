import { ethers } from "hardhat";

async function main() {
  const TestNFT = await ethers.getContractFactory("Daoathon");
  const testNft = await TestNFT.deploy();

  await testNft.deployed();

  console.log(`deployed to ${testNft.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
