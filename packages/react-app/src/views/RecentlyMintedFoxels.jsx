import React from "react";
import './RecentlyMintedFoxels.css';
import { Foxel } from '../views';
const { ethers } = require("ethers");
import { useThemeSwitcher } from 'react-css-theme-switcher';


export default function RecentlyMintedFoxels({ recentlyMinted }) {
    const { currentTheme } = useThemeSwitcher();
    return (
        <div className={`recently-minted-container ${currentTheme == 'dark' ? 'night' : ''}`}>
            {recentlyMinted.map(foxel => {
                const tokenId = ethers.BigNumber.from(foxel.args.tokenId).toNumber();
                return (
                    <Foxel
                        key={tokenId}
                        tokenId={tokenId} />
                );
            })
            }
        </div>
    );
}
