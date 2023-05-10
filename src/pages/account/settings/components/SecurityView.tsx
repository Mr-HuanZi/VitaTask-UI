import React from 'react';
import {List} from 'antd';
import {useModel} from "@@/plugin-model/useModel";
import NotLoggedIn from "@/pages/user/components/NotLoggedIn";
import {codeOk, successMessage, timestampToString} from "@/units";
import {ModalForm, ProFormText} from "@ant-design/pro-form";
import {changePassword, changeSingleInfo} from "@/services/ant-design-pro/api";

type Unpacked<T> = T extends (infer U)[] ? U : T;

const SecurityView: React.FC = () => {
  const {initialState, setInitialState} = useModel('@@initialState');

  if (!initialState) {
    return <NotLoggedIn/>;
  }

  const {currentUser} = initialState;

  if (!currentUser || !currentUser.userNickname) {
    return <NotLoggedIn/>;
  }

  const changePasswordFinish = async (formData: API.changePasswordDto) => {
    const {code} = await changePassword(formData);
    if (codeOk(code)) {
      successMessage();
      return true;
    }

    return false;
  }

  const changeEmailFinish = async (formData: any) => {
    const {code} = await changeSingleInfo({type: "email", value: formData.email});
    if (codeOk(code)) {
      successMessage();
      await setInitialState((s) => ({...s, currentUser: {...currentUser, userEmail: formData.email}}));
      return true;
    }

    return false;
  }

  const changeMobileFinish = async (formData: any) => {
    const {code} = await changeSingleInfo({type: "mobile", value: formData.mobile});
    if (codeOk(code)) {
      successMessage();
      await setInitialState((s) => ({...s, currentUser: {...currentUser, mobile: formData.mobile}}));
      return true;
    }

    return false;
  }

  const getData = () => [
    {
      title: '账户密码',
      description: (
        <>
          上次修改密码的时间：
          {currentUser.lastEditPass <= 0 ? '未修改过密码': timestampToString(currentUser.lastEditPass)}
        </>
      ),
      actions: [
        <ModalForm<API.changePasswordDto>
          key="Modify"
          title="修改密码"
          trigger={(<a>修改</a>)}
          onFinish={changePasswordFinish}
        >
          <ProFormText.Password label="旧密码" name="old_password" rules={[{required: true}]}/>
          <ProFormText.Password label="新密码" name="password" rules={[{required: true}, {type: "string"}, {min: 5}, {max: 20}]}/>
          <ProFormText.Password label="确认密码" name="confirm_password" rules={[{required: true}]}/>
        </ModalForm>
      ],
    },
    {
      title: '密保手机',
      description: `已绑定手机：${currentUser?.mobile ?? '-'}`,
      actions: [
        <ModalForm<API.changePasswordDto>
          key="Modify"
          title="修改密保手机"
          trigger={(<a>修改</a>)}
          onFinish={changeMobileFinish}
        >
          <ProFormText label="手机号" name="mobile" rules={[{required: true}]} initialValue={currentUser?.mobile ?? ''}/>
        </ModalForm>
      ],
    },
    {
      title: '备用邮箱',
      description: `已绑定邮箱：${currentUser?.userEmail ?? '-'}`,
      actions: [
        <ModalForm<API.changePasswordDto>
          key="Modify"
          title="修改备用邮箱"
          trigger={(<a>修改</a>)}
          onFinish={changeEmailFinish}
        >
          <ProFormText label="邮箱地址" name="email" rules={[{required: true}]} initialValue={currentUser?.userEmail ?? ''}/>
        </ModalForm>
      ],
    },
    {
      title: 'MFA 设备',
      description: '未绑定 MFA 设备，绑定后，可以进行二次确认',
      actions: [<a key="bind">未开放</a>],
    },
  ];

  const data = getData();
  return (
    <>
      <List<Unpacked<typeof data>>
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
    </>
  );
};

export default SecurityView;
