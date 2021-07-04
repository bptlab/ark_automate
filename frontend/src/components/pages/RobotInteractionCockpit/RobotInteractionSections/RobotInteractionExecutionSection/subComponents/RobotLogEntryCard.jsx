import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import PropTypes from 'prop-types';
const { Title } = Typography;
/**
 * @description Renders the status of an individual robot log
 * @category Frontend
 * @component
 */
const RobotLogCard = (props) => {
  const { log } = props;
  const { displayStatusIcon } = props;

  return (
    <Card
      style={{ margin: '10px' }}
      headStyle={{ fontWeight: 'bold' }}
      hoverable
      size='small'
      type='inner'
    >
      <Row>
        <Col xs={24} md={16}>
          {log.activityName && log.status && (
            <Title
              style={{
                top: '35%',
                position: 'absolute',
              }}
              level={5}
            >
              {log.activityName}
            </Title>
          )}
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
