import React, {useEffect, useRef, useState} from "react";
import type { ProFormInstance} from "@ant-design/pro-form";
import {DrawerForm} from "@ant-design/pro-form";
import type {DrawerFormProps} from "@ant-design/pro-form/lib/layouts/DrawerForm";
import {Button} from "antd";
import {createTask} from "@/services/task/api";
import {codeOk, proSelectComponentAssembleValue, successMessage} from "@/units";
import TaskForm from "@/pages/Task/components/TaskForm";
import {fetchProjectDetail} from "@/services/project/api";


interface TaskCreateProps {
  ok?: () => void;
  projectId?: number;
}

const TaskCreate: React.FC<DrawerFormProps<TaskAPI.TaskForm> & TaskCreateProps> = ({ok, projectId,...other}) => {
  const [describeHtml, setDescribeHtml] = useState<string>('');
  const [visible, setVisible] = useState(false);

  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (projectId && visible) {
      fetchProjectDetail(projectId).then(({code, data}) => {
        if (codeOk(code)) {
          formRef.current?.setFieldValue("project", proSelectComponentAssembleValue(data, {value: "id", label: "name"}));
        }
      });
    }
  }, [projectId, visible]);

  const handleFinish = async (formData: TaskAPI.TaskForm) => {
    // 任务描述
    formData.describe = describeHtml;
    // 在props中指定了项目
    if (projectId) {
      formData.project = projectId;
    }
    const {code} = await createTask(formData);
    if (codeOk(code)) {
      successMessage();
      // 成功的回调
      if (ok) ok();
      return true;
    }
    return false;
  };

  return (
    <DrawerForm<TaskAPI.TaskForm>
      grid={true}
      colon={false}
      formRef={formRef}
      onFinish={handleFinish}
      onOpenChange={setVisible}
      isKeyPressSubmit={false}
      trigger={<Button type="primary">新建任务</Button>}
      {...other}
    >
      <TaskForm
        projectId={projectId}
        onEditorChange={setDescribeHtml}
      />
    </DrawerForm>
  );
}

export default TaskCreate;
