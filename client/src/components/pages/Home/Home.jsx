import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Space } from 'antd';
import corporateDesign from '../../../layout/corporateDesign';
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
    <div className={styles.wrapper}>
      <Space
        direction='vertical'
        size='100%'
        style={{ width: '100%', pading: '0rem' }}
      >
        <Title
          style={{ textAlign: 'center', color: corporateDesign.colorPrimary }}
        >
          Ark
        </Title>
        <Title
          style={{
            textAlign: 'center',
            color: corporateDesign.colorPrimaryInvertedText,
          }}
          level={3}
        >
          fast, easy, automation
        </Title>
        <p>{message}</p>
        <Link to='/modeler'>
          <Button style={{ margin: '0 auto', display: 'block' }} type='primary'>
            Create Robot
          </Button>
        </Link>
      </Space>
    </div>
  );
};

export default Home;
