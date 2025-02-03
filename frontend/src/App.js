import React, { useState } from "react";
import Web3 from "web3";

function App() {
  const [account, setAccount] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div>
      <h1>Decentralized File Storage</h1>
      <button onClick={connectWallet}>
        {account ? `Connected: ${account}` : "Connect Wallet"}
      </button>
    </div>
  );
}

export default App;