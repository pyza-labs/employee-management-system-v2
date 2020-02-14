import React, { useState, useEffect, Fragment, FC } from "react";
import "./App.css";
import LoginPage from "../LoginPage/LoginPage";
import Navbar from "../../components/Navbar/Navbar";
import { Router, navigate } from "@reach/router";
import SignUp from "../SignUp/SignUp";
import ErrorPage from "../../components/ErrorPage/ErrorPage";
import EmployeeHome from "../Employee/EmployeeHome/EmployeeHome";
import HrHome from "../HR/HrHome/HrHome";
import { User } from "../../repos";
import { listenToAuthState, RootState } from "../../redux";
import { connect } from "react-redux";

interface AppProps {
  currentUser?: User | null;
  listenToAuthState: typeof listenToAuthState;
}

const homeSwitch = (role: string): JSX.Element | null => {
  switch (role) {
    case "hr":
      return <HrHome fireuser={fireUser} orgCode={orgCode} path="home" />;
    case "employee":
      return <EmployeeHome fireuser={fireUser} orgCode={orgCode} path="home" />;
    default:
      return null;
  }
};

const App: FC<AppProps> = props => {
  useEffect(() => {
    listenToAuthState();
  }, []);

  const { currentUser } = props;

  if (currentUser === undefined) {
    return <div>Loading</div>;
  }

  if (currentUser === null) {
    return (
      <div>
        <Navbar logout={() => {}} />
        <Router>
          <LoginPage />
          <SignUp />
        </Router>
      </div>
    );
  }

  return (
    <div>
      <Router>
        <Navbar logout={() => {}} name={currentUser.name} />
        {homeSwitch(currentUser.role)}
      </Router>
    </div>
  );

  // return (
  //   <Fragment>
  //     <div className="App">
  //       <Navbar logout={() => {}} name={name} />
  //       <Router>
  //         <LoginPage fireuser={fireUser} orgCode={orgCode} path="/" />
  //         <SignUp fireuser={fireUser} path="signup" />
  //         {homeSwitch()}
  //         <ErrorPage path="error404"></ErrorPage>
  //       </Router>
  //     </div>
  //   </Fragment>
  // );
};

const mapStateToProps = (state: RootState) => {
  const { currentUser, message, error } = state.Auth;
  return { currentUser, message, error };
};

export default connect(mapStateToProps, { listenToAuthState })(App);
