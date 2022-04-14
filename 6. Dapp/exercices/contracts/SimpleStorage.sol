// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

contract SimpleStorage {
    uint storageData;

    function get() public view returns(uint) {
        return storageData;
    }
    
    function set(uint n) public {
        storageData = n;
    }

    function increment(uint n) public {
        storageData = storageData + n;
    }

    function decrement(uint n) public {
        storageData = storageData - n;
    }

}