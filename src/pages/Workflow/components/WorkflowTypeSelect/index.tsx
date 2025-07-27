import React, {useMemo} from "react";
import { WorkflowTypeOrdinaryList } from "@/services/workflow/api";
import {CheckCard} from '@ant-design/pro-components';
import {useRequest} from "ahooks";
import {Tooltip} from "antd";
import stringWidth from "string-width";

interface WorkflowTypeSelectPropsI {
  /** 选中的值 */
  value?: any;
  /** 选中的值 */
  onChange?: (value: any) => void;
}

const CardTooltip: React.FC<{text?: string}> = ({text}) => {
  const strW = useMemo(() => {
    if (!text)
      return 0;

    return stringWidth(text);
  }, [text]);

  return useMemo(() => {
    if (strW <= 0)
      return (<>-</>);

    if (strW <= 30)
      return (<div style={{
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap"
      }}>{text}</div>);

    return (<Tooltip title={text}>
      <div style={{
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap"
      }}>{text}</div>
    </Tooltip>);
  }, [strW, text]);
}

const WorkflowTypeSelect: React.FC<WorkflowTypeSelectPropsI> = ({value, onChange}) => {
  const { data, loading } = useRequest(WorkflowTypeOrdinaryList, {
    defaultParams:[{page: 1,pageSize: 9999}]
  });

  return (
    <CheckCard.Group
      onChange={(v: any) => {
        if (onChange) {
          onChange(v);
        }
      }}
      defaultValue={value}
      loading={loading}
    >
      {data?.data?.items && data.data.items.map((item: any) => (
        <CheckCard
          key={item.only_name}
          title={item.name}
          description={<CardTooltip text={item?.illustrate} />}
          value={item.only_name}
        />
      ))}
    </CheckCard.Group>
  )
}

export default WorkflowTypeSelect;
