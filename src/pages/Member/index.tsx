import React, {useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {Avatar, Button, Dropdown, message, Popconfirm, Space, Tag} from 'antd';
import {ChangeMemberSuper, MemberChangeStatus, MemberLists, ResetPassword} from '@/services/member/api';
import {DownOutlined, StopOutlined} from '@ant-design/icons';
import type {ProFormInstance} from '@ant-design/pro-form';
import {codeOk, successMessage} from "@/units";
import CreateMember from "@/pages/Member/components/CreateMember";

const Messages: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const createMemberActionRef = useRef<ProFormInstance>();

  const handleDropdownClick = (key: string, entity: MemberAPI.Member) => {
    if (key === 'enable' || key === 'disable') {
      MemberChangeStatus({
        uid: entity.id,
        type: key,
      }).then(({code}) => {
        if (codeOk(code)) {
          successMessage();
          actionRef.current?.reload();
        }
      });
    } else if (key == 'setSuper' || key == 'unSuper') {
      ChangeMemberSuper({
        uid: entity.id,
        super: key == 'setSuper' ? 2 : 1, // 后端表单校验要支持0值有点麻烦，先+1
      }).then(({code}) => {
        if (codeOk(code)) {
          successMessage();
          actionRef.current?.reload();
        }
      });
    } else {
      message.warn('功能未开放').then();
    }
  };

  const columns: ProColumns<MemberAPI.Member>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'userLogin',
      render: (_, record) => {
        return (
          <Space>
            <Avatar src={record.avatar ?? ''}/>
            {record.userLogin}
          </Space>

        )
      }
    },
    {
      title: '昵称',
      dataIndex: 'userNickname',
    },
    {
      title: '超级用户',
      dataIndex: 'super',
      hideInSearch: true,
      valueEnum: {
        0: '否',
        1: '是',
      },
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        '1': '启用',
        '2': '禁用',
      },
      render: (dom, entity) => {
        let color: string, text: string;
        if (entity.userStatus === 1) {
          text = '启用';
          color = 'green';
        } else if (entity.userStatus === 2) {
          text = '禁用';
          color = 'red';
        } else {
          text = '错误';
          color = 'default';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, entity) => [
        <Popconfirm
          title="确定重置该成员密码？"
          okText="Yes"
          cancelText="No"
          key="key"
          onConfirm={() => {
            ResetPassword({
              uid: entity.id,
            }).then(({code}) => {
              if (codeOk(code)) {
                successMessage();
              }
            });
          }}
        >
          <a key="reset">重置密码</a>
        </Popconfirm>,
        <Dropdown
          key="more"
          menu={{
            onClick: ({ key }: any) => handleDropdownClick(key, entity),
            items: [
              {
                key: 'enable',
                label: '启用用户',
                disabled: !(entity.userStatus === 2)
              },
              {
                key: 'disable',
                danger: entity.userStatus == 1,
                label: '禁用用户',
                icon: <StopOutlined />,
                disabled: !(entity.userStatus === 1)
              },
              {
                key: 'setSuper',
                label: '设为超级用户',
                disabled: !(entity.super === 0)
              },
              {
                key: 'unSuper',
                label: '取消超级用户',
                disabled: !(entity.super === 1)
              },
            ]
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              更多
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<MemberAPI.Member, API.PageParams>
        columns={columns}
        actionRef={actionRef}
        revalidateOnFocus={false}
        rowKey={(record) => record.id}
        request={async (params) => {
          // 官方教程 https://procomponents.ant.design/components/table#request
          // tips： 如果按照官方的教程来，我也不知道 params 里应该定义什么，索性直接这样就行
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const result = await MemberLists({
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
          <CreateMember
            key="create"
            formRef={createMemberActionRef}
            trigger={(<Button>创建新成员</Button>)}
            success={() => actionRef.current?.reload()}
          />
        ]}
      />

    </PageContainer>
  );
};

export default Messages;
