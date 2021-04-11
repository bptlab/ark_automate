import React, { useState, useEffect } from 'react';
import { Layout, Button, Space, Row, Col } from 'antd';
import { highlight, languages } from 'prismjs/components/prism-core';
import Editor from 'react-simple-code-editor';
import HeaderNavbar from '../../content/HeaderNavbar/HeaderNavbar';
import getParsedRobotFile from '../../../api/ssot';
import initAvailableApplicationsSessionStorage from '../../../utils/sessionStorageUtils/sessionStorageUtils'
import { parseRobotCodeToSsot } from '../../../utils/parser/robotCodeToSsotParsing/robotCodeToSsotParsing';
import 'prismjs/components/prism-robotframework';
import 'prismjs/themes/prism.css';
import styles from './RobotFile.module.css';
import { upsert } from '../../../utils/attributeAndParamUtils';

/**
 * @description View of the robot file
 * @category Client
 * @component
 */
const RobotFile = () => {
  const [code, setCode] = useState(
    'Please wait, your robot file is being loaded.'
  );

  /**
   * @description Equivalent to ComponentDidMount in class based components
   */
  useEffect(() => {
    initAvailableApplicationsSessionStorage();

    const robotId = JSON.parse(sessionStorage.getItem('robotId'));
    getParsedRobotFile(robotId)
      .then((response) => response.text())
      .then((robotCode) => {
        setCode(robotCode);
      });
  }, []);

  /**
   * @description Gets called when the the button is pressed to save to the cloud.
   * This function will retrieve the code from the editor, parse it to a ssot and write the
   * resulting ssot into the sessionStorage.
   */
  const onSaveToCloud = /* async */ () => {
    const ssot = parseRobotCodeToSsot(code);
    sessionStorage.setItem('ssotLocal', JSON.stringify(ssot));
    upsert();
  };

  return (
    <Layout>
      <HeaderNavbar selectedKey={3} />
      <Row justify='center' width='100%'>
        <Col xs={24} sm={24} md={20}>
          <Space
            direction='vertical'
            size='middle'
            style={{ padding: '1rem', width: '100%' }}
          >
            <Button
              type='primary'
              onClick={onSaveToCloud}
              style={{ width: '100%' }}
            >
              Save changes to cloud
            </Button>
            <Editor
              value={code}
              onValueChange={(newCode) => setCode(newCode)}
              highlight={(highlightCode) =>
                highlight(highlightCode, languages.robotframework)
              }
              padding='1rem'
              className={styles.editor}
              tabsize={4}
            />
          </Space>
        </Col>
      </Row>
    </Layout>
  );
};

export default RobotFile;
