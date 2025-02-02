import React, {useEffect, useMemo} from 'react';
import FormRender from "form-render";
import type {FormInstance} from "form-render/lib/type";
import {ProCard} from '@ant-design/pro-components';
import {Typography} from "antd";

interface DetailContentPropsI {
  currNode: WorkflowAPI.WorkflowNode;
  formRef: FormInstance;
  schema?: string;
  values?: WorkflowAPI.WorkflowDataItemVo[];
}

const { Title } = Typography;

const DetailContent: React.FC<DetailContentPropsI> = ({currNode, schema, formRef, values}) => {
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

    if (parsedData) {
      formRef.setValues(parsedData);
    } else {
      formRef.setValues({});
    }
  }, [formRef, schemaData, parsedData]);

  if (!schemaData) return null;

  return (
    <ProCard title={<Title level={5}>附加信息</Title>} className={`m-b-15`}>
      <FormRender
        form={formRef}
        schema={schemaData}
        footer={false}
        onMount={() => { // 双重保障设置值
          if (parsedData) formRef.setValues(parsedData);
        }}
      />
    </ProCard>
  );

};

export default DetailContent;
