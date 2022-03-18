// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

contract Parent { 
    uint variable1 = 7;

    function getVariableFromParent() public view returns(uint) {
        return variable1;
    }
}

contract Enfant is Parent {
    uint variable2;

    constructor() {

    }

    function getVariableFromEnfant() public view returns(uint) {
        return this.getVariableFromParent();
    }
}

contract Caller is Enfant {
    Enfant saleGosse = new Enfant();

    function betises() public view returns(uint) {
        return saleGosse.getVariableFromParent();
    }

}