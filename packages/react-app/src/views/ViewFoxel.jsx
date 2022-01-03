import { useParams } from 'react-router-dom';
function ViewFoxel() {
    const id = useParams().id;
    console.log(id);
    return (
        <div className="view-foxel">
            <p>Hello Worlds! Viewing Foxel {id}</p>
        </div>
    )
}

export default ViewFoxel;