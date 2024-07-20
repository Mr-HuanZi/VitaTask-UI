import React from "react";
import type {ActionType, ProColumns} from "@ant-design/pro-components";
import {ProTable} from "@ant-design/pro-components";
import {Avatar, Popconfirm, Typography} from "antd";
import {deleteTask, queryTaskGroupSimpleList, queryTaskList} from "@/services/task/api";
import TagEnum from "@/components/TagEnum";
import TaskCreate from "@/pages/Task/components/TaskCreate";
import {codeOk, isEmpty, successMessage, timestampToString} from "@/units";
import {projectSimpleList} from "@/services/project/api";
import {QueryMemberSimpleLists} from "@/services/member/api";
import {TaskAPI} from "@/services/task/typings";

interface TaskListPropsI {
  /**
   * @param 指定项目
   * 值小于等于 0 时，不请求数据
   * 设置后，项目搜索项不可见
   */
  projectId?: number;
  create?: boolean; // 允许创建任务
  onTitleClick?: (entity: TaskAPI.Task) => void;
  onEditClick?: (data: TaskAPI.Task) => void;
  actionRef?: React.MutableRefObject<ActionType | undefined>;
}

const statusEnum = {
  0: {
    text: '进行中',
    color: 'processing',
    status: 'processing',
  },
  1: {
    text: '已完成',
    color: 'success',
    status: 'Success',
  },
  2: {
    text: '归档',
    color: 'default',
    status: 'default',
  },
};

const levelEnum = {
  0: {
    text: '不重要',
    color: 'default',
    status: 'default',
  },
  1: {
    text: '次要',
    color: 'processing',
    status: 'processing',
  },
  2: {
    text: '主要',
    color: 'success',
    status: 'Success',
  },
  3: {
    text: '紧急',
    color: 'warning',
    status: 'warning',
  },
  4: {
    text: '非常紧急',
    color: 'error',
    status: 'error',
  },
}

const {Text} = Typography;

const TaskList: React.FC<TaskListPropsI> = (props) => {
  const {projectId, create = true, onTitleClick, onEditClick} = props;

  const columns: ProColumns<TaskAPI.Task>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '所属项目',
      dataIndex: 'project_search',
      hideInSearch: projectId !== undefined,
      hideInTable: projectId !== undefined,
      render: (dom, entity) => {
        return entity?.project?.name;
      },
      request: async (params) => {
        return projectSimpleList(params).then(r => r.data ?? []);
      },
      fieldProps: {
        fieldNames: {value: 'id', label: 'name'}
      },
    },
    {
      title: '任务标题',
      dataIndex: 'title',
      render: (dom, entity) => {
        return onTitleClick ? (<a onClick={() => onTitleClick?.(entity)}>{entity?.title}</a>) : (<Text>{entity?.title}</Text>);
      },
    },
    {
      title: '任务组',
      dataIndex: 'group',
      valueType: 'select',
      params: {id: projectId},
      request: async (params) => {
        return queryTaskGroupSimpleList(params).then(r => r.data ?? []);
      },
      render: (dom, entity) => {
        return entity.group?.name;
      },
    },
    {
      title: '优先级',
      dataIndex: 'level',
      valueEnum: levelEnum,
      render: (dom, entity) => {
        return <TagEnum current={entity.status} items={levelEnum} />
      },
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      valueEnum: statusEnum,
    },
    {
      title: '负责人',
      dataIndex: 'leader',
      render: (dom, entity) => {
        return (
          <>
            <Avatar src={entity.leader?.user_info.avatar} className={`m-r-5`} />
            {entity.leader?.user_info.userNickname}
          </>
        );
      },
      request: async (params) => {
        return QueryMemberSimpleLists(params).then(r => r.data ?? []);
      }
    },
    {
      title: '计划时间',
      dataIndex: 'plan_time',
      valueType: 'dateRange',
      fieldProps: {
        format: 'YYYY-MM-DD',
        showToday: true,
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateRange',
      render: (dom, entity) => {
        return timestampToString(entity.create_time);
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, entity) => [
        <a
          key="edit"
          onClick={() => {
            if (onEditClick) onEditClick(entity);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          title="确定删除该任务？"
          okText="Yes"
          cancelText="No"
          key="delete"
          onConfirm={() => {
            deleteTask(entity.id).then(({code}) => {
              if (codeOk(code)) {
                successMessage();
                props?.actionRef?.current?.reload();
              }
            });
          }}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      <ProTable<TaskAPI.Task, TaskAPI.TaskListSearchParam>
        columns={columns}
        actionRef={props.actionRef}
        revalidateOnFocus={false}
        rowKey={(record) => record.id}
        params={{project: projectId}}
        request={async (params) => {
          // 官方教程 https://procomponents.ant.design/components/table#request
          // tips： 如果按照官方的教程来，我也不知道 params 里应该定义什么，索性直接这样就行
          if (params.project !== undefined && params.project <= 0) {
            // 如果 project 搜索值小于等于0，直接返回
            return {
              success: false,
            };
          }
          // 处理项目ID搜索
          if (!isEmpty(params?.project_search)) {
            params.project = params.project_search
          }
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const result = await queryTaskList({
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
        toolBarRender={() => [
          create && <TaskCreate
            key="createBtn"
            width="850px"
            title="新建任务"
            projectId={projectId}
            ok={() => props?.actionRef?.current?.reload()}
          />,
        ]}
        search={{
          showHiddenNum: true,
          defaultCollapsed: false,
        }}
      />
    </>
  );
}

export default TaskList;
