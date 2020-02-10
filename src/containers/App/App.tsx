import React, { useState, useEffect, Fragment, FC } from "react";
import "./App.css";
import LoginPage from "../LoginPage/LoginPage";
import Navbar from "../../components/Navbar/Navbar";
import { Router, navigate } from "@reach/router";
import SignUp from "../SignUp/SignUp";
import ErrorPage from "../../components/ErrorPage/ErrorPage";
import EmployeeHome from "../Employee/EmployeeHome/EmployeeHome";
import HrHome from "../HR/HrHome/HrHome";
import { auth } from "firebase";
import { firestore } from "firebase";
import { message } from "antd";

const App: FC = () => {
  const [fireUser = null, setFireUser] = useState<firebase.User | null>();
  const [role = "", setRole] = useState();
  const [orgCode = "", setOrgCode] = useState();
  const [name = "", setName] = useState();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        console.log(firebaseUser);
        // setIsLogin(true);
        setFireUser(firebaseUser);
      } else {
        console.log("Not Logged In");
        // setIsLogin(false);
        setFireUser(firebaseUser);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!fireUser) {
      return;
    }
    const unsubscribe = firestore()
      .collection("users")
      .doc(fireUser.uid)
      .onSnapshot(doc => {
        const data = doc.data();
        if (doc.exists && !!data) {
          setName(data.name); // Force unwraapping is wrong practise  and makes sure the data is not null
          setRole(data.role);
          setOrgCode(data.orgCode);
          setRole(doc.data()!.role); //Example of force unwrapping
        } else {
          console.log("SignUp in Progress");
        }
      });

    return unsubscribe;
  }, [fireUser]);

  const logoutHandler = (): void => {
    if (!fireUser) {
      return;
    }
    auth().signOut();
    message.success("Logged Out Successfully");
    setRole("");
    setOrgCode("");
    setName("");
    navigate("http://localhost:3000/");
  };

  const homeSwitch = (): JSX.Element | null => {
    switch (role) {
      case "hr":
        return <HrHome fireuser={fireUser} orgCode={orgCode} path="home" />;
      case "employee":
        return (
          <EmployeeHome fireuser={fireUser} orgCode={orgCode} path="home" />
        );
      default:
        return null;
    }
  };

  return (
    <Fragment>
      <div className="App">
        <Navbar logout={logoutHandler} name={name} />
        <Router>
          <LoginPage fireuser={fireUser} orgCode={orgCode} path="/" />
          <SignUp fireuser={fireUser} path="signup" />
          {homeSwitch()}
          <ErrorPage path="error404"></ErrorPage>
        </Router>
      </div>
    </Fragment>
  );
};

export default App;
