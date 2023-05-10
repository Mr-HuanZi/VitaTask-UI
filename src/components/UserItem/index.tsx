import {Avatar, Space, Tooltip} from 'antd';
import React, { useEffect, useState } from 'react';

type UserInfo = {
  id: number;
  avatar?: string;
  userLogin: string;
  userNickname: string;
};

interface UserItemPropsI {
  users?: UserInfo | UserInfo[];
}

const UserItem: React.FC<UserItemPropsI> = ({ users }) => {
  const [items, setItems] = useState<UserInfo[]>();

  useEffect(() => {
    if (users) {
      if (!(users instanceof Array)) {
        setItems([users]);
      } else {
        setItems(users);
      }
    } else {
      setItems(undefined);
    }
  }, [users]);

  if (!items) return <></>;

  if (items.length <= 1) {
    return (
      <Space>
        {items.map((item: UserInfo) => (
          <span key={item.id}>
            <Avatar src={item.avatar} className="m-r-5" />
              {item.userNickname}-{item.userLogin}
          </span>
        ))}
      </Space>
    );
  }

  return (
    <Avatar.Group>
      {items.map((item: UserInfo) => (
        <Tooltip key={item.id} title={`${item.userNickname}-${item.userLogin}`} placement="top">
          <Avatar src={item?.avatar} />
        </Tooltip>
      ))}
    </Avatar.Group>
  );


};

export default UserItem;
