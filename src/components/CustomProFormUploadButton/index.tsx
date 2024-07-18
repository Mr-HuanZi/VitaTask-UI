import React from 'react';
import { ProFormUploadButton } from '@ant-design/pro-components';
import type { ItemRender } from 'antd/lib/upload/interface';
import {errorMessage} from "@/units";
import type {ProFormUploadButtonProps} from "@ant-design/pro-form/es/components/UploadButton";

interface CustomProFormUploadButtonPropsI {
  name: string;
  fileType?: 'all' | 'image' | 'video' | 'audio' | 'file' | 'excel' | 'md';
  itemRender?: ItemRender;
}

const CustomProFormUploadButton: React.FC<ProFormUploadButtonProps & CustomProFormUploadButtonPropsI> = (
  props,
) => {
  // 支持的文件；类型
  const fileType = props.fileType ?? 'more';
  return (
    <ProFormUploadButton
      name={props.name}
      label={props.label}
      listType={props.listType ?? 'picture-card'}
      max={props.max ?? 1}
      rules={props.rules}
      action={`/v1/files/upload?key=${props.name}&type=${fileType}`}
      fieldProps={{
        multiple: true,
        name: props.name,
        itemRender: props.itemRender,
        headers: {
          Authorization: localStorage.getItem('Authorization') ?? '',
        },
      }}
      colProps={props.colProps}
      onChange={(e) => {
        const { file } = e;
        if (file.status === 'error') {
          errorMessage(file.response?.msg ?? '系统错误，原因未知');
        }
      }}
    />
  );
};

export default CustomProFormUploadButton;
