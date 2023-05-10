import React from "react";
import {Tabs} from "antd";
import styles from "./index.less"
import BaseView from "@/pages/account/settings/components/BaseView";
import SecurityView from "@/pages/account/settings/components/SecurityView";

const Settings: React.FC = () => {
    const items = [
        { label: '基本设置', key: 'base', children: <BaseView/> }, // 务必填写 key
        { label: '安全设置', key: 'item-2', children: <SecurityView/> },
    ];

  return (
      <div className={styles.main}>
          <Tabs items={items} tabPosition="left" className={styles.tabsContainer}/>
      </div>
  );
}

export default Settings;
