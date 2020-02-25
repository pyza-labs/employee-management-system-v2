import React, { useEffect } from "react";
import { Icon, Button, Switch, Table, Tag, Popconfirm } from "antd";
import { ColumnProps } from "antd/lib/table";
import { Question } from "../../../../repos";
import { connect } from "react-redux";
import {
  RootState,
  deleteQuestion,
  updateImportantStatus,
  listenToHRQuestions
} from "../../../../redux";

interface TableProps {
  loading: boolean;
  orgCode?: string;
  questions?: Question[];
  deleteQuestion: typeof deleteQuestion;
  updateImportantStatus: typeof updateImportantStatus;
  listenToHRQuestions: typeof listenToHRQuestions;
}
const QuestionTable = (props: TableProps) => {
  const {
    loading,
    questions,
    orgCode,
    deleteQuestion,
    updateImportantStatus,
    listenToHRQuestions
  } = props;

  useEffect(() => {
    if (!orgCode) {
      console.error("Org code not found");
      return;
    }
    listenToHRQuestions(orgCode);
  }, [orgCode, listenToHRQuestions]);

  const columns: ColumnProps<Question>[] = [
    {
      title: "Questions",
      dataIndex: "question",

      key: "question"
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text, record, index) => {
        switch (record.type) {
          case "text":
            return <Tag color="#1446A0">{text.toUpperCase()}</Tag>;
          case "mcq":
            return <Tag color="#DB3069">{text.toUpperCase()}</Tag>;
          case "file":
            return <Tag color="#F5D547">{text.toUpperCase()}</Tag>;
          default:
            return <Tag color="#2374AB">{text.toUpperCase()} Default</Tag>;
        }
      }
    },
    {
      title: "Important",
      dataIndex: "important",
      key: "important",
      render: (text: string, record: Question, index: number) => {
        return (
          <Switch
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
            defaultChecked={record.important}
            onChange={checked => {
              updateImportantStatus(checked, record.id);
            }}
          />
        );
      }
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text: string, record: Question, index: number) => {
        return (
          <Popconfirm
            title="Are you sure delete this task?"
            onConfirm={() => deleteQuestion(record.id)}
            onCancel={() => console.log("Delete Cancelled")}
            okText="Yes"
            cancelText="No"
          >
            <Button>Delete</Button>
          </Popconfirm>
        );
      }
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={questions}
      loading={loading}
      pagination={false}
    ></Table>
  );
};

const mapStateToProps = (state: RootState) => {
  const { currentUser } = state.Auth;
  const { loading, questions } = state.HR;
  return {
    loading,
    questions,
    orgCode: currentUser ? currentUser.orgCode : undefined
  };
};

export default connect(mapStateToProps, {
  deleteQuestion,
  updateImportantStatus,
  listenToHRQuestions
})(QuestionTable);
