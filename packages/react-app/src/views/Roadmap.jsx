import './Roadmap.css';

function Roadmap() {

    return (
        <div className="timeline">
            <div className="container left complete">
                <div className="content">
                    <h2>Genesis Collection</h2>
                    <p>The release of a collection of 3000 foxels into the wild. Ownership gaurantees the opportunity to participate in FoxelDAO.</p>
                </div>
            </div>
            <div className="container right complete">
                <div className="content">
                    <h2>FoxelDAO</h2>
                    <p>Each member comes together to contribute to the Foxel ecosystem through submitting ideas, voting and using their own unique abilities.</p>
                </div>
            </div>
            <div className="container left">
                <div className="content">
                    <h2>Breeder</h2>
                    <p>Add the abilty to breed two foxels to create a new one.</p>
                </div>
            </div>
            <div className="container right">
                <div className="content">
                    <h2>Arena</h2>
                    <p>Design and build a battle system with player incentives.</p>
                </div>
            </div>
            <div className="container left">
                <div className="content">
                    <h2>You decide...</h2>
                    <p>Every member of FoxelDAO can submit new ideas and help the Foxel community enact them.</p>
                </div>
            </div>
        </div>

    )
}

export default Roadmap;
