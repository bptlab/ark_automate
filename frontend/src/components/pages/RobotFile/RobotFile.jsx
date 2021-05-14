import React, { useState, useEffect } from 'react';
import { Layout, Button, Space, Row, Col } from 'antd';
import { highlight, languages } from 'prismjs/components/prism-core';
import Editor from 'react-simple-code-editor';
import HeaderNavbar from '../../HeaderNavbar/HeaderNavbar';
import { getParsedRobotFile } from '../../../api/ssotRetrieval';
import { initAvailableApplicationsSessionStorage } from '../../../utils/sessionStorageUtils/sessionStorageUtils';
import { parseRobotCodeToSsot } from '../../../utils/parser/robotCodeToSsotParsing/robotCodeToSsotParsing';
import { upsert } from '../../../utils/sessionStorageUtils/localSsotController/ssot';
import 'prismjs/components/prism-robotframework';
import 'prismjs/themes/prism.css';
import styles from './RobotFile.module.css';
import customNotification from '../../../utils/componentsFunctionality/notificationUtils';
import RobotFileSyntaxModal from './RobotFileSyntaxModal/RobotFileSyntaxModal';

/**
 * @description View of the robot file
 * @category Frontend
 * @component
 */
const RobotFile = () => {
  const [code, setCode] = useState(
    'Please wait, your robot file is being loaded.'
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

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
  const onSaveToCloud = () => {
    const ssot = parseRobotCodeToSsot(code);
    if (typeof ssot === 'undefined') {
      customNotification(
        'Warning',
        'Because a parsing error occurred, the robot was not saved to cloud.'
      );
    } else {
      sessionStorage.setItem('ssotLocal', JSON.stringify(ssot));

      upsert();
    }
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                type='primary'
                onClick={onSaveToCloud}
                style={{ width: '100%', marginRight: '1rem' }}
              >
                Save changes to cloud
              </Button>
              <Button
                type='primary'
                onClick={showModal}
                className={styles.syntaxModalButton}
              >
                Show Syntax
              </Button>
            </div>
            <RobotFileSyntaxModal
              visible={isModalVisible}
              handleClose={handleModalClose}
            />
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
