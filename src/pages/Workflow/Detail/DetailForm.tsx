import React, {forwardRef, useEffect, useImperativeHandle, useMemo} from 'react';
import FormRender, {useForm} from "form-render";
import {ProCard} from "@ant-design/pro-components";

export interface DetailFormPropsI {
  workflowData: WorkflowAPI.WorkflowDataItemVo;
  readonly?: boolean;
}

export interface DetailFormRefI {
  getValues: () => any; // 暴露给父组件的方法
}

const DetailForm = forwardRef<DetailFormRefI, DetailFormPropsI>((props, ref) => {
  const formRef = useForm();
  const {
    readonly,
    workflowData,
  } = props;

  useImperativeHandle(ref, () => ({
    getValues: () => {
      return formRef.getValues();
    },
  }));

  const schemaData = useMemo(() => {
    if (!workflowData.schema) return undefined;

    try {
      return JSON.parse(workflowData.schema);
    } catch (error) {
      console.error('Schema解析错误:', error);
      return undefined;
    }
  }, [workflowData?.schema]);

  // 解析数据
  const parsedData = useMemo(() => {
    if (!workflowData?.data) return undefined;

    try {
      return JSON.parse(workflowData.data);
    } catch (error) {
      console.error('数据解析错误:', error);
      return undefined;
    }
  }, [workflowData?.data]);

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
    <ProCard className={`m-b-15`}>
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
