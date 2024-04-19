// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Web3Spaces is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenCounter;
    uint256 public mintPrice = 0.0 ether;

    constructor() ERC721("Web3 Spaces", "W3S") Ownable(msg.sender) {}

    function safeMint(string memory uri) public payable {
        require(msg.value >= mintPrice);

        _tokenCounter += 1;
        _safeMint(msg.sender, _tokenCounter);
        _setTokenURI(_tokenCounter, uri);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
