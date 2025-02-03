const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
require("dotenv").config();

const pinFileToIPFS = async () => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const filePath = "./example-file.txt"; // Path to the file you want to upload

  // Create a readable stream from the file
  let data = new FormData();
  data.append("file", fs.createReadStream(filePath));

  try {
    const res = await axios.post(url, data, {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_KEY,
      },
    });

    console.log("File uploaded successfully!");
    console.log("IPFS Hash (CID):", res.data.IpfsHash);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

pinFileToIPFS();