import React from "react";
import Styles from "./Navbar.module.css";
import { PageHeader, Dropdown, Button, Menu, Avatar } from "antd";
import { RootState, logout } from "../../redux";
import { connect } from "react-redux";

interface NavbarProps {
  name?: string;
  logout: typeof logout;
}

const Navbar = (props: NavbarProps): JSX.Element => {
  const menu = (
    <Menu>
      <Menu.Item onClick={props.logout}>LogOut</Menu.Item>
    </Menu>
  );

  return (
    <div className={Styles.nav}>
      <PageHeader
        className={Styles.pageHeader}
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
        <Dropdown overlay={menu} placement="topRight">
          <Button className={Styles.button}>Menu</Button>
        </Dropdown>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { currentUser } = state.Auth;
  return { name: currentUser ? currentUser.name : undefined };
};

export default connect(mapStateToProps, { logout })(Navbar);
