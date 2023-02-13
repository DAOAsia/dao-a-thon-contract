// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract TestNFT is ERC721("Test NFT", "TNFT") {
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
                            '{"image": "ipfs://QmaA1TmDGUa8mBMF7rcMYdjtCBqbq5jM9r5DDRrgRZeH6S", "external_url": "https://ethereum.org/", "description": "tokenURI description!!", "name": "',
                            name(),
                            '", "background_color": "ee82ee"}'
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
                        '{"name": "event TestNFTs", "description": "contractURI description!!!", "image": "ipfs://QmayU4hTAyFQTHTfTAvxdiPCtyMxCW2qZs5SF2kUs4jCbk", "external_link": "https://polygon.technology/"}'
                    )
                )
            );
    }
}
