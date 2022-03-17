// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

contract Shop {
    struct Item {
        string name;
        uint price;
        uint units;
    }
    // mapping(string => Item) public products;
    Item[] products;

    function addItem(string memory _name, uint _price, uint _units) public {
        products.push(Item(_name, _price, _units));
    }

    function getItem(uint _id) public view returns(Item memory) {
        return products[_id];
    }

    function setItem(uint _id, string memory _name, uint _price, uint _units) public returns(bool) {
        products[_id].price = _price;
        products[_id].units = _units;
        products[_id].name = _name;
        return true;
    }

    function deleteLastItem() public {
        products.pop();
    }

    function totalItems() public view returns(uint){
        return products.length;
    }

}