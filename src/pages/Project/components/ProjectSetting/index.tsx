import {FC, useCallback, useEffect, useState} from "react";
import {Button, Card, Form, Select} from "antd";
import type { FormProps } from 'antd';
import {WorkflowTypeOptions} from "@/services/workflow/api";
import {codeOk, errorMessage, successMessage} from "@/units";
import {fetchProjectSetting, projectSettingUpdate} from "@/services/project/api";

interface ProjectSettingProps {
  projectId: number;
}

type FieldType = {
  defaultWorkflowType?: number;
};

const ProjectSetting: FC<ProjectSettingProps> = ({projectId}) => {
  const [form] = Form.useForm();

  const [workflowList, setWorkflowList] = useState([]);

  const onFinish: FormProps<FieldType>['onFinish'] = useCallback((values) => {
    if (!projectId || projectId <= 0) {
      errorMessage("项目ID错误");
      return;
    }

    let formData: ProjectAPI.ProjectSetting = {
      id: projectId,
      default_workflow_type: values.defaultWorkflowType ?? 0,
    };

    projectSettingUpdate(formData).then(r => {
      if (codeOk(r.code)) {
        successMessage()
      }
    });
  }, [projectId]);


  useEffect(() => {
    WorkflowTypeOptions({system: 1}).then(r => {
      const {code, data} = r;
      if (codeOk(code)) {
        setWorkflowList(data);
      }
    });
  }, []);

  useEffect(() => {
    if (!projectId || projectId <= 0)
      return;

    fetchProjectSetting(projectId).then(r => {
      const {code, data} = r;
      if (codeOk(code)) {
        form.setFieldsValue({
          defaultWorkflowType: data?.default_workflow_type <= 0 ? undefined : data?.default_workflow_type
        });
      }
    });

  }, [projectId]);

  return (
    <Card>
      <Form
        form={form}
        name="project-setting"
        wrapperCol={{ span: 8 }}
        initialValues={{default_workflow_type: undefined}}
        onFinish={onFinish}
      >
        <Form.Item<FieldType>
          label="默认工作流"
          name="defaultWorkflowType"
        >
          <Select options={workflowList} />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default ProjectSetting;
