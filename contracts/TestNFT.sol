// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract TestNFT is ERC721("Test NFT", "TNFT") {
    uint256 public tokenIds;
    address public admin;
    string public tokenUriImage =
        "ipfs://QmaA1TmDGUa8mBMF7rcMYdjtCBqbq5jM9r5DDRrgRZeH6S";
    string public contractUriJson =
        "ipfs://QmdgXMUVV2fqHC37yPvQ1TsQAdewPrxd4JBZJEWYC2PT3g";

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    function transferAdminship(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "New Admin is the zero address");
        admin = newAdmin;
    }

    function setTokenUriImage(string memory imageCid) external onlyAdmin {
        tokenUriImage = imageCid;
    }

    function setContractUriJson(string memory jsonCid) external onlyAdmin {
        contractUriJson = jsonCid;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override {
        require(
            from == address(0) || to == address(0),
            "Cannot transfer to others"
        );
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function hashMsgSender() public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(msg.sender)));
    }

    function mintNft() external {
        require(balanceOf(msg.sender) == 0, "You hava already minted");
        ++tokenIds;
        _safeMint(msg.sender, hashMsgSender());
    }

    function burnNft() external {
        require(balanceOf(msg.sender) != 0, "Only the owner can burn");
        --tokenIds;
        _burn(hashMsgSender());
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
        return contractUriJson;
    }
}
