import React from 'react';
import { Card, Row, Col } from 'antd';
import PropTypes from 'prop-types';

const RobotLogCard = (props) => {
  const { log } = props;
  const { displayStatusIcon } = props;

  return (
    <Card
      style={{ margin: '10px' }}
      headStyle={{ fontWeight: 'bold' }}
      hoverable
      title={log.activityName}
      size='small'
      type='inner'
    >
      <Row>
        <Col xs={24} md={16}>
          {log.message && <p>Error Message: {log.message}</p>}
          {log.tasks &&
            log.tasks.map((task, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Card key={index} size='small'>
                <Row>
                  <Col xs={24} lg={24} xl={16}>
                    <p>Task: {task.task_name}</p>
                  </Col>
                  <Col xs={24} lg={24} xl={8}>
                    <p>Status: {task.status}</p>
                  </Col>
                </Row>
              </Card>
            ))}
        </Col>
        <Col xs={24} md={8}>
          <>{displayStatusIcon(log.status)}</>
        </Col>
      </Row>
    </Card>
  );
};
export default RobotLogCard;

RobotLogCard.propTypes = {
  displayStatusIcon: PropTypes.func.isRequired,
  log: PropTypes.oneOfType([PropTypes.arrayOf(Object), PropTypes.any])
    .isRequired,
};
