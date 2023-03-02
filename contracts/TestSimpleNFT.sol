// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract TestSimpleNFT is ERC721, Pausable {
    uint256 public tokenIds;
    address public admin;
    string public tokenUriImage =
        "ipfs://QmaA1TmDGUa8mBMF7rcMYdjtCBqbq5jM9r5DDRrgRZeH6S";
    string public contractUriJson =
        "ipfs://QmdgXMUVV2fqHC37yPvQ1TsQAdewPrxd4JBZJEWYC2PT3g";
    string public externalUrl = "https://dao-a-thon-front-cp9e.vercel.app/";

    constructor() ERC721("Test NFT", "TNFT") {
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

    function pause() public onlyAdmin {
        _pause();
    }

    function unpause() public onlyAdmin {
        _unpause();
    }

    function setTokenUriImage(string memory imageCid) external onlyAdmin {
        tokenUriImage = imageCid;
    }

    function setContractUriJson(string memory jsonCid) external onlyAdmin {
        contractUriJson = jsonCid;
    }

    function setExternalUrl(string memory _externalUrl) external onlyAdmin {
        externalUrl = _externalUrl;
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

    // function hashMsgSender() public view returns (uint256) {
    //     return uint256(keccak256(abi.encodePacked(msg.sender)));
    // }

    function mintNft() external whenNotPaused {
        // ++tokenIds;
        _safeMint(msg.sender, tokenIds);
        ++tokenIds;
    }

    function burnNft(uint256 tokenId) external {
        // --tokenIds;
        _burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        _requireMinted(tokenId);
        return tokenUriImage;
        // string(
        //     abi.encodePacked(
        //         "data:application/json;base64,",
        //         Base64.encode(
        //             abi.encodePacked(
        //                 '{"image": "',
        //                 tokenUriImage,
        //                 '", "external_url": "',
        //                 externalUrl,
        //                 '": "https://ethereum.org/", "description": "tokenURI description. tokenURI description.", "name": "Test NFT Player", "background_color": "000000"}'
        //             )
        //         )
        //     )
        // );
    }

    function contractURI() public view returns (string memory) {
        return contractUriJson;
    }
}
