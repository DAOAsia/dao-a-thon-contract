// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract TestNFT is ERC721("Test NFT", "TNFT") {
    uint256 public _tokenId;
    address public admin;
    string public tokenUriImage =
        "ipfs://QmaA1TmDGUa8mBMF7rcMYdjtCBqbq5jM9r5DDRrgRZeH6S";
    string public contractUriImage =
        "ipfs://QmayU4hTAyFQTHTfTAvxdiPCtyMxCW2qZs5SF2kUs4jCbk";

    mapping(address => bool) private _hasMinted;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

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
        _hasMinted[msg.sender] = true;
        _safeMint(msg.sender, _tokenId);
        ++_tokenId;
    }

    function burnNft(uint256 tokenId) public {
        require(msg.sender == ownerOf(tokenId), "Only the owner can burn");
        _burn(tokenId);
    }

    function setTokenUriImage(string memory imageCid) external onlyAdmin {
        tokenUriImage = imageCid;
    }

    function setContractUriImage(string memory imageCid) external onlyAdmin {
        contractUriImage = imageCid;
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
                            '{"image": "',
                            tokenUriImage,
                            '", "external_url": "https://ethereum.org/", "description": "tokenURI description. tokenURI description.", "name": "Test NFT Player", "background_color": "000000"}'
                        )
                    )
                )
            );
    }

    function contractURI() public view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        abi.encodePacked(
                            '{"name": "Test NFT 1st", "description": "contractURI description. contractURI description.", "image": "',
                            contractUriImage,
                            '", "external_link": "https://polygon.technology/"}'
                        )
                    )
                )
            );
    }
}
