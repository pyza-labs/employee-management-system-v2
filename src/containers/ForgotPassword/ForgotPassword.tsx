import React, { FC, useState, ChangeEvent } from "react";
import Styles from "./ForgotPassword.module.css";
import { RouteComponentProps } from "@reach/router";
import { connect } from "react-redux";
import { resetPassword } from "../../redux";
import { Layout, Input, Button } from "antd";

const { Header, Content, Footer } = Layout;

interface ForgotPasswordProps extends RouteComponentProps {
  resetPassword: typeof resetPassword;
}
const ForgotPassword: FC<ForgotPasswordProps> = (props): JSX.Element => {
  const [email = "", setEmail] = useState<string>();

  const emailHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value.trim());
  };

  return (
    <Layout>
      <Content className={Styles.content}>
        <div>
          <span>Please Enter Your Registered email</span>
          <Input
            className={Styles.input}
            onChange={emailHandler}
            placeholder="Enter Email"
          ></Input>
          <Button onClick={() => props.resetPassword(email)}>Submit</Button>
        </div>
      </Content>
      <Footer className={Styles.footer}>Pyza Labs ©2020</Footer>
    </Layout>
  );
};

export default connect(null, { resetPassword })(ForgotPassword);
