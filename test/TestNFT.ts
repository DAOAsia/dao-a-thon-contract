import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const initialTokenUriImage: string = "ipfs://QmaA1TmDGUa8mBMF7rcMYdjtCBqbq5jM9r5DDRrgRZeH6S";
const initialContractUriJson: string = "ipfs://QmdgXMUVV2fqHC37yPvQ1TsQAdewPrxd4JBZJEWYC2PT3g";
const initialExternalUrl: string = "https://dao-a-thon-front-cp9e.vercel.app/";

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

    it("Should check token name", async function () {
      const { testNft, user1, user2, user1Hash, user2Hash, deployer } = await loadFixture(deployFixture);

      expect(await testNft.name()).to.equal("Test NFT");
    });

    it("Should check token symbol", async function () {
      const { testNft, user1, user2, user1Hash, user2Hash, deployer } = await loadFixture(deployFixture);

      expect(await testNft.symbol()).to.equal("TNFT");
    });

    it("Should check initial tokenUriImage", async function () {
      const { testNft, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await testNft.tokenUriImage()).to.equal(initialTokenUriImage);
    });

    it("Should check initial contractUriJson", async function () {
      const { testNft, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await testNft.contractUriJson()).to.equal(initialContractUriJson);
    });

    it("Should check initial externalUrl", async function () {
      const { testNft, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await testNft.externalUrl()).to.equal(initialExternalUrl);
    });

    it("Should check tokenIds", async function () {
      const { testNft, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await testNft.tokenIds()).to.equal(0);
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

      await expect(testNft.connect(user1).mintNft()).to.be.revertedWith("ERC721: token already minted");

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

      await expect(testNft.connect(user1).burnNft()).to.be.reverted;
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

  describe("tokenURI", function () {
    it("Should read initial vale of tokenURI", async function () {
      const { testNft, deployer, user1, user2, user1Hash } = await loadFixture(deployFixture);

      expect(await testNft.tokenIds()).to.equal(0);
      await expect(testNft.ownerOf(user1Hash)).to.be.revertedWith("ERC721: invalid token ID");
  
      await testNft.connect(user1).mintNft();

      expect(await testNft.balanceOf(user1.address)).to.equal(1);
      expect(await testNft.ownerOf(user1Hash)).to.equal(user1.address);
      
      const decodedTokenUri = JSON.parse(atob((await testNft.tokenURI(user1Hash)).split(",")[1]));
      
      expect(decodedTokenUri.image).to.equal(initialTokenUriImage);
      expect(decodedTokenUri.external_url).to.equal(initialExternalUrl);
      expect(decodedTokenUri.description).to.equal("tokenURI description. tokenURI description.");
      expect(decodedTokenUri.name).to.equal("Test NFT Player");
      expect(decodedTokenUri.background_color).to.equal("000000");
    });
  });

  describe("setTokenUriImage", function () {
    it("Should read initial vale of tokenUriImage", async function () {
      const { testNft, deployer, user1, user2 } = await loadFixture(deployFixture);

      expect(await testNft.tokenUriImage()).to.equal(initialTokenUriImage);
    });
    
    it("Should set new tokenUriImage by admin", async function () {
      const { testNft, user1, user2, deployer, user1Hash } = await loadFixture(deployFixture);

      await testNft.connect(user1).mintNft();

      expect(await testNft.tokenUriImage()).to.equal(initialTokenUriImage);
      expect(JSON.parse(atob((await testNft.tokenURI(user1Hash)).split(",")[1])).image).to.equal(initialTokenUriImage);

      await testNft.connect(deployer).setTokenUriImage("new tokenUriImage");

      expect(await testNft.tokenUriImage()).to.equal("new tokenUriImage");
      expect(JSON.parse(atob((await testNft.tokenURI(user1Hash)).split(",")[1])).image).to.equal("new tokenUriImage");

      await testNft.connect(deployer).setTokenUriImage("new tokenUriImage 2");

      expect(await testNft.tokenUriImage()).to.equal("new tokenUriImage 2");
      expect(JSON.parse(atob((await testNft.tokenURI(user1Hash)).split(",")[1])).image).to.equal("new tokenUriImage 2");
    });
    
    it("Should revert setting new tokenUriImage by non admin", async function () {
      const { testNft, user1, user2, deployer, user1Hash } = await loadFixture(deployFixture);

      await testNft.connect(user1).mintNft();

      expect(await testNft.tokenUriImage()).to.equal(initialTokenUriImage);
      expect(JSON.parse(atob((await testNft.tokenURI(user1Hash)).split(",")[1])).image).to.equal(initialTokenUriImage);

      await expect(testNft.connect(user1).setTokenUriImage("new tokenUriImage")).to.be.revertedWith("Only admin");

      expect(await testNft.tokenUriImage()).to.equal(initialTokenUriImage);
      expect(JSON.parse(atob((await testNft.tokenURI(user1Hash)).split(",")[1])).image).to.equal(initialTokenUriImage);
    });
  });

  describe("setContractUriJson", function () {
    it("Should read initial vale of tokenUriImage", async function () {
      const { testNft, deployer, user1, user2 } = await loadFixture(deployFixture);

      expect(await testNft.contractUriJson()).to.equal(initialContractUriJson);
    });
    
    it("Should set new contractUriJson by admin", async function () {
      const { testNft, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await testNft.contractUriJson()).to.equal(initialContractUriJson);

      await testNft.connect(deployer).setContractUriJson("new contractUriJson");

      expect(await testNft.contractUriJson()).to.equal("new contractUriJson");

      await testNft.connect(deployer).setContractUriJson("new contractUriJson 2");

      expect(await testNft.contractUriJson()).to.equal("new contractUriJson 2");
    });
    
    it("Should revert setting new contractUriJson by non admin", async function () {
      const { testNft, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await testNft.contractUriJson()).to.equal(initialContractUriJson);

      await expect(testNft.connect(user1).setContractUriJson("new contractUriJson")).to.be.revertedWith("Only admin");

      expect(await testNft.contractUriJson()).to.equal(initialContractUriJson);
    });
  });

  describe("setExternalUrl", function () {
    it("Should read initial vale of externalUrl", async function () {
      const { testNft, deployer, user1, user2 } = await loadFixture(deployFixture);

      expect(await testNft.externalUrl()).to.equal(initialExternalUrl);
    });
    
    it("Should set new externalUrl by admin", async function () {
      const { testNft, user1, user2, deployer, user1Hash } = await loadFixture(deployFixture);

      await testNft.connect(user1).mintNft();

      expect(await testNft.externalUrl()).to.equal(initialExternalUrl);
      expect(JSON.parse(atob((await testNft.tokenURI(user1Hash)).split(",")[1])).external_url).to.equal(initialExternalUrl);

      await testNft.connect(deployer).setExternalUrl("new externalUrl");

      expect(await testNft.externalUrl()).to.equal("new externalUrl");
      expect(JSON.parse(atob((await testNft.tokenURI(user1Hash)).split(",")[1])).external_url).to.equal("new externalUrl");

      await testNft.connect(deployer).setExternalUrl("new externalUrl 2");

      expect(await testNft.externalUrl()).to.equal("new externalUrl 2");
      expect(JSON.parse(atob((await testNft.tokenURI(user1Hash)).split(",")[1])).external_url).to.equal("new externalUrl 2");
    });
    
    it("Should revert setting new externalUrl by non admin", async function () {
      const { testNft, user1, user2, deployer, user1Hash } = await loadFixture(deployFixture);

      await testNft.connect(user1).mintNft();

      expect(await testNft.externalUrl()).to.equal(initialExternalUrl);
      expect(JSON.parse(atob((await testNft.tokenURI(user1Hash)).split(",")[1])).external_url).to.equal(initialExternalUrl);

      await expect(testNft.connect(user1).setExternalUrl("new externalUrl")).to.be.revertedWith("Only admin");

      expect(await testNft.externalUrl()).to.equal(initialExternalUrl);
      expect(JSON.parse(atob((await testNft.tokenURI(user1Hash)).split(",")[1])).external_url).to.equal(initialExternalUrl);
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
