import React, { Component } from "react";
import DevinezContract from "./contracts/Devinez.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { text:"", owned: false, indice:"", web3: null, accounts: null, contract: null};

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DevinezContract.networks[networkId];

      const instance = new web3.eth.Contract(
        DevinezContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const gagnant = await instance.methods.gagnant().call();
      const indice = await instance.methods.indice().call();
      const owner = await instance.methods.owner().call();

      let owned = accounts[0] == owner;

      let text;

      if(accounts[0] == gagnant) {
        text = "Bravo, vous avez gagné la partie, attendez que l'admin en lance une nouvelle";
      } else if(gagnant != 0x0000000000000000000000000000000000000000) {
        text = "Un autre joueuer a gagné gagné la partie, attendez que l'admin en lance une nouvelle";  
      } else {
        text = "Personne n'a encore gagné, tentez votre chance!"
      }

      this.setState({ text, owned, web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        {/* <h2>Smart Contract Example</h2>
        <div>The stored Value is: {this.state.storageValue}</div>
        <p>
          Change value :
        </p>
        <input type="text" id="valeur" />
        <button onClick={(this.runSet)}>Set the value you wrote inside the blockchain</button>
        <br />
        <p>
          Addresses that interacted with the contract, and the value they put
        </p>
        <table>
          <tr><td>Address From</td><td>Value Written</td></tr>
          {this.state.addresses.map((addresse) => (
            <tr><td>{addresse.returnValues.addr}</td><td>{addresse.returnValues.data}</td></tr>
          ))}
        </table> */}
      </div>
    );
  }
}

export default App;
