import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const initialTokenUriImage: string = "ipfs://Qme91E5bV9FUuRh4Us9hMyhobfsVKQ3ui4AQ87NoqrLhGe";
const initialContractUriJson: string = "ipfs://QmUvxmsBqjBsSciC9oLJnVBqZKXDkgsy67WnRA2oHc88b7";
const initialExternalUrl = "https://dao-a-thon-front-cp9e.vercel.app/";

describe("Daoathon", function () {
  async function deployFixture() {
    const [user1, user2, user3, deployer] = await ethers.getSigners();

    const Daoathon = await ethers.getContractFactory("Daoathon");
    const daoathon = await Daoathon.connect(deployer).deploy();

    const user1Hash = await daoathon.connect(user1).hashMsgSender();
    const user2Hash = await daoathon.connect(user2).hashMsgSender();

    return { daoathon, user1, user2, user3, user1Hash, user2Hash, deployer };
  }

  describe("Deployment", function () {
    it("Should deploy", async function () {
      const { daoathon, user1, user2, user1Hash, user2Hash, deployer } = await loadFixture(deployFixture);
    });

    it("Should check token name", async function () {
      const { daoathon, user1, user2, user1Hash, user2Hash, deployer } = await loadFixture(deployFixture);

      expect(await daoathon.name()).to.equal("DAO-A-THON Player");
    });

    it("Should check token symbol", async function () {
      const { daoathon, user1, user2, user1Hash, user2Hash, deployer } = await loadFixture(deployFixture);

      expect(await daoathon.symbol()).to.equal("DAT");
    });

    it("Should check initial tokenUriImage", async function () {
      const { daoathon, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await daoathon.tokenUriImage()).to.equal(initialTokenUriImage);
    });

    it("Should check initial contractUriJson", async function () {
      const { daoathon, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await daoathon.contractUriJson()).to.equal(initialContractUriJson);
    });

    it("Should check initial externalUrl", async function () {
      const { daoathon, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await daoathon.externalUrl()).to.equal(initialExternalUrl);
    });

    it("Should check tokenIds", async function () {
      const { daoathon, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await daoathon.tokenIds()).to.equal(0);
    });

    it("Should check admin", async function () {
      const { daoathon, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await daoathon.admin()).to.equal(deployer.address);
    });

    it("Should check pausable", async function () {
      const { daoathon, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await daoathon.paused()).to.equal(false);
    });
  });

  describe("mintNft", function () {
    it("Should mint #1 by user1", async function () {
      const { daoathon, user1, user2, user1Hash, user2Hash } = await loadFixture(deployFixture);

      expect(await daoathon.tokenIds()).to.equal(0);
      await expect(daoathon.ownerOf(user1Hash)).to.be.revertedWith("ERC721: invalid token ID");
      await expect(daoathon.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await daoathon.balanceOf(user1.address)).to.equal(0);
      expect(await daoathon.balanceOf(user2.address)).to.equal(0);

      await daoathon.connect(user1).mintNft();

      expect(await daoathon.tokenIds()).to.equal(1);
      expect(await daoathon.ownerOf(user1Hash)).to.equal(user1.address);
      await expect(daoathon.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await daoathon.balanceOf(user1.address)).to.equal(1);
      expect(await daoathon.balanceOf(user2.address)).to.equal(0);
    });

    it("Should revert minting #2 by user1", async function () {
      const { daoathon, user1, user2, user1Hash, user2Hash } = await loadFixture(deployFixture);

      await daoathon.connect(user1).mintNft();

      expect(await daoathon.tokenIds()).to.equal(1);
      expect(await daoathon.ownerOf(user1Hash)).to.equal(user1.address);
      await expect(daoathon.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      
      expect(await daoathon.balanceOf(user1.address)).to.equal(1);
      expect(await daoathon.balanceOf(user2.address)).to.equal(0);

      await expect(daoathon.connect(user1).mintNft()).to.be.revertedWith("ERC721: token already minted");

      expect(await daoathon.tokenIds()).to.equal(1);
      expect(await daoathon.ownerOf(user1Hash)).to.equal(user1.address);
      await expect(daoathon.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      
      expect(await daoathon.balanceOf(user1.address)).to.equal(1);
      expect(await daoathon.balanceOf(user2.address)).to.equal(0);
    });

    it("Should mint #2 by user2", async function () {
      const { daoathon, user1, user2, user1Hash, user2Hash } = await loadFixture(deployFixture);

      await daoathon.connect(user1).mintNft();

      expect(await daoathon.tokenIds()).to.equal(1);
      expect(await daoathon.ownerOf(user1Hash)).to.equal(user1.address);
      await expect(daoathon.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      
      expect(await daoathon.balanceOf(user1.address)).to.equal(1);
      expect(await daoathon.balanceOf(user2.address)).to.equal(0);

      await daoathon.connect(user2).mintNft();

      expect(await daoathon.tokenIds()).to.equal(2);
      expect(await daoathon.ownerOf(user1Hash)).to.equal(user1.address);
      expect(await daoathon.ownerOf(user2Hash)).to.equal(user2.address);
      
      expect(await daoathon.balanceOf(user1.address)).to.equal(1);
      expect(await daoathon.balanceOf(user2.address)).to.equal(1);
    });
  });

  describe("BurnNFT", function () {
    it("Should burn #1 by user1", async function () {
      const { daoathon, user1, user2, user1Hash, user2Hash } = await loadFixture(deployFixture);
      
      await daoathon.connect(user1).mintNft();
      await daoathon.connect(user2).mintNft();

      expect(await daoathon.tokenIds()).to.equal(2);
      expect(await daoathon.ownerOf(user1Hash)).to.equal(user1.address);
      expect(await daoathon.ownerOf(user2Hash)).to.equal(user2.address);
      
      expect(await daoathon.balanceOf(user1.address)).to.equal(1);
      expect(await daoathon.balanceOf(user2.address)).to.equal(1);

      await daoathon.connect(user1).burnNft();

      expect(await daoathon.tokenIds()).to.equal(1);
      await expect(daoathon.ownerOf(user1Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await daoathon.ownerOf(user2Hash)).to.equal(user2.address);
      
      expect(await daoathon.balanceOf(user1.address)).to.equal(0);
      expect(await daoathon.balanceOf(user2.address)).to.equal(1);
    });

    it("Should burn #2 by user2", async function () {
      const { daoathon, user1, user2, user1Hash, user2Hash } = await loadFixture(deployFixture);
      
      await daoathon.connect(user1).mintNft();
      await daoathon.connect(user2).mintNft();

      expect(await daoathon.tokenIds()).to.equal(2);
      expect(await daoathon.ownerOf(user1Hash)).to.equal(user1.address);
      expect(await daoathon.ownerOf(user2Hash)).to.equal(user2.address);
      
      expect(await daoathon.balanceOf(user1.address)).to.equal(1);
      expect(await daoathon.balanceOf(user2.address)).to.equal(1);

      await daoathon.connect(user2).burnNft();

      expect(await daoathon.tokenIds()).to.equal(1);
      expect(await daoathon.ownerOf(user1Hash)).to.equal(user1.address);
      await expect(daoathon.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      
      expect(await daoathon.balanceOf(user1.address)).to.equal(1);
      expect(await daoathon.balanceOf(user2.address)).to.equal(0);
    });

    it("Should revert burning by non owner", async function () {
      const { daoathon, user1, user2, user1Hash, user2Hash } = await loadFixture(deployFixture);

      expect(await daoathon.tokenIds()).to.equal(0);
      await expect(daoathon.ownerOf(user1Hash)).to.be.revertedWith("ERC721: invalid token ID");
      await expect(daoathon.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await daoathon.balanceOf(user1.address)).to.equal(0);
      expect(await daoathon.balanceOf(user2.address)).to.equal(0);

      await expect(daoathon.connect(user1).burnNft()).to.be.reverted;
    });

    it("Should mint again", async function () {
      const { daoathon, user1, user2, user1Hash, user2Hash } = await loadFixture(deployFixture);
      
      await daoathon.connect(user1).mintNft();

      expect(await daoathon.tokenIds()).to.equal(1);
      expect(await daoathon.ownerOf(user1Hash)).to.equal(user1.address);
      expect(await daoathon.balanceOf(user1.address)).to.equal(1);

      await daoathon.connect(user1).burnNft();

      expect(await daoathon.tokenIds()).to.equal(0);
      await expect(daoathon.ownerOf(user1Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await daoathon.balanceOf(user1.address)).to.equal(0);
      
      await daoathon.connect(user1).mintNft();

      expect(await daoathon.tokenIds()).to.equal(1);
      expect(await daoathon.ownerOf(user1Hash)).to.equal(user1.address);
      expect(await daoathon.balanceOf(user1.address)).to.equal(1);
    });
  });

  describe("transferAdminship", function () {
    it("Should transfer admin", async function () {
      const { daoathon, deployer, user1, user2 } = await loadFixture(deployFixture);

      expect(await daoathon.admin()).to.equal(deployer.address);

      await daoathon.connect(deployer).transferAdminship(user1.address);

      expect(await daoathon.admin()).to.equal(user1.address);

      await daoathon.connect(user1).transferAdminship(deployer.address);

      expect(await daoathon.admin()).to.equal(deployer.address);
    });

    it("Should revert transferring admin from non deployer", async function () {
      const { daoathon, deployer, user1, user2 } = await loadFixture(deployFixture);

      expect(await daoathon.admin()).to.equal(deployer.address);

      await expect(daoathon.connect(user1).transferAdminship(user1.address)).to.be.revertedWith("Only admin");

      expect(await daoathon.admin()).to.equal(deployer.address);
    });

    it("Should revert transferring admin to zero address", async function () {
      const { daoathon, deployer, user1, user2 } = await loadFixture(deployFixture);

      expect(await daoathon.admin()).to.equal(deployer.address);

      await expect(daoathon.connect(deployer).transferAdminship(ethers.constants.AddressZero)).to.be.revertedWith("New Admin is the zero address");

      expect(await daoathon.admin()).to.equal(deployer.address);
    });
  });

  describe("tokenURI", function () {
    it("Should read initial vale of tokenURI", async function () {
      const { daoathon, deployer, user1, user2, user1Hash } = await loadFixture(deployFixture);

      expect(await daoathon.tokenIds()).to.equal(0);
      await expect(daoathon.ownerOf(user1Hash)).to.be.revertedWith("ERC721: invalid token ID");
  
      await daoathon.connect(user1).mintNft();

      expect(await daoathon.balanceOf(user1.address)).to.equal(1);
      expect(await daoathon.ownerOf(user1Hash)).to.equal(user1.address);
      
      const decodedTokenUri = JSON.parse(atob((await daoathon.tokenURI(user1Hash)).split(",")[1]));
      
      expect(decodedTokenUri.image).to.equal(initialTokenUriImage);
      expect(decodedTokenUri.external_url).to.equal(initialExternalUrl);
      expect(decodedTokenUri.description).to.equal("The DAO-A-THON is the mixture of hackathon and ideathon that brings together web3 enthusiasts from Japan and around the world to collaborate on decentralized autonomous organization (DAO) projects. The event combines elements of an ideathon and hackathon to address the challenges and limitations faced by current DAOs, such as scaling and decentralization. The goal is to empower and inspire new talents to contribute to the growing ecosystem of DAOs, particularly in nations like Japan where understanding and adoption of decentralized technology are still developing. The event aims to promote the growth of the DAOism movement in Asia and establish it as a leading hub for new communities in this field.");
      expect(decodedTokenUri.name).to.equal("DAO-A-THON Player");
      expect(decodedTokenUri.background_color).to.equal("000000");
    });
  });

  describe("setTokenUriImage", function () {
    it("Should read initial vale of tokenUriImage", async function () {
      const { daoathon, deployer, user1, user2 } = await loadFixture(deployFixture);

      expect(await daoathon.tokenUriImage()).to.equal(initialTokenUriImage);
    });
    
    it("Should set new tokenUriImage by admin", async function () {
      const { daoathon, user1, user2, deployer, user1Hash } = await loadFixture(deployFixture);

      await daoathon.connect(user1).mintNft();

      expect(await daoathon.tokenUriImage()).to.equal(initialTokenUriImage);
      expect(JSON.parse(atob((await daoathon.tokenURI(user1Hash)).split(",")[1])).image).to.equal(initialTokenUriImage);

      await daoathon.connect(deployer).setTokenUriImage("new tokenUriImage");

      expect(await daoathon.tokenUriImage()).to.equal("new tokenUriImage");
      expect(JSON.parse(atob((await daoathon.tokenURI(user1Hash)).split(",")[1])).image).to.equal("new tokenUriImage");

      await daoathon.connect(deployer).setTokenUriImage("new tokenUriImage 2");

      expect(await daoathon.tokenUriImage()).to.equal("new tokenUriImage 2");
      expect(JSON.parse(atob((await daoathon.tokenURI(user1Hash)).split(",")[1])).image).to.equal("new tokenUriImage 2");
    });
    
    it("Should revert setting new tokenUriImage by non admin", async function () {
      const { daoathon, user1, user2, deployer, user1Hash } = await loadFixture(deployFixture);

      await daoathon.connect(user1).mintNft();

      expect(await daoathon.tokenUriImage()).to.equal(initialTokenUriImage);
      expect(JSON.parse(atob((await daoathon.tokenURI(user1Hash)).split(",")[1])).image).to.equal(initialTokenUriImage);

      await expect(daoathon.connect(user1).setTokenUriImage("new tokenUriImage")).to.be.revertedWith("Only admin");

      expect(await daoathon.tokenUriImage()).to.equal(initialTokenUriImage);
      expect(JSON.parse(atob((await daoathon.tokenURI(user1Hash)).split(",")[1])).image).to.equal(initialTokenUriImage);
    });
  });

  describe("setContractUriJson", function () {
    it("Should read initial vale of tokenUriImage", async function () {
      const { daoathon, deployer, user1, user2 } = await loadFixture(deployFixture);

      expect(await daoathon.contractUriJson()).to.equal(initialContractUriJson);
    });
    
    it("Should set new contractUriJson by admin", async function () {
      const { daoathon, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await daoathon.contractUriJson()).to.equal(initialContractUriJson);

      await daoathon.connect(deployer).setContractUriJson("new contractUriJson");

      expect(await daoathon.contractUriJson()).to.equal("new contractUriJson");

      await daoathon.connect(deployer).setContractUriJson("new contractUriJson 2");

      expect(await daoathon.contractUriJson()).to.equal("new contractUriJson 2");
    });
    
    it("Should revert setting new contractUriJson by non admin", async function () {
      const { daoathon, user1, user2, deployer } = await loadFixture(deployFixture);

      expect(await daoathon.contractUriJson()).to.equal(initialContractUriJson);

      await expect(daoathon.connect(user1).setContractUriJson("new contractUriJson")).to.be.revertedWith("Only admin");

      expect(await daoathon.contractUriJson()).to.equal(initialContractUriJson);
    });
  });

  describe("setExternalUrl", function () {
    it("Should read initial vale of externalUrl", async function () {
      const { daoathon, deployer, user1, user2 } = await loadFixture(deployFixture);

      expect(await daoathon.externalUrl()).to.equal(initialExternalUrl);
    });
    
    it("Should set new externalUrl by admin", async function () {
      const { daoathon, user1, user2, deployer, user1Hash } = await loadFixture(deployFixture);

      await daoathon.connect(user1).mintNft();

      expect(await daoathon.externalUrl()).to.equal(initialExternalUrl);
      expect(JSON.parse(atob((await daoathon.tokenURI(user1Hash)).split(",")[1])).external_url).to.equal(initialExternalUrl);

      await daoathon.connect(deployer).setExternalUrl("new externalUrl");

      expect(await daoathon.externalUrl()).to.equal("new externalUrl");
      expect(JSON.parse(atob((await daoathon.tokenURI(user1Hash)).split(",")[1])).external_url).to.equal("new externalUrl");

      await daoathon.connect(deployer).setExternalUrl("new externalUrl 2");

      expect(await daoathon.externalUrl()).to.equal("new externalUrl 2");
      expect(JSON.parse(atob((await daoathon.tokenURI(user1Hash)).split(",")[1])).external_url).to.equal("new externalUrl 2");
    });
    
    it("Should revert setting new externalUrl by non admin", async function () {
      const { daoathon, user1, user2, deployer, user1Hash } = await loadFixture(deployFixture);

      await daoathon.connect(user1).mintNft();

      expect(await daoathon.externalUrl()).to.equal(initialExternalUrl);
      expect(JSON.parse(atob((await daoathon.tokenURI(user1Hash)).split(",")[1])).external_url).to.equal(initialExternalUrl);

      await expect(daoathon.connect(user1).setExternalUrl("new externalUrl")).to.be.revertedWith("Only admin");

      expect(await daoathon.externalUrl()).to.equal(initialExternalUrl);
      expect(JSON.parse(atob((await daoathon.tokenURI(user1Hash)).split(",")[1])).external_url).to.equal(initialExternalUrl);
    });
  });

  describe("non transfer", function () {
    it("Should revert transferring by user1", async function () {
      const { daoathon, deployer, user1, user2, user3, user1Hash, user2Hash } = await loadFixture(deployFixture);

      await daoathon.connect(user1).mintNft();
      await daoathon.connect(user2).mintNft();

      await expect(daoathon.connect(user1).transferFrom(user1.address, user3.address, user1Hash)).to.be.revertedWith("Cannot transfer to others");
    });
    
    it("Should revert transferring by user2", async function () {
      const { daoathon, deployer, user1, user2, user3, user1Hash, user2Hash } = await loadFixture(deployFixture);

      await daoathon.connect(user1).mintNft();
      await daoathon.connect(user2).mintNft();

      await expect(daoathon.connect(user2).transferFrom(user2.address, user3.address, user2Hash)).to.be.revertedWith("Cannot transfer to others");
    });
  });

  describe("pausable", function () {
    it("Should pause by admin", async function () {
      const { daoathon, deployer, user1, user2, user3, user1Hash, user2Hash } = await loadFixture(deployFixture);

      expect(await daoathon.paused()).to.equal(false);

      await daoathon.connect(deployer).pause();

      expect(await daoathon.paused()).to.equal(true);
    });

    it("Should unpause by admin", async function () {
      const { daoathon, deployer, user1, user2, user3, user1Hash, user2Hash } = await loadFixture(deployFixture);

      expect(await daoathon.paused()).to.equal(false);

      await daoathon.connect(deployer).pause();

      expect(await daoathon.paused()).to.equal(true);

      await daoathon.connect(deployer).unpause();

      expect(await daoathon.paused()).to.equal(false);
    });

    it("Should revert pausing by non admin", async function () {
      const { daoathon, deployer, user1, user2, user3, user1Hash, user2Hash } = await loadFixture(deployFixture);

      expect(await daoathon.paused()).to.equal(false);

      await expect(daoathon.connect(user1).pause()).to.be.revertedWith("Only admin");

      expect(await daoathon.paused()).to.equal(false);
    });

    it("Should revert minting when paused", async function () {
      const { daoathon, deployer, user1, user2, user3, user1Hash, user2Hash } = await loadFixture(deployFixture);

      expect(await daoathon.paused()).to.equal(false);

      expect(await daoathon.tokenIds()).to.equal(0);
      await expect(daoathon.ownerOf(user1Hash)).to.be.revertedWith("ERC721: invalid token ID");
      await expect(daoathon.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await daoathon.balanceOf(user1.address)).to.equal(0);
      expect(await daoathon.balanceOf(user2.address)).to.equal(0);

      await daoathon.connect(user1).mintNft();

      expect(await daoathon.tokenIds()).to.equal(1);
      expect(await daoathon.ownerOf(user1Hash)).to.equal(user1.address);
      await expect(daoathon.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await daoathon.balanceOf(user1.address)).to.equal(1);
      expect(await daoathon.balanceOf(user2.address)).to.equal(0);

      await daoathon.connect(deployer).pause();

      expect(await daoathon.paused()).to.equal(true);

      await expect(daoathon.connect(user2).mintNft()).to.be.revertedWith("Pausable: paused")

      expect(await daoathon.tokenIds()).to.equal(1);
      expect(await daoathon.ownerOf(user1Hash)).to.equal(user1.address);
      await expect(daoathon.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await daoathon.balanceOf(user1.address)).to.equal(1);
      expect(await daoathon.balanceOf(user2.address)).to.equal(0);

      await daoathon.connect(deployer).unpause();

      expect(await daoathon.paused()).to.equal(false);

      await daoathon.connect(user2).mintNft();

      expect(await daoathon.tokenIds()).to.equal(2);
      expect(await daoathon.ownerOf(user1Hash)).to.equal(user1.address);
      expect(await daoathon.ownerOf(user2Hash)).to.equal(user2.address);
      expect(await daoathon.balanceOf(user1.address)).to.equal(1);
      expect(await daoathon.balanceOf(user2.address)).to.equal(1);
    });

    it("Should burn when paused", async function () {
      const { daoathon, user1, user2, user1Hash, user2Hash, deployer } = await loadFixture(deployFixture);
      
      await daoathon.connect(user1).mintNft();
      await daoathon.connect(user2).mintNft();

      expect(await daoathon.paused()).to.equal(false);
      expect(await daoathon.tokenIds()).to.equal(2);
      expect(await daoathon.ownerOf(user1Hash)).to.equal(user1.address);
      expect(await daoathon.ownerOf(user2Hash)).to.equal(user2.address);
      
      expect(await daoathon.balanceOf(user1.address)).to.equal(1);
      expect(await daoathon.balanceOf(user2.address)).to.equal(1);

      expect(await daoathon.paused()).to.equal(false);

      await daoathon.connect(user1).burnNft();

      expect(await daoathon.tokenIds()).to.equal(1);
      await expect(daoathon.ownerOf(user1Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await daoathon.ownerOf(user2Hash)).to.equal(user2.address);
      
      expect(await daoathon.balanceOf(user1.address)).to.equal(0);
      expect(await daoathon.balanceOf(user2.address)).to.equal(1);

      await daoathon.connect(deployer).pause();

      expect(await daoathon.paused()).to.equal(true);

      await daoathon.connect(user2).burnNft();

      expect(await daoathon.tokenIds()).to.equal(0);
      await expect(daoathon.ownerOf(user1Hash)).to.be.revertedWith("ERC721: invalid token ID");
      await expect(daoathon.ownerOf(user2Hash)).to.be.revertedWith("ERC721: invalid token ID");
      expect(await daoathon.balanceOf(user1.address)).to.equal(0);
      expect(await daoathon.balanceOf(user2.address)).to.equal(0);
    });
  });
});
