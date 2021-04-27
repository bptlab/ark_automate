import React, { useState, useEffect } from 'react';
import { Layout, Button, Space, Row, Col, Modal, Table } from 'antd';
import { highlight, languages } from 'prismjs/components/prism-core';
import Editor from 'react-simple-code-editor';
import HeaderNavbar from '../../content/HeaderNavbar/HeaderNavbar';
import getParsedRobotFile from '../../../api/ssot';
import initAvailableApplicationsSessionStorage from '../../../utils/sessionStorageUtils/sessionStorageUtils'
import { parseRobotCodeToSsot } from '../../../utils/parser/robotCodeToSsotParsing/robotCodeToSsotParsing';
import { upsert } from '../../../utils/attributeAndParamUtils';
import 'prismjs/components/prism-robotframework';
import 'prismjs/themes/prism.css';
import styles from './RobotFile.module.css';
import customNotification from '../../../utils/notificationUtils';

/**
 * @description View of the robot file
 * @category Client
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

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
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
      customNotification('Warning', 'Because a parsing error occurred, the robot was not saved to cloud.')
    } else {
      sessionStorage.setItem('ssotLocal', JSON.stringify(ssot));

      upsert();
    }
  };

  const dataSource = [
    {
      key: '1',
      name: 'Regular parameters',
      syntax: 'parameterValue',
      description: 'Hard code the specific value for this parameter',
    },
    {
      key: '2',
      name: 'Empty Variable Field',
      syntax: '%%parameterName%%',
      description: 'Highlights a field which has not been configured yet in the ssot',
    },
    {
      key: '3',
      name: 'Requires User Input',
      syntax: '!!parameterName!!',
      description: 'Highlights a parameter which should be specified by the user when starting the robot',
    },
    {
      key: '4',
      name: 'Variable',
      syntax: '$(variableName)',
      description: 'Used to pass in a variable, which could be the output of a previous activity',
    },
  ];
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Syntax specification',
      dataIndex: 'syntax',
      key: 'syntax',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];

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
            <Modal title="Robot Framework Syntax" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={false}>
              <Table dataSource={dataSource} columns={columns} pagination={false} />
            </Modal>

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
    </Layout >
  );
};

export default RobotFile;
