import { useParams } from 'react-router-dom';
import { Col, Row, Card } from "antd";
import metadata from '../assets/foxelMetadata.json';
function ViewFoxel({ baseUri }) {
    const id = useParams().id;
    const imgLocation = `/Genesis/${id}.png`;
    const thisFoxel = metadata[id - 1];
    return (
        <div className="view-foxel" style={{ padding: '2% 5% 5%' }}>
            <Row>
                <Col span={24}><h2>Viewing {thisFoxel.name}</h2></Col>
                <Col span={12}>
                    <img src={imgLocation} alt={thisFoxel.name} style={{ transform: 'scaleX(-1)' }} />
                    <h4 style={{ textAlign: 'left' }}>DNA:<br /> {thisFoxel.dna}</h4>
                    <h4 style={{ textAlign: 'left' }}>Metadata Location:<br /> {baseUri + id}</h4>
                    <h4 style={{ textAlign: 'left' }}>Image Location:<br /> {thisFoxel.image}</h4>
                </Col>
                <Col span={12}>
                    <h4 style={{ textAlign: 'left' }}>Traits:</h4>
                    <Row gutter={[16, 16]}>


                        {thisFoxel.attributes.map((attribute, index) => {
                            return (
                                <Col span={7} key={index}>
                                    <Card key={index} size="small" title={attribute.trait_type}>
                                        <p>{attribute.value}</p>
                                    </Card>
                                </ Col>
                            );
                        })}
                    </Row>

                </Col>
            </Row>

        </div>
    )
}

export default ViewFoxel;