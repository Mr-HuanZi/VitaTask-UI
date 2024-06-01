import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type {ProFormInstance} from '@ant-design/pro-form';
import {ProFormSwitch, ProFormTextArea} from '@ant-design/pro-form';
import {ModalForm, ProFormText} from '@ant-design/pro-form';
import { message, Button } from 'antd';
import { Link } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import {
  WorkflowTypeAdd,
  WorkflowTypeList,
  WorkflowTypeUpdate,
} from '@/services/workflow/api';
import {codeOk} from "@/units";

const Messages: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [workflowNameFormVisible, setWorkflowNameFormVisible] = useState(false);
  const [workflowTypeId, setWorkflowTypeId] = useState<number>(0);

  const updateFormRef = useRef<ProFormInstance>();

  const createWorkflowType = (
    <ModalForm
      autoFocusFirstInput
      layout="horizontal"
      title="新建工作流类型"
      modalProps={{
        destroyOnClose: true,
      }}
      trigger={
        <Button>
          <PlusOutlined />
          新增类型
        </Button>
      }
      onFinish={async (formData: any) => {
        const result = await WorkflowTypeAdd(formData);
        if (codeOk(result.code)) {
          message.success(result.message);
          actionRef.current?.reload();
        }

        return codeOk(result.code); // 返回true关闭弹窗
      }}
    >
      <ProFormText name="name" label="工作流类型名称" />
      <ProFormText name="only_name" label="工作流唯一标识" />
      <ProFormTextArea name="illustrate" label="工作流说明" />
      <ProFormSwitch name="system" label="系统级" />
    </ModalForm>
  );

  const columns: ProColumns<WorkflowAPI.WorkflowType>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '工作流名称',
      dataIndex: 'name',
    },
    {
      title: '唯一标识',
      dataIndex: 'only_name',
      hideInSearch: true,
    },
    {
      title: '说明',
      dataIndex: 'illustrate',
      hideInSearch: true,
    },
    {
      title: '系统级',
      dataIndex: 'system',
      valueEnum: {
        1: { text: '是', status: 'Success' },
        0: { text: '否', status: 'Default' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, entity) => [
        <a
          key="link"
          onClick={() => {
            setWorkflowTypeId(entity.id);
            setWorkflowNameFormVisible(true);
            // 弹层动画有延迟，如果这里不延迟执行数据不显示
            setTimeout(() => updateFormRef.current?.setFieldsValue({"name": entity.name, "system": entity?.system === 1 ?? false, "illustrate": entity.illustrate}), 100);
          }}
        >
          编辑
        </a>,
        <Link key="steps" to={`/settings/workflow/nodes/${entity.id}`}>
          节点管理
        </Link>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<WorkflowAPI.WorkflowType, API.PageParams>
        rowKey="id"
        revalidateOnFocus={false}
        columns={columns}
        actionRef={actionRef}
        request={async (params: any) => {
          // 官方教程 https://procomponents.ant.design/components/table#request
          // tips： 如果按照官方的教程来，我也不知道 params 里应该定义什么，索性直接这样就行
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const result = await WorkflowTypeList({
            page: params.current,
            pageSize: params.pageSize,
            ...params,
          });
          return {
            data: result?.data?.items ?? [],
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: true,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: result?.data?.total,
          };
        }}
        toolBarRender={() => [createWorkflowType]}
      />
      <ModalForm
        autoFocusFirstInput
        title="修改工作流类型名称"
        formRef={updateFormRef}
        open={workflowNameFormVisible}
        onFinish={async (formData: any) => {
          formData.id = workflowTypeId;
          const result = await WorkflowTypeUpdate(formData);
          if (codeOk(result.code)) {
            message.success(result.message);
            actionRef.current?.reload();
          }

          return codeOk(result.code); // 返回true关闭弹窗
        }}
        modalProps={{
          destroyOnClose: true,
        }}
        onOpenChange={(visible: boolean) => {
          if (!visible) {
            setWorkflowNameFormVisible(visible);
          }
        }}
      >
        <ProFormText name="name" label="工作流类型名称" />
        <ProFormTextArea name="illustrate" label="工作流说明" />
        <ProFormSwitch name="system" label="系统级" />
      </ModalForm>
    </PageContainer>
  );
};

export default Messages;
