// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
 
import "../node_modules/@openzeppelin/contracts/token/ERC20";

contract ERC20Token is ERC20 {
    constructor(uint initialSupply) ERC20("TokenCoin", "TKC") {
        _mint(msg.sender, initialSupply);
    }
}

// abstract contract ERC20Token is ERC20 { }

contract Crowdsale {
    uint public rate = 200;
    ERC20Token public token;

    constructor(uint inititalSupply) {
        token = new ERC20Token(inititalSupply);
    }

    receive() external payable {
        require(msg.value >= 0.1 ether, "You can't send less than 0.1 ether");
        distribute(msg.value);
    }

    function distribute(uint256 _amount) internal {
        uint256 tokensToSend = _amount * rate;
        token.transfer(msg.sender, tokensToSend);
    }
}