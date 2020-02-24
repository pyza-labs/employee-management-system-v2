import React, { useState, useEffect, Fragment, FC, ChangeEvent } from "react";
import Styles from "./EmployeeAnswerItem.module.css";
import { Input, message, Upload, Button, Icon, Radio, Tag } from "antd";
import { firestore, storage } from "firebase";
import debounce from "lodash.debounce";
import { UploadProps } from "antd/lib/upload";
import { Question, User } from "../../../../repos";
import { RadioChangeEvent } from "antd/lib/radio/interface";
import { connect } from "react-redux";

interface EmpAnswerProps {
  question: Question;
  currentUser?: User | null;
  saveStatus(status: boolean): void;
}

export interface empDocData {
  id: string;
  question: string;
  answer: string;
}
const EmployeeAnswerItem: FC<EmpAnswerProps> = props => {
  const { question, currentUser, saveStatus } = props;

  const [text = "", setText] = useState();
  const [radio = "", setRadio] = useState();

  useEffect(() => {
    if (!currentUser || !currentUser.id || !props.question.question) {
      return;
    }
    switch (props.question.type) {
      case "text":
        setText(props.answer);
        break;
      case "mcq":
        setRadio(props.answer);
        break;
      case "file":
        setText(props.answer);
        break;
      default:
    }
  }, []);

  const debounceEvent = (...args: [(event: any) => any, number]) => {
    // Doubt
    let debouncedEvent = debounce(...args);
    return (event: any) => {
      event.persist();
      return debouncedEvent(event);
    };
  };

  const firestoreData = (text: string): void => {
    if (!currentUser || !currentUser.id) {
      return;
    }
    firestore()
      .collection("users")
      .doc(currentUser.id)
      .collection("onboardingAnswers")
      .doc(props.question.id)
      .set(
        {
          question: props.question.question,
          answer: text
        },
        { merge: true }
      )
      .then(() => {
        console.log("Document successfully updated!");
        props.saveStatus(true);
      })
      .catch(error => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  };

  const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    props.saveStatus(false);
    setText(event.target.value);
    firestoreData(event.target.value);
  };

  const radioHandler = (event: RadioChangeEvent) => {
    setRadio(event.target.value);
    props.saveStatus(false);
    firestoreData(event.target.value);
  };

  const uploadAttributes: UploadProps = {
    name: "file",
    customRequest: async ({ onError, onSuccess, file }) => {
      const storageRef = storage().ref();
      const metadata = {
        contentType: "image/jpeg" || "application/pdf"
      };
      if (!currentUser) {
        return;
      }
      const uploadTask = storageRef.child(
        `users/${currentUser.id}/answer/${props.question.id}`
      );
      try {
        const image = await uploadTask.put(file, metadata);
        onSuccess({}, file);
        firestoreData("File Uploaded");
        props.saveStatus(true);
      } catch (error) {
        onError(error);
      }
    },
    headers: {
      authorization: "authorization-text"
    },
    onChange(info) {
      props.saveStatus(false);
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
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "application/pdf";
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

  const render = () => {
    switch (props.question.type) {
      case "text":
        return (
          <div className={Styles.inputDiv}>
            <Input
              key={text}
              onChange={debounceEvent(inputHandler, 700)}
              className={Styles.input}
              defaultValue={text}
            ></Input>
          </div>
        );
      case "mcq":
        return (
          <div className={Styles.mcqOption}>
            <Radio.Group
              name="radiogroup"
              key={radio}
              onChange={radioHandler}
              defaultValue={radio}
            >
              {props.question.options &&
                props.question.options.map((option, index) => {
                  return (
                    <Radio value={option} key={index.toString()}>
                      {option}
                    </Radio>
                  );
                })}
              ;
            </Radio.Group>
          </div>
        );
      case "file":
        return (
          <Fragment>
            <Upload {...uploadAttributes}>
              <Button>
                <Icon type="upload" /> Click to Upload
              </Button>
            </Upload>
            {text && (
              <Tag style={{ margin: "4px" }} color="green">
                File uploaded successfully
              </Tag>
            )}
          </Fragment>
        );
      default:
        return null;
    }
  };

  return render();
};

const mapStateToProps = () => {};

export default connect(mapStateToProps, {})(EmployeeAnswerItem);
