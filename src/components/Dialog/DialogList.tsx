import React, {useEffect, useRef, useState} from "react";
import styles from "./index.less";
import type {DialogItemProps} from "@/components/Dialog/DialogItem";
import DialogItem from "@/components/Dialog/DialogItem";
import {Empty} from "antd";

interface DialogListProps {
  dataSource: DialogItemProps[];
}

const DialogList: React.FC<DialogListProps> = ({dataSource}) => {
  const dialogListRef = useRef<HTMLDivElement>(null);

  const [pr, setPr] = useState(0);

  useEffect(() => {
    if (dialogListRef && dialogListRef?.current) {
      // 对话列表有更新时将滚动条置底
      const current = dialogListRef.current!
      current.scrollTop = current.scrollHeight;
      // 判断是否有垂直滚动条
      if (current.scrollHeight > current.clientHeight) {
        setPr(10);
      } else {
        setPr(0);
      }
    }
  }, [dataSource]);

  if (!dataSource || dataSource.length <= 0) {
    return <Empty />
  }

  return (
    <div className={styles.DialogList} ref={dialogListRef} style={{paddingRight: pr}}>
      {dataSource.map(item => <DialogItem key={item.id} {...item} />)}
    </div>
  );
}

export default DialogList;
