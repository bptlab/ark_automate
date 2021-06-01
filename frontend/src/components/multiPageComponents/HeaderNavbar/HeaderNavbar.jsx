import PropTypes from 'prop-types';
import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { getRobotId } from '../../../utils/sessionStorage/localSsotController/ssot';
import styles from './HeaderNavbar.module.css';

const { Header } = Layout;

/**
 * @component
 * @description Renders the header navbar for all pages and initially selects the passed key element.
 * @category Frontend
 * @example return <HeaderNavbar selectedKey={2} />
 */
const HeaderNavbar = (props) => {
  const { selectedKey } = props;
  const ICON_KEY = 0;
  const ROBOT_OVERVIEW_PAGE_KEY = 1;
  const BPMN_MODELER_PAGE_KEY = 2;
  const ROBOT_CODE_EDITOR_PAGE_KEY = 3;
  const ROBOT_INTERACTION_PAGE_KEY = 4;

  let onOverview = false;
  if (selectedKey === ROBOT_OVERVIEW_PAGE_KEY) {
    onOverview = true;
  }

  let onRobotInteraction = false;
  if (selectedKey === ROBOT_INTERACTION_PAGE_KEY) {
    onRobotInteraction = true;
  }

  let bpmnModelerLink = '/modeler';
  if (
    selectedKey === BPMN_MODELER_PAGE_KEY ||
    selectedKey === ROBOT_CODE_EDITOR_PAGE_KEY
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
        <Menu.Item className={styles.modifiedMenuItem} key={ICON_KEY}>
          <Link to='/'>
            <img
              style={{ height: '3rem' }}
              src='/logo/logoCta.png'
              alt='Ark Automate Icon'
            />
          </Link>
        </Menu.Item>

        <Menu.Item key={ROBOT_OVERVIEW_PAGE_KEY}>
          Overview
          <Link to='/robotOverview' />
        </Menu.Item>
        {!onRobotInteraction && (
          <>
            {!onOverview && (
              <Menu.Item key={BPMN_MODELER_PAGE_KEY}>
                Modeler
                <Link to={bpmnModelerLink} />
              </Menu.Item>
            )}
            {!onOverview && (
              <Menu.Item key={ROBOT_CODE_EDITOR_PAGE_KEY}>
                Robot Code
                <Link to='/robotCodeEditor' />
              </Menu.Item>
            )}
          </>
        )}
        {onRobotInteraction && (
          <Menu.Item key={ROBOT_INTERACTION_PAGE_KEY}>
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
