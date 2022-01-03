import React from "react";
import { Link } from "react-router-dom";
import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import useScript from '../useScript.js';
import FoxelBackdrop from "./shared/FoxelBackdrop";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 */
function Home({ yourLocalBalance, readContracts }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const purpose = useContractReader(readContracts, "YourContract", "purpose");
  useScript('https://platform.twitter.com/widgets.js');
  return (
    <div style={{ minHeight: 800 }}>
      <FoxelBackdrop />
      <div>
        <h1 style={{ fontSize: '54px', margin: '10px 0 0' }}>Foxel Universe</h1>
        <a href="https://twitter.com/FoxelUniverse?ref_src=twsrc%5Etfw" className="twitter-follow-button" data-show-count="false">Follow @FoxelUniverse</a>
      </div>
      <div style={{ margin: '32px auto', width: '70%' }}>
        <h2>Foxel is an open-source, community-driven game of fox-like<br /> creatures that can be bred, battled and traded.<br /><br /> Each owner becomes a member of FoxelDAO and can contribute to the Foxel ecosystem through submitting ideas, voting and executing on the decisions of FoxelDAO with their own unique abilities.</h2>
      </div>

    </div >
  );
}

export default Home;
