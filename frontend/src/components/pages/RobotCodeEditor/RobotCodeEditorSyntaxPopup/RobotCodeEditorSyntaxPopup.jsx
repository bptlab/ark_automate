import React from 'react';
import { Modal, Table } from 'antd';
import PropTypes from 'prop-types';

/**
 * @description View of the robot file
 * @category Frontend
 * @component
 */
const RobotFileSyntaxModal = (props) => {
  const { visible, handleClose } = props;
  const dataSource = [
    {
      key: '1',
      name: 'Regular parameters',
      syntax: 'parameterValue',
      description: 'Hard code the specific value for this parameter',
    },
    {
      key: '2',
      name: 'Empty Parameter Field',
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
      name: 'Parameter',
      syntax: '$(parameterName)',
      description:
        'Used to pass in a parameter, which could be the output of a previous activity',
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

RobotFileSyntaxModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default RobotFileSyntaxModal;
