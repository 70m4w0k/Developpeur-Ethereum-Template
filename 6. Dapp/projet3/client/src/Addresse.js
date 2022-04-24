import React from 'react';

export default class Addresse extends React.Component {

    render(){
        if(this.props.owner === this.props.addr) {
            return (
                <div>
                    <p>
                        You are the owner 🧑‍🍳
                    </p>
                    <div>{this.props.addr}</div>
                </div>
            )
        } else if(this.props.isVoter) {
            return (
                <div>
                    <p>
                        You are registered as a voter 📩
                    </p>
                    <div>{this.props.addr}</div>
                    <div>{this.props.isVoter}</div>
                </div>
            )
        } else {
            return (
                <div>
                    <p>
                        You are not registered as voter  
                    </p>
                    <div>{this.props.addr}</div>
                </div>
            )
        }
    }
}