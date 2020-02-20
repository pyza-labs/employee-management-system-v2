import React, { useEffect, FC } from "react";
import "./App.css";
import { message as ShowMessage } from "antd";
import LoginPage from "../LoginPage/LoginPage";
import Navbar from "../../components/Navbar/Navbar";
import { Router } from "@reach/router";
import SignUp from "../SignUp/SignUp";
// import EmployeeHome from "../Employee/EmployeeHome/EmployeeHome";
// import HrHome from "../HR/HrHome/HrHome";
import { User } from "../../repos";
import { listenToAuthState, RootState } from "../../redux";
import { connect } from "react-redux";
import ForgotPassword from "../ForgotPassword/ForgotPassword";

interface AppProps {
  currentUser?: User | null;
  listenToAuthState: typeof listenToAuthState;
  error?: string;
  message?: string;
}

export enum Routes {
  Home = "home",
  ForgotPassword = "forgot-password",
  UserHr = "hr-home",
  UserEmployee = "employee-home",
  SignUp = "sign-up"
}

// const homeSwitch = (role: string): JSX.Element | null => {
//   switch (role) {
//     case "hr":
//       return <HrHome path={Routes.UserHr} />;
//     case "employee":
//       return <EmployeeHome path={Routes.UserEmployee} />;
//     default:
//       return null;
//   }
// };

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
    return <div>Loading</div>;
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
      <Router>
        <Navbar />
        {/* {homeSwitch(currentUser.role)} */}
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
