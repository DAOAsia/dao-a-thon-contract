// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract Daoathon is ERC721("DAO-A-THON Player", "DAT") {
    uint256 public _tokenId;
    mapping(address => bool) private _hasMinted;

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function mintNft() public {
        require(_hasMinted[msg.sender] == false, "You hava already minted");
        uint256 tokenId = ++_tokenId;
        _safeMint(msg.sender, tokenId);
        _hasMinted[msg.sender] = true;
    }

    function burnNft(uint256 tokenId) public {
        require(msg.sender == ownerOf(tokenId), "Only the owner can burn");
        _burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        _requireMinted(tokenId);
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        abi.encodePacked(
                            '{"image": "ipfs://QmaA1TmDGUa8mBMF7rcMYdjtCBqbq5jM9r5DDRrgRZeH6S", "external_url": "https://ethereum.org/", "description": "The DAO-A-THON is the mixture of hackathon and ideathon that brings together web3 enthusiasts from Japan and around the world to collaborate on decentralized autonomous organization (DAO) projects. The event combines elements of an ideathon and hackathon to address the challenges and limitations faced by current DAOs, such as scaling and decentralization. The goal is to empower and inspire new talents to contribute to the growing ecosystem of DAOs, particularly in nations like Japan where understanding and adoption of decentralized technology are still developing. The event aims to promote the growth of the DAOism movement in Asia and establish it as a leading hub for new communities in this field.", "name": "DAO-A-THON Player", "background_color": "000000"}'
                        )
                    )
                )
            );
    }

    function contractURI() public pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        '{"name": "DAO-A-THON 1st", "description": "The DAO-A-THON is the mixture of hackathon and ideathon that brings together web3 enthusiasts from Japan and around the world to collaborate on decentralized autonomous organization (DAO) projects. The event combines elements of an ideathon and hackathon to address the challenges and limitations faced by current DAOs, such as scaling and decentralization. The goal is to empower and inspire new talents to contribute to the growing ecosystem of DAOs, particularly in nations like Japan where understanding and adoption of decentralized technology are still developing. The event aims to promote the growth of the DAOism movement in Asia and establish it as a leading hub for new communities in this field.", "image": "ipfs://QmayU4hTAyFQTHTfTAvxdiPCtyMxCW2qZs5SF2kUs4jCbk", "external_link": "https://preview.studio.site/live/EjOQb90oqJ/1"}'
                    )
                )
            );
    }
}
