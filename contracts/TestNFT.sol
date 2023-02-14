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
        return "ipfs://QmZyDPjt35VYvFLB7r76ME78ADMH7ZvuMGbeV4UzbPjPHU";
    }

    function contractURI() public pure returns (string memory) {
        return "ipfs://QmdgXMUVV2fqHC37yPvQ1TsQAdewPrxd4JBZJEWYC2PT3g";
    }
}
