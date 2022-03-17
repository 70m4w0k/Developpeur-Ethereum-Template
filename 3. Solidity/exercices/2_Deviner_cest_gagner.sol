// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.1;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract DevinerCEstGagner is Ownable {
    string private solution;
    string clue;

    mapping(address => bool) hasAlreadyPlayed;

    function setSolution(string memory _solution) public onlyOwner {
        solution = _solution;
    }

    function getClue() public view returns(string memory) {
        return clue;
    }

    function initiateGame(string memory _solution, string memory _clue) public onlyOwner {
        setSolution(_solution);
        clue = _clue;
    }

    function guess(string memory _guess) public returns(bool) {
        require(!hasAlreadyPlayed[msg.sender], "you have already played ! Wait for next round");
        hasAlreadyPlayed[msg.sender] = true;
        if (keccak256(abi.encodePacked(_guess)) == keccak256(abi.encodePacked(solution))) {
            return true;
        } else {
            return false;
        }
    }
}