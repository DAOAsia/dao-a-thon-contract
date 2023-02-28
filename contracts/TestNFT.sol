// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract TestNFT is ERC721, Pausable {
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

    function onlyAdmin() internal view {
        if (msg.sender != admin) revert("Only admin");
    }

    function transferAdminship(address newAdmin) external {
        onlyAdmin();
        bool isZeroAddress;
        assembly {
            isZeroAddress := iszero(newAdmin)
        }
        if (isZeroAddress) revert("New Admin is the zero address");
        admin = newAdmin;
    }

    function pause() public {
        onlyAdmin();
        _pause();
    }

    function unpause() public {
        onlyAdmin();
        _unpause();
    }

    function setTokenUriImage(string calldata imageCid) external {
        onlyAdmin();
        tokenUriImage = imageCid;
    }

    function setContractUriJson(string calldata jsonCid) external {
        onlyAdmin();
        contractUriJson = jsonCid;
    }

    function setExternalUrl(string calldata _externalUrl) external {
        onlyAdmin();
        externalUrl = _externalUrl;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override {
        bool fromIsZero;
        bool toIsZero;
        assembly {
            fromIsZero := iszero(from)
            toIsZero := iszero(to)
        }
        if (!fromIsZero && !toIsZero) revert("Cannot transfer to others");
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function hashMsgSender() public view returns (uint256) {
        return uint256(keccak256(abi.encode(msg.sender)));
    }

    function mintNft() external whenNotPaused {
        unchecked {
            ++tokenIds;
        }
        _safeMint(msg.sender, hashMsgSender());
    }

    function burnNft() external {
        unchecked {
            --tokenIds;
        }
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
                            '", "',
                            externalUrl,
                            '": "https://ethereum.org/", "description": "tokenURI description. tokenURI description.", "name": "Test NFT Player", "background_color": "000000"}'
                        )
                    )
                )
            );
    }

    function contractURI() public view returns (string memory) {
        return contractUriJson;
    }
}
