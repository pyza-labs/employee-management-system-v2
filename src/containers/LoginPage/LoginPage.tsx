import React, {
  useState,
  useEffect,
  FC,
  ChangeEventHandler,
  ChangeEvent
} from "react";
import Styles from "./LoginPage.module.css";
import { Input, Button, message } from "antd";
import { auth } from "firebase";
import { navigate, Link, RouteComponentProps } from "@reach/router";

export interface AppProps extends RouteComponentProps {
  orgCode: string;
  fireuser: firebase.User | null;
}

const LoginPage: FC<AppProps> = props => {
  const [email = "", setEmail] = useState<string>();
  const [pass = "", setPass] = useState<string>();
  const [code = "", setCode] = useState<string>();
  const [loading = false, setLoading] = useState<boolean>();

  const emailHandler: ChangeEventHandler<HTMLInputElement> = (event): void => {
    setEmail(event.target.value.trim());
  };

  const passHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setPass(event.target.value);
  };

  const codeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setCode(event.target.value);
  };

  useEffect(() => {
    if (!props.orgCode) {
      return;
    }
    console.log(props.orgCode, code);
    if (props.orgCode === code) {
      navigate("home");
    } else {
      message.error("Wrong Organisational Code");
      auth().signOut();
      navigate("erromess404");
    }
  }, [props.orgCode]);

  const loginHandler = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    setLoading(true);
    await auth()
      .signInWithEmailAndPassword(email, pass)
      .catch(error => alert(error.message));
  };

  const forgotPassHandler = (): void => {
    if (!email) {
      alert("No Email Entered");
      return;
    }
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        alert("Email Sent");
      })
      .catch(error => {
        // An error happened.
      });
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
          onClick={loginHandler}
          disabled={!email || !pass || !code}
        >
          SignIn
        </Button>
        <Button className={Styles.button}>
          <Link to="signup">SignUp</Link>
        </Button>
        <a className={Styles.forgot} onClick={forgotPassHandler} href="">
          Forgot Password
        </a>
      </div>
    </div>
  );
};
export default LoginPage;
