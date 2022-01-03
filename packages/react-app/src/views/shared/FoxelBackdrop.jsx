import React from "react";
import './FoxelBackdrop.css';
import FoxelSvg from '../../assets/foxel.svg';
import { useThemeSwitcher } from 'react-css-theme-switcher';

export default function FoxelBackdrop() {
    const { currentTheme } = useThemeSwitcher();

    return (
        <div className={`backdrop ${currentTheme == 'dark' ? 'night' : ''}`}>

            <div className={`sky ${currentTheme == 'dark' ? 'night' : ''}`}>
                <div className="x4">
                    <div className="cloud"></div>
                </div>
                <div className="x3">
                    <div className="cloud"></div>
                </div>
                <div className="x5">
                    <div className="cloud"></div>
                </div>
            </div>
            <img className={`foxel ${currentTheme == 'dark' ? 'night' : ''}`} src={FoxelSvg} />
        </div>);
}
