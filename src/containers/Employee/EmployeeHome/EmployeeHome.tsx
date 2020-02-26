import React, { useState, useEffect, FC } from "react";
import Styles from "./EmployeeHome.module.css";
import { Layout, Menu, Icon, List, Skeleton } from "antd";
import EmployeeAnswers from "./EmployeeAnswerItem";
import { connect } from "react-redux";
import { Question } from "../../../repos";
import {
  RootState,
  listenToEmployeeQuestions,
  setCurrentUser
} from "../../../redux";
import { RouteComponentProps } from "@reach/router";

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

interface EmployeeProps extends RouteComponentProps {
  orgCode?: string;
  listenToEmployeeQuestions: typeof listenToEmployeeQuestions;
  loading: boolean;
  questions?: Question[];
  status?: boolean;
}

const EmployeeHome: FC<EmployeeProps> = props => {
  const {
    orgCode,
    loading,
    listenToEmployeeQuestions,
    questions,
    status
  } = props;

  const [
    selectedOption = "Onboarding Questions",
    setSelectedOption
  ] = useState();

  useEffect(() => {
    if (!orgCode) {
      return;
    }
    listenToEmployeeQuestions(orgCode);
  }, [orgCode]);

  return (
    <div className={Styles.employeeHome}>
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
                <Menu.Item key="1">Questions</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <h1 style={{ margin: "16px 0" }}>{selectedOption}</h1>
            <Content className={Styles.content}>
              <div className={Styles.savedWrapper}>{status ? "Saved" : ""}</div>
              {console.log(questions)}
              {questions && questions.length !== 0 && (
                <List
                  itemLayout="horizontal"
                  dataSource={questions}
                  renderItem={item => {
                    return (
                      <List.Item key={item.id}>
                        <Skeleton loading={loading} active avatar>
                          <List.Item.Meta
                            title={
                              <div>
                                <span>{item.question}</span>
                                {item.important && (
                                  <span className={Styles.important}>*</span>
                                )}
                              </div>
                            }
                            description={<EmployeeAnswers question={item} />}
                          />
                        </Skeleton>
                      </List.Item>
                    );
                  }}
                />
              )}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { currentUser } = state.Auth;
  const orgCode = currentUser ? currentUser.orgCode : undefined;
  const { questions, loading, status } = state.Employee;
  return { orgCode, questions, loading, status };
};

export default connect(mapStateToProps, { listenToEmployeeQuestions })(
  EmployeeHome
);
