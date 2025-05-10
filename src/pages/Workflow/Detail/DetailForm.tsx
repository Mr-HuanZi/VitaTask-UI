import React, {forwardRef, useEffect, useImperativeHandle, useMemo} from 'react';
import FormRender, {useForm} from "form-render";
import {ProCard} from "@ant-design/pro-components";
import {Typography} from "antd";

export interface DetailFormPropsI {
  currNode: WorkflowAPI.WorkflowNode;
  schema?: string;
  values?: WorkflowAPI.WorkflowDataItemVo[];
  readonly?: boolean;
  title?: string;
}

export interface DetailFormRefI {
  getValues: () => any; // 暴露给父组件的方法
}

const { Title } = Typography;

const DetailForm = forwardRef<DetailFormRefI, DetailFormPropsI>((props, ref) => {
  const formRef = useForm();
  const { currNode, schema, values, readonly, title } = props;

  useImperativeHandle(ref, () => ({
    getValues: () => {
      return formRef.getValues();
    },
  }));

  const schemaData = useMemo(() => {
    if (!schema) return undefined;

    try {
      return JSON.parse(schema);
    } catch (error) {
      console.error('Schema解析错误:', error);
      return undefined;
    }
  }, [schema]);

  // 找到当前节点要加载的数据
  const currentDataItem = useMemo(() => {
    return values?.find(item => item.node_id === currNode.id);
  }, [values, currNode.id]);

  // 解析数据
  const parsedData = useMemo(() => {
    if (!currentDataItem?.data) return undefined;
    try {
      return JSON.parse(currentDataItem.data);
    } catch (error) {
      console.error('数据解析错误:', error);
      return undefined;
    }
  }, [currentDataItem?.data]);

  useEffect(() => {
    if (!formRef || !schemaData) return;

    console.log('schemaData', schemaData);

    if (parsedData) {
      formRef.setValues(parsedData);
    } else {
      formRef.setValues({});
    }
  }, [formRef, schemaData, parsedData]);

  if (!schemaData) return null;

  return (
    <ProCard title={<Title level={5}>{title ?? '审批数据'}</Title>} className={`m-b-15`}>
      <FormRender
        form={formRef}
        schema={schemaData}
        footer={false}
        readOnly={readonly}
        onMount={() => { // 双重保障设置值
          if (parsedData) formRef.setValues(parsedData);
        }}
      />
    </ProCard>
  )
});

export default DetailForm;
