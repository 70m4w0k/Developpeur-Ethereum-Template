// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Epargne is Ownable{
    // address private owner;
    event TokenDeposited(uint amount, uint date);

    uint depositDate;
    mapping(uint => uint) deposits;
    uint depositId;

    /*
    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only Owner");
        _;
    }
    */

    function deposit() public payable onlyOwner{
        depositId ++;
        deposits[depositId] = msg.value;
        depositDate = block.timestamp;
        emit TokenDeposited(msg.value, depositDate);
    }

    function removeMoney() public onlyOwner {
        require(block.timestamp > depositDate + 12 weeks, "you need to w8 m8");
        (bool sent, ) = payable(msg.sender).call{value:address(this).balance}("");
        require(sent, "Error in transfer");
    }
}