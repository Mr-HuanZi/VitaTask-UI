import React from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { ProTable } from '@ant-design/pro-table';
import { Tag } from 'antd';
import { QueryWorkflowLogList } from '@/services/workflow/api';
import moment from "moment/moment";

interface LogsPropsI {
  workflowId: number;
}

const Logs: React.FC<LogsPropsI> = ({ workflowId }) => {
  const columns: ProColumns<WorkflowAPI.WorkflowLogVo>[] = [
    {
      title: '节点序号',
      dataIndex: 'node',
      width: '80px',
    },
    {
      title: '节点',
      dataIndex: 'node_info',
      render: (dom, entity) => {
        return entity.node_info?.name ?? '-';
      },
    },
    {
      title: '动作',
      dataIndex: 'action_name',
      render: (dom, entity) => {
        const actionColor = { initiate: 'blue', pass: 'green', overrule: 'orange', reject: 'red' };
        return <Tag color={actionColor?.[entity.action] ?? 'default'}>{entity.action}</Tag>;
      },
    },
    {
      title: '操作人',
      dataIndex: 'nickname',
    },
    {
      title: '说明',
      dataIndex: 'explain',
    },
    {
      title: '操作时间',
      dataIndex: 'create_time',
      render: (_, entity) => {
        return entity?.create_time ? moment(entity?.create_time).format('YYYY-MM-DD HH:mm:ss') : '-';
      },
    },
  ];

  return (
    <ProTable<WorkflowAPI.WorkflowLogVo, WorkflowAPI.PageParams>
      rowKey="id"
      revalidateOnFocus={false}
      columns={columns}
      search={false}
      params={{ workflow_id: workflowId }}
      request={async (params: any) => {
        // 官方教程 https://procomponents.ant.design/components/table#request
        // tips： 如果按照官方的教程来，我也不知道 params 里应该定义什么，索性直接这样就行
        // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
        // 如果需要转化参数可以在这里进行修改
        const result = await QueryWorkflowLogList({
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
    />
  );
};

export default Logs;
