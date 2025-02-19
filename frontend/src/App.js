import React, { useState } from "react";
import { ethers } from "ethers";

const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your contract address
const contractABI = [ /* Paste the ABI here */ ];

function App() {
    const [account, setAccount] = useState("");
    const [fileHash, setFileHash] = useState("");
    const [fileId, setFileId] = useState("");

    const connectWallet = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            setAccount(await signer.getAddress());
        } else {
            alert("Please install MetaMask!");
        }
    };

    const uploadFile = async () => {
        if (!fileHash) return alert("Please enter a file hash");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const tx = await contract.uploadFile(fileHash);
        await tx.wait();
        alert("File uploaded successfully!");
    };

    const getFile = async () => {
        if (!fileId) return alert("Please enter a file ID");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const hash = await contract.getFileHash(fileId);
        alert(`File Hash: ${hash}`);
    };

    return (
        <div>
            <h1>Decentralized File Storage</h1>
            <button onClick={connectWallet}>
                {account ? `Connected: ${account}` : "Connect Wallet"}
            </button>
            <div>
                <h2>Upload File</h2>
                <input
                    type="text"
                    placeholder="Enter IPFS Hash"
                    value={fileHash}
                    onChange={(e) => setFileHash(e.target.value)}
                />
                <button onClick={uploadFile}>Upload</button>
            </div>
            <div>
                <h2>Get File</h2>
                <input
                    type="text"
                    placeholder="Enter File ID"
                    value={fileId}
                    onChange={(e) => setFileId(e.target.value)}
                />
                <button onClick={getFile}>Get File</button>
            </div>
        </div>
    );
}

export default App;