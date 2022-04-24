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
                    <li>Registering Voters > </li>
                    <li className="currentStatus">Proposal Registration > </li>
                    <li>Voting Session > </li>
                    <li>Votes Tallied </li>
                </div>
            )
        } else if(this.props.wfStatus === '3') {
            return (
                <div>
                    <li>Registering Voters > </li>
                    <li>Proposal Registration > </li>
                    <li className="currentStatus">Voting Session > </li>
                    <li>Votes Tallied </li>
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
            )
        } else {
            return (
                <div>
                    <li>Registering Voters > </li>
                    <li>Proposal Registration > </li>
                    <li>Voting Session > </li>
                    <li>Votes Tallied </li>
                </div>
            )
        }
    } 
}