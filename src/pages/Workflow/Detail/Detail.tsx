import React, {useEffect} from 'react';
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
  const [schemaData, setSchemaData] = React.useState<any|undefined>(schema);

  useEffect(() => {
    let obj: any = undefined;
    if (schema) {
      // 解析json字符串
      obj = JSON.parse(schema);
    }

    setSchemaData(obj);
  }, [schema]);

  useEffect(() => {
    if (formRef && schemaData) {
      setTimeout(() => {
        if (values) {
          values.forEach((item) => {
            if (item.node_id === currNode.id) {
              formRef.setValues(JSON.parse(item.data));
            }
          });
        }
      }, 100);
    }
  }, [formRef, values, currNode, schemaData])

  if (schemaData)
    return (
      <ProCard title={<Title level={5}>附加信息</Title>} className={`m-b-15`}>
        <FormRender
          form={formRef}
          schema={schemaData}
          footer={false}
        />
      </ProCard>
    );

  return <></>;
};

export default DetailContent;
