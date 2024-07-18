import type {FC} from "react";
import {fetchTaskLogOperators, fetchTaskLogs} from "@/services/task/api";
import type {ProColumns} from "@ant-design/pro-components";
import {ProTable} from "@ant-design/pro-components";
import {Avatar} from "antd";
import {QueryMemberSimpleLists} from "@/services/member/api";
import {timestampToString} from "@/units";

interface TaskLogProps {
  taskIds?: number[];
}

const TaskLog: FC<TaskLogProps> = ({taskIds}) => {

  const columns: ProColumns<TaskAPI.TaskLog>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      render: (dom, entity) => {
        return (
          <>
            <Avatar src={entity.operator_info?.avatar} className={`m-r-5`} />
            {entity.operator_info?.userNickname}
          </>
        );

      },
      request: async (params) => {
        return QueryMemberSimpleLists(params).then(r => r.data ?? []);
      },
    },
    {
      title: '操作类型',
      dataIndex: 'operate_type',
      valueType: 'select',
      request: async () => {
        return fetchTaskLogOperators().then(r => r.data ?? []);
      },
    },
    {
      title: '操作时间',
      dataIndex: 'operate_time',
      valueType: 'dateTimeRange',
      render: (dom, entity) => {
        return timestampToString(entity.operate_time);
      },
    },
    {
      title: '消息',
      dataIndex: 'message',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTimeRange',
      render: (dom, entity) => {
        return timestampToString(entity?.create_time ?? "");
      },
    },
  ];
  return (
    <ProTable<TaskAPI.TaskLog, TaskAPI.TaskLogQueryParams>
      columns={columns}
      revalidateOnFocus={false}
      rowKey={(record) => record.id}
      params={{task_id: taskIds}}
      request={async (params) => {
        // 官方教程 https://procomponents.ant.design/components/table#request
        // tips： 如果按照官方的教程来，我也不知道 params 里应该定义什么，索性直接这样就行
        // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
        // 如果需要转化参数可以在这里进行修改
        const result = await fetchTaskLogs({
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
      search={{
        showHiddenNum: true,
        defaultCollapsed: false,
      }}
    />
  );
}

export default TaskLog;
