import React, {useRef, useState} from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, PageContainer } from '@ant-design/pro-components';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {WorkflowTypeList,} from '@/services/workflow/api';
import WorkflowManageDrawer from "@/pages/Settings/Workflow/components/WorkflowManageDrawer";

const Workflow: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const [workflowTypeId, setWorkflowTypeId] = useState<number>(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const onDrawerClose = () => {
    setDrawerOpen(false);
    setWorkflowTypeId(0);
    actionRef.current?.reload(); // 关闭抽屉后刷新表格
  }

  const handleAddBtnClick = () => {
    setWorkflowTypeId(0);
    setDrawerOpen(true);
  }

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
        <Button
          key="manage"
          type="link"
          onClick={() => {
            setWorkflowTypeId(entity.id);
            setDrawerOpen(true);
          }}
        >
          管理
        </Button>,
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
        toolBarRender={() => [<Button key="add" onClick={handleAddBtnClick}><PlusOutlined />新增类型</Button>]}
      />
      <WorkflowManageDrawer
        drawerOpen={drawerOpen}
        onDrawerClose={onDrawerClose}
        workflowTypeId={workflowTypeId}
        saveSuccess={(entity) => setWorkflowTypeId(entity.id)}
      />
    </PageContainer>
  );
};

export default Workflow;
