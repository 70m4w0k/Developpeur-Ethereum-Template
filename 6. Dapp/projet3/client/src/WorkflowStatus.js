import React from 'react';

import "./App.css";

export default class WorkflowStatus extends React.Component {
    
    render(){
        if(this.props.wfStatus === '0') {
            return (
                <div>
                    <li className="currentStatus">Registering Voters > </li>
                    <li>Proposal Registration > </li>
                    <li>Voting Session > </li>
                    <li>Votes Tallied </li>
                </div>
            )
        } else if(this.props.wfStatus === '1') {
            return (
                <div>
                    <p>Registering Voters</p>
                    <h3>ProposalsRegistrationStarted</h3>
                    <p>ProposalsRegistrationEnded</p>
                    <p>VotingSessionStarted</p>
                    <p>VotingSessionEnded</p>
                    <p>VotesTallied</p>
                </div>
            )
        } else if(this.props.wfStatus === '2') {
            return (
                <div>
                    <p>Registering Voters</p>
                    <p>ProposalsRegistrationStarted</p>
                    <h3>ProposalsRegistrationEnded</h3>
                    <p>VotingSessionStarted</p>
                    <p>VotingSessionEnded</p>
                    <p>VotesTallied</p>
                </div>
            )
        } else if(this.props.wfStatus === '3') {
            return (
                <div>
                    <p>Registering Voters</p>
                    <p>ProposalsRegistrationStarted</p>
                    <p>ProposalsRegistrationEnded</p>
                    <h3>VotingSessionStarted</h3>
                    <p>VotingSessionEnded</p>
                    <p>VotesTallied</p>
                </div>
            )
        } else if(this.props.wfStatus === '4') {
            return (
                <div>
                    <p>Registering Voters</p>
                    <p>ProposalsRegistrationStarted</p>
                    <p>ProposalsRegistrationEnded</p>
                    <p>VotingSessionStarted</p>
                    <h3>VotingSessionEnded</h3>
                    <p>VotesTallied</p>
                </div>
            )
        } else if(this.props.wfStatus === '5') {
            return (
                <div>
                    <li>Registering Voters > </li>
                    <li>Proposal Registration > </li>
                    <li>Voting Session > </li>
                    <li className="currentStatus">Votes Tallied </li>
                </div>
                // <ol className="c-stepper">
                //     <li className="c-stepper__item">
                //         <h3 className="c-stepper__title">Registering Voters</h3>
                //     </li>
                //     <li className="c-stepper__item">
                //         <h3 className="c-stepper__title">Registering Proposals</h3>
                //     </li>
                //     <li className="c-stepper__item">
                //         <h3 className="c-stepper__title">Voting Session</h3>
                //     </li>
                //     <li className="c-stepper__item">
                //         <h3 className="c-stepper__title">Votes Tallied</h3>
                //     </li>                       
                // </ol>
                
            )
        }
    } 
}