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

  runGuess = async () => {
    const { accounts, contract } = this.state;
    let guess = document.getElementById("guess").value;
    await contract.methods.playWord(guess).send({ from: accounts[0]} );

    let text;
    const gagnant = contract.methods.gagnant().call();
    if(accounts[0] == gagnant) {
      text = "Bravo, vous avez gagné la partie, attendez que l'admin en lance une nouvelle";
    } else if(gagnant != 0x0000000000000000000000000000000000000000) {
      text = "Un autre joueuer a gagné gagné la partie, attendez que l'admin en lance une nouvelle";  
    } else {
      text = "Personne n'a encore gagné, tentez votre chance!"
    }

    this.setState({ text });    
  }

  runReset = async () => {
    const { accounts, contract } = this.state;
    let mot = document.getElementById("mot").value;
    let indice = document.getElementById("mot").value;

    await contract.methods.reset(mot, indice).send({ from: accounts[0] });
    
    let text = "Vous avez reset le jeu et indiqué un nouveau mot";
    
    this.setState({ text });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    if (this.state.owned) {
      return (
        <div className="App">
          <Adresse addr={this.state.accounts[0]} />
          <h1>Deviner c'est gagner</h1>
          <p>Voici l'etat du jeu : </p>
          <h2>{this.state.text}</h2>
          <p>Vous pouvez jouer maintenant</p>
          <p> L'indice est : {this.state.indice}</p>
          <input type="text" id="guess" />
          <button onClick={this.runSet}>Essayer</button>
          <br />
          <br />
          <p>C'est toi l'admin gros
          <br />
            <input type="text" id="mot" placeholder="mot" />
            <br />
            <input type="text" id="indice" placeholder="indice" />
            <br />
            <button onClick={this.runReset}>Reset le jeu</button>
          </p>
        </div>
        );
      } else {
        return (
          <div className="App">
          <Adresse addr={this.state.accounts[0]} />
          <h1>Deviner c'est gagner</h1>
          <p>Voici l'etat du jeu : </p>
          <h2>{this.state.text}</h2>
          <p>Vous pouvez jouer maintenant</p>
          <p> L'indice est : {this.state.indice}</p>
          <input type="text" id="guess" />
          <button onClick={this.runSet}>Essayer</button>
          <br />
        </div>
      );  
    }
  }
}

export default App;
