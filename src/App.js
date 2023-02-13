import React, { useCallback, useEffect, useState } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import "./App.css";
import particlesOptions from "./particles.json";
import { ethers } from "ethers";
import presaletoken from "./PresaleToken.json";

function App() {
  const [selectedAddress, setSetSelectedAddress] = useState("");
  const [ethValue, setEthValue] = useState(0);
  const [ethSent, setEthSent] = useState(false);
  const contractAddress = "0x82B6a6065129f52d79e03c33Dc753f70FC424966";
  const chainId = 5; //change
  const conversion = 100000000000;

  useEffect(() => {
    if (ethSent === true) {
      sendEther(ethValue, selectedAddress, contractAddress);
    }
  });

  const particlesInit = useCallback((main) => {
    loadFull(main);
  }, []);

  const connectToMetamask = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setSetSelectedAddress(accounts[0]);
    console.log(window.ethereum.networkVersion);
    if (window.ethereum.networkVersion !== chainId.toString()) {
      alert(
        "Please change to ethereum mainet in metamask, otherwise you may lose money!"
      );
    }
  };

  const sendEther = async (value, account, contractAddress) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = await new ethers.Contract(
        contractAddress,
        presaletoken.abi,
        provider
      );
      console.log(contract);
      const signerConnected = await contract.connect(provider.getSigner());
      console.log(ethers.utils.parseEther(value.toString()));
      const output = await signerConnected.transferTokens({
        value: ethers.utils.parseEther(value)
      });
      setEthSent(false);
      alert(output.hash);
    } catch (err) {
      if (err.message.toString().includes("allowance")) {
        alert("More than total presal tokens left are trying to be bought!");
        setEthSent(false);
        return;
      }
      if (err.message.toString().includes("insufficient funds")) {
        alert("Insufficient funds in account!");
        setEthSent(false);
        return;
      }
      alert(err.message);
      setEthSent(false);
    }
  };

  const connect = () => {
    connectToMetamask();
  };
  const buy = () => {
    setEthSent(true);
  };

  if (selectedAddress === "") {
    return (
      <div className="App">
        <Particles options={particlesOptions} init={particlesInit} />
        <img class = "logo" src={require('.//img/ShibRobo.png')} alt= "ShibRobo"></img>
        <div class="vertical-center">
          <button onClick={connect} type="submit" class="elementor-button">
            Connect To Metamask
          </button>
        </div>
      </div>
    );
  } else {
  }

  return (
    <div className="App">
      <Particles options={particlesOptions} init={particlesInit} />
      <img class = "logo" src={require('.//img/ShibRobo.png')} alt= "ShibRobo"></img>
      <div class="vertical-center">
        <input
          type="number"
          id="lname"
          name="lname"
          class="elementor-input"
          placeholder="Enter Eth Value"
          onChange={(e) => setEthValue(e.currentTarget.value)}
        ></input>
        <center>
          <p class="elementor-p">
            {ethValue * conversion} SHIBROBO tokens{" "}
          </p>
        </center>
        <br></br>
        <button type="submit" class="elementor-button" onClick={buy}>
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default App;
