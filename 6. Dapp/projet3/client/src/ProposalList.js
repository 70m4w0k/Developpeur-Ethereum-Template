import React from 'react';

import "./App.css";

export default class ProposalList extends React.Component {

    render(){
        
        return (
            <table className="center">
                <tr><td>Proposals</td></tr>
                {this.props.proposals.map((prop) => (
                <tr>
                    <td>{prop.returnValues.voterAddress}</td>
                </tr>
                ))}
            </table>
        )
    } 
}