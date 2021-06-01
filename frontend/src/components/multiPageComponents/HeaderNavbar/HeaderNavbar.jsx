import PropTypes from 'prop-types';
import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { getRobotId } from '../../../utils/sessionStorage/localSsotController/ssot';
import styles from './HeaderNavbar.module.css';

const { Header } = Layout;

/**
 * @component
 * @description Renders the header navbar for all pages and initially selects the passed key-element.
 * @category Frontend
 * @example return <HeaderNavbar selectedKey={2} />
 */
const HeaderNavbar = (props) => {
  const { selectedKey } = props;
  const iconKey = 0;
  const robotOverviewPageKey = 1;
  const bpmnModelerPageKey = 2;
  const robotCodeEditorPageKey = 3;
  const robotInteractionPageKey = 4;

  let onOverview = false;
  if (selectedKey === robotOverviewPageKey) {
    onOverview = true;
  }

  let onRobotInteraction = false;
  if (selectedKey === robotInteractionPageKey) {
    onRobotInteraction = true;
  }

  let bpmnModelerLink = '/modeler';
  if (
    selectedKey === bpmnModelerPageKey ||
    selectedKey === robotCodeEditorPageKey
  ) {
    bpmnModelerLink += `/${getRobotId()}`;
  }

  return (
    <Header className={styles.header}>
      <Menu
        theme='dark'
        mode='horizontal'
        defaultSelectedKeys={[selectedKey.toString()]}
      >
        <Menu.Item className={styles.modifiedMenuItem} key={iconKey}>
          <Link to='/'>
            <img
              style={{ height: '3rem' }}
              src='/logo/logoCta.png'
              alt='Ark Automate Icon'
            />
          </Link>
        </Menu.Item>

        <Menu.Item key={robotOverviewPageKey}>
          Overview
          <Link to='/robot_overview' />
        </Menu.Item>
        {!onRobotInteraction && (
          <>
            {!onOverview && (
              <Menu.Item key={bpmnModelerPageKey}>
                Modeler
                <Link to={bpmnModelerLink} />
              </Menu.Item>
            )}
            {!onOverview && (
              <Menu.Item key={robotCodeEditorPageKey}>
                Robot Code
                <Link to='/robotcode_editor' />
              </Menu.Item>
            )}
          </>
        )}
        {onRobotInteraction && (
          <Menu.Item key={robotInteractionPageKey}>
            Robot Interaction Cockpit
          </Menu.Item>
        )}
      </Menu>
    </Header>
  );
};

HeaderNavbar.propTypes = {
  selectedKey: PropTypes.number.isRequired,
};

export default HeaderNavbar;
