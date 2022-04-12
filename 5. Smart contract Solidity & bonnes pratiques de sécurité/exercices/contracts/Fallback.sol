// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;

contract FallBack {
    mapping(address => uint) balances;

    event LogBadCall(address _sender);
    event LogDeposit(address _sender, uint _quantity);

    function deposit() payable external { balances[msg.sender] += msg.value; emit LogDeposit(msg.sender, msg.value); }
 
    fallback() external payable { require(msg.data.length == 0); emit LogBadCall(msg.sender); }

    receive() external payable { emit LogDeposit(msg.sender, msg.value); }

}