// voting.test.js 
const { BN, ether, expectRevert } = require('@openzeppelin/test-helpers');
const expectEvent = require('@openzeppelin/test-helpers/src/expectEvent');
const { assertion } = require('@openzeppelin/test-helpers/src/expectRevert');
const { expect } = require('chai');
const Voting = artifacts.require('Voting');
contract('VOTING', function (accounts) {
    const owner = accounts[0];
    const alice = accounts[1];
    const bob = accounts[2];
    
    // ::::::::::::: GETTERS ::::::::::::: //

    describe('get voter', async function () {

        before(async function () {
            this.VotingInstance = await Voting.new();
            await this.VotingInstance.addVoter(alice);
        });
    
        it('should revert because caller is not voter', async function () {
            expectRevert(this.VotingInstance.getVoter(alice), "You're not a voter");
        });

        it('should return isRegistred from voter', async function () {            
            let newVoter = await this.VotingInstance.getVoter(alice, {from: alice}); 
            expect(newVoter.isRegistered).to.equal(true, "Voter is not registred");
        });

        it('should return hasVoted from voter', async function () {
            let newVoter = await this.VotingInstance.getVoter(alice, {from: alice}); 
            expect(newVoter.hasVoted).to.equal(false, "Voter has already voted");
        });

        it('should return votedProposalId from voter', async function () {
            let newVoter = await this.VotingInstance.getVoter(alice, {from: alice}); 
            expect(newVoter.votedProposalId).to.be.bignumber.equal(new BN(0), "Voter has allready voted");
        });

    });

    describe('get one proposal', async function () {

        before(async function () {
            this.VotingInstance = await Voting.new();
            await this.VotingInstance.addVoter(alice);
            await this.VotingInstance.startProposalsRegistering();
            await this.VotingInstance.addProposal("description 1", {from: alice});
        });
    
        it('should revert because caller is not voter', async function () {
            expectRevert(this.VotingInstance.getOneProposal(0), "You're not a voter");
        });

        it('should return proposal description', async function () {
            let proposal = await this.VotingInstance.getOneProposal(0, {from: alice});
            expect(proposal.description).to.equal("description 1", "Proposal description doesn't fit");
        });
        
        it('should return proposal vote count', async function () {
            let proposal = await this.VotingInstance.getOneProposal(0, {from: alice});
            expect(proposal.voteCount).to.be.bignumber.equal(new BN(0), "Proposal already contains a vote");
        });
        
    });

    // ::::::::::::: STATE ::::::::::::: //
    
    describe('workflow status', async function () {

        beforeEach(async function () {
            this.VotingInstance = await Voting.new();
        });

        describe('start proposals registering', async function () {
        
            it('should revert because wrong WorkflowStatus', async function () {
                await this.VotingInstance.startProposalsRegistering();
                await expectRevert(this.VotingInstance.startProposalsRegistering(), "Registering proposals cant be started now");
            });

            it('should emit \'WorkflowStatusChange\'', async function () {
                const txReceipt = await this.VotingInstance.startProposalsRegistering();
                expectEvent(txReceipt, 'WorkflowStatusChange', {previousStatus: new BN(0), newStatus: new BN(1)});
            });

        });

        describe('end proposals registering', async function () {
        
            it('should revert because wrong WorkflowStatus', async function () {
                await expectRevert(this.VotingInstance.endProposalsRegistering(), "Registering proposals havent started yet");
            });
            
            it('should emit \'WorkflowStatusChange\'', async function () {
                await this.VotingInstance.startProposalsRegistering();
                const txReceipt = await this.VotingInstance.endProposalsRegistering();
                expectEvent(txReceipt, 'WorkflowStatusChange', {previousStatus: new BN(1), newStatus: new BN(2)});
            });

        });

        describe('start voting session', async function () {
        
            it('should revert because wrong WorkflowStatus', async function () {
                await expectRevert(this.VotingInstance.startVotingSession(), "Registering proposals phase is not finished");
            });
        
            it('should emit \'WorkflowStatusChange\'', async function () {
                await this.VotingInstance.startProposalsRegistering();
                await this.VotingInstance.endProposalsRegistering();
                const txReceipt = await this.VotingInstance.startVotingSession();
                expectEvent(txReceipt, 'WorkflowStatusChange', {previousStatus: new BN(2), newStatus: new BN(3)});
            });

        });

        describe('end voting session', async function () {
        
            it('should revert because wrong WorkflowStatus', async function () {
                await expectRevert(this.VotingInstance.endVotingSession(), "Voting session havent started yet");
            });
        
            it('should emit \'WorkflowStatusChange\'', async function () {
                await this.VotingInstance.startProposalsRegistering();
                await this.VotingInstance.endProposalsRegistering();
                await this.VotingInstance.startVotingSession();
                const txReceipt = await this.VotingInstance.endVotingSession();
                expectEvent(txReceipt, 'WorkflowStatusChange', {previousStatus: new BN(3), newStatus: new BN(4)});
            });
            
        });
        
    });
    
    // ::::::::::::: REGISTRATION ::::::::::::: //

    describe('add voter', async function () {

        beforeEach(async function () {
            this.VotingInstance = await Voting.new();
        });
    
        it('should revert because caller is not owner ', async function () {
            await expectRevert(this.VotingInstance.addVoter(alice, {from: alice}), "Ownable: caller is not the owner");
        });

        it('should revert because of wrong WorkflowStatus', async function () {
            await this.VotingInstance.startProposalsRegistering();
            await expectRevert(this.VotingInstance.addVoter(alice), "Voters registration is not open yet");
        });

        it('should revert because voter is already registred ', async function () {
            await this.VotingInstance.addVoter(alice);
            await expectRevert(this.VotingInstance.addVoter(alice), "Already registered");
        });
        
        it('should emit event \'VoterRegistered\'', async function () {
            const txReceipt = await this.VotingInstance.addVoter(alice);
            expectEvent(txReceipt, 'VoterRegistered', {voterAddress: alice});
        });    
        
        it('isRegistred field from new voter should be true', async function () {
            await this.VotingInstance.addVoter(alice);
            let newVoter = await this.VotingInstance.getVoter(alice, {from: alice}); 
            expect(newVoter.isRegistered).to.equal(true, "Voter is not registred");
        });
        
    });

    describe('delete voter', async function () {

        beforeEach(async function () {
            this.VotingInstance = await Voting.new();
        });
    
        it('should revert because caller is not owner ', async function () {
            await expectRevert(this.VotingInstance.deleteVoter(alice, {from: alice}), "Ownable: caller is not the owner");
        });

        it('should revert because of wrong WorkflowStatus', async function () {
            await this.VotingInstance.startProposalsRegistering();
            await expectRevert(this.VotingInstance.deleteVoter(alice), "Voters registration is not open yet");
        });

        it('should revert because voter is not registred ', async function () {
            await expectRevert(this.VotingInstance.deleteVoter(alice), "Not registered.");
        });
        
        it('should emit event \'VoterRegistered\'', async function () {
            await this.VotingInstance.addVoter(alice);
            const txReceipt = await this.VotingInstance.deleteVoter(alice);
            expectEvent(txReceipt, 'VoterRegistered', {voterAddress: alice});
        });    
        
        it('isRegistred field from new voter should be false', async function () {
            await this.VotingInstance.addVoter(alice);
            await this.VotingInstance.addVoter(bob);
            await this.VotingInstance.deleteVoter(alice, {from: owner}); 
            let newVoter = await this.VotingInstance.getVoter(alice, {from: bob}); 
            expect(newVoter.isRegistered).to.equal(false, "Voter is not registred");
        });
        
    });
    
    // ::::::::::::: PROPOSAL ::::::::::::: // 
    
    describe('add proposal', async function () {

        beforeEach(async function () {
            this.VotingInstance = await Voting.new();
            await this.VotingInstance.addVoter(alice);
        });
    
        it('should revert because caller is not voter', async function () {
            await expectRevert(this.VotingInstance.addProposal("I'm the 1rst proposal"), "You're not a voter");            
        });

        it('should revert because of wrong WorkflowStatus', async function () {
            await expectRevert(this.VotingInstance.addProposal(alice, {from: alice}), "Proposals are not allowed yet");
        });
        
        it('should revert because proposal is empty', async function () {
            await this.VotingInstance.startProposalsRegistering();
            await expectRevert(this.VotingInstance.addProposal("", {from: alice}), "Vous ne pouvez pas ne rien proposer");
        });

        it('should emit \'ProposalRegistered\'', async function () {
            await this.VotingInstance.startProposalsRegistering();
            const txReceipt = await this.VotingInstance.addProposal("description 1", {from: alice});
            expectEvent(txReceipt, 'ProposalRegistered', {proposalId: new BN(0)});
        });
        
        it('should stores description', async function () {
            await this.VotingInstance.startProposalsRegistering();
            await this.VotingInstance.addProposal("description 1", {from: alice});
            let proposal = await this.VotingInstance.getOneProposal(0, {from: alice});
            expect(proposal.description).to.equal("description 1", "Proposal description doesn't fit");
        });
        
    });
    
    // ::::::::::::: VOTE ::::::::::::: //
    
    describe('set vote', async function () {
        
        beforeEach(async function () {
            this.VotingInstance = await Voting.new();
            await this.VotingInstance.addVoter(alice);
            await this.VotingInstance.startProposalsRegistering();
            await this.VotingInstance.addProposal("proposal 1", {from: alice});
        });
        
        it('should revert because caller is not voter', async function () {
            await expectRevert(this.VotingInstance.setVote(0), "You're not a voter"); 
        });
        
        it('should revert because of wrong WorkflowStatus', async function () {
            await expectRevert(this.VotingInstance.setVote(0, {from: alice}), "Voting session havent started yet");
        });
        
        it('should revert because proposal doesn\'t exist', async function () {
            await this.VotingInstance.endProposalsRegistering();
            await this.VotingInstance.startVotingSession();
            await expectRevert(this.VotingInstance.setVote(1, {from: alice}), "Proposal not found");
        });

        describe('jump-to-vote', async function () {

            beforeEach(async function () {
                await this.VotingInstance.endProposalsRegistering();
                await this.VotingInstance.startVotingSession();
                await this.VotingInstance.setVote(0, {from: alice});
            });

            it('should revert because voter already voted', async function () {    
                await expectRevert(this.VotingInstance.setVote(0, {from: alice}), "You have already voted");
            });
            
            it('should store proposal id in voter', async function () { 
                let newVoter = await this.VotingInstance.getVoter(alice, {from: alice}); 
                expect(newVoter.votedProposalId).to.be.bignumber.equal(new BN(0));
            });
    
            it('voter hasVoted should be true', async function () { 
                let newVoter = await this.VotingInstance.getVoter(alice, {from: alice}); 
                expect(newVoter.hasVoted).to.equal(true);
            });
            
            it('proposal voteCount should increase by 1', async function () {
                let proposal = await this.VotingInstance.getOneProposal(0, {from: alice});
                expect(proposal.voteCount).to.be.bignumber.equal(new BN(1));
            });

        });

    });

    // ::::::::::::: TALLY VOTES ::::::::::::: //
    
    describe('tally votes', async function () {
        
        beforeEach(async function () {
            this.VotingInstance = await Voting.new();
            await this.VotingInstance.addVoter(alice);
            await this.VotingInstance.addVoter(bob);
            await this.VotingInstance.startProposalsRegistering();
            await this.VotingInstance.addProposal("proposal 1", {from: alice});
            await this.VotingInstance.addProposal("proposal 2", {from: alice});
            await this.VotingInstance.endProposalsRegistering();
            await this.VotingInstance.startVotingSession();
            await this.VotingInstance.setVote(1, {from: alice});
            await this.VotingInstance.setVote(1, {from: bob});
        });
        
        it('should revert because caller is not the owner', async function () {
            await expectRevert(this.VotingInstance.tallyVotes({from: alice}), "Ownable: caller is not the owner");     
        });
        
        it('should revert because of wrong WorkflowStatus', async function () {
            await expectRevert(this.VotingInstance.tallyVotes(), "Current status is not voting session ended");
        });
        
        it('should emit \'WorkflowStatusChange\'', async function () {
            await this.VotingInstance.endVotingSession();
            const txReceipt = await this.VotingInstance.tallyVotes();
            expectEvent(txReceipt, 'WorkflowStatusChange', {previousStatus: new BN(4), newStatus: new BN(5)});
        });

        it('should store result in winningProposalID', async function () {
            await this.VotingInstance.endVotingSession();
            await this.VotingInstance.tallyVotes();
            let winnerID = await this.VotingInstance.winningProposalID();
            expect(winnerID).to.be.bignumber.equal(new BN(1));
        });

    });

    describe('tally votes draw', async function () {
        
        beforeEach(async function () {
            this.VotingInstance = await Voting.new();
            await this.VotingInstance.addVoter(alice);
            await this.VotingInstance.addVoter(bob);
            await this.VotingInstance.startProposalsRegistering();
            await this.VotingInstance.addProposal("proposal 1", {from: alice});
            await this.VotingInstance.addProposal("proposal 2", {from: alice});
            await this.VotingInstance.endProposalsRegistering();
            await this.VotingInstance.startVotingSession();
            await this.VotingInstance.setVote(0, {from: alice});
            await this.VotingInstance.setVote(1, {from: bob});
        });
        
        it('should revert because caller is not the owner', async function () {
            await expectRevert(this.VotingInstance.tallyVotesDraw({from: alice}), "Ownable: caller is not the owner");     
        });
        
        it('should revert because of wrong WorkflowStatus', async function () {
            await expectRevert(this.VotingInstance.tallyVotesDraw(), "Current status is not voting session ended");
        });
        
        it('should emit \'WorkflowStatusChange\'', async function () {
            await this.VotingInstance.endVotingSession();
            const txReceipt = await this.VotingInstance.tallyVotesDraw();
            expectEvent(txReceipt, 'WorkflowStatusChange', {previousStatus: new BN(4), newStatus: new BN(5)});
        });

        describe('should store', async function () {
        
            beforeEach(async function () {
                await this.VotingInstance.endVotingSession();
                await this.VotingInstance.tallyVotesDraw();
            });

            it('1rst winning proposal ID in winningProposalsID', async function () {
                let firstWinner = await this.VotingInstance.winningProposalsID(0);
                expect(firstWinner).to.be.bignumber.equal(new BN(0));
            });
    
            it('2nd winning proposal ID in winningProposalsID', async function () {
                let secondWinner = await this.VotingInstance.winningProposalsID(1);
                expect(secondWinner).to.be.bignumber.equal(new BN(1));
            });
    
            it('1rst winning proposal in winningProposals', async function () {
                let firstProposal = await this.VotingInstance.winningProposals(0);
                expect(firstProposal.description).to.equal("proposal 1");
            });

            it('2nd winning proposal in winningProposals', async function () {
                let secondProposal = await this.VotingInstance.winningProposals(1);
                expect(secondProposal.description).to.equal("proposal 2");
            });

        });

    });

});