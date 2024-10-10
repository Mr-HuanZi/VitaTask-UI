import React, {useCallback, useEffect, useRef, useState} from "react";
import {WorkflowTypeAdd, WorkflowTypeDetail, WorkflowTypeUpdate} from "@/services/workflow/api";
import {codeOk} from "@/units";
import type { ProFormInstance} from "@ant-design/pro-components";
import { ProForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import {message} from "antd";

interface WorkflowBasePropsI {
  id?: number;
  saveSuccess?: (entity: WorkflowAPI.WorkflowType) => void;
}

const WorkflowBase: React.FC<WorkflowBasePropsI> = ({id, saveSuccess}) => {
  const formRef = useRef<ProFormInstance>();

  const [messageApi, contextHolder] = message.useMessage();

  const [, setWorkflowType] = useState<WorkflowAPI.WorkflowType|undefined>(undefined);
  const [workflowTypeId, setWorkflowTypeId] = useState<number>(0);

  useEffect(() => {
    if (id) {
      // 先获取工作流详情
      WorkflowTypeDetail(id).then((result) => {
        if (codeOk(result.code)) {
          const entity = result.data;
          setWorkflowType(entity);
          setWorkflowTypeId(entity?.id ?? 0);
          if (entity) {
            formRef.current?.setFieldsValue({
              "name": entity.name,
              "illustrate": entity.illustrate,
              "only_name": entity.only_name,
            });
          }
        }
      });
    }
  }, [id]);

  /**
   * 表单提交方法
   */
  const handleFinish = useCallback(async (formData: any) => {
    let result;
    if (workflowTypeId) {
      formData.id = workflowTypeId;
      result = await WorkflowTypeUpdate(formData);
    } else {
      result = await WorkflowTypeAdd(formData);
    }

    if (codeOk(result.code)) {
      messageApi.success(result.message);
      if(saveSuccess && result.data)
        saveSuccess(result.data);
    }

    return codeOk(result.code); // 返回true关闭弹窗
  }, [saveSuccess, workflowTypeId]);

  return (
    <>
      {contextHolder}
      <ProForm
        formRef={formRef}
        layout="vertical"
        onFinish={handleFinish}
      >
        <ProFormText
          name="name"
          label="工作流类型名称"
          rules={[{ required: true, message: '请填写工作流类型名称' }]}
        />
        <ProFormText
          name="only_name"
          label="工作流唯一标识"
          disabled={workflowTypeId > 0}
          rules={[
            { required: workflowTypeId <= 0, message: '请填写工作流类型名称' },
            () => ({
              // 自定义校验规则，只有workflowTypeId <= 0时才校验
              validator(_, value) {
                if (workflowTypeId > 0) {
                  return Promise.resolve();
                }
                // 只能包含字母、数字与下划线
                if (/^[a-zA-Z0-9_]+$/.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('格式不正确，只能包含字母、数字与下划线'));
              },
            }),
          ]}
          tooltip={'只能包含字母、数字，并且一旦提交后就不能修改'}
        />
        <ProFormTextArea name="illustrate" label="工作流说明" />
      </ProForm>
    </>
  );
}

export default WorkflowBase;
