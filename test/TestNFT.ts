import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TestNFT", function () {
  async function deployFixture() {
    const [user1, user2, user3, deployer] = await ethers.getSigners();

    const TestNFT = await ethers.getContractFactory("TestNFT");
    const testNft = await TestNFT.connect(deployer).deploy();

    const user1Hash = await testNft.connect(user1).hashMsgSender();
    const user2Hash = await testNft.connect(user2).hashMsgSender();

    return { testNft, user1, user2, user3, user1Hash, user2Hash, deployer };
  }

  describe("Deployment", function () {
    it("Should deploy", async function () {
      const { testNft, user1, user2, user1Hash, user2Hash, deployer } = await loadFixture(deployFixture);
    });

    it("Should check initial tokenUriImage", async function () {
      const { testNft, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await testNft.tokenUriImage()).to.equal("ipfs://QmaA1TmDGUa8mBMF7rcMYdjtCBqbq5jM9r5DDRrgRZeH6S");
    });

    it("Should check initial contractUriJson", async function () {
      const { testNft, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await testNft.contractUriJson()).to.equal("ipfs://QmdgXMUVV2fqHC37yPvQ1TsQAdewPrxd4JBZJEWYC2PT3g");
    });

    it("Should check admin", async function () {
      const { testNft, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await testNft.admin()).to.equal(deployer.address);
    });

    it("Should check pausable", async function () {
      const { testNft, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await testNft.paused()).to.equal(false);
    });
  });

  describe("mintNft", function () {
    it("Should mint #1 by user1", async function () {
      const { testNft, user1, user2, user1Hash, user2Hash } = await loadFixture(deployFixture);

      expect(await testNft.tokenIds()).to.equal(0);
      await expect(testNft.ownerOf(user1Hash)).to.be.revertedWith("ERC721: invalid token ID");
      await expect(testNft.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await testNft.balanceOf(user1.address)).to.equal(0);
      expect(await testNft.balanceOf(user2.address)).to.equal(0);

      await testNft.connect(user1).mintNft();

      expect(await testNft.tokenIds()).to.equal(1);
      expect(await testNft.ownerOf(user1Hash)).to.equal(user1.address);
      await expect(testNft.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await testNft.balanceOf(user1.address)).to.equal(1);
      expect(await testNft.balanceOf(user2.address)).to.equal(0);
    });

    it("Should revert minting #2 by user1", async function () {
      const { testNft, user1, user2, user1Hash, user2Hash } = await loadFixture(deployFixture);

      await testNft.connect(user1).mintNft();

      expect(await testNft.tokenIds()).to.equal(1);
      expect(await testNft.ownerOf(user1Hash)).to.equal(user1.address);
      await expect(testNft.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      
      expect(await testNft.balanceOf(user1.address)).to.equal(1);
      expect(await testNft.balanceOf(user2.address)).to.equal(0);

      await expect(testNft.connect(user1).mintNft()).to.be.revertedWith("You hava already minted");

      expect(await testNft.tokenIds()).to.equal(1);
      expect(await testNft.ownerOf(user1Hash)).to.equal(user1.address);
      await expect(testNft.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      
      expect(await testNft.balanceOf(user1.address)).to.equal(1);
      expect(await testNft.balanceOf(user2.address)).to.equal(0);
    });

    it("Should mint #2 by user2", async function () {
      const { testNft, user1, user2, user1Hash, user2Hash } = await loadFixture(deployFixture);

      await testNft.connect(user1).mintNft();

      expect(await testNft.tokenIds()).to.equal(1);
      expect(await testNft.ownerOf(user1Hash)).to.equal(user1.address);
      await expect(testNft.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      
      expect(await testNft.balanceOf(user1.address)).to.equal(1);
      expect(await testNft.balanceOf(user2.address)).to.equal(0);

      await testNft.connect(user2).mintNft();

      expect(await testNft.tokenIds()).to.equal(2);
      expect(await testNft.ownerOf(user1Hash)).to.equal(user1.address);
      expect(await testNft.ownerOf(user2Hash)).to.equal(user2.address);
      
      expect(await testNft.balanceOf(user1.address)).to.equal(1);
      expect(await testNft.balanceOf(user2.address)).to.equal(1);
    });
  });

  describe("BurnNFT", function () {
    it("Should burn #1 by user1", async function () {
      const { testNft, user1, user2, user1Hash, user2Hash } = await loadFixture(deployFixture);
      
      await testNft.connect(user1).mintNft();
      await testNft.connect(user2).mintNft();

      expect(await testNft.tokenIds()).to.equal(2);
      expect(await testNft.ownerOf(user1Hash)).to.equal(user1.address);
      expect(await testNft.ownerOf(user2Hash)).to.equal(user2.address);
      
      expect(await testNft.balanceOf(user1.address)).to.equal(1);
      expect(await testNft.balanceOf(user2.address)).to.equal(1);

      await testNft.connect(user1).burnNft();

      expect(await testNft.tokenIds()).to.equal(1);
      await expect(testNft.ownerOf(user1Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await testNft.ownerOf(user2Hash)).to.equal(user2.address);
      
      expect(await testNft.balanceOf(user1.address)).to.equal(0);
      expect(await testNft.balanceOf(user2.address)).to.equal(1);
    });

    it("Should burn #2 by user2", async function () {
      const { testNft, user1, user2, user1Hash, user2Hash } = await loadFixture(deployFixture);
      
      await testNft.connect(user1).mintNft();
      await testNft.connect(user2).mintNft();

      expect(await testNft.tokenIds()).to.equal(2);
      expect(await testNft.ownerOf(user1Hash)).to.equal(user1.address);
      expect(await testNft.ownerOf(user2Hash)).to.equal(user2.address);
      
      expect(await testNft.balanceOf(user1.address)).to.equal(1);
      expect(await testNft.balanceOf(user2.address)).to.equal(1);

      await testNft.connect(user2).burnNft();

      expect(await testNft.tokenIds()).to.equal(1);
      expect(await testNft.ownerOf(user1Hash)).to.equal(user1.address);
      await expect(testNft.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      
      expect(await testNft.balanceOf(user1.address)).to.equal(1);
      expect(await testNft.balanceOf(user2.address)).to.equal(0);
    });

    it("Should revert burning by non owner", async function () {
      const { testNft, user1, user2, user1Hash, user2Hash } = await loadFixture(deployFixture);

      expect(await testNft.tokenIds()).to.equal(0);
      await expect(testNft.ownerOf(user1Hash)).to.be.revertedWith("ERC721: invalid token ID");
      await expect(testNft.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await testNft.balanceOf(user1.address)).to.equal(0);
      expect(await testNft.balanceOf(user2.address)).to.equal(0);

      await expect(testNft.connect(user1).burnNft()).to.be.revertedWith("Only the owner can burn");
    });

    it("Should mint again", async function () {
      const { testNft, user1, user2, user1Hash, user2Hash } = await loadFixture(deployFixture);
      
      await testNft.connect(user1).mintNft();

      expect(await testNft.tokenIds()).to.equal(1);
      expect(await testNft.ownerOf(user1Hash)).to.equal(user1.address);
      expect(await testNft.balanceOf(user1.address)).to.equal(1);

      await testNft.connect(user1).burnNft();

      expect(await testNft.tokenIds()).to.equal(0);
      await expect(testNft.ownerOf(user1Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await testNft.balanceOf(user1.address)).to.equal(0);
      
      await testNft.connect(user1).mintNft();

      expect(await testNft.tokenIds()).to.equal(1);
      expect(await testNft.ownerOf(user1Hash)).to.equal(user1.address);
      expect(await testNft.balanceOf(user1.address)).to.equal(1);
    });
  });

  describe("transferAdminship", function () {
    it("Should transfer admin", async function () {
      const { testNft, deployer, user1, user2 } = await loadFixture(deployFixture);

      expect(await testNft.admin()).to.equal(deployer.address);

      await testNft.connect(deployer).transferAdminship(user1.address);

      expect(await testNft.admin()).to.equal(user1.address);

      await testNft.connect(user1).transferAdminship(deployer.address);

      expect(await testNft.admin()).to.equal(deployer.address);
    });

    it("Should revert transferring admin from non deployer", async function () {
      const { testNft, deployer, user1, user2 } = await loadFixture(deployFixture);

      expect(await testNft.admin()).to.equal(deployer.address);

      await expect(testNft.connect(user1).transferAdminship(user1.address)).to.be.revertedWith("Only admin");

      expect(await testNft.admin()).to.equal(deployer.address);
    });

    it("Should revert transferring admin to zero address", async function () {
      const { testNft, deployer, user1, user2 } = await loadFixture(deployFixture);

      expect(await testNft.admin()).to.equal(deployer.address);

      await expect(testNft.connect(deployer).transferAdminship(ethers.constants.AddressZero)).to.be.revertedWith("New Admin is the zero address");

      expect(await testNft.admin()).to.equal(deployer.address);
    });
  });

  describe("setTokenUriImage", function () {
    it("Should read initial vale of tokenUriImage", async function () {
      const { testNft, deployer, user1, user2 } = await loadFixture(deployFixture);

      expect(await testNft.tokenUriImage()).to.equal("ipfs://QmaA1TmDGUa8mBMF7rcMYdjtCBqbq5jM9r5DDRrgRZeH6S");
    });
    
    it("Should set new tokenUriImage by admin", async function () {
      const { testNft, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await testNft.tokenUriImage()).to.equal("ipfs://QmaA1TmDGUa8mBMF7rcMYdjtCBqbq5jM9r5DDRrgRZeH6S");

      await testNft.connect(deployer).setTokenUriImage("new tokenUriImage");

      expect(await testNft.tokenUriImage()).to.equal("new tokenUriImage");

      await testNft.connect(deployer).setTokenUriImage("new tokenUriImage 2");

      expect(await testNft.tokenUriImage()).to.equal("new tokenUriImage 2");
    });
    
    it("Should revert setting new tokenUriImage by non admin", async function () {
      const { testNft, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await testNft.tokenUriImage()).to.equal("ipfs://QmaA1TmDGUa8mBMF7rcMYdjtCBqbq5jM9r5DDRrgRZeH6S");

      await expect(testNft.connect(user1).setTokenUriImage("new tokenUriImage")).to.be.revertedWith("Only admin");

      expect(await testNft.tokenUriImage()).to.equal("ipfs://QmaA1TmDGUa8mBMF7rcMYdjtCBqbq5jM9r5DDRrgRZeH6S");
    });
  });

  describe("setContractUriJson", function () {
    it("Should read initial vale of tokenUriImage", async function () {
      const { testNft, deployer, user1, user2 } = await loadFixture(deployFixture);

      expect(await testNft.contractUriJson()).to.equal("ipfs://QmdgXMUVV2fqHC37yPvQ1TsQAdewPrxd4JBZJEWYC2PT3g");
    });
    
    it("Should set new contractUriJson by admin", async function () {
      const { testNft, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await testNft.contractUriJson()).to.equal("ipfs://QmdgXMUVV2fqHC37yPvQ1TsQAdewPrxd4JBZJEWYC2PT3g");

      await testNft.connect(deployer).setContractUriJson("new contractUriJson");

      expect(await testNft.contractUriJson()).to.equal("new contractUriJson");

      await testNft.connect(deployer).setContractUriJson("new contractUriJson 2");

      expect(await testNft.contractUriJson()).to.equal("new contractUriJson 2");
    });
    
    it("Should revert setting new contractUriJson by non admin", async function () {
      const { testNft, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await testNft.contractUriJson()).to.equal("ipfs://QmdgXMUVV2fqHC37yPvQ1TsQAdewPrxd4JBZJEWYC2PT3g");

      await expect(testNft.connect(user1).setContractUriJson("new contractUriJson")).to.be.revertedWith("Only admin");

      expect(await testNft.contractUriJson()).to.equal("ipfs://QmdgXMUVV2fqHC37yPvQ1TsQAdewPrxd4JBZJEWYC2PT3g");
    });
  });

  describe("non transfer", function () {
    it("Should revert transferring by user1", async function () {
      const { testNft, deployer, user1, user2, user3, user1Hash, user2Hash } = await loadFixture(deployFixture);

      await testNft.connect(user1).mintNft();
      await testNft.connect(user2).mintNft();

      await expect(testNft.connect(user1).transferFrom(user1.address, user3.address, user1Hash)).to.be.revertedWith("Cannot transfer to others");
    });
    
    it("Should revert transferring by user2", async function () {
      const { testNft, deployer, user1, user2, user3, user1Hash, user2Hash } = await loadFixture(deployFixture);

      await testNft.connect(user1).mintNft();
      await testNft.connect(user2).mintNft();

      await expect(testNft.connect(user2).transferFrom(user2.address, user3.address, user2Hash)).to.be.revertedWith("Cannot transfer to others");
    });
  });

  describe("pausable", function () {
    it("Should pause by admin", async function () {
      const { testNft, deployer, user1, user2, user3, user1Hash, user2Hash } = await loadFixture(deployFixture);

      expect(await testNft.paused()).to.equal(false);

      await testNft.connect(deployer).pause();

      expect(await testNft.paused()).to.equal(true);
    });

    it("Should unpause by admin", async function () {
      const { testNft, deployer, user1, user2, user3, user1Hash, user2Hash } = await loadFixture(deployFixture);

      expect(await testNft.paused()).to.equal(false);

      await testNft.connect(deployer).pause();

      expect(await testNft.paused()).to.equal(true);

      await testNft.connect(deployer).unpause();

      expect(await testNft.paused()).to.equal(false);
    });

    it("Should revert pausing by non admin", async function () {
      const { testNft, deployer, user1, user2, user3, user1Hash, user2Hash } = await loadFixture(deployFixture);

      expect(await testNft.paused()).to.equal(false);

      await expect(testNft.connect(user1).pause()).to.be.revertedWith("Only admin");

      expect(await testNft.paused()).to.equal(false);
    });

    it("Should revert minting when paused", async function () {
      const { testNft, deployer, user1, user2, user3, user1Hash, user2Hash } = await loadFixture(deployFixture);

      expect(await testNft.paused()).to.equal(false);

      expect(await testNft.tokenIds()).to.equal(0);
      await expect(testNft.ownerOf(user1Hash)).to.be.revertedWith("ERC721: invalid token ID");
      await expect(testNft.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await testNft.balanceOf(user1.address)).to.equal(0);
      expect(await testNft.balanceOf(user2.address)).to.equal(0);

      await testNft.connect(user1).mintNft();

      expect(await testNft.tokenIds()).to.equal(1);
      expect(await testNft.ownerOf(user1Hash)).to.equal(user1.address);
      await expect(testNft.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await testNft.balanceOf(user1.address)).to.equal(1);
      expect(await testNft.balanceOf(user2.address)).to.equal(0);

      await testNft.connect(deployer).pause();

      expect(await testNft.paused()).to.equal(true);

      await expect(testNft.connect(user2).mintNft()).to.be.revertedWith("Pausable: paused")

      expect(await testNft.tokenIds()).to.equal(1);
      expect(await testNft.ownerOf(user1Hash)).to.equal(user1.address);
      await expect(testNft.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await testNft.balanceOf(user1.address)).to.equal(1);
      expect(await testNft.balanceOf(user2.address)).to.equal(0);

      await testNft.connect(deployer).unpause();

      expect(await testNft.paused()).to.equal(false);

      await testNft.connect(user2).mintNft();

      expect(await testNft.tokenIds()).to.equal(2);
      expect(await testNft.ownerOf(user1Hash)).to.equal(user1.address);
      expect(await testNft.ownerOf(user2Hash)).to.equal(user2.address);
      expect(await testNft.balanceOf(user1.address)).to.equal(1);
      expect(await testNft.balanceOf(user2.address)).to.equal(1);
    });

    it("Should burn when paused", async function () {
      const { testNft, user1, user2, user1Hash, user2Hash, deployer } = await loadFixture(deployFixture);
      
      await testNft.connect(user1).mintNft();
      await testNft.connect(user2).mintNft();

      expect(await testNft.paused()).to.equal(false);
      expect(await testNft.tokenIds()).to.equal(2);
      expect(await testNft.ownerOf(user1Hash)).to.equal(user1.address);
      expect(await testNft.ownerOf(user2Hash)).to.equal(user2.address);
      
      expect(await testNft.balanceOf(user1.address)).to.equal(1);
      expect(await testNft.balanceOf(user2.address)).to.equal(1);

      expect(await testNft.paused()).to.equal(false);

      await testNft.connect(user1).burnNft();

      expect(await testNft.tokenIds()).to.equal(1);
      await expect(testNft.ownerOf(user1Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await testNft.ownerOf(user2Hash)).to.equal(user2.address);
      
      expect(await testNft.balanceOf(user1.address)).to.equal(0);
      expect(await testNft.balanceOf(user2.address)).to.equal(1);

      await testNft.connect(deployer).pause();

      expect(await testNft.paused()).to.equal(true);

      await testNft.connect(user2).burnNft();

      expect(await testNft.tokenIds()).to.equal(0);
      await expect(testNft.ownerOf(user1Hash)).to.be.revertedWith("ERC721: invalid token ID");
      await expect(testNft.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await testNft.balanceOf(user1.address)).to.equal(0);
      expect(await testNft.balanceOf(user2.address)).to.equal(0);
    });
  });
});
