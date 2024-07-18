import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
  FetchWorkflowNodeActions,
  fetchWorkflowNodeTypeAll,
  WorkflowNodeAdd,
  WorkflowNodeDelete,
  WorkflowNodeUpdate
} from "@/services/workflow/api";
import {codeOk, getProSelectComponentValue, isEmpty} from "@/units";
import type { ProFormInstance, ActionType, ProColumns } from "@ant-design/pro-components";
import { DrawerForm, ProFormSelect, ProFormText, ProTable } from "@ant-design/pro-components";
import MemberProSelect from "@/components/MemberProSelect";
import {Button, message, Popconfirm} from "antd";

interface WorkflowNodeEditPropsI {
  id?: number;
}

const WorkflowNodeEdit: React.FC<WorkflowNodeEditPropsI> = ({id}) => {
  const formRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();

  const [workflowTypeId, setWorkflowTypeId] = useState<number>();
  const [currNodeId, setCurrNodeId] = useState<number>(0);
  const [drawerVisit, setDrawerVisit] = useState(false);

  useEffect(() => {
    setWorkflowTypeId(id);
  }, [id]);

  const setFormData = useCallback((entity: WorkflowAPI.WorkflowNode) => {
    formRef.current?.setFieldsValue(entity);
    // 单独设置指定审核人
    if (entity?.action !== '') {
      formRef.current?.setFieldValue('action', entity?.action_option,);
    }
    if (entity?.action_value && !isEmpty(entity.action_value)) {
      formRef.current?.setFieldValue('action_value', entity.action_value);
    } else {
      formRef.current?.setFieldValue('action_value', []);
    }
  }, [formRef]);

  /**
   * 表单提交方法
   */
  const handleFinish = useCallback(async (formData: any) => {
    if (!workflowTypeId) {
      message.success('当前步骤不属于任何工作流，请确认');
      return false;
    }

    formData.type_id = workflowTypeId;
    formData.node = parseInt(formData.node);
    // 解析select组件的值
    formData.action = getProSelectComponentValue(formData.action);
    // action_value 是空的话就传空字符串
    if (isEmpty(formData?.action_value)) {
      formData.action_value = '';
    } else {
      formData.action_value = getProSelectComponentValue(formData.action_value);
    }

    if (currNodeId > 0) {
      formData.id = currNodeId;
      const result = await WorkflowNodeUpdate(formData);
      if (codeOk(result.code)) {
        message.success(result.message);
      }

      return codeOk(result.code); // 返回true关闭弹窗
    } else {
      const result = await WorkflowNodeAdd(formData);
      if (codeOk(result.code)) {
        message.success(result.message);
      }

      return codeOk(result.code);
    }
  }, [workflowTypeId, currNodeId]);

  /**
   * 表单重置
   */
  const handleReset = useCallback(() => {
    setCurrNodeId(0);
  }, []);

  const submitterConfig = useMemo(() => ({
    searchConfig: {submitText: currNodeId > 0 ? '更新' : '新建', resetText: '重置'}
  }), [currNodeId]);

  const columns: ProColumns<WorkflowAPI.WorkflowNode>[] = [
    {
      title: '节点序号',
      dataIndex: 'node',
      hideInSearch: true,
    },
    {
      title: '节点名称',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      hideInSearch: true,
      render: (_, entity) => (
        <>
          {entity?.action_option?.label ?? '-'}
        </>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, entity) => [
        <a
          key="modify"
          onClick={() => {
            setCurrNodeId(entity?.id ?? 0);
            setDrawerVisit(true);
            setTimeout(() => setFormData(entity), 150);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          title="确定删除？"
          okText="Yes"
          cancelText="No"
          key="delete"
          onConfirm={() => {
            WorkflowNodeDelete({ id: entity?.id ?? 0, workflow_type_id: entity?.type_id ?? 0 }).then(
              (result) => {
                if (codeOk(result.code)) {
                  message.success('操作成功').then();
                  actionRef.current?.reload();
                  formRef.current?.resetFields();
                }
              },
            );
          }}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      <ProTable<WorkflowAPI.WorkflowNode, WorkflowAPI.NodePageParams>
        rowKey="id"
        defaultSize="small"
        headerTitle="节点列表"
        search={false}
        options={false}
        revalidateOnFocus={false}
        columns={columns}
        actionRef={actionRef}
        params={{ type_id: workflowTypeId }}
        request={async (params: any) => {
          if ((workflowTypeId ?? 0) <= 0) {
            return {
              success: false,
            };
          }
          const result = await fetchWorkflowNodeTypeAll(params.type_id);
          return {
            data: result?.data ?? [],
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: true,
          };
        }}
        toolBarRender={() => [
          <Button
            key="add"
            onClick={() => {
              setCurrNodeId(0);
              setDrawerVisit(true);
              setTimeout(() => formRef.current?.resetFields(), 150);
            }}
          >
            添加节点
          </Button>,
        ]}
      />
      <DrawerForm
        formRef={formRef}
        layout="horizontal"
        onFinish={handleFinish}
        onReset={handleReset}
        onOpenChange={(visible)=> {
          setDrawerVisit(visible);
          // 关闭弹窗时刷新表格
          if (!visible)
            actionRef.current?.reload();
        }}
        open={drawerVisit}
        submitter={submitterConfig}
      >
        <ProFormText width="md" name="name" label="节点名称" />
        <ProFormText
          width="md"
          name="node"
          label="节点序号"
          tooltip={'小的排在前面'}
          fieldProps={{
            type: 'number',
          }}
        />
        <ProFormSelect
          width="md"
          name="action"
          label="节点操作"
          request={async () => {
            const result = await FetchWorkflowNodeActions();
            return result?.data ?? [];
          }}
        />
        <ProFormSelect
          width="md"
          name="everyone"
          label="所有人审批"
          placeholder="当前节点是否需要当前所有审核人审批"
          options={[
            {
              label: '否',
              value: 0,
            },
            {
              label: '是',
              value: 1,
            },
          ]}
        />
        <MemberProSelect
          width="md"
          label="指定审核人"
          name="action_value"
          multiple
          showSearch
        />
      </DrawerForm>
    </>
  );
}

export default WorkflowNodeEdit;
