import React, { useState } from "react";
import { BrowserProvider, Contract } from "ethers";

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Replace with your contract address
const contractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "fileId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "FileUploaded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "accessList",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "fileCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "files",
      "outputs": [
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_fileId",
          "type": "uint256"
        }
      ],
      "name": "getFileHash",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_fileId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "grantAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "uploadFile",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
  function App() {
    const [account, setAccount] = useState("");
    const [fileHash, setFileHash] = useState("");
    const [fileId, setFileId] = useState("");

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new BrowserProvider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();
                setAccount(await signer.getAddress());
            } catch (error) {
                console.error("Error connecting to MetaMask:", error);
                alert("Error connecting to MetaMask. Please try again.");
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    const uploadFile = async () => {
        if (!fileHash) return alert("Please enter a file hash");
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, contractABI, signer);
            const tx = await contract.uploadFile(fileHash);
            const receipt = await tx.wait(); // Wait for the transaction to be mined
    
            // Extract the File ID from the event
            const event = receipt.logs[0].args;
            const fileId = event.fileId.toString();
    
            alert(`File uploaded successfully! File ID: ${fileId}`);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error uploading file. Please try again.");
        }
    };

    const fetchFileFromIPFS = async (ipfsHash) => {
        const url = `https://ipfs.io/ipfs/${ipfsHash}`;
        const response = await fetch(url);
        const data = await response.blob(); // For binary files (e.g., images, PDFs)
        return data;
    };

    // Save File ID to localStorage
const saveFileId = (fileId) => {
    const uploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles") || []);
    uploadedFiles.push(fileId);
    localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));
};

// Retrieve File IDs from localStorage
const getUploadedFiles = () => {
    return JSON.parse(localStorage.getItem("uploadedFiles") || []);
};

    const getLatestFileId = async () => {
        const provider = new BrowserProvider(window.ethereum);
        const contract = new Contract(contractAddress, contractABI, provider);
        const count = await contract.fileCount();
        return count - 1;
    };

    const getFile = async () => {
        if (!fileId) return alert("Please enter a file ID");
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, contractABI, signer);
            const hash = await contract.getFileHash(fileId);
            alert(`File Hash: ${hash}`);

            // Fetch the file from IPFS
            const file = await fetchFileFromIPFS(hash);
            console.log("File retrieved from IPFS:", file);

            // Display the file (if it's an image)
            if (file.type.startsWith("image/")) {
                const url = URL.createObjectURL(file);
                const img = document.createElement("img");
                img.src = url;
                document.body.appendChild(img);
            }
        } catch (error) {
            console.error("Error retrieving file:", error);
            alert("Error retrieving file. Please check the file ID and try again.");
        }
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