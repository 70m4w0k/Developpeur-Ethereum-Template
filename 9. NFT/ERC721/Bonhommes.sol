// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;
 
import "./node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./node_modules/@openzeppelin/contracts/utils/Counters.sol";
 
contract Bonhommes is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    struct Bonhommes {
        uint height;
        bool hair;
    }

    Bonhommes[] bonhommes;

    constructor() ERC721 ("Bonhommes", "BH") {}

    function MintBonhommes(address _player, string memory _tokenURI, uint _height, bool _hair) public returns (uint256) {
        _tokenIds.increment();

        bonhommes.push(Bonhommes(_height, _hair));
        uint newItemId = _tokenIds.current();
        _mint(_player, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        return newItemId;
    }
}