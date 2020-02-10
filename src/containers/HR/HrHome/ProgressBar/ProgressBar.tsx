import React, { useEffect, useState, FC, Fragment } from "react";
import Styles from "./ProgressBar.module.css";
import { Progress, Row, Col, Popover } from "antd";
import { firestore } from "firebase";
import { empDocData } from "../../../Employee/EmployeeHome/EmployeeAnswerItem/EmployeeAnswerItem";

interface empProgData {
  userId: string;
  name: string;
  response: empDocData[];
}

interface ProgressProps {
  totalQuestions: number;
  orgCode: string;
}

const ProgressBar: FC<ProgressProps> = props => {
  const [employeeData = [], setEmployeeData] = useState<empProgData[]>();

  useEffect(() => {
    if (!props.orgCode) {
      return;
    }
    let unsubscribe = firestore()
      .collection("users")
      .where("orgCode", "==", props.orgCode)
      .where("role", "==", "employee")
      .onSnapshot(async querySnapshot => {
        const employeeProgress = await Promise.all(
          querySnapshot.docs.map(mainDoc => {
            const { name } = mainDoc.data();
            return firestore()
              .collection("users")
              .doc(mainDoc.id)
              .collection("onboardingAnswers")
              .get()
              .then(querySnapshot => {
                const response = querySnapshot.docs.map(doc => {
                  // mainDoc.data() is never undefined for query mainDoc snapshots
                  return {
                    question: doc.data().question,
                    id: doc.id,
                    answer: doc.data().answer
                  };
                });
                return { userId: mainDoc.id, name: name, response: response };
              });
          })
        );
        console.log(employeeProgress);
        setEmployeeData(employeeProgress);
      });
    return unsubscribe;
  }, [props.orgCode]);

  const trackProgress = employeeData.map(data => {
    let percent = (data.response.length / props.totalQuestions) * 100;
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
export default ProgressBar;
