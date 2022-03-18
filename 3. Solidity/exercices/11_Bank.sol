// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Bank is Ownable { 
    mapping(address => uint) private _balances;

    function deposit(uint _amount) public {
        require(msg.sender != address(0), "You cannot deposit in the holy address");
        _balances[msg.sender] += _amount;
    }

    function transfer(uint _amount, address _to) public {
        require(msg.sender != address(0), "You cannot transfer to the holy address");
        require(_balances[msg.sender] >= _amount, "Not enough money :(");
        _balances[_to] += _amount;
        _balances[msg.sender] -= _amount;
    }

    function balanceOf(address _address) public view returns(uint) {
        return _balances[_address];
    }
}