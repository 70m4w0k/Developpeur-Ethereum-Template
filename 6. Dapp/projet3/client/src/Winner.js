import React from 'react';

export default class Addresse extends React.Component {

    render(){
        if(this.props.wfStatus === '5' && this.props.winningProposal !== null) {
            return (
                <div>
                    <p>
                        HEINDE ZE OUINEURIZ
                    </p>
                    <div>{this.props.winningProposal.description}</div>
                    <div>Nombre de votes : {this.props.winningProposal.voteCount}</div>
                </div>
            )
        } else {
            return (<div></div>)
        }
    }
}