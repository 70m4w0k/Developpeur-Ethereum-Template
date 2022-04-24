import React from 'react';

export default class Addresse extends React.Component {

    render(){
        if(this.props.winningProposal !== null) {
            return (
                <div  className="App">
                    <h2>
                        And the winner is 
                    </h2>
                    <div>{this.props.winningProposal.description}</div>
                    <div>Nombre de votes : {this.props.winningProposal.voteCount}</div>
                </div>
            )
        } else {
            return (<div></div>)
        }
    }
}