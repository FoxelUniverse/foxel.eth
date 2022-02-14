import React from "react";
import { Link } from "react-router-dom";

import './Foxel.css';
import metadata from '../../assets/foxelMetadata.json';

export default function Foxel({ tokenId }) {
    const imgLocation = '/Genesis/';
    const thisFoxel = metadata[tokenId - 1];
    return (
        <Link className="foxel" to={`foxel/${tokenId}`}>
            <img src={imgLocation + tokenId + '.png'} alt={thisFoxel.name} />
            <p className="foxel-name">{thisFoxel.name}</p>
        </Link>
    );
}
