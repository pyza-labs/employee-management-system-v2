import React, { useState, useEffect, FC } from "react";
import Styles from "./HrHome.module.css";
import { Layout, Menu, Icon } from "antd";
import ProgressBar from "./ProgressBar/ProgressBar";
import QuestionTable from "./QuestionsTable/QuestionTable";
import QuestionForm from "./QuestionForm/QuestionForm";
import { connect } from "react-redux";
import { RootState, listenToHrQuestionsState } from "../../../redux";
import { Question } from "../../../repos";

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

interface HrProps {
  orgCode: string;
  questions?: Question[] | null; // Why This Error onRemoval of ?
  loading: boolean;
  listenToHrQuestionsState: typeof listenToHrQuestionsState;
}

const HrHome: FC<HrProps> = props => {
  const { orgCode, questions, listenToHrQuestionsState, loading } = props;
  const [onQuestions = false, setOnQuestions] = useState();
  const [progress = false, setProgress] = useState();

  const [selectedOption = "Questions", setSelectedOption] = useState();

  useEffect(() => {
    if (!orgCode) {
      return;
    }
    listenToHrQuestionsState(orgCode);
  }, [orgCode, listenToHrQuestionsState]);

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
                <QuestionForm orgCode={orgCode!} />
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
  const { questions, loading } = state.Hr;
  const orgCode = currentUser!.orgCode;
  return { orgCode, questions, loading };
};

export default connect(mapStateToProps, { listenToHrQuestionsState })(HrHome);

// useEffect(() => {
//   if (!orgCode) {
//     return;
//   }
//   let unsubscribe = listenToHrQuestionsState(orgCode);
//   return unsubscribe;
// }, [orgCode, listenToHrQuestionsState]);
