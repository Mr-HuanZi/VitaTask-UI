import React, {useEffect, useState} from "react";
import styles from "./index.less";
import {Avatar} from "antd";
import { useModel } from '@umijs/max';

export interface DialogItemProps {
  author: string;
  avatar: string;
  content: React.ReactNode;
  datetime: string;
  userId: number;
  id?: number;
}

const DialogItem: React.FC<DialogItemProps> = ({avatar, author, datetime, content, userId}) => {
  const {initialState} = useModel('@@initialState');

  const [left, setLeft] = useState<boolean>(true);

  useEffect(() => {
    setLeft(userId !== initialState?.currentUser?.id);
  }, [userId, initialState?.currentUser?.id]);

  return (
    <div className={left ? styles.DialogItem : styles.DialogItemUser}>
      <div className={`${styles.DialogItemInner} ${left ? styles.InnerLeft : styles.InnerRight}`}>
        <div className={styles.DialogItemAvatar}>
          <Avatar src={avatar} />
        </div>
        <div className={styles.DialogItemContent}>
          <div className={`${styles.DialogItemContentAuthor} ${left ? styles.ContentAuthorLeft : styles.ContentAuthorRight}`}>
            <span className={styles.name}>{author}</span>
            <span className={styles.time}>{datetime}</span>
          </div>
          <div className={styles.DialogItemContentDetail}>{content}</div>
        </div>
      </div>
    </div>
  );
}

export default DialogItem;
