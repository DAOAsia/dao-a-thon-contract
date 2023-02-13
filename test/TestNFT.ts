import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TestNFT", function () {
  async function deployFixture() {
    const [deployer, user1, user2] = await ethers.getSigners();

    const TestNFT = await ethers.getContractFactory("TestNFT");
    const testNft = await TestNFT.connect(deployer).deploy();

    return { testNft, deployer, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should deploy", async function () {
      const { testNft, deployer, user1 } = await loadFixture(deployFixture);
    });
  });

  describe("Mint", function () {
    it("Should mint #1 by user1", async function () {
      const { testNft, user1, user2 } = await loadFixture(deployFixture);

      await expect(testNft.ownerOf(0)).to.be.reverted;
      await expect(testNft.ownerOf(1)).to.be.reverted;
      await expect(testNft.ownerOf(2)).to.be.reverted;
      expect(await testNft.balanceOf(user1.address)).to.equal(0);
      expect(await testNft.balanceOf(user2.address)).to.equal(0);

      await testNft.connect(user1).mintNft();

      await expect(testNft.ownerOf(0)).to.be.reverted;
      expect(await testNft.ownerOf(1)).to.equal(user1.address);
      await expect(testNft.ownerOf(2)).to.be.reverted;
      expect(await testNft.balanceOf(user1.address)).to.equal(1);
      expect(await testNft.balanceOf(user2.address)).to.equal(0);
    });

    it("Should mint #2 by user1", async function () {
      const { testNft, user1, user2 } = await loadFixture(deployFixture);

      await testNft.connect(user1).mintNft();

      await expect(testNft.ownerOf(0)).to.be.reverted;
      expect(await testNft.ownerOf(1)).to.equal(user1.address);
      await expect(testNft.ownerOf(2)).to.be.reverted;
      await expect(testNft.ownerOf(3)).to.be.reverted;
      expect(await testNft.balanceOf(user1.address)).to.equal(1);
      expect(await testNft.balanceOf(user2.address)).to.equal(0);

      await testNft.connect(user1).mintNft();

      await expect(testNft.ownerOf(0)).to.be.reverted;
      expect(await testNft.ownerOf(1)).to.equal(user1.address);
      expect(await testNft.ownerOf(2)).to.equal(user1.address);
      await expect(testNft.ownerOf(3)).to.be.reverted;
      expect(await testNft.balanceOf(user1.address)).to.equal(2);
      expect(await testNft.balanceOf(user2.address)).to.equal(0);
    });

    it("Should mint #2 by user1", async function () {
      const { testNft, user1, user2 } = await loadFixture(deployFixture);

      await testNft.connect(user1).mintNft();
      await testNft.connect(user1).mintNft();

      await expect(testNft.ownerOf(0)).to.be.reverted;
      expect(await testNft.ownerOf(1)).to.equal(user1.address);
      expect(await testNft.ownerOf(2)).to.equal(user1.address);
      await expect(testNft.ownerOf(3)).to.be.reverted;
      await expect(testNft.ownerOf(4)).to.be.reverted;
      expect(await testNft.balanceOf(user1.address)).to.equal(2);
      expect(await testNft.balanceOf(user2.address)).to.equal(0);

      await testNft.connect(user2).mintNft();

      await expect(testNft.ownerOf(0)).to.be.reverted;
      expect(await testNft.ownerOf(1)).to.equal(user1.address);
      expect(await testNft.ownerOf(2)).to.equal(user1.address);
      expect(await testNft.ownerOf(3)).to.equal(user2.address);
      await expect(testNft.ownerOf(4)).to.be.reverted;
      expect(await testNft.balanceOf(user1.address)).to.equal(2);
      expect(await testNft.balanceOf(user2.address)).to.equal(1);
    });
  });

  describe("TokenURI", function () {
    it("Should #1's tokenURI be", async function () {
      const { testNft, user1, user2 } = await loadFixture(deployFixture);

      await expect(testNft.tokenURI(0)).to.be.reverted;
      await expect(testNft.tokenURI(1)).to.be.reverted;
      await expect(testNft.tokenURI(2)).to.be.reverted;

      await testNft.connect(user1).mintNft();

      await expect(testNft.tokenURI(0)).to.be.reverted;
      expect(await testNft.tokenURI(1)).to.equal("TokenURI");
      await expect(testNft.tokenURI(2)).to.be.reverted;
    });

    it("Should #2's tokenURI be", async function () {
      const { testNft, user1, user2 } = await loadFixture(deployFixture);

      await testNft.connect(user1).mintNft();

      await expect(testNft.tokenURI(0)).to.be.reverted;
      expect(await testNft.tokenURI(1)).to.equal("TokenURI");
      await expect(testNft.tokenURI(2)).to.be.reverted;
      await expect(testNft.tokenURI(3)).to.be.reverted;

      await testNft.connect(user1).mintNft();

      await expect(testNft.tokenURI(0)).to.be.reverted;
      expect(await testNft.tokenURI(1)).to.equal("TokenURI");
      expect(await testNft.tokenURI(2)).to.equal("TokenURI");
      await expect(testNft.tokenURI(3)).to.be.reverted;
    });

    it("Should #3's tokenURI be", async function () {
      const { testNft, user1, user2 } = await loadFixture(deployFixture);

      await testNft.connect(user1).mintNft();
      await testNft.connect(user1).mintNft();

      await expect(testNft.tokenURI(0)).to.be.reverted;
      expect(await testNft.tokenURI(1)).to.equal("TokenURI");
      expect(await testNft.tokenURI(2)).to.equal("TokenURI");
      await expect(testNft.tokenURI(3)).to.be.reverted;
      await expect(testNft.tokenURI(4)).to.be.reverted;

      await testNft.connect(user2).mintNft();

      await expect(testNft.tokenURI(0)).to.be.reverted;
      expect(await testNft.tokenURI(1)).to.equal("TokenURI");
      expect(await testNft.tokenURI(2)).to.equal("TokenURI");
      expect(await testNft.tokenURI(3)).to.equal("TokenURI");
      await expect(testNft.tokenURI(4)).to.be.reverted;
    });
  });
});
