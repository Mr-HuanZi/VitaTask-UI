import React, {useEffect, useState} from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import {
  WorkflowHandled,
  WorkflowList,
  WorkflowStatusList, WorkflowTodo,
  WorkflowTypeOptions,
} from '@/services/workflow/api';
import { Link } from '@umijs/max';
import { Space } from 'antd';
import { QueryMemberSimpleLists } from '@/services/member/api';
import {timestampToString} from "@/units";
import type {ProSchemaValueEnumType} from "@ant-design/pro-utils/lib/typing";

interface TableListPropsI {
  requestType: string;
  ExcludedField?: string[];
  toolBarRender?: React.ReactNode[] | false;
  actionRef?: React.MutableRefObject<ActionType | undefined>;
}

const TableList: React.FC<TableListPropsI> = (
  {
    requestType,
    ExcludedField,
    toolBarRender,
    actionRef
  }
) => {
  const [statusEnum, setStatusEnum] = useState<Map<number, ProSchemaValueEnumType>>();

  useEffect(function (){
    WorkflowStatusList().then((result) => {
      setStatusEnum(result?.data);
    });
  }, []);

  const columns: ProColumns<WorkflowAPI.Workflow>[] = [
    {
      title: '编号',
      dataIndex: 'serials',
      hideInTable: ExcludedField ? ExcludedField?.indexOf('serials') !== -1 : false,
      hideInSearch: ExcludedField ? ExcludedField?.indexOf('serials') !== -1 : false,
    },
    {
      title: '工作流类型',
      dataIndex: 'type_id',
      valueType: 'select',
      params: {system: 1},
      hideInTable: ExcludedField ? ExcludedField?.indexOf('type') !== -1 : false,
      hideInSearch: ExcludedField ? ExcludedField?.indexOf('type') !== -1 : false,
      fieldProps: {
        showSearch: true,
        mode: "multiple",
      },
      request: (params) => {
        return WorkflowTypeOptions(params).then((result) => {
          return result?.data ?? [];
        });
      },
      render: (dom, entity) => {
        return entity.type_name;
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      hideInTable: ExcludedField ? ExcludedField?.indexOf('title') !== -1 : false,
      hideInSearch: ExcludedField ? ExcludedField?.indexOf('title') !== -1 : false,
    },
    {
      title: '发起人',
      dataIndex: 'promoter',
      valueType: 'select',
      hideInTable: ExcludedField ? ExcludedField?.indexOf('promoter') !== -1 : false,
      hideInSearch: ExcludedField ? ExcludedField?.indexOf('promoter') !== -1 : false,
      fieldProps: {
        showSearch: true,
        fieldNames: {
          value: 'id',
        },
      },
      render: (dom, entity) => {
        return entity.nickname;
      },
      request: (params) => {
        return QueryMemberSimpleLists(params).then(r => r.data ?? []);
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: statusEnum,
      hideInTable: ExcludedField ? ExcludedField?.indexOf('status') !== -1 : false,
      hideInSearch: ExcludedField ? ExcludedField?.indexOf('status') !== -1 : false,
      fieldProps: {
        showSearch: true,
      },
    },
    {
      title: '当前节点',
      dataIndex: 'node',
      hideInSearch: true,
      hideInTable: ExcludedField ? ExcludedField?.indexOf('node') !== -1 : false,
      render: (dom, entity) => {
        return entity?.node_info?.name ?? '-';
      },
    },
    {
      title: '当前操作人',
      dataIndex: 'operator',
      hideInSearch: true,
      hideInTable: ExcludedField ? ExcludedField?.indexOf('operator') !== -1 : false,
      render: (dom, entity) => {
        if (entity?.operator && entity?.operator?.length > 0) {
          return <Space>{entity?.operator.map((item) => item.nickname)}</Space>;
        }
        return '-';
      },
    },
    {
      title: '发起时间',
      dataIndex: 'create_time',
      valueType: 'dateTimeRange',
      hideInTable: ExcludedField ? ExcludedField?.indexOf('create_time') !== -1 : false,
      hideInSearch: ExcludedField ? ExcludedField?.indexOf('create_time') !== -1 : false,
      render: (dom, entity) => {
        return timestampToString(entity?.create_time ?? "");
      },
    },
    {
      title: '提交次数',
      dataIndex: 'submit_num',
      hideInSearch: true,
      hideInTable: ExcludedField ? ExcludedField?.indexOf('submit_num') !== -1 : false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, entity) => [
        <Link key="link" to={`/workflow/detail/${entity.id}`}>
          查看
        </Link>,
      ],
    },
  ];
  return (
    <ProTable<WorkflowAPI.Workflow, API.PageParams>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      revalidateOnFocus={false}
      toolBarRender={!toolBarRender ? toolBarRender: () => toolBarRender}
      request={async (params: any) => {
        // 如果需要转化参数可以在这里进行修改
        if (params?.status) {
          // 将其转换成数字类型
          params.status = Number(params.status);
        }

        let result;
        switch (requestType) {
          case 'initiated':
          default:
            result = await WorkflowList({
              page: params.current,
              pageSize: params.pageSize,
              ...params,
            });
            break;
          case 'todo':
            result = await WorkflowTodo({
              page: params.current,
              pageSize: params.pageSize,
              ...params,
            });
            break;
          case 'completed':
            result = await WorkflowHandled({
              page: params.current,
              pageSize: params.pageSize,
              ...params,
            });
        }

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

export default TableList;
