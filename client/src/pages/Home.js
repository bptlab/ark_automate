import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from 'antd';

const { Title } = Typography;

const Home = () => {
  const [message] = useState(null);

  return (
    <div>
      <Title style={{ alignItems: 'center' }}>Startseite</Title>
      <Title level={3}>Das ist unsere Startseite - TOLL!</Title>
      {/* <p>{isFetching ? 'Fetching message from API' : message}</p> */}
      <p>{message}</p>
      <Link to='/modeler'>
        <Button type='primary'>Go to Modeler</Button>
      </Link>
    </div>
  );
};

export default Home;
