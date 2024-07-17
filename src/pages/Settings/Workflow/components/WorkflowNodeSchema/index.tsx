import React, {useEffect, useRef, useState} from "react";
import Generator from "fr-generator";
import {fetchWorkflowNodeSchema, fetchWorkflowNodeTypeAll, saveWorkflowNodeSchema} from "@/services/workflow/api";
import {codeOk} from "@/units";
import {Divider, message, Segmented, Space, Spin, Typography} from "antd";
import type { SegmentedValue } from "antd/lib/segmented";
import {useRequest} from "@@/plugin-request/request";

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
    setCurrentNodeId(typeof value === 'string' ? parseInt(value) : value);
  }

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
        <Generator
          ref={genRef}
          extraButtons={[
            true, true, true, false,
            {
              text: '保存',
              type: "primary",
              onClick: () => {
                if (currentNodeId) {
                  setSpinning(true);
                  saveWorkflowNodeSchema({id: currentNodeId, schema: JSON.stringify(genRef.current?.getValue())}).then((result) => {
                    if (codeOk(result.code)) {
                      message.success(result.message).then();
                    }
                  }).finally(() => setSpinning(false));
                }
              }
            }
          ]}
        />
      </Spin>
    </>
  );
}

export default WorkflowNodeSchema;
