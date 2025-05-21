import React from "react";
import {WorkflowTypeList} from "@/services/workflow/api";
import {CheckCard} from '@ant-design/pro-components';
import {useRequest} from "ahooks";

interface WorkflowTypeSelectPropsI {
  /** 选中的值 */
  value?: any;
  /** 选中的值 */
  onChange?: (value: any) => void;
}

const WorkflowTypeSelect: React.FC<WorkflowTypeSelectPropsI> = ({value, onChange}) => {
  const { data, loading } = useRequest(WorkflowTypeList, {
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
          description={item?.illustrate || '-'}
          value={item.only_name}
        />
      ))}
    </CheckCard.Group>
  )
}

export default WorkflowTypeSelect;
