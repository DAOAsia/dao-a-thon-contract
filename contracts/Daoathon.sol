// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract Daoathon is ERC721, Pausable {
    uint256 public tokenIds;
    address public admin;
    string public tokenUriImage =
        "ipfs://Qme91E5bV9FUuRh4Us9hMyhobfsVKQ3ui4AQ87NoqrLhGe";
    string public contractUriJson =
        "ipfs://QmUvxmsBqjBsSciC9oLJnVBqZKXDkgsy67WnRA2oHc88b7";
    string public externalUrl = "https://dao-a-thon-front-cp9e.vercel.app/";

    constructor() ERC721("DAO-A-THON Player", "DAT") {
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

    function hashMsgSender() public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(msg.sender)));
    }

    function mintNft() external whenNotPaused {
        ++tokenIds;
        _safeMint(msg.sender, hashMsgSender());
    }

    function burnNft() external {
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
                            '", "external_url": "',
                            externalUrl,
                            '", "description": "The DAO-A-THON is the mixture of hackathon and ideathon that brings together web3 enthusiasts from Japan and around the world to collaborate on decentralized autonomous organization (DAO) projects. The event combines elements of an ideathon and hackathon to address the challenges and limitations faced by current DAOs, such as scaling and decentralization. The goal is to empower and inspire new talents to contribute to the growing ecosystem of DAOs, particularly in nations like Japan where understanding and adoption of decentralized technology are still developing. The event aims to promote the growth of the DAOism movement in Asia and establish it as a leading hub for new communities in this field.", "name": "DAO-A-THON Player", "background_color": "000000"}'
                        )
                    )
                )
            );
    }

    function contractURI() public view returns (string memory) {
        return contractUriJson;
    }
}
