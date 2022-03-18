// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DuckToken is ERC20 {
    constructor() ERC20("DucK", "DCK") {
    }
}