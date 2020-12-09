import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

import './HeaderNavbar.css';

const { Header, Footer, Sider, Content } = Layout;

export default class HeaderNavbar extends Component {
    render() {
        return (
            <>
                <Header>
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                        <Menu.Item key="1">
                            Home
            <Link to="/" />
                        </Menu.Item>
                        <Menu.Item key="2">Modeler</Menu.Item>
                        <Menu.Item key="3">Option 3</Menu.Item>
                    </Menu>
    Das wird mal unser Modeler - Header
</Header >
            </>
        );
    }
}