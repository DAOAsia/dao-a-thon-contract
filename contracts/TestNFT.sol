// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestNFT is ERC721("Test NFT", "TNFT") {
    uint256 public _tokenId;
    mapping(address => bool) private _hasMinted;

    mapping(uint256 => string) private _tokenURIs;

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function mintNft() public {
        require(_hasMinted[msg.sender] == false, "You hava already minted.");
        uint256 tokenId = ++_tokenId;
        _safeMint(msg.sender, tokenId);
        _tokenURIs[tokenId] = "TokenURI";
        _hasMinted[msg.sender] = true;
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
