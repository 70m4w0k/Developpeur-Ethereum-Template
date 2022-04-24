import React from 'react';

export default class Addresse extends React.Component {

    render(){
        if(this.props.owner === this.props.addr) {
            return (
                <div>
                    <p>
                        Vous etes le chef 🧑‍🍳
                    </p>
                    <div>{this.props.addr}</div>
                </div>
            )
        } else {
            return (
                <div>
                    <p>
                        Vous etes pas le chef 💩
                    </p>
                    <div>{this.props.addr}</div>
                </div>
            )
        }
    }
}