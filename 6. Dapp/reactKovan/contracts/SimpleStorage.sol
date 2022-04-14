// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

contract SimpleStorage {
  uint storedData;

  event valueSet(uint _value);

  function set(uint x) public {
    storedData = x;
    emit valueSet(x);
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
