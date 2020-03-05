import React from "react";
import Styles from "./Navbar.module.scss";
import { PageHeader, Dropdown, Button, Menu, Avatar } from "antd";
import { RootState, logout } from "../../redux";
import { connect } from "react-redux";
import { navigate } from "@reach/router";
import { Routes } from "../../containers/App/App";

interface NavbarProps {
  name?: string;
  logout: typeof logout;
}

const Navbar = (props: NavbarProps): JSX.Element => {
  const menu = (
    <Menu>
      {props.name ? (
        <Menu.Item onClick={props.logout}>LogOut</Menu.Item>
      ) : (
        <Menu.Item onClick={() => navigate(Routes.Home)}>LogIn</Menu.Item>
      )}
    </Menu>
  );

  return (
    <div className={Styles.nav}>
      <PageHeader
        title="Pyza Labs"
        subTitle="Employee Management System"
      ></PageHeader>
      <div className={Styles.subWrapper}>
        {props.name && (
          <div className={Styles.avatarWrapper}>
            <Avatar src="" />
            <span className={Styles.name}>{props.name}</span>
          </div>
        )}
        {props.name && (
          <Dropdown overlay={menu} placement="topRight">
            <Button className={Styles.button}>Menu</Button>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { currentUser } = state.Auth;
  return { name: currentUser ? currentUser.name : undefined };
};

export default connect(mapStateToProps, { logout })(Navbar);
