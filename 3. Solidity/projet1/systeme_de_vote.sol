// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable { 

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    event VoterRegistered(address voterAddress); 
    event VoterUnregistered(address voterAddress);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    
    modifier onlyRegistred() { 
        require(voters[msg.sender].isRegistered, "you are not registred");
        _;
    }

    modifier proposalExists() {
        require(proposals.length > 0, "no proposals to count");
        _;
    }

    modifier proposalSessionOpen() {
        require(isProposalSessionStarted, "proposals session is not yet open");
        _;
    }

    modifier voteSessionOpen() {
        require(isVotingSessionStarted, "proposals session is not yet open");
        _;
    }

    mapping(address => Voter) public voters;

    Proposal[] public proposals;
    Proposal[] public winners;

    bool public isProposalSessionStarted = false; // private
    bool public isVotingSessionStarted = false; // private

    /**
     * @dev Returns proposals that have won previous votes
     */
    function getWinners() external view returns(Proposal[] memory) {
        return winners;
    }

    /**
     * @dev Returns proposal by id
     */
    function getProposal(uint _proposalId) external view returns(string memory) {
        return proposals[_proposalId].description;
    }

    /**
     * @dev Returns all proposals
     */
    function getProposals() external view returns(Proposal[] memory) {
        return proposals;
    }

    /**
     * @dev Allows owner to register addresses for participation 
     * WorkflowStatusChange |1|2|3|4|5|6|
     *                       ^
     */
    function whitelist(address _address) external onlyOwner {
        voters[_address].isRegistered = true;

        emit VoterRegistered(_address); 
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.RegisteringVoters);
    }

    /**
     * @dev Allows owner to unregister addresses for participation
     */
    function greylist(address _address) external onlyOwner {
        voters[_address].isRegistered = false;

        emit VoterUnregistered(_address);
    }

     /**
     * @dev Allows owner to start a proposal session
     * WorkflowStatusChange |1|2|3|4|5|6|
     *                         ^
     */
    function startProposalSession() external onlyOwner {
        require(!isProposalSessionStarted, "proposals session is already open");

        isProposalSessionStarted = true;

        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

     /**
     * @dev Allows owner to stop a proposal session
     * WorkflowStatusChange |1|2|3|4|5|6|
     *                           ^
     */
    function stopProposalSession() external onlyOwner proposalSessionOpen {

        isProposalSessionStarted = false;

        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /**
     * @dev Allows registred voters to propose as many _prop as they want
     */
    function propose(string memory _prop) external onlyRegistred proposalSessionOpen {

        Proposal memory p = Proposal(_prop, 0);
        proposals.push(p);

        emit ProposalRegistered(proposals.length-1);
    }

     /**
     * @dev Allows owner to stop a proposal session  
     * WorkflowStatusChange |1|2|3|4|5|6|
     *                             ^
     */
    function startVotingSession() external onlyOwner proposalExists {
        require(!isVotingSessionStarted, "voting session is already open");

        isVotingSessionStarted = true;

        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

     /**
     * @dev Allows owner to stop a proposal session  
     * WorkflowStatusChange |1|2|3|4|5|6|
     *                               ^
     */
    function stopVotingSession() external onlyOwner voteSessionOpen {

        isVotingSessionStarted = false;

        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /**
     *  @dev Allows registred voters to vote once for the proposal of their choice
     */
    function vote(uint _propositionId) external onlyRegistred voteSessionOpen {
        require(!voters[msg.sender].hasVoted, "you already voted");

        proposals[_propositionId].voteCount++;
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _propositionId;

        emit Voted(msg.sender, _propositionId);
    }

    /**
    * @dev Allows owner to stop a proposal session  
    * WorkflowStatusChange |1|2|3|4|5|6|
    *                                 ^
    */
    function countVotes() external onlyOwner proposalExists {
        require(!isVotingSessionStarted, "the voting session needs to be closed for the count");

        uint highestVote = getHighestVote();
        setWinners(highestVote);

        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }

    /**
     * @dev Compares all the proposals to the highest vote to manage ties
     */
    function setWinners(uint _highestVote) internal {
        for (uint i=0; i < proposals.length; i++) {
            if (proposals[i].voteCount == _highestVote) {
                winners.push(proposals[i]);
            }
        }
    }

    /**
     * @dev Returns the proposal that have the highest number of votes 
     */
    function getHighestVote() internal view proposalExists returns(uint) {
        uint currentScore;
        for (uint i=0; i < proposals.length; i++) {
            if (proposals[i].voteCount > currentScore) {
                currentScore = proposals[i].voteCount;
            }
        }
        return currentScore;
    }
} 