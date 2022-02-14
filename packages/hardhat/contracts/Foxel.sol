pragma solidity >=0.8.4 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Foxel is ERC721, Ownable {
    event minted(address owner, uint256 tokenId);
    uint256 public limit;
    uint256 public price;
    string public baseURI;
    bool public mintEnabled = false;

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor(
        uint256 _limit,
        uint256 _price,
        string memory _baseURI
    ) ERC721("Foxel", "FOXEL") {
        limit = _limit;
        price = _price;
        baseURI = _baseURI;
    }

    function safeMint(address to) public payable returns (uint256) {
        require(mintEnabled || msg.sender == owner(), "Minting is disabled");
        _tokenIdCounter.increment();
        uint256 newItemId = _tokenIdCounter.current();
        require(msg.value >= price, "Not enough funds to mint");

        require(newItemId <= limit, "There are no more Foxels to mint");

        _safeMint(to, newItemId);

        emit minted(msg.sender, newItemId);

        return newItemId;
    }

    function updatePrice(uint256 _price) public onlyOwner {
        require(_price >= 0, "Price must be 0 or greater");
        price = _price;
    }

    function changeMintEnabled(bool _enabled) public onlyOwner {
        mintEnabled = _enabled;
    }

    function withdrawFunds() public onlyOwner {
        uint256 amount = address(this).balance;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed");
    }

    function currentSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}
