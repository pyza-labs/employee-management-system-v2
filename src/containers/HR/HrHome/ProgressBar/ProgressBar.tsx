import React, { useEffect, FC, Fragment } from "react";
import Styles from "./ProgressBar.module.css";
import { Progress, Row, Col, Popover } from "antd";
import { EmployeeProgress } from "../../../../repos";
import { connect } from "react-redux";
import { RootState } from "../../../../redux";
import { listenToEmployeeProgress } from "../../../../redux/actions";

interface ProgressProps {
  totalQuestions: number;
  orgCode: string;
  employeeData?: EmployeeProgress[];
  listenToEmployeeProgress: typeof listenToEmployeeProgress;
}

const ProgressBar: FC<ProgressProps> = props => {
  const {
    employeeData,
    totalQuestions,
    orgCode,
    listenToEmployeeProgress
  } = props;
  useEffect(() => {
    if (!props.orgCode) {
      return;
    }
    listenToEmployeeProgress(orgCode);
  }, [orgCode]);

  const trackProgress =
    employeeData &&
    employeeData.map(data => {
      let percent = (data.response.length / totalQuestions) * 100;
      console.log(data.response.length);
      let content = data.response.map((res, index) => {
        return (
          <div key={res.id} className={Styles.popover}>
            <div className={Styles.questionWrapper}>
              <h5>Question {index + 1}</h5>
              <h5>Answer</h5>
            </div>
            <div className={Styles.questionWrapper}>
              <h5>{res.question}</h5>
              <h5>{res.answer}</h5>
            </div>
          </div>
        );
      });

      console.log(content);
      return (
        <Popover
          content={content.length === 0 ? "No Questions answered" : content}
          title="Employee Feedback"
          trigger="click"
          key={data.userId}
        >
          <Row className={Styles.rowData} gutter={16}>
            <Col span={12}>
              <span className={Styles.name}>{data.name}</span>
              <Progress
                percent={percent}
                strokeWidth={12}
                className={Styles.progressBar}
              />
            </Col>
          </Row>
        </Popover>
      );
    });

  return <Fragment>{trackProgress}</Fragment>;
};
const mapStateToProps = (state: RootState) => {
  const { employeeProgress } = state.HR;
  const employeeData = employeeProgress;
  return { employeeData };
};
export default connect(mapStateToProps, {
  listenToEmployeeProgress
})(ProgressBar);
