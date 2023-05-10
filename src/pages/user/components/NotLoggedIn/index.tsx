import {Button, Result} from "antd";
import React from "react";
import {history} from "@@/core/history";

const NotLoggedIn: React.FC = () => {
  return (
    <Result
      status="error"
      title="您还没有登录"
      subTitle="点击下方按钮跳转至登录页面"
      extra={[
        <Button
          type="primary"
          key="login"
          onClick={() => history.push('/user/login')}
        >
          去登录
        </Button>,
      ]}
    />
  );
}

export default NotLoggedIn;
