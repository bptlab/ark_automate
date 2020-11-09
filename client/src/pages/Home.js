import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Row } from 'antd';

const { Title } = Typography;

 
const Home = () => {
    return (
        <div>
            <Title style={{alignItems: 'center'}}>Startseite</Title>
            <Title level={3}>Das ist unsere Startseite - GEIL!</Title>
            <Link to="/modeler">
                <Button type="primary">Go to Modeler</Button>
            </Link>
        </div>
    );
}
 
export default Home;