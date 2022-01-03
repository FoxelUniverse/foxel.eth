import React from "react";
import './RecentlyMintedFoxels.css';
import { Foxel } from '../views';
const { ethers } = require("ethers");


export default function RecentlyMintedFoxels({ recentlyMinted, baseURI }) {

    return (
        <div className="recently-minted-container">
            {recentlyMinted.map(foxel => {
                return (
                    <Foxel metadataSrc={baseURI.replace('ipfs://', 'https://ipfs.io/ipfs/') + ethers.BigNumber.from(foxel.args.tokenId)} />
                );
            })
            }
        </div>
    );
}
