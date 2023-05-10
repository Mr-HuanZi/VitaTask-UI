import React, {useEffect, useState} from "react";
import type { TagProps} from "antd";
import {Tag} from "antd";

export type TagEnumItem = { color: string; text: string; };
export type TagEnumItems = Record<string | number, TagEnumItem>

export interface TagEnumProps extends TagProps {
  items: TagEnumItems;
  current: string | number;
}

const TagEnum: React.FC<TagEnumProps> = (props) => {
  const {items, current} = props;

  const[item, setItem] = useState<TagEnumItem>();

  useEffect(() => {
    setItem(items?.[current]);
  }, [items, current]);

  if (item) {
    return <Tag color={item.color}>{item.text}</Tag>;
  }
  return <></>
}

export default TagEnum;
