// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable { 

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        uint sessionId;
        string description;
        uint voteCount;
    }

     /**
     * @dev Status that keep track of the workflow 
     * WorkflowStatus |0|1|2|3|4|5|
     */
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
        require(voters[currentSession][msg.sender].isRegistered, "you are not registred");
        _;
    }

    modifier proposalExists() {
        require(proposals.length > 0, "no proposals to count");
        _;
    }

    modifier withStatus(WorkflowStatus _status) {
        require(_status == wfStatus, "incorrect workflow");
        _;
    }

    // session id => address => Voter
    mapping(uint => mapping(address => Voter)) public voters;

    Proposal[] public proposals;
    Proposal[] public winners;

    uint private currentSession;
    uint private totalVotes;
    uint private totalVoters;
    WorkflowStatus public wfStatus = WorkflowStatus.VotesTallied;
    
    /**
     * @dev Returns all the Proposals that have won the previous sessions as :
     * 
     *          { sessionId, description, numberOfVotes }
     */
    function getWinners() external view returns(Proposal[] memory) {
        return winners;
    }

    /**
     * @dev Returns proposal by id
     */
    function getProposal(uint _proposalId) external view returns(Proposal memory) {
        return proposals[_proposalId];
    }

    /**
     * @dev Returns all proposals
     */
    function getProposals() external view returns(Proposal[] memory) {
        return proposals;
    }

    /**
     * @dev Updates the session # and clears proposals  
     */
    function initialize() internal {
        currentSession++;
        while (proposals.length > 0) {
            proposals.pop();
        }
    }

    /**
     * @dev Updates the workflow status by adding +1 until last status : VotesTallied and go back to zero
     */
    function updateStatus() internal {
        uint newStatus;
        (WorkflowStatus(wfStatus) == WorkflowStatus.VotesTallied)? 
            newStatus = 0 : newStatus = uint(WorkflowStatus(wfStatus)) + 1; 

        emit WorkflowStatusChange(WorkflowStatus(wfStatus), WorkflowStatus(newStatus));

        wfStatus = WorkflowStatus(newStatus);
    }

    /**
     * @dev Allows owner to register addresses for participation 
     * WorkflowStatusChange |0|1|2|3|4|5|
     *                       ^
     */
    function whitelist(address[] memory _addresses) external onlyOwner withStatus(WorkflowStatus.VotesTallied) {
        initialize();

        for (uint i = 0; i < _addresses.length; i++) {
            whitelistOne(_addresses[i]);
        }
    
        updateStatus();
    }

    /**
     * @dev Registers the given address for participation
     */
    function whitelistOne(address _address) internal {
        Voter memory voter = Voter(true, false, 0);
        voters[currentSession][_address] = voter;
        totalVoters++;

        emit VoterRegistered(_address);
    }

    /**
     * @dev Allows owner to unregister address for participation
     */
    function greylist(address _address) external onlyOwner {
        voters[currentSession][_address].isRegistered = false;

        emit VoterUnregistered(_address);
    }

     /**
     * @dev Allows owner to start a proposal session
     * WorkflowStatusChange |0|1|2|3|4|5|
     *                         ^
     */
    function startProposalSession() external onlyOwner withStatus(WorkflowStatus.RegisteringVoters){

        updateStatus();
    }

     /**
     * @dev Allows owner to stop a proposal session
     * WorkflowStatusChange |0|1|2|3|4|5|
     *                           ^
     */
    function stopProposalSession() external onlyOwner proposalExists withStatus(WorkflowStatus.ProposalsRegistrationStarted) {

        updateStatus();
    }

    /**
     * @dev Allows registred voters to propose as many _prop as they want
     */
    function propose(string memory _prop) external onlyRegistred withStatus(WorkflowStatus.ProposalsRegistrationStarted){

        Proposal memory p = Proposal(currentSession, _prop, 0);
        proposals.push(p);

        emit ProposalRegistered(proposals.length-1);
    }

     /**
     * @dev Allows owner to stop a proposal session  
     * WorkflowStatusChange |0|1|2|3|4|5|
     *                             ^
     */
    function startVotingSession() external onlyOwner withStatus(WorkflowStatus.ProposalsRegistrationEnded) {

        updateStatus();
    }

     /**
     * @dev Allows owner to stop a proposal session  
     * WorkflowStatusChange |0|1|2|3|4|5|
     *                               ^
     */
    function stopVotingSession() external onlyOwner withStatus(WorkflowStatus.VotingSessionStarted) {
        require(totalVotes > 0, "no votes yet");
        updateStatus();
    }

    /**
     *  @dev Allows registred voters to vote once for the proposal of their choice
     */
    function vote(uint _propositionId) external onlyRegistred withStatus(WorkflowStatus.VotingSessionStarted) {
        require(!voters[currentSession][msg.sender].hasVoted, "you already voted");

        proposals[_propositionId].voteCount++;
        voters[currentSession][msg.sender].hasVoted = true;
        voters[currentSession][msg.sender].votedProposalId = _propositionId;
        totalVotes++;

        emit Voted(msg.sender, _propositionId);
    }

    /**
    * @dev Allows owner to stop a proposal session  
    * WorkflowStatusChange |0|1|2|3|4|5|
    *                                 ^
    */
    function countVotes() external onlyOwner withStatus(WorkflowStatus.VotingSessionEnded) {

        uint highestVote = getHighestVote();
        setWinners(highestVote);

        updateStatus();
        totalVotes = 0;
    }

    /**
     * @dev Compares all the proposals to the highest vote to manage ties
     */
    function setWinners(uint _highestVote) internal {
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount == _highestVote) {
                winners.push(proposals[i]);
            }
        }
    }

    /**
     * @dev Returns the proposal that have the highest number of votes in the current session
     */
    function getHighestVote() internal view proposalExists returns(uint) {
        uint currentScore;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > currentScore) {
                currentScore = proposals[i].voteCount;
            }
        }
        return currentScore;
    }
} 