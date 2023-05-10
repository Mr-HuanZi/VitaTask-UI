import type {FC} from "react";
import {MemberCreate} from "@/services/member/api";
import {codeOk, successMessage} from "@/units";
import {ModalForm, ProForm, ProFormText} from "@ant-design/pro-form";
import type {ModalFormProps} from "@ant-design/pro-form/es/layouts/ModalForm";

interface CreateMemberProps {
  success?: () => void;
}

const CreateMember: FC<ModalFormProps<MemberAPI.Member> & CreateMemberProps> = ({success, ...props}) => {
  return (
    <ModalForm<MemberAPI.Member>
      title="创建新成员"
      autoFocusFirstInput
      onFinish={async (formData: any) => {
        const {code} = await MemberCreate(formData);

        if (codeOk(code)) {
          successMessage();
          // 成功的回调
          if (success) success();
        }

        return true; // 返回true关闭弹窗
      }}
      modalProps={{
        destroyOnClose: true,
      }}
      {...props}
    >
      <ProForm.Group>
        <ProFormText
          name="username"
          label="用户名"
          placeholder="请填写用户名"
          rules={[
            {
              required: true,
              message: '请填写用户名',
            },
          ]}
          fieldProps={{
            autoComplete: 'off',
          }}
        />
        <ProFormText
          name="nickname"
          label="昵称"
          placeholder="请填写昵称"
          rules={[
            {
              required: true,
              message: '请填写昵称',
            },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          name="email"
          label="邮箱"
          placeholder="请填写邮箱"
          rules={[
            {
              message: '邮箱格式不正确',
              type: 'email',
            },
          ]}
        />
        <ProFormText
          name="mobile"
          label="手机号"
          placeholder="请填写手机号"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText.Password
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: '请填写密码',
            },
          ]}
          fieldProps={{
            autoComplete: 'new-password',
          }}
        />
      </ProForm.Group>
    </ModalForm>
  );
}

export default CreateMember;
