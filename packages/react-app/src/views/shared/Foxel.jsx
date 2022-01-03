import React from "react";
import { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import './Foxel.css';
import FoxelSvg from '../../assets/foxel.svg';


export default function Foxel({ metadataSrc }) {
    const [foxel, setFoxel] = useState([]);
    const [loading, setLoading] = useState(true);
    fetch(metadataSrc)
        .then(response => response.json())
        .then(data => {
            setFoxel(data);
            setLoading(false);
        }).catch(error => console.log(error));

    return (
        <div className="foxel">
            {loading ? (
                <LoadingOutlined
                    type="message"
                    style={{ paddingTop: 20, fontSize: "60px", color: "#d34d2f" }}
                    theme="outlined"
                />
            ) : (
                <img src={foxel && foxel.image ? foxel.image.replace('ipfs://', 'https://ipfs.io/ipfs/') : FoxelSvg} />
            )}
        </div>
    );
}
