import React, { useState, useEffect, FC } from "react";
import Styles from "./HRHome.module.css";
import { Layout, Menu, Icon } from "antd";
import ProgressBar from "./ProgressBar/ProgressBar";
import QuestionTable from "./QuestionsTable/QuestionTable";
import QuestionForm from "./QuestionForm/QuestionForm";
import { connect } from "react-redux";
import { RootState, listenToHRQuestions } from "../../../redux";
import { Question } from "../../../repos";
import { RouteComponentProps } from "@reach/router";

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

interface HRProps extends RouteComponentProps {
  orgCode: string;
  questions?: Question[];
  loading: boolean;
  listenToHRQuestions: typeof listenToHRQuestions;
}

const HRHome: FC<HRProps> = props => {
  const { orgCode, questions, listenToHRQuestions, loading } = props;
  const [onQuestions = false, setOnQuestions] = useState();
  const [progress = false, setProgress] = useState();

  const [selectedOption = "Questions", setSelectedOption] = useState();

  useEffect(() => {
    if (!orgCode) {
      return;
    }
    listenToHRQuestions(orgCode);
  }, [orgCode, listenToHRQuestions]);

  const showQuestionsHandler = (): void => {
    setOnQuestions(true);
    setProgress(false);
    setSelectedOption("Questions");
  };

  const showProgressHandler = (): void => {
    setProgress(true);
    setOnQuestions(false);
    setSelectedOption("Progress");
  };

  return (
    <div className={Styles.hrHome}>
      <Layout>
        <Layout>
          <Sider
            width={200}
            style={{ background: "#fff" }}
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={broken => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              style={{ height: "100%", borderRight: 0 }}
            >
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="user" />
                    Onboarding
                  </span>
                }
              >
                <Menu.Item key="1" onClick={showQuestionsHandler}>
                  Questions
                </Menu.Item>
                <Menu.Item key="2" onClick={showProgressHandler}>
                  Track Progress
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <h1 className={Styles.selectedOption}>{selectedOption}</h1>
            {onQuestions && (
              <Content className={Styles.content}>
                <QuestionForm loading={loading} orgCode={orgCode!} />
                {questions!.length !== 0 && (
                  <QuestionTable //remove hr
                    dataSource={questions!}
                    loading={loading!}
                  />
                )}
              </Content>
            )}
            {progress && (
              <ProgressBar
                totalQuestions={questions!.length}
                orgCode={orgCode!}
              />
            )}
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { currentUser } = state.Auth;
  const { questions, loading } = state.HR;
  const orgCode = currentUser!.orgCode;
  return { orgCode, questions, loading };
};

export default connect(mapStateToProps, { listenToHRQuestions })(HRHome);

// useEffect(() => {
//   if (!orgCode) {
//     return;
//   }
//   let unsubscribe =listenToHRQuestions(orgCode);
//   return unsubscribe;
// }, [orgCode,listenToHRQuestions]);
