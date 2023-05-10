import type {FC} from "react";
import {useRef} from "react";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import {ProTable} from "@ant-design/pro-table";
import {Button, Popconfirm} from "antd";
import {projectMemberBind, projectMemberList, projectMemberRemove} from "@/services/project/api";
import {ModalForm} from "@ant-design/pro-form";
import MemberProSelect from "@/components/MemberProSelect";
import {codeOk, successMessage} from "@/units";
import {PROJECT_MEMBER} from "@/constants/project";

interface ProjectMemberPropsI {
  projectId: number;
}

const ProjectMember: FC<ProjectMemberPropsI> = ({projectId}) => {
  const actionRef = useRef<ActionType>();

  const submitHandle = (formData: any) => {
    projectMemberBind({
      users: formData?.member ?? [],
      project: projectId,
      role: PROJECT_MEMBER,
    }).then(({code}) => {
      if (codeOk(code)) {
        successMessage();
        actionRef.current?.reload();
        return true;
      } else {
        return false;
      }
    });
  };

  const addForm = (
    <ModalForm
      title="添加成员"
      labelAlign="right"
      layout="horizontal"
      grid={true}
      colon={false}
      isKeyPressSubmit={false}
      trigger={<Button>添加成员</Button>}
      onFinish={async (formData) => {
        return submitHandle(formData);
      }}
    >
      <MemberProSelect
        label="选择成员"
        name="member"
        multiple
        pageSize={0}
      />
    </ModalForm>
  );


  const toolBarRender = () => [
    addForm,
  ];

  const columns: ProColumns<ProjectAPI.ProjectMember>[] = [
    {
      title: 'UID',
      dataIndex: 'userId',
      hideInSearch: true,
    },
    {
      title: '用户名',
      hideInSearch: true,
      render: (dom, entity) => {
        return entity?.userInfo?.userLogin;
      },
    },
    {
      title: '昵称',
      hideInSearch: true,
      render: (dom, entity) => {
        return entity?.userInfo?.userNickname;
      },
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      valueType: 'select',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'options',
      hideInSearch: true,
      render: (_, entity) => [
        <Popconfirm
          key="remove"
          okText="Yes"
          cancelText="No"
          title="确定删除该成员？"
          onConfirm={() => {
            projectMemberRemove({project: entity.projectId, users: [entity.userId], role: PROJECT_MEMBER}).then(({code}) => {
              if (codeOk(code)) {
                successMessage();
                actionRef.current?.reload();
              }
            });
          }}
        >
          <a>移除</a>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <>
      <ProTable<ProjectAPI.ProjectMember, ProjectAPI.ProjectMemberQueryParams>
        rowKey="id"
        search={false}
        columns={columns}
        actionRef={actionRef}
        revalidateOnFocus={false}
        params={{project: projectId}}
        request={async (params) => {
          // 官方教程 https://procomponents.ant.design/components/table#request
          // tips： 如果按照官方的教程来，我也不知道 params 里应该定义什么，索性直接这样就行
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const result = await projectMemberList({
            page: params.current,
            pageSize: params.pageSize,
            role: -1, // 搜索所有角色
            ...params,
          });
          return {
            data: result?.data?.items,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: true,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: result?.data?.total,
          };
        }}
        toolBarRender={toolBarRender}
      />
    </>
  );
}

export default ProjectMember;
