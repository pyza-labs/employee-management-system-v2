import React from "react";
import { Icon, Button, Switch, Table, Tag, Popconfirm, message } from "antd";
import { firestore } from "firebase";
import { ColumnProps } from "antd/lib/table";
import { Question } from "../../containers/HR/HrHome/HrHome";

interface TableProps {
  loading: boolean;
  dataSource: Question[];
}
const QuestionTable = (props: TableProps) => {
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
              updateImportantHandler(checked, record.id);
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
            onConfirm={() => deleteQuestionHandler(record.id)}
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

  const updateImportantHandler = (checked: boolean, docId: string) => {
    firestore()
      .collection("onboardingQuestions")
      .doc(docId)
      .update({
        important: checked
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch(error => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  };

  const deleteQuestionHandler = (docId: string) => {
    firestore()
      .collection("onboardingQuestions")
      .doc(docId)
      .delete()
      .then(function() {
        console.log("Document successfully deleted!");
        message.success("Question deleted successfully");
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
  };
  return (
    <Table
      columns={columns}
      dataSource={props.dataSource}
      loading={props.loading}
      pagination={false}
    ></Table>
  );
};
export default QuestionTable;
