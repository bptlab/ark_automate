import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from 'antd';
import styles from './Home.module.css';

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
      <Title className={styles.title}>Startseite</Title>
      <Title level={3}>Das ist unsere Startseite - TOLL!</Title>
      <p>{message}</p>
      <Link to='/modeler'>
        <Button type='primary'>Go to Modeler</Button>
      </Link>
    </div>
  );
};

export default Home;
