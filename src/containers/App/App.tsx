import React, { useEffect, FC } from "react";
import "./App.scss";
import { message as ShowMessage, Spin } from "antd";
import LoginPage from "../LoginPage";
import Navbar from "../../components/Navbar";
import { Router } from "@reach/router";
import SignUp from "../SignUp/SignUp";
import EmployeeHome from "../Employee/EmployeeHome";
import HRHome from "../HR/HRHome";
import { User } from "../../repos";
import { listenToAuthState, RootState } from "../../redux";
import { connect } from "react-redux";
import ForgotPassword from "../ForgotPassword";

interface AppProps {
  currentUser?: User | null;
  listenToAuthState: typeof listenToAuthState;
  error?: string;
  message?: string;
}

export enum Routes {
  Home = "/",
  ForgotPassword = "forgot-password",
  SignUp = "sign-up"
}

const homeSwitch = (role: string): JSX.Element | null => {
  switch (role) {
    case "hr":
      return <HRHome path={Routes.Home} />;
    case "employee":
      return <EmployeeHome path={Routes.Home} />;
    default:
      return null;
  }
};

const App: FC<AppProps> = props => {
  const { listenToAuthState, error, message, currentUser } = props;

  useEffect(() => {
    listenToAuthState();
  }, []);

  useEffect(() => {
    if (!message) {
      return;
    }
    ShowMessage.success(message);
  }, [message]);

  useEffect(() => {
    if (!error) {
      return;
    }
    ShowMessage.error(error);
  }, [error]);

  if (currentUser === undefined) {
    return (
      <div className="Apploader">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  if (currentUser === null) {
    return (
      <div>
        <Navbar />
        <Router>
          <LoginPage path={Routes.Home} default />
          <SignUp path={Routes.SignUp} />
          <ForgotPassword path={Routes.ForgotPassword} />
        </Router>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Router>{homeSwitch(currentUser.role)}</Router>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { currentUser, message, error } = state.Auth;
  return { currentUser, message, error };
};

export default connect(mapStateToProps, { listenToAuthState })(App);
