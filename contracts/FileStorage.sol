// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    struct File {
        string ipfsHash; // IPFS hash of the file
        address owner;   // Address of the file owner
        mapping(address => bool) accessList; // List of addresses with access
    }

    mapping(uint256 => File) public files; // Stores all files
    uint256 public fileCount; // Total number of files

    // Event to notify when a file is uploaded
    event FileUploaded(uint256 fileId, string ipfsHash, address owner);

    // Upload a file
    function uploadFile(string memory _ipfsHash) public {
        files[fileCount] = File({
            ipfsHash: _ipfsHash,
            owner: msg.sender
        });
        fileCount++;
        emit FileUploaded(fileCount - 1, _ipfsHash, msg.sender);
    }

    // Grant access to a file
    function grantAccess(uint256 _fileId, address _user) public {
        require(files[_fileId].owner == msg.sender, "Only owner can grant access");
        files[_fileId].accessList[_user] = true;
    }

    // Get file details
    function getFileHash(uint256 _fileId) public view returns (string memory) {
        require(
            files[_fileId].owner == msg.sender || files[_fileId].accessList[msg.sender],
            "Access denied"
        );
        return files[_fileId].ipfsHash;
    }
}