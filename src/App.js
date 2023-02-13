import React, { useCallback, useEffect, useState } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import logo from "./logo.svg";
import "./App.css";
import particlesOptions from "./particles.json";
import { ethers } from 'ethers';
import Web3 from "web3";
import presaletoken from"./PresaleToken.json";

function App() {
  const [selectedAddress, setSetSelectedAddress] = useState("");
  const [provider, setProvider] = useState("");
  const [ethValue, setEthValue] = useState(0);
  const [ethSent, setEthSent] = useState(false);
  const contractAddress = "0xa5bb3A2cB5FE910562A711DcA1680714f766F9Ba";

  useEffect(() => {
    if (ethSent === true) {
      sendEther(ethValue, provider, selectedAddress, contractAddress);
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
    console.log(this.state.selectedAddress);
  };

  const sendEther = async (value, provider, account, contractAddress) => {
    const contract = await new ethers.Contract(contractAddress, presaletoken.abi, new ethers.providers.Web3Provider(window.ethereum));
    console.log(contract);
    const signerConnected = await contract.connect(account);
    const output = await signerConnected.transferTokens({ value: ethers.utils.parseUnits(value.toString(), "ether") });
    alert(output.hash);
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
      <div class="vertical-center">
        <input
          type="number"
          id="lname"
          name="lname"
          class="elementor-input"
          placeholder="Enter Eth Value"
          onChange={(e) => setEthValue(e.currentTarget.value)}
        ></input>
        <br></br>
        <br></br>
        <button type="submit" class="elementor-button" onClick={buy}>
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default App;
