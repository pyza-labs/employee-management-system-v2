import React, { useState, useEffect, FC } from "react";
import Styles from "./EmployeeHome.module.css";
import { Layout, Menu, Icon, List, Skeleton, Tag } from "antd";
import EmployeeAnswers from "./EmployeeAnswerItem/EmployeeAnswerItem";
import { firestore } from "firebase";
// import { AppProps } from "../../LoginPage/LoginPage";
import { Question } from "../../HR/HrHome/HrHome";

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

const EmployeeHome: FC<AppProps> = props => {
  const [questions = [], setQuestions] = useState<Question[]>();
  const [
    selectedOption = "Onboarding Questions",
    setSelectedOption
  ] = useState();
  const [loading = true, setLoading] = useState();
  const [saveStatus = false, setSaveStatus] = useState();

  useEffect(() => {
    if (!props.orgCode) {
      setLoading(true);
      return;
    }
    firestore()
      .collection("onboardingQuestions")
      .where("orgCode", "==", props.orgCode)
      .get()
      .then(querySnapshot => {
        const questions = querySnapshot.docs.map(doc => {
          // doc.data() is never undefined for query doc snapshot
          return { ...doc.data(), id: doc.id } as Question;
        });
        setQuestions(questions); //
        setLoading(false);
      });
  }, [props.orgCode]);

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
              <div className={Styles.savedWrapper}>
                {saveStatus ? "Saved" : ""}
              </div>
              {questions.length !== 0 && (
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
                            description={
                              <EmployeeAnswers
                                question={item}
                                fireuser={props.fireuser!}
                                saveStatus={(status: boolean): void =>
                                  setSaveStatus(status)
                                }
                              />
                            }
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
export default EmployeeHome;
