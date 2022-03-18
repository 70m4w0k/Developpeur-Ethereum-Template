// SPDX-License-Identifier: GPL-3.0
// 0xE9e1c1CC91950C424631addbd812d960e9505b47
pragma solidity ^0.8.9;

contract Deployed {
    function store(uint256 num) public {}
    function retrieve() public view returns (uint256){}
}

contract Heritage { 
    Deployed dc;

    function call(address _addr) public {
        dc = Deployed(_addr);
    }

    function getA() public view returns(uint result) {
        return dc.retrieve();
    }

    function setA(uint _val) public returns(uint result) {
        dc.store(_val);
        return _val;
    }
}