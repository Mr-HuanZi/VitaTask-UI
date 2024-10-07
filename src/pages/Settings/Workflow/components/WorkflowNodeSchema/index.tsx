import React, {useCallback, useEffect, useRef, useState} from "react";
import {fetchWorkflowNodeSchema, fetchWorkflowNodeTypeAll, saveWorkflowNodeSchema} from "@/services/workflow/api";
import {codeOk} from "@/units";
import {Divider, message, Segmented, Space, Spin, Typography} from "antd";
import type {SegmentedValue} from "antd/lib/segmented";
import {useRequest} from "@@/plugin-request/request";
import {ProForm, ProFormInstance, ProFormTextArea} from "@ant-design/pro-components";

interface WorkflowNodeFormPropsI {
  id: number;
  updateTime: number;
}

const { Title, Link, Text } = Typography;

const WorkflowNodeSchema: React.FC<WorkflowNodeFormPropsI> = ({id, updateTime}) => {
  const formRef = useRef<ProFormInstance>();

  const [spinning, setSpinning] = useState(false);
  const [segmentedOptions, setSegmentedOptions] = useState<any[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState(0);

  const [messageApi, contextHolder] = message.useMessage();

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
          formRef.current?.setFieldsValue({schema: res.data});
        } else {
          formRef.current?.setFieldsValue({schema: ''});
        }
      }).finally(() => setSpinning(false));
    }
  }, [currentNodeId]);

  const handleSegmentedChange = (value: SegmentedValue) => {
    setCurrentNodeId(typeof value === 'string' ? parseInt(value) : value);
  }

  const handleFinish = useCallback(async (formData: any) => {
    setSpinning(true);
    saveWorkflowNodeSchema({id: currentNodeId, schema: formData?.schema}).then((result) => {
      if (codeOk(result.code)) {
        messageApi.success(result.message);
      }
    }).finally(() => setSpinning(false));
  }, [currentNodeId]);


  return (
    <>
      {contextHolder}
      <Space>
        <Title level={5}>请选择节点：</Title>
        <Spin tip="Loading..." spinning={loading}>
          <Segmented block options={segmentedOptions} value={currentNodeId} onChange={handleSegmentedChange} />
        </Spin>
      </Space>
      <p>
        <Text>因没有合适的可视化编辑器，请前往</Text>
        <Link href="https://xrender.fun/schema-builder-online" target="_blank">https://xrender.fun/schema-builder-online</Link>
        <Text>进行编辑，生成Json Schema后，再复制到下方。</Text>
      </p>
      <Divider />
      <Spin tip="Loading..." spinning={spinning}>
        <ProForm
          onFinish={handleFinish}
          formRef={formRef}
        >
          <ProFormTextArea
            name="schema"
            label="Json Schema"
            placeholder="请将Json Schema数据粘贴至此处"
            fieldProps={{
              autoSize: { minRows: 20, maxRows: 20 },
            }}
          />
        </ProForm>
      </Spin>
    </>
  );
}

export default WorkflowNodeSchema;
