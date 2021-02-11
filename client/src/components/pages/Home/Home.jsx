import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from 'antd';

const { Title } = Typography;

/**
 * @description Homepage of the application
 * @category Client
 * @component
 */
const Home = () => {
  const [message] = useState(null);

  return (
    <div>
      <Title style={{ alignItems: 'center', color: 'lightblue' }}>
        Startseite
      </Title>
      <Title level={3}>Das ist unsere Startseite - TOLL!</Title>
      <p>{message}</p>
      <Link to='/modeler'>
        <Button type='primary'>Go to Modeler</Button>
      </Link>
    </div>
  );
};

export default Home;
