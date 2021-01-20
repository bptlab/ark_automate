import React from 'react';
import { Layout , Typography } from 'antd';
import HeaderNavbar from '../content/HeaderNavbar/HeaderNavbar';


const { Title } = Typography;

const RobotFile = () => (
    <div>
      <Layout>
        <HeaderNavbar selectedKey={3} />
        <br />
        <Title style={{ paddingLeft: '30px' }}>
          In future versions, the Robot Framework code can also be edited
          directly here.
        </Title>
      </Layout>
    </div>
  );

export default RobotFile;
