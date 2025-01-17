// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol";

interface IERC2981Royalties {
  function royaltyInfo(uint256 _tokenId, uint256 _value) external view returns(address _receiver, uint256 _royaltyAmount);
}


contract Royalties is IERC2981Royalties, ERC165 {

  struct RoyaltyInfo {
    address _recipient;
    uint24 amount;
  }

  mapping(uint256 => RoyaltyInfo) internal _royalties;

  function supportsInterface(bytes4 interfaceId) public view virtual override returns(bool) {
    return interfaceId == type(IERC2981Royalties).interfaceId || super.supportsInterface(interfaceId);
  }

  function _setTokenRoyalty(uint256 tokenId, address recipient, uint256 value) internal {
    require(value <= 10000, 'ERC2981Royalties : Too High');
    _royalties[tokenId] = RoyaltyInfo(recipient, uint24(value));
  }

  function royaltyInfo(uint256 tokenId, uint256 value) external view override returns (address receiver, uint256 royaltyAmount) {
    RoyaltyInfo memory royalties = _royalties[tokenId];
    receiver = royalties._recipient;
    royaltyAmount = (value * royalties.amount) / 10000;
  }
}

contract BonhommesNFT is ERC1155, Royalties {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  struct Bonhommes {
    string name;
    uint height;
    bool hair;
  }

  Bonhommes[] bonhommes;

  constructor() ERC1155("http://bafybeicj3qmcao2yypablayqocwuhvg4diuog6omkjy5pbf4udpwa7f254.ipfs.localhost:8080/") {}

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, Royalties) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function mintBonhommes(address _player, string memory _name, uint _height, bool _hair, uint _number) public returns (uint) {
    _tokenIds.increment();
    bonhommes.push(Bonhommes(_name, _height, _hair));
    uint newItemId = _tokenIds.current();
    _mint(_player, newItemId, _number, "");
    _setTokenRoyalty(newItemId, msg.sender, 1000);
    return newItemId;
  }

  function init() public {
    mintBonhommes(msg.sender, "Parisiens", 170, false, 2*10**6);
    mintBonhommes(msg.sender, "Formateur", 185, true, 1);
  }
}