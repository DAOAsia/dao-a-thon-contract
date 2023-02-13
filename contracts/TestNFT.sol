// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestNFT is ERC721("Test NFT", "TNFT") {
    uint256 public _tokenId;

    mapping(uint256 => string) private _tokenURIs;

    function mintNft() public {
        uint256 tokenId = ++_tokenId;
        _safeMint(msg.sender, tokenId);
        _tokenURIs[tokenId] = "TokenURI";
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        _requireMinted(tokenId);
        string memory _tokenURI = _tokenURIs[tokenId];
        return _tokenURI;
    }
}
