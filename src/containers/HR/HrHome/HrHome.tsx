import React, { useState, FC } from "react";
import Styles from "./HRHome.module.css";
import { Layout, Menu, Icon } from "antd";
import ProgressBar from "./ProgressBar";
import QuestionTable from "./QuestionsTable";
import QuestionForm from "./QuestionForm";
import { connect } from "react-redux";
import { RootState, listenToHRQuestions } from "../../../redux";
import { Question } from "../../../repos";
import { RouteComponentProps } from "@reach/router";

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

interface HRProps extends RouteComponentProps {
  orgCode?: string;
  questions?: Question[];
  listenToHRQuestions: typeof listenToHRQuestions;
}

const HRHome: FC<HRProps> = props => {
  const { orgCode, questions = [] } = props;
  const [onQuestions = true, setOnQuestions] = useState();
  const [progress = false, setProgress] = useState();

  const [selectedOption = "Questions", setSelectedOption] = useState();

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
                <QuestionTable />
              </Content>
            )}
            {progress && orgCode && (
              <ProgressBar
                totalQuestions={questions.length}
                orgCode={orgCode}
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
  const { questions } = state.HR;
  const orgCode = currentUser ? currentUser.orgCode : undefined;
  return { orgCode, questions };
};

export default connect(mapStateToProps, { listenToHRQuestions })(HRHome);
