// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

contract Shop {
    struct Item {
        uint price;
        uint units;
    }
    uint id;
    mapping(string => Item) public products;

    function addItem(string memory _name, uint _price, uint _units) public {
        products[_name] = Item(_price, _units);
    }

    function getItem(string memory _name) public view returns(Item memory) {
        return products[_name];
    }

    function setItem(string memory _name, uint _price, uint _units) external {
        products[_name].price = _price;
        products[_name].units = _units;
    }
}