import React, { useState, useEffect, Fragment, FC, ChangeEvent } from "react";
import Styles from "./EmployeeAnswerItem.module.css";
import { Input, message, Upload, Button, Icon, Radio, Tag } from "antd";
import debounce from "lodash.debounce";
import { UploadProps } from "antd/lib/upload";
import { Question } from "../../../../repos";
import { RadioChangeEvent } from "antd/lib/radio/interface";
import { connect } from "react-redux";
import { RootState } from "../../../../redux";
import {
  listenToEmployeeAnswers,
  updateEmployeeAnswer,
  uploadDocuments,
  saveStatus
} from "../../../../redux/actions";
import { Answer } from "../../../../repos";

interface EmpAnswerProps {
  question: Question;
  saveStatus: typeof saveStatus;
  userId?: string;
  employeeQA?: Answer;
  listenToEmployeeAnswers: typeof listenToEmployeeAnswers;
  updateEmployeeAnswer: typeof updateEmployeeAnswer;
  uploadDocuments: typeof uploadDocuments;
}

const EmployeeAnswerItem: FC<EmpAnswerProps> = props => {
  const {
    question,
    userId,
    saveStatus,
    employeeQA,
    listenToEmployeeAnswers,
    updateEmployeeAnswer,
    uploadDocuments
  } = props;

  const [text = "", setText] = useState();
  const [radio = "", setRadio] = useState();

  useEffect(() => {
    if (!userId || !props.question.question) {
      return;
    }
    listenToEmployeeAnswers(userId, question.id);
    if (!employeeQA) {
      return;
    }
    console.log(employeeQA.answer);
    switch (question.type) {
      case "text":
        setText(employeeQA.answer);
        break;
      case "mcq":
        setRadio(employeeQA.answer);
        break;
      case "file":
        setText(employeeQA.answer);
        break;
      default:
    }
  }, [question]);

  const debounceEvent = (...args: [(event: any) => any, number]) => {
    // Doubt
    let debouncedEvent = debounce(...args);
    return (event: any) => {
      event.persist();
      return debouncedEvent(event);
    };
  };

  const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    saveStatus(false);
    setText(event.target.value);
    if (!userId) {
      return;
    }
    updateEmployeeAnswer(
      event.target.value,
      userId,
      question.id,
      question.question
    );
  };

  const radioHandler = (event: RadioChangeEvent) => {
    setRadio(event.target.value);
    saveStatus(false);
    if (!userId) {
      return;
    }
    updateEmployeeAnswer(
      event.target.value,
      userId,
      question.id,
      question.question
    );
  };

  const uploadAttributes: UploadProps = {
    name: "file",
    customRequest: async ({ onError, onSuccess, file }) => {
      if (!userId) {
        return;
      }
      uploadDocuments(file, userId, question.id);
      updateEmployeeAnswer(
        "File Uploaded",
        userId,
        question.id,
        question.question
      );
    },
    headers: {
      authorization: "authorization-text"
    },
    onChange(info) {
      props.saveStatus(false);
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
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
    switch (question.type) {
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
              {question.options &&
                question.options.map((option, index) => {
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

const mapStateToProps = (state: RootState) => {
  const { currentUser } = state.Auth;
  if (!currentUser) {
    return;
  }
  const userId = currentUser.id;
  const { employeeQA } = state.Employee;
  return { userId, employeeQA };
};

export default connect(mapStateToProps, {
  listenToEmployeeAnswers,
  updateEmployeeAnswer,
  uploadDocuments,
  saveStatus
})(EmployeeAnswerItem);
