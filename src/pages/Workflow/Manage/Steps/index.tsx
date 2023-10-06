import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Button, message, Popconfirm } from 'antd';
import { useParams } from 'umi';
import {
  FetchWorkflowNodeActions,
  WorkflowNodeAdd,
  WorkflowNodeDelete,
  WorkflowNodeLists,
  WorkflowNodeUpdate,
  WorkflowTypeDetail,
} from '@/services/workflow/api';
import MemberProSelect from '@/components/MemberProSelect';
import { isEmpty } from '@/units';

const Messages: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const workflowStepFormRef = useRef<ProFormInstance<WorkflowAPI.WorkflowNode>>();

  const [workflowStepFormVisible, setWorkflowStepFormVisible] = useState(false);
  const [workflowStepId, setWorkflowStepId] = useState<number>(0);
  const [workflowType, setWorkflowType] = useState<WorkflowAPI.WorkflowType>();
  const [actionValues, setActionValues] = useState<MemberAPI.Member[]>();

  // 获取路由参数
  const routeParams: any = useParams();

  useEffect(() => {
    const { name } = routeParams;
    // 先获取工作流详情
    WorkflowTypeDetail(name).then((result) => {
      if (result.code === 1) {
        setWorkflowType(result.data);
      }
    });
  }, [routeParams]);

  const columns: ProColumns<WorkflowAPI.WorkflowNode>[] = [
    {
      title: '步骤序号',
      dataIndex: 'step',
      hideInSearch: true,
    },
    {
      title: '步骤名称',
      dataIndex: 'name',
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      hideInSearch: true,
    },
    {
      title: '是否需要所有人审批',
      dataIndex: 'everyone',
      hideInSearch: true,
      valueEnum: {
        1: '是',
        0: '否',
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, entity) => [
        <a
          key="modify"
          onClick={async () => {
            setWorkflowStepFormVisible(true);
            setWorkflowStepId(entity.id);
            if (isEmpty(entity.action_value)) entity.action_value = undefined;
            // 延时，等待Modal加载完毕
            setTimeout(() => workflowStepFormRef.current?.setFieldsValue(entity), 300);
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
            WorkflowNodeDelete({ id: entity.id, workflow_type_id: workflowType?.id ?? 0 }).then(
              (result) => {
                if (result.code === 1) {
                  message.success('操作成功').then();
                  actionRef.current?.reload();
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
    <PageContainer title={`工作流[${workflowType?.name ?? ''}]步骤管理`}>
      <ProTable<WorkflowAPI.WorkflowNode, WorkflowAPI.NodePageParams>
        rowKey="id"
        revalidateOnFocus={false}
        columns={columns}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button
            key="add"
            onClick={() => {
              setWorkflowStepId(0);
              setWorkflowStepFormVisible(true);
            }}
          >
            添加步骤
          </Button>,
        ]}
        params={{ type_id: workflowType?.id }}
        request={async (params: any) => {
          // 官方教程 https://procomponents.ant.design/components/table#request
          // tips： 如果按照官方的教程来，我也不知道 params 里应该定义什么，索性直接这样就行
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          if ((workflowType?.id ?? 0) <= 0) {
            return {
              success: false,
            };
          }
          const result = await WorkflowNodeLists({
            ...params,
          });
          return {
            data: result?.data?.items ?? [],
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: true,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: 0,
          };
        }}
      />
      <ModalForm
        title={(workflowStepId > 0 ? '编辑' : '新增') + '步骤'}
        open={workflowStepFormVisible}
        formRef={workflowStepFormRef}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={async (formData: any) => {
          if (!workflowType?.id) {
            message.success('当前步骤不属于任何工作流，请确认');
            return false;
          }

          formData.workflow_type_id = workflowType.id;
          // 指定步骤审核人
          if (actionValues?.length && actionValues.length > 0) {
            formData.action_value = actionValues.map((item) => item.id);
          }
          if (workflowStepId > 0) {
            formData.id = workflowStepId;
            const result = await WorkflowNodeUpdate(formData);
            if (result.code === 1) {
              message.success(result.message);
              actionRef.current?.reload();
            }

            return result.code === 1; // 返回true关闭弹窗
          } else {
            const result = await WorkflowNodeAdd(formData);
            if (result.code === 1) {
              message.success(result.message);
              actionRef.current?.reload();
            }

            return result.code === 1; // 返回true关闭弹窗
          }
        }}
        onOpenChange={(visible: boolean) => {
          if (!visible) {
            setWorkflowStepFormVisible(visible);
            setActionValues([]);
          }
        }}
      >
        <ProForm.Group>
          <ProFormText width="md" name="name" label="步骤名称" />
          <ProFormText
            width="md"
            name="step"
            label="步骤序号"
            fieldProps={{
              type: 'number',
            }}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            width="md"
            name="action"
            label="步骤操作"
            request={() => {
              return FetchWorkflowNodeActions().then((result) => {
                return result?.data ?? [];
              });
            }}
            fieldProps={{
              fieldNames: {
                label: 'name',
              },
            }}
          />
          <ProFormSelect
            width="md"
            name="everyone"
            label="所有人审批"
            placeholder="当前步骤是否需要当前所有审核人审批"
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
        </ProForm.Group>
        <ProForm.Group>
          <MemberProSelect
            width="md"
            label="指定审核人"
            name="action_value"
            multiple
            showSearch
          />
        </ProForm.Group>
      </ModalForm>
    </PageContainer>
  );
};

export default Messages;
