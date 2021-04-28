import React from 'react';
import { Modal, Table } from 'antd';

/**
 * @description View of the robot file
 * @category Client
 * @component
 */
const RobotFileSyntaxModal = (visible, handleClose) => {
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
      description:
        'Highlights a field which has not been configured yet in the ssot',
    },
    {
      key: '3',
      name: 'Requires User Input',
      syntax: '!!parameterName!!',
      description:
        'Highlights a parameter which should be specified by the user when starting the robot',
    },
    {
      key: '4',
      name: 'Variable',
      syntax: '$(variableName)',
      description:
        'Used to pass in a variable, which could be the output of a previous activity',
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
    <Modal
      title='Robot Framework Syntax'
      visible={visible}
      onOk={handleClose}
      onCancel={handleClose}
      footer={false}
    >
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </Modal>
  );
};

export default RobotFileSyntaxModal;
