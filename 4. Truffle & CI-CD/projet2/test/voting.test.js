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
    
    it('add voter works', async function () {
        const txReceipt = await this.VotingInstance.addVoter(voter1, {from: owner});
        // await expectRevert(await this.VotingInstance.addVoter(voter1, {from: voter1}), "You're not a voter");
        expectEvent(txReceipt, 'VoterRegistered', {voterAddress: voter1});
        let newVoter = await this.VotingInstance.getVoter(voter1); 
        expect(newVoter.isRegistered).to.equal(true, "Voter is not registred");
    });

    it('add proposal works', async function () {
        await this.VotingInstance.addVoter(voter1, {from: owner});
        await this.VotingInstance.startProposalsRegistering({from: owner});
        await this.VotingInstance.addProposal("description 1", {from: voter1});
        let proposal = await this.VotingInstance.getOneProposal(0, {from: voter1});

        expect(proposal.description).to.equal("description 1", "Proposal description doesn't fit");
    });

    // add proposal should revert because of wrong workflow status 
    // add proposal should revert because of proposal description empty 

    it('set vote works', async function () {
        await this.VotingInstance.addVoter(voter1, {from: owner});
        await this.VotingInstance.startProposalsRegistering({from: owner});

        await this.VotingInstance.addProposal("description 1", {from: voter1});
        // await expectRevert(await this.VotingInstance.addProposal("", {from: voter1}), "Vous ne pouvez pas ne rien proposer");
        
        await this.VotingInstance.endProposalsRegistering({from: owner});
        await this.VotingInstance.startVotingSession({from: owner});
        
        await this.VotingInstance.setVote(0, {from: voter1});
        // await expectRevert(await this.VotingInstance.setVote(0, {from: voter1}), "You have already voted");
        
        // await this.VotingInstance.endVotingSession({from: owner});
        let proposal = await this.VotingInstance.getOneProposal(0, {from: voter1});
        
        expect(proposal.voteCount).to.be.bignumber.equal(new BN(1));
    });

    it('tally votes works', async function () {
        await this.VotingInstance.addVoter(voter1, {from: owner});
        await this.VotingInstance.addVoter(voter2, {from: owner});
        await this.VotingInstance.startProposalsRegistering({from: owner});

        await this.VotingInstance.addProposal("description 1", {from: voter1});
        await this.VotingInstance.addProposal("description 2", {from: voter2});
        // await expectRevert(await this.VotingInstance.addProposal("", {from: voter1}), 'Vous ne pouvez pas ne rien proposer');
        
        await this.VotingInstance.endProposalsRegistering({from: owner});
        await this.VotingInstance.startVotingSession({from: owner});
        
        await this.VotingInstance.setVote(1, {from: voter1});
        await this.VotingInstance.setVote(1, {from: voter2});
        // await expectRevert(await this.VotingInstance.setVote(0, {from: voter1}), "You have already voted");
        
        await this.VotingInstance.endVotingSession({from: owner});
        await this.VotingInstance.tallyVotes({from: owner});

        let winnerID = await this.VotingInstance.winningProposalID();
        expect(winnerID).to.be.bignumber.equal(new BN(1));
    });

    



















    // it('a un symbole', async function () {
    //     expect(await this.ERC20Instance.symbol()).to.equal(_symbol);
    // });

    // it('a une valeur décimal', async function () {
    //     expect(await this.ERC20Instance.decimals()).to.be.bignumber.equal(_decimals);
    // });
    
    // it('vérifie la balance du propriétaire du contrat', async function (){
    //     let balanceOwner = await this.ERC20Instance.balanceOf(owner);
    //     let totalSupply = await this.ERC20Instance.totalSupply();
    //     expect(balanceOwner).to.be.bignumber.equal(totalSupply);
    // });

    // it('vérifie si un transfer est bien effectué', async function (){
    //     let balanceOwnerBeforeTransfer = await this.ERC20Instance.balanceOf(owner);
    //     let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
    //     let amount = new BN(10);
        
    //     await this.ERC20Instance.transfer(recipient, amount, {from: owner});
    //     let balanceOwnerAfterTransfer = await this.ERC20Instance.balanceOf(owner);
    //     let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);
        
    //     expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(balanceOwnerBeforeTransfer.sub(amount));
    //     expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
    // });

    // it('vérifie si un approve est bien effectué', async function (){
    //     let allowancesSpenderBeforeApproval = await this.ERC20Instance.allowance(owner, spender);
    //     let amount = new BN(10);
        
    //     await this.ERC20Instance.approve(spender, amount, {from: owner});
    //     let allowancesSpenderAfterApproval = await this.ERC20Instance.allowance(owner, spender);
        
    //     expect(allowancesSpenderAfterApproval).to.be.bignumber.equal(allowancesSpenderBeforeApproval.add(amount));
    // });

    // it('vérifie si un transfert from est bien effectué', async function (){
    //     let balanceOwnerBeforeTransfer = await this.ERC20Instance.balanceOf(owner);
    //     let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
    //     let amount = new BN(10);
             
    //     await this.ERC20Instance.approve(spender, amount, {from: owner});
    //     await this.ERC20Instance.transferFrom(owner, recipient, amount, {from: spender});
        
    //     let balanceOwnerAfterTransfer = await this.ERC20Instance.balanceOf(owner);
    //     let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);
        
    //     expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(balanceOwnerBeforeTransfer.sub(amount));
    //     expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
    // });
});
