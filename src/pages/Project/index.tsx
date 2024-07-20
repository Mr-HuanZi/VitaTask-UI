import React, {useEffect, useRef, useState} from 'react';
import { PageContainer, ModalForm, ProFormText, ProForm, ProTable } from '@ant-design/pro-components';
import type {ActionType, ProColumns, ProFormInstance} from '@ant-design/pro-components';
import {Button, Drawer, Dropdown, message, Modal, Space} from 'antd';
import {
  projectArchive,
  projectCreate,
  projectDelete,
  projectEdit,
  projectUnArchive,
  queryProjects
} from "@/services/project/api";
import {assembleSingleFormData, codeOk, isEmpty, successMessage} from "@/units";
import {Link} from "@umijs/max";
import MemberProSelect from "@/components/MemberProSelect";
import {DeleteOutlined, DownOutlined, EditOutlined, ExclamationCircleFilled, InboxOutlined} from '@ant-design/icons';
import ProjectMember from "@/pages/Project/components/ProjectMember";

const { confirm } = Modal;

const Project: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const [editProjectModalVisible, setEditProjectModalVisible] = useState<boolean>(false);
  const [memberListDrawerVisible, setMemberListDrawerVisible] = useState<boolean>(false);
  const [thatProject, setThatProject] = useState<ProjectAPI.Project>();

  useEffect(() => {
    if (thatProject) {
      let leader: {value: number; label: string} | undefined;
      // 获取负责人
      if (thatProject?.leader?.userInfo) {
        leader = {
          value: thatProject?.leader?.userInfo.id ?? 0,
          label: thatProject?.leader?.userInfo.userNickname ?? '',
        };
      } else {
        leader = undefined;
      }
      formRef.current?.setFieldsValue({...thatProject, leader});
    }
  }, [thatProject]);

  const handleDropdownClick = (key: string, entity: ProjectAPI.Project) => {
    if (key === 'edit') {
      setThatProject(entity);
      setEditProjectModalVisible(true);
    } else if (key === 'del') {
      confirm({
        title: '确定删除该项目？',
        icon: <ExclamationCircleFilled />,
        content: '此操作不可恢复',
        onOk() {
          projectDelete({id: entity.id}).then(({code}) => {
            if (codeOk(code)) {
              successMessage();
              actionRef.current?.reload();
            }
          });
        },
      });
    } else if (key === 'archive') {
      let promise;
      if (entity.archive === 1) {
        promise = projectUnArchive({id: entity.id});
      } else {
        promise = projectArchive({id: entity.id});
      }
      promise.then(({code}) => {
        if (codeOk(code)) {
          successMessage();
          actionRef.current?.reload();
        }
      })
    } else {
      message.warning('功能未开放');
    }
  };

  const handleFinish = async (formData: any) => {
    const data = await assembleSingleFormData(
      formData,
      {
        select: ["leader"],
      }
    );
    let r: any;
    if (isEmpty(thatProject?.id)) {
      r = await projectCreate(data);
    } else {
      data.id = thatProject?.id;
      r = await projectEdit(data);
    }
    if (codeOk(r.code)) {
      successMessage();
      actionRef.current?.reload();
    }
    setEditProjectModalVisible(false); // 关闭弹层
    return true; // 返回true关闭弹窗
  }

  const projectFormDom = (
    <>
      <ProFormText
        name="name"
        label="项目名称"
        placeholder="请填写项目名称"
        initialValue={thatProject?.name ?? ''}
        rules={[
          {
            required: true,
            message: '请填写项目名称',
          },
        ]}
      />
      <MemberProSelect
        label="负责人"
        name="leader"
        pageSize={0}
      />
    </>
  );

  const createProjectModal = (
    <ModalForm
      title="新建项目"
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
      }}
      trigger={(<Button type="primary" >创建项目</Button>)}
      onFinish={handleFinish}
    >
      {projectFormDom}
    </ModalForm>
  );

  const columns: ProColumns<ProjectAPI.Project>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '项目名',
      dataIndex: 'name',
      render: (dom, entity) => {
        return <Link to={`/project/detail/${entity.id}`}>{entity.name}</Link>
      },
    },
    {
      title: '负责人',
      render: (dom, entity) => {
        return entity.leader?.userInfo.userNickname;
      },
    },
    {
      title: '已完成项目数',
      dataIndex: 'complete',
      hideInSearch: true,
      width: '120px',
    },
    {
      title: '状态',
      dataIndex: 'archive',
      valueEnum: {
        0: {
          text: '开始',
          status: 'Processing',
        },
        1: {
          text: '归档',
          status: 'Success',
        },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      hideInSearch: true,
      render: (_, entity) => [
        <a
          key="member"
          onClick={() => {
            setThatProject(entity);
            setMemberListDrawerVisible(true);
          }}
        >
          成员管理
        </a>,
        <Dropdown
          key="more"
          menu={{
            onClick: ({ key }: any) => handleDropdownClick(key, entity),
            items: [
              {
                key: 'edit',
                label: '编辑项目',
                icon: <EditOutlined />,
              },
              {
                key: 'archive',
                label: entity.archive === 1 ? '取消归档' : '归档',
                icon: <InboxOutlined />,
              },
              {
                key: 'del',
                danger: true,
                label: '删除',
                icon: <DeleteOutlined />,
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
        </Dropdown>
      ],
    },
  ];
  return (
    <PageContainer ghost={false}>
      <ProTable<ProjectAPI.Project, API.PageParams>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        revalidateOnFocus={false}
        request={async (params) => {
          // 官方教程 https://procomponents.ant.design/components/table#request
          // tips： 如果按照官方的教程来，我也不知道 params 里应该定义什么，索性直接这样就行
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const result = await queryProjects({
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
          createProjectModal,
        ]}
      />
      <Drawer
        title={`[${thatProject?.name ?? ''}]成员列表`}
        width="50vw"
        open={memberListDrawerVisible}
        onClose={() => setMemberListDrawerVisible(false)}
      >
        <ProjectMember projectId={thatProject?.id ?? 0}/>
      </Drawer>
      <Modal
        open={editProjectModalVisible}
        onCancel={()=> setEditProjectModalVisible(false)}
        onOk={() => formRef.current?.submit()} // 触发表单提交方法
      >
        <ProForm
          submitter={false}
          formRef={formRef}
          onFinish={handleFinish}
        >
          {projectFormDom}
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default Project;
