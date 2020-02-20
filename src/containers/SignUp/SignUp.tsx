import React, { useState, FC, FormEvent, FocusEvent } from "react";
import Styles from "./SignUp.module.css";
import {
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  Upload,
  Icon,
  message
} from "antd";
import { auth, firestore, storage } from "firebase";
import { RouteComponentProps } from "@reach/router";
import { FormComponentProps } from "antd/lib/form";
import { UploadProps } from "antd/lib/upload";
import { RootState } from "../../redux";
import { connect } from "react-redux";
import { signUp } from "../../redux";
import { uploadProfilePicture } from "../../repos";

var {
  CountryDropdown,
  RegionDropdown
} = require("react-indian-state-region-selector");

const { Option } = Select;

export interface FormData {
  email: string;
  password: string;
  name: string;
  orgCode: string;
  role: string;
  bio: string;
  pan: string;
  address: string;
}

interface SignUpFormProps extends FormComponentProps<FormData> {
  loading: boolean;
  signUp: typeof signUp;
}

const SignUpForm: FC<SignUpFormProps> = props => {
  const [confirmDirty = false, setConfirmDirty] = useState();
  const [state = "", setState] = useState<string>();
  const [region = "", setRegion] = useState<string>();
  const [email = "", setEmail] = useState();
  const [disabled = true, setDisabled] = useState();

  const uploadAttributes: UploadProps = {
    name: "file",
    customRequest: options => {
      const { onProgress, onError, onSuccess, file } = options;
      uploadProfilePicture(file).subscribe(
        snapshot => {
          const percent =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress({ percent }, file);
          if (percent === 100) {
            onSuccess({ downloadUrl: snapshot.downloadURL }, file);
          }
        },
        error => {
          onError(error);
        }
      );
    },
    headers: {
      authorization: "authorization-text"
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
      }
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        message.error("Image must be smaller than 1MB!");
      }
      return isJpgOrPng && isLt1M;
    }
  };

  const selectState = (val: string) => {
    setState(val);
  };

  const selectRegion = (val: string) => {
    setRegion(val);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    // Doubt
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        props.signUp(values, state, region);
      } else {
        return alert("Please fill the fields marked with asterik");
      }
    });
  };

  const handleConfirmBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value);
  };

  const compareToFirstPassword = (
    rule: any,
    value: any,
    callback: (error?: string) => void
  ) => {
    const { form } = props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      setDisabled(false);
      callback();
    }
  };

  const validateToNextPassword = (rule: any, value: any, callback: any) => {
    const { form } = props;
    if (value && confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  const normalizeFileStructure = (e: any): any => {
    // Doubt
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const { getFieldDecorator } = props.form;

  const formItemLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 10 }
    },
    wrapperCol: {
      xs: { span: 2 },
      sm: { span: 6 }
    }
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 16,
        offset: 8
      }
    }
  };

  return (
    <div className={Styles.signup}>
      <Form {...formItemLayout} onSubmit={handleSubmit} className={Styles.form}>
        <Form.Item label="Name">
          {getFieldDecorator("name", {
            rules: [
              {
                required: true,
                message: "Please input your Name!"
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="E-mail">
          {getFieldDecorator("email", {
            rules: [
              {
                type: "email",
                message: "The input is not valid E-mail!"
              },
              {
                required: true,
                message: "Please input your E-mail!"
              }
            ]
          })(
            <Input
              onChange={event => {
                return setEmail(event.target.value);
              }}
            />
          )}
        </Form.Item>
        <Form.Item label="Password" hasFeedback>
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "Please input your password!"
              },
              {
                validator: validateToNextPassword
              }
            ]
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="Confirm Password" hasFeedback>
          {getFieldDecorator("confirm", {
            rules: [
              {
                required: true,
                message: "Please confirm your password!"
              },
              {
                validator: compareToFirstPassword
              }
            ]
          })(<Input.Password onBlur={handleConfirmBlur} />)}
        </Form.Item>
        <Form.Item label="Organisation Code">
          {getFieldDecorator("orgCode", {
            rules: [
              {
                required: true,
                message: "Please input your Organisation Code!"
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Role">
          {getFieldDecorator("role", {
            rules: [
              {
                required: true,
                message: "Select Role"
              }
            ]
          })(
            <Select placeholder="Please Select your Role">
              <Option value="hr">HR</Option>
              <Option value="accounts">Accounts</Option>
              <Option value="employee">Employee</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Upload Pic" extra="Max Size 1MB">
          {getFieldDecorator("upload", {
            valuePropName: "fileList",
            getValueFromEvent: normalizeFileStructure
          })(
            <Upload {...uploadAttributes}>
              <Button disabled={disabled}>
                <Icon type="upload" /> Click to Upload
              </Button>
            </Upload>
          )}
        </Form.Item>
        <Form.Item label="Bio">
          {getFieldDecorator("bio", {
            rules: [
              {
                required: false,
                message: "!!!"
              }
            ]
          })(<Input.TextArea />)}
        </Form.Item>
        <Form.Item label="Address">
          {getFieldDecorator("address", {
            rules: [
              {
                required: true,
                message: "Please input your Permanent Address"
              }
            ]
          })(<Input.TextArea />)}
        </Form.Item>
        <Form.Item label="Residence">
          {getFieldDecorator("residence", {
            rules: [
              {
                required: true,
                message: "Please input your Permanent Address"
              }
            ]
          })(
            <div>
              <CountryDropdown
                value={state}
                onChange={(val: string) => selectState(val)}
              />
              <RegionDropdown
                country={state}
                value={region}
                onChange={(val: string) => selectRegion(val)}
              />
            </div>
          )}
        </Form.Item>
        <Form.Item label="Pan Number">
          {getFieldDecorator("pan", {
            rules: [
              { required: true, message: "Please input your Pan number!" }
            ]
          })(<Input style={{ width: "100%" }} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          {getFieldDecorator("agreement", {
            valuePropName: "checked"
          })(
            <Checkbox>
              I have read the <a href="">agreement</a>
            </Checkbox>
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={props.loading}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

interface SignUpProps extends RouteComponentProps {
  loading: boolean;
  signUp: typeof signUp;
}

const mapStateToProps = (state: RootState) => {
  const { loading } = state.Auth;
  return { loading };
};

const SignUp: FC<SignUpProps> = props => {
  const ConnectedForm = Form.create<SignUpFormProps>()(SignUpForm);
  return <ConnectedForm loading={props.loading} signUp={props.signUp} />;
};

export default connect(mapStateToProps, { signUp })(SignUp);
