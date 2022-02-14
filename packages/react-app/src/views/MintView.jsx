import { Alert, Button, Col, Menu, Row, Affix, Typography, Space } from "antd";

import React from "react";
import { RecentlyMintedFoxels } from "./";
const { ethers } = require("ethers");

export default function MintView({
  address,
  loadWeb3Modal,
  price,
  yourLocalBalance,
  tokenLimit,
  tokenPrice,
  mintEnabled,
  currentSupply,
  minting,
  writeContracts,
  setMinting,
  tx,
}) {
  return (
    <div className="mint-view">
      <Space size="middle" direction="vertical">
        <h1 style={{ marginTop: "20px" }}>Mint a Foxel!</h1>
        <h3>
          Minting is how you create your very own Foxel.
          <br /> Connect a web3 wallet and press the button below.
        </h3>

        {address ? (
          <Button
            style={{ margin: "8px 8px 0", fontSize: 24, height: 50 }}
            type="primary"
            size="large"
            loading={minting}
            disabled={
              !mintEnabled ||
              !address ||
              price > yourLocalBalance ||
              (tokenLimit && currentSupply && tokenLimit.toString() == currentSupply.toString())
            }
            onClick={async () => {
              try {
                setMinting(true);
                const result = tx(
                  writeContracts.Foxel.safeMint(address, {
                    value: tokenPrice,
                    gasLimit: "140000",
                  }),
                );
                console.log("awaiting metamask/web3 confirm result...", result);
                console.log(await result);
                setMinting(false);
              } catch (e) {
                console.log(e);
                setMinting(false);
              }
            }}
          >
            {mintEnabled
              ? tokenLimit && currentSupply && tokenLimit.toString() == currentSupply.toString()
                ? "All Foxels are minted"
                : `Mint for ${tokenPrice ? ethers.utils.formatEther(tokenPrice) : "..."} MATIC`
              : "Minting Disabled"}
          </Button>
        ) : (
          <Button
            key="loginbutton"
            type="primary"
            style={{ verticalAlign: "top", margin: 8, fontSize: 24, height: 50 }}
            shape="round"
            size="large"
            /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
            onClick={loadWeb3Modal}
          >
            Connect to Mint
          </Button>
        )}
        <p>
          <Typography.Text style={{ margin: 8 }}>{`${currentSupply || "..."} out of ${tokenLimit || "..."
            } minted`}</Typography.Text>
        </p>

        {currentSupply ? <RecentlyMintedFoxels currentSupply={currentSupply} /> : <div />}
      </Space>
    </div>
  );
}
