// voting.test.js 
const { BN, ether, expectRevert } = require('@openzeppelin/test-helpers');
const expectEvent = require('@openzeppelin/test-helpers/src/expectEvent');
const { assertion } = require('@openzeppelin/test-helpers/src/expectRevert');
const { expect } = require('chai');
const Voting = artifacts.require('Voting');
contract('VOTING', function (accounts) {
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    
    beforeEach(async function () {
        this.VotingInstance = await Voting.new({from: owner});
    });

    // ::::::::::::: GETTERS ::::::::::::: //

    it('get voter revert because caller is not voter', async function () {
        expectRevert(this.VotingInstance.getVoter(voter1, {from: owner}), "You're not a voter");
    });

    it('get voter works', async function () {
        await this.VotingInstance.addVoter(voter1, {from: owner});
        let newVoter = await this.VotingInstance.getVoter(voter1, {from: voter1}); 
        expect(newVoter.isRegistered).to.equal(true, "Voter is not registred");
        expect(newVoter.hasVoted).to.equal(false, "Voter has already voted");
        expect(newVoter.votedProposalId).to.be.bignumber.equal(new BN(0), "Voter has allready voted");
    });

    it('get one proposal revert because caller is not voter', async function () {
        await this.VotingInstance.addVoter(voter1, {from: owner});
        await this.VotingInstance.startProposalsRegistering({from: owner});
        await this.VotingInstance.addProposal("description 1", {from: voter1});
        expectRevert(this.VotingInstance.getOneProposal(0, {from: owner}), "You're not a voter");
    });

    it('get one proposal works', async function () {
        await this.VotingInstance.addVoter(voter1, {from: owner});
        await this.VotingInstance.startProposalsRegistering({from: owner});
        await this.VotingInstance.addProposal("description 1", {from: voter1});
        let proposal = await this.VotingInstance.getOneProposal(0, {from: voter1});

        expect(proposal.description).to.equal("description 1", "Proposal description doesn't fit");
        expect(proposal.voteCount).to.be.bignumber.equal(new BN(0), "Proposal already contains a vote");
    });

    // ::::::::::::: STATE ::::::::::::: //

    it('start proposals registering revert because wrong WorkflowStatus', async function () {
        await this.VotingInstance.startProposalsRegistering({from: owner});
        await expectRevert(this.VotingInstance.startProposalsRegistering({from: owner}), "Registering proposals cant be started now");
    });

    it('start proposals registering should emit \'WorkflowStatusChange\'', async function () {
        const txReceipt = await this.VotingInstance.startProposalsRegistering({from: owner});
        expectEvent(txReceipt, 'WorkflowStatusChange', {previousStatus: new BN(0), newStatus: new BN(1)});
    });

    it('end proposals registering revert because wrong WorkflowStatus', async function () {
        await expectRevert(this.VotingInstance.endProposalsRegistering({from: owner}), "Registering proposals havent started yet");
    });

    it('end proposals registering should emit \'WorkflowStatusChange\'', async function () {
        await this.VotingInstance.startProposalsRegistering({from: owner});
        const txReceipt = await this.VotingInstance.endProposalsRegistering({from: owner});
        expectEvent(txReceipt, 'WorkflowStatusChange', {previousStatus: new BN(1), newStatus: new BN(2)});
    });

    it('start voting session revert because wrong WorkflowStatus', async function () {
        await expectRevert(this.VotingInstance.startVotingSession({from: owner}), "Registering proposals phase is not finished");
    });

    it('start voting session should emit \'WorkflowStatusChange\'', async function () {
        await this.VotingInstance.startProposalsRegistering({from: owner});
        await this.VotingInstance.endProposalsRegistering({from: owner});
        const txReceipt = await this.VotingInstance.startVotingSession({from: owner});
        expectEvent(txReceipt, 'WorkflowStatusChange', {previousStatus: new BN(2), newStatus: new BN(3)});
    });

    it('end voting session revert because wrong WorkflowStatus', async function () {
        await expectRevert(this.VotingInstance.endVotingSession({from: owner}), "Voting session havent started yet");
    });

    it('end voting session should emit \'WorkflowStatusChange\'', async function () {
        await this.VotingInstance.startProposalsRegistering({from: owner});
        await this.VotingInstance.endProposalsRegistering({from: owner});
        await this.VotingInstance.startVotingSession({from: owner});
        const txReceipt = await this.VotingInstance.endVotingSession({from: owner});
        expectEvent(txReceipt, 'WorkflowStatusChange', {previousStatus: new BN(3), newStatus: new BN(4)});
    });

    // ::::::::::::: REGISTRATION ::::::::::::: //
    
    it('add voter should revert because caller is not owner ', async function () {
        await expectRevert(this.VotingInstance.addVoter(voter1, {from: voter1}), "Ownable: caller is not the owner");
    });
    
    it('add voter should revert because of wrong WorkflowStatus', async function () {
        await this.VotingInstance.startProposalsRegistering({from: owner});
        await expectRevert(this.VotingInstance.addVoter(voter1, {from: owner}), "Voters registration is not open yet");
    });

    it('add voter should revert because voter is already registred ', async function () {
        await this.VotingInstance.addVoter(voter1, {from: owner});
        await expectRevert(this.VotingInstance.addVoter(voter1, {from: owner}), "Already registered");
    });

    it('add voter should emit event \'VoterRegistered\'', async function () {
        const txReceipt = await this.VotingInstance.addVoter(voter1, {from: owner});
        expectEvent(txReceipt, 'VoterRegistered', {voterAddress: voter1});
    });    
    
    it('add voter works', async function () {
        await this.VotingInstance.addVoter(voter1, {from: owner});
        let newVoter = await this.VotingInstance.getVoter(voter1, {from: voter1}); 
        expect(newVoter.isRegistered).to.equal(true, "Voter is not registred");
    });

    // ::::::::::::: PROPOSAL ::::::::::::: // 

    it('add proposal should revert because caller is not voter', async function () {
        
    });

    it('add proposal should revert because of wrong WorkflowStatus', async function () {
        await this.VotingInstance.addVoter(voter1, {from: owner});
        await expectRevert(this.VotingInstance.addProposal(voter1, {from: voter1}), "Proposals are not allowed yet");
    });

    it('add proposal should revert because proposal is empty', async function () {
        await this.VotingInstance.addVoter(voter1, {from: owner});
        await this.VotingInstance.startProposalsRegistering({from: owner});
        await expectRevert(this.VotingInstance.addProposal("", {from: voter1}), "Vous ne pouvez pas ne rien proposer");
    });

    it('add proposal should emit \'ProposalRegistered\'', async function () {
        await this.VotingInstance.addVoter(voter1, {from: owner});
        await this.VotingInstance.startProposalsRegistering({from: owner});
        const txReceipt = await this.VotingInstance.addProposal("description 1", {from: voter1});
        expectEvent(txReceipt, 'ProposalRegistered', {proposalId: new BN(0)});
    });

    it('add proposal works', async function () {
        await this.VotingInstance.addVoter(voter1, {from: owner});
        await this.VotingInstance.startProposalsRegistering({from: owner});
        await this.VotingInstance.addProposal("description 1", {from: voter1});
        let proposal = await this.VotingInstance.getOneProposal(0, {from: voter1});

        expect(proposal.description).to.equal("description 1", "Proposal description doesn't fit");
    });

    // ::::::::::::: VOTE ::::::::::::: //

    it('set vote should revert because caller is not voter', async function () {
        
    });

    it('set vote should revert because of wrong WorkflowStatus', async function () {
        await this.VotingInstance.addVoter(voter1, {from: owner});
        await expectRevert(this.VotingInstance.setVote(0, {from: voter1}), "Voting session havent started yet");

    });

    it('set vote should revert because voter already voted', async function () {
        await this.VotingInstance.addVoter(voter1, {from: owner});
        await this.VotingInstance.startProposalsRegistering({from: owner});

        await this.VotingInstance.addProposal("description 1", {from: voter1});
        
        await this.VotingInstance.endProposalsRegistering({from: owner});
        await this.VotingInstance.startVotingSession({from: owner});
        
        await this.VotingInstance.setVote(0, {from: voter1});
        await expectRevert(this.VotingInstance.setVote(0, {from: voter1}), "You have already voted");
    });

    it('set vote should revert because proposal doesn\'t exist', async function () {
        await this.VotingInstance.addVoter(voter1, {from: owner});
        await this.VotingInstance.startProposalsRegistering({from: owner});
        await this.VotingInstance.endProposalsRegistering({from: owner});
        await this.VotingInstance.startVotingSession({from: owner});
        await expectRevert(this.VotingInstance.setVote(1, {from: voter1}), "Proposal not found");

    });

    it('set vote works', async function () {
        await this.VotingInstance.addVoter(voter1, {from: owner});
        await this.VotingInstance.startProposalsRegistering({from: owner});

        await this.VotingInstance.addProposal("description 1", {from: voter1});
        
        await this.VotingInstance.endProposalsRegistering({from: owner});
        await this.VotingInstance.startVotingSession({from: owner});
        
        await this.VotingInstance.setVote(0, {from: voter1});
        
        let proposal = await this.VotingInstance.getOneProposal(0, {from: voter1});
        
        expect(proposal.voteCount).to.be.bignumber.equal(new BN(1));
    });

    it('tally votes should revert because caller is not the owner', async function () {
        
    });

    it('tally votes should revert because of wrong WorkflowStatus', async function () {
        await this.VotingInstance.addVoter(voter1, {from: owner});
        await this.VotingInstance.addVoter(voter2, {from: owner});
        await this.VotingInstance.startProposalsRegistering({from: owner});

        await this.VotingInstance.addProposal("description 1", {from: voter1});
    
        await this.VotingInstance.endProposalsRegistering({from: owner});
        await this.VotingInstance.startVotingSession({from: owner});
        
        await this.VotingInstance.setVote(0, {from: voter1});
        await expectRevert(this.VotingInstance.tallyVotes({from: owner}), "Current status is not voting session ended");
    });

    it('tally votes should emit \'WorkflowStatusChange\'', async function () {
        await this.VotingInstance.addVoter(voter1, {from: owner});
        await this.VotingInstance.addVoter(voter2, {from: owner});
        await this.VotingInstance.startProposalsRegistering({from: owner});

        await this.VotingInstance.addProposal("description 1", {from: voter1});
    
        await this.VotingInstance.endProposalsRegistering({from: owner});
        await this.VotingInstance.startVotingSession({from: owner});
        
        await this.VotingInstance.setVote(0, {from: voter1});
        await this.VotingInstance.endVotingSession({from: owner});
        const txReceipt = await this.VotingInstance.tallyVotes({from: owner});

        expectEvent(txReceipt, 'WorkflowStatusChange', {previousStatus: new BN(4), newStatus: new BN(5)});
    });

    it('tally votes works', async function () {
        await this.VotingInstance.addVoter(voter1, {from: owner});
        await this.VotingInstance.addVoter(voter2, {from: owner});
        await this.VotingInstance.startProposalsRegistering({from: owner});

        await this.VotingInstance.addProposal("description 1", {from: voter1});
        await this.VotingInstance.addProposal("description 2", {from: voter1});
        
        await this.VotingInstance.endProposalsRegistering({from: owner});
        await this.VotingInstance.startVotingSession({from: owner});
        
        await this.VotingInstance.setVote(1, {from: voter1});
        await this.VotingInstance.setVote(1, {from: voter2});
        
        await this.VotingInstance.endVotingSession({from: owner});
        await this.VotingInstance.tallyVotes({from: owner});

        let winnerID = await this.VotingInstance.winningProposalID();
        expect(winnerID).to.be.bignumber.equal(new BN(1));
    });
});
