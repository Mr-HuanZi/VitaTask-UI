import type {FC} from "react";
import React, {useRef, useState} from "react";
import type {ActionType, ProColumns} from "@ant-design/pro-components";
import {EditableProTable} from "@ant-design/pro-components";
import {Popconfirm} from "antd";
import {addTaskGroup, deleteTaskGroup, queryTaskGroupList, updateTaskGroup} from "@/services/task/api";
import {codeOk, errorMessage, isEmpty, successMessage} from "@/units";
import {TaskAPI} from "@/services/task/typings";

interface TaskGroupProps {
  project: number;
}

const TaskGroup: FC<TaskGroupProps> = ({project}) => {

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<TaskAPI.TaskGroup>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      readonly: true,
    },
    {
      title: '标题',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'date',
      readonly: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, entity, _, action) => [
        <a
          key="edit"
          onClick={() => {
            action?.startEditable?.(entity.id);
          }}
        >
          更改名称
        </a>,
        <Popconfirm
          title="确定删除任务组？"
          okText="Yes"
          cancelText="No"
          key="delete"
          onConfirm={() => {
            deleteTaskGroup(entity.id).then(({code}) => {
              if (codeOk(code)) {
                successMessage();
                actionRef.current?.reload();
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
    <EditableProTable<TaskAPI.TaskGroup, TaskAPI.TaskGroupListSearchParam>
      search={false}
      columns={columns}
      params={{project}}
      actionRef={actionRef}
      revalidateOnFocus={false}
      rowKey={(record) => record.id}
      recordCreatorProps={{
        position: 'top',
        record: () => ({ id: -parseInt((Math.random() * 1000000).toFixed(0)) }),
      }}
      toolbar={{
        title: '任务组列表',
        tooltip: '对任务进行分组',
      }}
      pagination={{}} // 分页
      request={async (params) => {
        // 官方教程 https://procomponents.ant.design/components/table#request
        // tips： 如果按照官方的教程来，我也不知道 params 里应该定义什么，索性直接这样就行
        if (params.project !== undefined && params.project <= 0) {
          // 如果 project 搜索值小于等于0，直接返回
          return {
            success: false,
          };
        }
        // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
        // 如果需要转化参数可以在这里进行修改
        const result = await queryTaskGroupList({
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
      editable={{
        type: 'multiple',
        editableKeys,
        onSave: async (rowKey, data) => {
          if (isEmpty(data?.name)) {
            errorMessage('请填写任务组名称')
            return;
          }
          const formData: TaskAPI.TaskGroupForm = {
            name: data?.name ?? '',
            project: project, // 指定项目
          };
          if (!isEmpty(data.id) && data.id > 0) {
            // 编辑
            formData.id = data.id;
            const {code} = await updateTaskGroup(formData);
            if (codeOk(code)) {
              successMessage();
              actionRef.current?.reload()
            }
          } else {
            // 新增
            const {code} = await addTaskGroup(formData);
            if (codeOk(code)) {
              successMessage();
              actionRef.current?.reload()
            }
          }
        },
        onChange: setEditableRowKeys,
      }}
    />
  );
}

export default TaskGroup;
