import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import Addresse from "./Addresse.js";
import WorkflowStatus from "./WorkflowStatus.js";
import VoterList from "./VoterList.js";
import Winner from "./Winner.js";

import "./App.css";

class App extends Component {
  state = { 
    owner: null, 
    isVoter: null,
    wfStatus: null, 
    voters: null, 
    proposals: null,
    winningProposal: null,
    web3: null, 
    accounts: null, 
    contract: null 
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];

      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const owner = await instance.methods.owner().call();

      const options = { 
        fromBlock: 0,
        toBlock : 'latest'
      }
      const voters = await instance.getPastEvents('VoterRegistered', options);
      const wfStatus = await instance.methods.workflowStatus().call();
      const nbrProposals = await instance.getPastEvents('ProposalRegistered', options);    

      const isVoter = await this.isVoter(accounts[0], voters);
      const proposalList = [];
      if (isVoter) {
        for(let i = 0; i < nbrProposals.length; i++) {
          const prop = await instance.methods.getOneProposal(i).call({ from: accounts[0]});
          proposalList.push(prop);
        }
      }

      this.setState({ owner, isVoter, wfStatus, voters, proposals: proposalList, web3, accounts, contract: instance });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runAddVoter = async () => {
    const { accounts, contract} = this.state;
    let voter=document.getElementById("voter").value;
    await contract.methods.addVoter(voter).send({ from: accounts[0] });
    const options = { 
      fromBlock: 0,
      toBlock : 'latest'
    }
    const voters = await contract.getPastEvents('VoterRegistered', options);
    this.setState({ voters });
  }

  runStartProposals = async () => {
    const { accounts, contract} = this.state;
    const wfStatusObject = await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
    const wfStatus = wfStatusObject.events.WorkflowStatusChange.returnValues.newStatus;
    this.setState({ wfStatus });
  }

  runEndProposals = async () => {
    const { accounts, contract} = this.state;
    await contract.methods.endProposalsRegistering().send({ from: accounts[0] });
    const wfStatus = await contract.methods.workflowStatus().call();
    this.setState({ wfStatus });
  }

  runStartVoting = async () => {
    const { accounts, contract} = this.state;
    await contract.methods.startVotingSession().send({ from: accounts[0] });
    const wfStatus = await contract.methods.workflowStatus().call();
    this.setState({ wfStatus });
  }

  runEndVoting = async () => {
    const { accounts, contract} = this.state;
    await contract.methods.endVotingSession().send({ from: accounts[0] });
    const wfStatus = await contract.methods.workflowStatus().call();
    this.setState({ wfStatus });
  }

  runTallyVotes = async () => {
    const { accounts, contract} = this.state;
    await contract.methods.tallyVotes().send({ from: accounts[0] });
    const wfStatus = await contract.methods.workflowStatus().call();
    const winningProposal = this.getWinningProposal();
    this.setState({ wfStatus, winningProposal });
  }

  runAddProposal = async () => {
    const { accounts, contract} = this.state;
    let description = document.getElementById("proposal").value;
    await contract.methods.addProposal(description).send({ from: accounts[0] });
    this.getProposals();
  }

  runSetVote = async (index) => {
    const { accounts, contract} = this.state;
    await contract.methods.setVote(index).send({ from: accounts[0] });
    this.getProposals();
  }

  isVoter = async (addr, voters) => {
    for (let i = 0; i < voters.length; i++) {
      const voter = voters[i].returnValues.voterAddress;
      if (voter === addr) {
        return true;
      }
    }
    return false;
  }

  getProposals = async () => {
    const { accounts, contract } = this.state;
    const options = { 
      fromBlock: 0,
      toBlock : 'latest'
    }
    const nbrProposals = await contract.getPastEvents('ProposalRegistered', options);
    const proposals = [];
    for(let i = 0; i < nbrProposals.length; i++) {
      const prop = await contract.methods.getOneProposal(i).call({ from: accounts[0]});
      proposals.push(prop);
    }
    this.setState({ proposals })
  }

  getWinningProposal = async () => {
    const { accounts, contract } = this.state;
    const id = await contract.methods.winningProposalID().call();
    const winningProposal = await contract.methods.getOneProposal(id).call({ from: accounts[0]});
    this.setState({ winningProposal })
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    } else if (this.state.wfStatus === '0' && this.state.owner === this.state.accounts[0]) {
      return (
        <div className="grid-container">
          <div className="header">
            <h2 className="title">Voting</h2>
            <WorkflowStatus wfStatus={this.state.wfStatus} />
          </div>
          <div className="left">
            <Addresse owner={this.state.owner} isVoter={this.state.isVoter} addr={this.state.accounts[0]} />
            <div>
              <p>
                <button onClick={this.runStartProposals}>Start Proposals Registering</button>
              </p>
              <p>
                <button onClick={this.runEndProposals}>End Proposals Registering</button>
              </p>
              <p>
                <button onClick={this.runStartVoting}>Start Voting Session</button>
              </p>
              <p>
                <button onClick={this.runEndVoting}>End Voting Session</button>
              </p>
              <p>
                <button onClick={this.runTallyVotes}>Tally votes</button>
              </p>
            </div>
          </div>
          <div className="center">
            <div className="form">
              <input type="text" id="voter" />
              <button onClick={this.runAddVoter}>Add Voter</button>
            </div>
          </div>
          <div className="right">
            <VoterList voters={this.state.voters} />
          </div> 
        </div>
      );
    } else if (this.state.wfStatus === '0' && this.state.isVoter) {
      return (
        <div className="grid-container">
          <div className="header">
            <h2 className="title">Votin</h2>
            <WorkflowStatus wfStatus={this.state.wfStatus} />
          </div>
          <div className="left">
            <Addresse owner={this.state.owner} isVoter={this.state.isVoter} addr={this.state.accounts[0]} />
          </div>
          <div className="center form">
            You are a voter, you will be able to make a proposal during the proposal session
          </div>
          <div className="right">
            <VoterList voters={this.state.voters} />
          </div>
                  
        </div>
      );
    } else if (this.state.wfStatus === '1' && this.state.owner === this.state.accounts[0]) {
      return (
        <div className="grid-container">
          <div className="header">
            <h2 className="title">Voting</h2>
            <WorkflowStatus wfStatus={this.state.wfStatus} />
          </div>
          <div className="left">
            <Addresse owner={this.state.owner} isVoter={this.state.isVoter} addr={this.state.accounts[0]} />
            <div>
              <p>
                <button onClick={this.runStartProposals}>Start Proposals Registering</button>
              </p>
              <p>
                <button onClick={this.runEndProposals}>End Proposals Registering</button>
              </p>
              <p>
                <button onClick={this.runStartVoting}>Start Voting Session</button>
              </p>
              <p>
                <button onClick={this.runEndVoting}>End Voting Session</button>
              </p>
              <p>
                <button onClick={this.runTallyVotes}>Tally votes</button>
              </p>
            </div>
          </div>
          <div className="center">
            <div className="form">
              <input type="text" id="proposal" />
              <button onClick={this.runAddProposal}>Add Proposal</button>
            </div>
          </div>
          <div className="right">
            <VoterList voters={this.state.voters} />
          </div>
          <div className="footer center">
            <table>
                <tr><td>Proposals</td><td>Vote Count</td></tr>
                {this.state.proposals.map((prop, index) => (
                <tr key={index}>
                    <td>{prop.description}</td>
                    <td>{prop.voteCount}</td>
                </tr>
                ))}
            </table>
          </div>          
        </div>
      );
    } else if (this.state.wfStatus === '1' && this.state.isVoter) {
      return (
        <div className="grid-container">
          <div className="header">
            <h2 className="title">Voting</h2>
            <WorkflowStatus wfStatus={this.state.wfStatus} />
          </div>
          <div className="left">
            <Addresse owner={this.state.owner} isVoter={this.state.isVoter} addr={this.state.accounts[0]} />
          </div>
          <div className="center">
            <div className="form">
              <input type="text" id="proposal" />
              <button onClick={this.runAddProposal}>Add Proposal</button>
            </div>
          </div>
          <div className="right">
            <VoterList voters={this.state.voters} />
          </div>
          <div className="footer center">
            <table>
                <tr><td>Proposals</td><td>Vote Count</td></tr>
                {this.state.proposals.map((prop, index) => (
                <tr key={index}>
                    <td>{prop.description}</td>
                    <td>{prop.voteCount}</td>
                </tr>
                ))}
            </table>
          </div>
        </div>
      );
    } else if (this.state.wfStatus === '2' && this.state.owner === this.state.accounts[0]) {
      return (
        <div className="grid-container">
          <div className="header">
            <h2 className="title">Voting</h2>
            <WorkflowStatus wfStatus={this.state.wfStatus} />
          </div>
          <div className="left">
            <Addresse owner={this.state.owner} isVoter={this.state.isVoter} addr={this.state.accounts[0]} />
            <div>
              <p>
                <button onClick={this.runStartProposals}>Start Proposals Registering</button>
              </p>
              <p>
                <button onClick={this.runEndProposals}>End Proposals Registering</button>
              </p>
              <p>
                <button onClick={this.runStartVoting}>Start Voting Session</button>
              </p>
              <p>
                <button onClick={this.runEndVoting}>End Voting Session</button>
              </p>
              <p>
                <button onClick={this.runTallyVotes}>Tally votes</button>
              </p>
            </div>
          </div>
          <div className="center form">
            <div>Proposals registered, you can now start Voting session</div>
          </div>
          <div className="right">
            <VoterList voters={this.state.voters} />
          </div>
          <div className="footer center">
            <table>
                <tr><td>Proposals</td><td>Vote Count</td></tr>
                {this.state.proposals.map((prop, index) => (
                <tr key={index}>
                    <td>{prop.description}</td>
                    <td>{prop.voteCount}</td>
                </tr>
                ))}
            </table>
          </div>          
        </div>
      );
    } else if (this.state.wfStatus === '2') {
      return (
        <div className="grid-container">
          <div className="header">
            <h2 className="title">Voting</h2>
            <WorkflowStatus wfStatus={this.state.wfStatus} />
          </div>
          <div className="left">
            <Addresse owner={this.state.owner} isVoter={this.state.isVoter} addr={this.state.accounts[0]} />
            <div>
              <p>
                <button onClick={this.runStartProposals}>Start Proposals Registering</button>
              </p>
              <p>
                <button onClick={this.runEndProposals}>End Proposals Registering</button>
              </p>
              <p>
                <button onClick={this.runStartVoting}>Start Voting Session</button>
              </p>
              <p>
                <button onClick={this.runEndVoting}>End Voting Session</button>
              </p>
              <p>
                <button onClick={this.runTallyVotes}>Tally votes</button>
              </p>
              <p>
                <button onClick={this.getWinningProposal}>Winner</button>
              </p>
            </div>
          </div>
          <div className="center form">
            <div>Proposals registered, you will be able to vote during Voting session</div>
          </div>
          <div className="right">
            <VoterList voters={this.state.voters} />
          </div>
          <div className="footer center">
            <table>
                <tr><td>Proposals</td><td>Vote Count</td></tr>
                {this.state.proposals.map((prop, index) => (
                <tr key={index}>
                    <td>{prop.description}</td>
                    <td>{prop.voteCount}</td>
                </tr>
                ))}
            </table>
          </div>
        </div>
      );
    } else if (this.state.wfStatus === '3' && this.state.owner === this.state.accounts[0]) {
      return (
        <div className="grid-container">
          <div className="header">
            <h2 className="title">Voting</h2>
            <WorkflowStatus wfStatus={this.state.wfStatus} />
          </div>
          <div className="left">
            <Addresse owner={this.state.owner} isVoter={this.state.isVoter} addr={this.state.accounts[0]} />
            <div>
              <p>
                <button onClick={this.runStartProposals}>Start Proposals Registering</button>
              </p>
              <p>
                <button onClick={this.runEndProposals}>End Proposals Registering</button>
              </p>
              <p>
                <button onClick={this.runStartVoting}>Start Voting Session</button>
              </p>
              <p>
                <button onClick={this.runEndVoting}>End Voting Session</button>
              </p>
              <p>
                <button onClick={this.runTallyVotes}>Tally votes</button>
              </p>
            </div>
          </div>
          <div className="center form">
            <div>Please vote for a proposal</div>
          </div>
          <div className="right">
            <VoterList voters={this.state.voters} />
          </div>
          <div className="footer center">
            <table>
                <tr><td>Proposals</td><td>Vote Count</td></tr>
                {this.state.proposals.map((prop, index) => (
                <tr key={index}>
                    <td>{prop.description}</td>
                    <td>{prop.voteCount}</td>
                    <td><button onClick={() => this.runSetVote(index)}>Vote</button></td>
                </tr>
                ))}
            </table>
          </div>
        </div>
      );
    } else if (this.state.wfStatus === '3' && this.state.isVoter) {
      return (
        <div className="grid-container">
          <div className="header">
            <h2 className="title">Voting</h2>
            <WorkflowStatus wfStatus={this.state.wfStatus} />
          </div>
          <div className="left">
            <Addresse owner={this.state.owner} isVoter={this.state.isVoter} addr={this.state.accounts[0]} />
          </div>
          <div className="center form">
            <div>Please vote for a proposal</div>
          </div>
          <div className="right">
            <VoterList voters={this.state.voters} />
          </div>
          <div className="footer center">
            <table>
                <tr><td>Proposals</td><td>Vote Count</td></tr>
                {this.state.proposals.map((prop, index) => (
                <tr key={index}>
                    <td>{prop.description}</td>
                    <td>{prop.voteCount}</td>
                    <td><button onClick={() => this.runSetVote(index)}>Vote</button></td>
                </tr>
                ))}
            </table>
          </div>
          
        </div>
      );
    } else if (this.state.wfStatus === '4' && this.state.owner === this.state.accounts[0]) {
      return (
        <div className="grid-container">
          <div className="header">
            <h2 className="title">Voting</h2>
            <WorkflowStatus wfStatus={this.state.wfStatus} />
          </div>
          <div className="left">
            <Addresse owner={this.state.owner} isVoter={this.state.isVoter} addr={this.state.accounts[0]} />
            <div>
              <p>
                <button onClick={this.runStartProposals}>Start Proposals Registering</button>
              </p>
              <p>
                <button onClick={this.runEndProposals}>End Proposals Registering</button>
              </p>
              <p>
                <button onClick={this.runStartVoting}>Start Voting Session</button>
              </p>
              <p>
                <button onClick={this.runEndVoting}>End Voting Session</button>
              </p>
              <p>
                <button onClick={this.runTallyVotes}>Tally votes</button>
              </p>
            </div>
          </div>
          <div className="center form">
            <div>Voting session ended, you can now Tally Votes</div>
          </div>
          <div className="right">
            <VoterList voters={this.state.voters} />
          </div>
          <div className="footer center">
            <table>
                <tr><td>Proposals</td><td>Vote Count</td></tr>
                {this.state.proposals.map((prop, index) => (
                <tr key={index}>
                    <td>{prop.description}</td>
                    <td>{prop.voteCount}</td>
                </tr>
                ))}
            </table>
          </div>
        </div>
      );
    } else if (this.state.wfStatus === '4' && this.state.isVoter) {
      return (
        <div className="grid-container">
          <div className="header">
            <h2 className="title">Voting</h2>
            <WorkflowStatus wfStatus={this.state.wfStatus} />
          </div>
          <div className="left">
            <Addresse owner={this.state.owner} isVoter={this.state.isVoter} addr={this.state.accounts[0]} />
          </div>
          <div className="center form">
            <div>Voting session ended, please wait to see the winning proposal</div>
          </div>
          <div className="right">
            <VoterList voters={this.state.voters} />
          </div>
          <div className="footer center">
            <table>
                <tr><td>Proposals</td><td>Vote Count</td></tr>
                {this.state.proposals.map((prop, index) => (
                <tr key={index}>
                    <td>{prop.description}</td>
                    <td>{prop.voteCount}</td>
                </tr>
                ))}
            </table>
          </div>          
        </div>
      );
    } else if (this.state.wfStatus === '5') {
      return (
        <div className="grid-container">
          <div className="header">
            <h2 className="title">Voting</h2>
            <WorkflowStatus wfStatus={this.state.wfStatus} />
          </div>
          <div className="left">
            <Addresse owner={this.state.owner} isVoter={this.state.isVoter} addr={this.state.accounts[0]} />
            <div>
              <p>
                <button onClick={this.getWinningProposal}>Winner</button>
              </p>
            </div>
          </div>
          <div className="center form">
            <Winner winningProposal={this.state.winningProposal} />
          </div>
          <div className="right">
            <VoterList voters={this.state.voters} />
          </div>
          <div className="footer center">
            <table>
                <tr><td>Proposals</td><td>Vote Count</td></tr>
                {this.state.proposals.map((prop, index) => (
                <tr key={index}>
                    <td>{prop.description}</td>
                    <td>{prop.voteCount}</td>
                </tr>
                ))}
            </table>
          </div>
        </div>
      );
    } else {
      return (
        <div className="grid-container">
          <div className="header">
            <h2 className="title">Voting</h2>
            <WorkflowStatus wfStatus={this.state.wfStatus} />
          </div>
          <div className="left">
            <Addresse owner={this.state.owner} isVoter={this.state.isVoter} addr={this.state.accounts[0]} />
          </div>
          <div className="center">
            <div className="form">
              You need to ask {this.state.owner} to register you as voter
            </div>
          </div>
          <div className="right">
            <VoterList voters={this.state.voters} />
          </div> 
        </div>
      );
    }
  }
}

export default App;
