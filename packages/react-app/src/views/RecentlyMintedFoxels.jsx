import React from "react";
import "./RecentlyMintedFoxels.css";
import { Foxel } from "../views";
const { ethers } = require("ethers");
import metadata from "../assets/foxelMetadata.json";
import { useThemeSwitcher } from "react-css-theme-switcher";

export default function RecentlyMintedFoxels({ currentSupply }) {
  const count = ethers.BigNumber.from(currentSupply).toNumber();
  const recentlyMinted = metadata.slice(count - (count >= 5 ? 5 : count), count);
  const { currentTheme } = useThemeSwitcher();
  return (
    <div className={`recently-minted-container ${currentTheme == "dark" ? "night" : ""}`}>
      {recentlyMinted.map(foxel => {
        const tokenId = foxel.name.split("#")[1];
        return <Foxel key={tokenId} tokenId={tokenId} />;
      })}
    </div>
  );
}
