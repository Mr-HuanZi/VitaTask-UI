import React, {useEffect, useRef, useState} from "react";
import type {ProFormInstance} from "@ant-design/pro-components";
import {ProForm} from "@ant-design/pro-components";
import {fetchTask, updateTask} from "@/services/task/api";
import {
  codeOk,
  getProSelectComponentValue,
  proSelectComponentAssembleValue,
  successMessage,
  timestampToString
} from "@/units";
import TaskForm from "@/pages/Task/components/TaskForm";
import type {DrawerProps} from "antd";
import {Button, Drawer, Space} from "antd";

interface TaskEditProps {
  ok?: () => void;
  taskId?: number;
}

const TaskEdit: React.FC<DrawerProps & TaskEditProps> = ({ok, taskId, open, onClose, ...other}) => {
  const [describeHtml, setDescribeHtml] = useState<string>('');
  const [projectId, setProjectId] = useState(0);
  const [taskData, setTaskData] = useState<TaskAPI.Task>();

  const formRef = useRef<ProFormInstance>();

  const fetchTaskData = (id: number) => {
    fetchTask({id: id}).then(r => {
      const {code, data} = r;
      if (codeOk(code)) {
        setTaskData(data);
        setDescribeHtml(data?.describe ?? '');
        setProjectId(data?.project?.id ?? 0);
        formRef.current?.setFieldsValue({
          ...data,
          leader: proSelectComponentAssembleValue(data?.leader?.user_info,{value: "id", label: "userNickname"}),
          collaborator: proSelectComponentAssembleValue(data?.collaborator?.map((item: TaskAPI.TaskMember) => item?.user_info),{value: "id", label: "userNickname"}),
          plan_time: data?.plan_time ? timestampToString(data.plan_time, 'YYYY-MM-DD') : undefined,
          project: proSelectComponentAssembleValue(data?.project, {value: "id", label: "name"}),
          group: proSelectComponentAssembleValue(data?.group, {value: "id", label: "name"}),
        });
      }
    });
  }

  useEffect(() => {
    if (taskId && open) {
      fetchTaskData(taskId);
    }
  }, [taskId, open]);

  const handleFinish = async (formData: TaskAPI.TaskForm) => {
    // 任务描述
    formData.describe = describeHtml;
    formData.id = taskId;
    formData.leader = getProSelectComponentValue(formData.leader);
    formData.collaborator = getProSelectComponentValue(formData.collaborator);
    formData.project = getProSelectComponentValue(formData.project);
    formData.group = getProSelectComponentValue(formData.group);
    const {code} = await updateTask(formData);
    if (codeOk(code)) {
      successMessage();
      // 成功的回调
      if (ok) ok();
    }
  };

  return (
    <Drawer
      width="850px"
      open={open}
      title={taskData?.title}
      destroyOnClose={true}
      onClose={onClose}
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button onClick={() => formRef.current?.submit()} type="primary">
            提交
          </Button>
        </Space>
      }
      {...other}
    >
      <ProForm<TaskAPI.TaskForm>
        grid={true}
        formRef={formRef}
        isKeyPressSubmit={false}
        onFinish={handleFinish}
        submitter={false}
      >
        <TaskForm
          projectId={projectId}
          onEditorChange={setDescribeHtml}
          editorHtml={describeHtml}
        />
      </ProForm>
    </Drawer>
  );
}

export default TaskEdit;
