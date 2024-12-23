import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from "react"
import {fetchWorkflowNodeTypeAll, saveWorkflowNodeCirculation} from "@/services/workflow/api";
import {codeOk} from "@/units";
import {Button, Checkbox} from "antd";
import {ActionType, ProColumns, ProTable} from "@ant-design/pro-components";
import {message} from "@/Notice";

interface WorkflowCirculationPropI {
  id?: number;
}

const WorkflowCirculation: FC<WorkflowCirculationPropI> = ({id}) => {
  const actionRef = useRef<ActionType>();

  const [workflowTypeId, setWorkflowTypeId] = useState<number>();
  const [allNode, setAllNode] = useState<WorkflowAPI.WorkflowNode[]>([]);
  // 保存复选框的选中状态
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  // 维护加载中状态
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setWorkflowTypeId(id);
    if (id) {
      // 获取所有节点
      fetchWorkflowNodeTypeAll(id).then((entity) => {
        if (codeOk(entity?.code)) {
          const allNode = entity?.data ?? [];

          setAllNode(allNode);
          // 遍历节点
          const selectedKeys: string[] = [];
          for (const node of allNode) {
            if (node?.circulation) {
              for (const circulationNode of node.circulation) {
                selectedKeys.push(node.id + '-' + circulationNode.id);
              }
            }
          }

          if (selectedKeys) {
            setSelectedKeys(selectedKeys);
          }
        }
      });
    }
  }, [id]);

  const tableColumns = useMemo(() => {
    let columns: ProColumns<WorkflowAPI.WorkflowNode>[] = [];

    if (allNode) {
      // 默认列
      columns.push({
        title: '节点名称',
        dataIndex: 'name',
        hideInSearch: true,
        render: (_, entity) => (
          '从【' + entity.name + '】可流转到'
        ),
      });
      for (const node of allNode) {
        columns.push({
          title: node.name,
          dataIndex: 'nodeIndex' + node.id,
          hideInSearch: true,
          // 如果是当前节点，禁用复选框并默认勾选
          render: (_, entity) => (
            <>
              <Checkbox
                key={node.id}
                disabled={node.id === entity.id}
                checked={selectedKeys.includes(entity.id + '-' + node.id)}
                onChange={(e) => {
                  // 设置选中
                  setSelectedKeys((prevKeys) => {
                    const nowKey = entity.id + '-' + node.id;
                    if (e.target.checked) {
                      return [...prevKeys, nowKey];
                    }
                    return prevKeys.filter((key) => key !== nowKey);
                  });
                }}
              />
            </>
          ),
        })
      }
    }
    return columns;
  }, [allNode, selectedKeys]);

  // 获取已选中的NodeID
  const getSelectedNodeIds = useCallback(() => {
    const nodeIds: Record<string, number[]> = {};

    for (const key of selectedKeys) {
      const [fromNodeId, targetNodeId] = key.split('-');
      if (nodeIds?.[fromNodeId]) {
        nodeIds[fromNodeId].push(parseInt(targetNodeId));
      } else {
        nodeIds[fromNodeId] = [parseInt(targetNodeId)];
      }
    }
    return nodeIds;
  }, [selectedKeys]);

  const handleSubmit = () => {
    if (!workflowTypeId)
      return;

    setLoading(true);

    const nodeIds = getSelectedNodeIds();
    saveWorkflowNodeCirculation({
      type_id: workflowTypeId,
      circulation: nodeIds,
    }).then(entity => {
      if (codeOk(entity?.code)) {
        message.success('保存成功').then();
      }
    }).finally(() => setLoading(false));
  }

  return (
    <div>
      <ProTable<WorkflowAPI.WorkflowNode, WorkflowAPI.NodePageParams>
        rowKey="id"
        defaultSize="small"
        headerTitle="节点流转"
        search={false}
        options={false}
        revalidateOnFocus={false}
        columns={tableColumns}
        actionRef={actionRef}
        dataSource={allNode}
      />
      <Button
        type="primary"
        onClick={handleSubmit}
        loading={loading}
      >
        保存
      </Button>
    </div>
  )
}

export default WorkflowCirculation;
