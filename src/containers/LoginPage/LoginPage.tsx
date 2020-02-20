import React, { useState, FC, ChangeEventHandler, ChangeEvent } from "react";
import Styles from "./LoginPage.module.css";
import { Input, Button } from "antd";
import { Link, RouteComponentProps } from "@reach/router";
import { connect } from "react-redux";
import { RootState, signIn } from "../../redux";
import { Routes } from "../App/App";

export interface LoginProps extends RouteComponentProps {
  loading: boolean;
  signIn: typeof signIn;
}

const LoginPage: FC<LoginProps> = props => {
  const [email = "", setEmail] = useState<string>();
  const [password = "", setPassword] = useState<string>();
  const [orgCode = "", setOrgCode] = useState<string>();

  const { signIn, loading } = props;

  const emailHandler: ChangeEventHandler<HTMLInputElement> = (event): void => {
    setEmail(event.target.value.trim());
  };

  const passHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const codeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setOrgCode(event.target.value);
  };

  return (
    <div className={Styles.login}>
      <div className={Styles.loginInfo}>
        <Input
          placeholder="Email"
          className={Styles.input}
          onChange={emailHandler}
        ></Input>
        <Input.Password
          placeholder="Password"
          className={Styles.input}
          onChange={passHandler}
        ></Input.Password>
        <Input.Password
          placeholder="Organisation Code"
          className={Styles.input}
          onChange={codeHandler}
        ></Input.Password>
      </div>
      <div className={Styles.submitInfo}>
        <Button
          loading={loading}
          className={Styles.button}
          onClick={() => signIn(email, password, orgCode)}
          disabled={!email || !password || !orgCode}
        >
          SignIn
        </Button>
        <Button className={Styles.button}>
          <Link to={Routes.SignUp}>SignUp</Link>
        </Button>
        <Link className={Styles.forgot} to={Routes.ForgotPassword}>
          Forgot Password
        </Link>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { loading } = state.Auth;
  return { loading };
};

export default connect(mapStateToProps, { signIn })(LoginPage);
