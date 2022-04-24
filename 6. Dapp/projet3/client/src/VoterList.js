import React from 'react';

import "./App.css";

export default class VoterList extends React.Component {

    render(){
        return (
            <table className="center">
                <tr><td>Voters</td></tr>
                {this.props.voters.map((voter) => (
                    <tr>
                        <td>{voter.returnValues.voterAddress}</td>
                    </tr>
                ))}
            </table>
        )
    } 
}