import PropTypes from 'prop-types'
import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import logoCTA from '../../../resources/assets/images/logo_cta.png';

const { Header } = Layout;

/**
 * @component
 * @description Renders the header navbar for all pages and initially selects the passed key-element.
 * @example return <HeaderNavbar selectedKey={2} />
 */
const HeaderNavbar = (props) => {
  const { selectedKey } = props;
  let onOverview = true;
  if (selectedKey === 1) {
    onOverview = false;
  }


  return (
    <Header>
      <Menu
        theme='dark'
        mode='horizontal'
        defaultSelectedKeys={[selectedKey.toString()]}
      >
        <Link to='/'>
          <img
            style={{ margin: '0 1rem 0 -1rem', height: '3rem' }}
            src={logoCTA}
            alt='ark_automate Icon'
          />
        </Link>
        <Menu.Item key='1'>
          Overview
        <Link to='/robot_overview' />
        </Menu.Item>
        {onOverview && (
          <Menu.Item key='2'>
            Modeler
            <Link to='/modeler' />
          </Menu.Item>
        )}
        {onOverview && (
          <Menu.Item key='3'>
            Robot File
            <Link to='/robotfile' />
          </Menu.Item>
        )}
      </Menu>
    </Header>
  );
};

HeaderNavbar.propTypes = {
  selectedKey: PropTypes.number.isRequired
};

export default HeaderNavbar;
