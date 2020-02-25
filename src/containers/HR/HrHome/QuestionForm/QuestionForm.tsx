import React, { useState, FC, ChangeEventHandler, FormEvent } from "react";
import Styles from "./QuestionForm.module.css";
import { Icon, Input, Button, Switch, Form, Radio } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { RadioChangeEvent } from "antd/lib/radio";
import { connect } from "react-redux";
import { RootState, setOnBoardingQuestions } from "../../../../redux";

export interface FormDataHRQuestions {
  question: string;
  important: string;
  type: string;
}

interface HRAddFormProps extends FormComponentProps<FormDataHRQuestions> {
  orgCode: string;
  loading?: boolean;
  setOnBoardingQuestions: typeof setOnBoardingQuestions;
}

const HRAddQuestionForm: FC<HRAddFormProps> = props => {
  const { orgCode, loading, setOnBoardingQuestions } = props;
  const [isShowingQuestionForm = false, setShowingQuestionForm] = useState();
  const [radio = "", setRadio] = useState();
  const [text = "", setText] = useState();
  const [options = [], setOptions] = useState<string[]>();

  const addQuestionHandler = () => {
    setShowingQuestionForm(true);
  };

  const cancelHandler = () => {
    setShowingQuestionForm(false);
  };

  const inputHandler: ChangeEventHandler<HTMLInputElement> = event => {
    props.form.setFieldsValue({
      question: event.target.value
    });
  };

  const inputOptionHandler: ChangeEventHandler<HTMLInputElement> = event => {
    setText(event.target.value);
  };

  const addOptionHandler = () => {
    if (text) {
      let optionArray = [...options];
      optionArray.push(text);
      setOptions(optionArray);
      setText("");
    }
  };

  const cancelOptionHandler = () => {
    setRadio("");
  };

  const radioHandler = (event: RadioChangeEvent) => {
    if (event.target.value === "mcq") {
      setRadio(event.target.value);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        if (values.type === "mcq") {
          setOnBoardingQuestions(values, orgCode, options);
        } else {
          setOnBoardingQuestions(values, orgCode);
        }
      }
    });
  };

  const { getFieldDecorator } = props.form;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  };

  const addButtonLayout = { wrapperCol: { span: 14, offset: 6 } };

  return isShowingQuestionForm ? (
    <div className={Styles.input}>
      <Form {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="Add Question">
          {getFieldDecorator("question", {
            rules: [{ required: true, message: "Please input your question!" }]
          })(<Input onChange={inputHandler} />)}
        </Form.Item>
        <Form.Item label="Type of Question">
          {getFieldDecorator("type", {
            rules: [{ required: true, message: "Please select an option" }],
            initialValue: "text"
          })(
            <Radio.Group name="radiogroup" onChange={radioHandler}>
              <Radio.Button className={Styles.radioButton} value="text">
                Normal Text
              </Radio.Button>
              <Radio.Button className={Styles.radioButton} value="file">
                Upload a File
              </Radio.Button>
              <Radio.Button className={Styles.radioButton} value="mcq">
                Multiple Choice
              </Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>
        {radio === "mcq" && (
          <Form.Item label="Add Option">
            {getFieldDecorator("optionText", {
              rules: [
                { required: true, message: "Please input your question!" }
              ]
            })(
              <div>
                <Input onChange={inputOptionHandler} value={text} />
                <div className={Styles.addOptionWrapper}>
                  <div>
                    <Button
                      className={Styles.button}
                      onClick={addOptionHandler}
                    >
                      Add Option
                    </Button>
                    <Button
                      className={Styles.button}
                      onClick={cancelOptionHandler}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Form.Item>
        )}
        {options.length !== 0 && (
          <Form.Item label="Options">
            {getFieldDecorator("options", {
              rules: [{ required: true, message: "Please select an option" }],
              initialValue: "text"
            })(
              <Radio.Group name="radiogroup">
                {options.map((option, index) => {
                  return (
                    <Radio value={option} key={index.toString()}>
                      {option}
                    </Radio>
                  );
                })}
              </Radio.Group>
            )}
          </Form.Item>
        )}
        <Form.Item label="Important">
          {getFieldDecorator("important", {
            valuePropName: "checked",
            initialValue: false
          })(
            <Switch
              className={Styles.button}
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
            />
          )}
        </Form.Item>
        <Form.Item {...addButtonLayout}>
          <div className={Styles.addOptionWrapper}>
            <div>
              <Button
                className={Styles.button}
                htmlType="submit"
                loading={loading}
              >
                Add
              </Button>
              <Button className={Styles.button} onClick={cancelHandler}>
                Cancel
              </Button>
            </div>
          </div>
        </Form.Item>
      </Form>
    </div>
  ) : (
    <div className={Styles.addQuestion} onClick={addQuestionHandler}>
      <Icon type="plus-circle" className={Styles.plus} />
      Add Questions
    </div>
  );
};

interface HRAddProps {
  orgCode: string;
  loading: boolean;
  setOnBoardingQuestions: typeof setOnBoardingQuestions;
}
const QuestionForm: FC<HRAddProps> = props => {
  let ConnectedComponent = Form.create<HRAddFormProps>()(HRAddQuestionForm);
  return (
    <ConnectedComponent
      orgCode={props.orgCode}
      loading={props.loading}
      setOnBoardingQuestions={props.setOnBoardingQuestions}
    />
  );
};

const mapStateToProps = (state: RootState) => {
  const { loading } = state.HR;
  return loading;
};

export default connect(mapStateToProps, { setOnBoardingQuestions })(
  QuestionForm
);
