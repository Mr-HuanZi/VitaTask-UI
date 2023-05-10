import React from "react";
import {Avatar, Col, Row, Typography} from "antd";
import ProForm, {ProFormDatePicker, ProFormSelect, ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import CustomProFormUploadButton from "@/components/CustomProFormUploadButton";
import {useModel} from "@@/plugin-model/useModel";
import {changeAvatar, storeSelf} from "@/services/ant-design-pro/api";
import {codeOk, errorMessage, formatUploadFiles, getProSelectComponentValue, successMessage} from "@/units";
import NotLoggedIn from "@/pages/user/components/NotLoggedIn";

const sexEnum = {1: {label: "男", value: 1}, 2: {label: "女", value: 2}};

const BaseView: React.FC = () => {
  const {initialState, setInitialState} = useModel('@@initialState');

  if (!initialState) {
    return <NotLoggedIn/>;
  }

  const {currentUser} = initialState;

  if (!currentUser || !currentUser.userNickname) {
    return <NotLoggedIn/>;
  }

  return (
    <Row>
      <Col span={8}>
        <ProForm<API.StoreSelfForm>
          onFinish={async (formData) => {
            formData.sex = parseInt(getProSelectComponentValue(formData.sex));
            if (formData.avatar != "") {
              // @ts-ignore
              formData.avatar = formatUploadFiles(formData.avatar)?.[0]?.url ?? "";
            }
            const {code, data} = await storeSelf(formData);
            if (codeOk(code)) {
              successMessage();
              await setInitialState((s) => ({...s, currentUser: data}));
            }
          }}
        >
          <ProFormText
            name="nickname"
            label="昵称"
            initialValue={currentUser.userNickname}
          />
          <ProFormTextArea
            name="signature"
            label="个人简介"
            initialValue={currentUser.signature}
          />
          <ProFormSelect
            name="sex"
            label="性别"
            valueEnum={{1: "男", 2: "女"}}
            initialValue={sexEnum[currentUser.sex] ?? 1}
          />
          <ProFormDatePicker
            name="birthday"
            label="生日"
            initialValue={currentUser.birthday}
          />
        </ProForm>
      </Col>
      <Col span={7} offset={1}>
        <ProForm<{avatar: API.FileSimple[]}>
          onFinish={async (formData) => {
            if (formData.avatar.length <= 0) {
              errorMessage("请选择要上传的头像");
              return;
            }
            const avatar = formatUploadFiles(formData.avatar)?.[0];
            const {code} = await changeAvatar(avatar);
            if (codeOk(code)) {
              successMessage();
              await setInitialState((s) => ({...s, currentUser: {...currentUser, avatar: avatar.url}}));
            }
          }}
        >
          <div>
            <Typography.Text>头像</Typography.Text>
          </div>
          <Avatar src={currentUser.avatar} size={120} className={`m-b-15`}/>
          <CustomProFormUploadButton name="avatar" listType="picture" fileType="image"/>
        </ProForm>
      </Col>
    </Row>
  );
}

export default BaseView;
