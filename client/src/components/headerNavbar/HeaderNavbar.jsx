import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

import './HeaderNavbar.css';

const { Header } = Layout;

export default class HeaderNavbar extends Component {
    render() {
        return (
            <>
                <Header style={{ background: '#363636' }}>
                    <div className="logo" />
                    {console.log(this.props.selectedKey)}
                    <Menu theme="dark" style={{ background: '#363636' }} mode="horizontal" defaultSelectedKeys={[this.props.selectedKey.toString()]}>
                        <Menu.Item key="1">
                            Home
                            <Link to="/" />
                        </Menu.Item>
                        <Menu.Item key="2">
                            Modeler
                            <Link to="/modeler" />
                        </Menu.Item>
                        <Menu.Item key="3">
                            Robot File
                            <Link to="/robotfile" />
                        </Menu.Item>
                    </Menu>
                </Header >
            </>
        );
    }
}