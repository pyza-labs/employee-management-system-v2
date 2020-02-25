import React from "react";
import { Icon, Button, Switch, Table, Tag, Popconfirm } from "antd";
import { ColumnProps } from "antd/lib/table";
import { Question } from "../../../../repos";
import { connect } from "react-redux";
import {
  RootState,
  deleteQuestion,
  updateImportantStatus
} from "../../../../redux";

interface TableProps {
  loading: boolean;
  dataSource: Question[];
  deleteQuestion: typeof deleteQuestion;
  updateImportantStatus: typeof updateImportantStatus;
}
const QuestionTable = (props: TableProps) => {
  const { loading, dataSource, deleteQuestion, updateImportantStatus } = props;

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
      dataSource={dataSource}
      loading={loading}
      pagination={false}
    ></Table>
  );
};

const mapStateToProps = (state: RootState) => {
  const { loading } = state.HR;
  return loading;
};

export default connect(mapStateToProps, {
  deleteQuestion,
  updateImportantStatus
})(QuestionTable);
