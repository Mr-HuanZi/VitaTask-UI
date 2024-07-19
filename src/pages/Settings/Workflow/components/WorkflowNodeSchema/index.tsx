import React, {useEffect, useMemo, useRef, useState} from "react";
import ReactDOM from 'react-dom';
import {fetchWorkflowNodeSchema, fetchWorkflowNodeTypeAll, saveWorkflowNodeSchema} from "@/services/workflow/api";
import {codeOk} from "@/units";
import {Divider, message, Segmented, Space, Spin, Typography} from "antd";
import type {SegmentedValue} from "antd/lib/segmented";
import {useRequest} from "@@/plugin-request/request";
import SchemaBuilder from '@xrenders/schema-builder';

window.React = React;
window.ReactDOM = ReactDOM;

interface WorkflowNodeFormPropsI {
  id: number;
  updateTime: number;
}

const { Title } = Typography;

const WorkflowNodeSchema: React.FC<WorkflowNodeFormPropsI> = ({id, updateTime}) => {
  const genRef = useRef<any>(); // 不知道组件用的是哪个类型，先用 any

  const [spinning, setSpinning] = useState(false);
  const [segmentedOptions, setSegmentedOptions] = useState<any[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState(0);

  const { run: fetchWorkflowNodeTypeAllReq, loading } = useRequest(fetchWorkflowNodeTypeAll, {manual: true});

  useEffect(() => {
    if (id && updateTime) {
      // 获取工作流所有节点
      fetchWorkflowNodeTypeAllReq(id).then((entity) => {
        // 获取第一个节点
        setCurrentNodeId(entity?.[0]?.id ?? 0);
        // 设置 segmented组件 数据
        setSegmentedOptions(entity?.map(item => {
          return {
            label: item.name,
            value: item.id,
          };
        }) ?? []);
      });
    }
  }, [id, updateTime, fetchWorkflowNodeTypeAllReq]);

  useEffect(() => {
    console.log('fetchWorkflowNodeSchema useEffect', currentNodeId, genRef.current?.getValue());
    if (currentNodeId) {
      setSpinning(true);
      // 获取第一个节点的 schema
      fetchWorkflowNodeSchema(currentNodeId).then((res) => {
        if (codeOk(res.code) && res?.data) {
          genRef.current?.setValue(JSON.parse(res.data));
        } else {
          genRef.current?.setValue('');
        }
      }).finally(() => setSpinning(false));
    }
  }, [currentNodeId]);

  const handleSegmentedChange = (value: SegmentedValue) => {
    console.log('handleSegmentedChange', value);
    setCurrentNodeId(typeof value === 'string' ? parseInt(value) : value);
  }

  const saveBtnConfig = useMemo(() => ({
    text: '保存',
    order: 1,
    onClick: () => {
      console.log('saveBtnConfig', currentNodeId, genRef.current?.getValue());
      if (currentNodeId) {
        setSpinning(true);
        saveWorkflowNodeSchema({id: currentNodeId, schema: JSON.stringify(genRef.current?.getValue())}).then((result) => {
          if (codeOk(result.code)) {
            message.success(result.message).then();
          }
        }).finally(() => setSpinning(false));
      }
    },
  }), [currentNodeId]);


  return (
    <>
      <Space>
        <Title level={5}>请选择节点：</Title>
        <Spin tip="Loading..." spinning={loading}>
          <Segmented block options={segmentedOptions} value={currentNodeId} onChange={handleSegmentedChange} />
        </Spin>
      </Space>
      <Divider />
      <Spin tip="Loading..." spinning={spinning}>
        <div style={{minHeight: '580px', height: '580px'}}>
          <SchemaBuilder
            ref={genRef}
            importBtn={true}
            exportBtn={true}
            pubBtn={false}
            saveBtn={saveBtnConfig}
          />
        </div>
      </Spin>
    </>
  );
}

export default WorkflowNodeSchema;
