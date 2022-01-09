import { CarFilled } from "@ant-design/icons";
import { Alert, Button, Col, Menu, Row, Affix, Typography, Card, Timeline } from "antd";
import './Roadmap.css';

function Roadmap() {

    return (
        <div className="roadmap" style={{ padding: '20px 10px' }}>
            <h1>It All Starts Here</h1>
            <Timeline mode="alternate">
                <Timeline.Item color="#d34d2f">
                    <Card title="Genesis Collection" >
                        <p>The release of a collection of 3000 foxels into the wild. Ownership gaurantees the opportunity to participate in FoxelDAO.</p>
                    </Card>
                </Timeline.Item>
                <Timeline.Item color="#d34d2f">
                    <Card title="Breeder">
                        <p>Add the abilty to breed two foxels to create a new one. The Foxel will be a conglomeration of its parents DNA with potential to exhibit its grandparent DNA.</p>
                    </Card>
                </Timeline.Item>
                <Timeline.Item color="#d34d2f">
                    <Card title="Arena">
                        <p>Design and build a battle system with player incentives.</p>
                    </Card>
                </Timeline.Item>
                <Timeline.Item color="#d34d2f">
                    <Card title="FoxelDAO">
                        <p>Each member comes together to contribute to the Foxel ecosystem through submitting ideas, voting and using their own unique abilities.</p>
                    </Card>
                </Timeline.Item>
                <Timeline.Item color="#d34d2f">
                    <Card title="∞">
                        <p>Every member of FoxelDAO can submit new ideas and help move the needle forward.</p>
                    </Card>
                </Timeline.Item>
            </Timeline>
        </div>
    )
}

export default Roadmap;
