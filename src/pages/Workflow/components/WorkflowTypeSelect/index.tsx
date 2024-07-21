import React, {useEffect} from "react";
import {WorkflowTypeList} from "@/services/workflow/api";
import {codeOk} from "@/units";
import {CheckCard} from '@ant-design/pro-components';

interface WorkflowTypeSelectPropsI {
  /** 选中的值 */
  value?: any;
  /** 选中的值 */
  onChange?: (value: any) => void;
}

const WorkflowTypeSelect: React.FC<WorkflowTypeSelectPropsI> = ({value, onChange}) => {
  const [typeList, setTypeList] = React.useState<any>([]);

  useEffect(() => {
    WorkflowTypeList({
      page: 1,
      pageSize: 9999,
    }).then((result) => {
      if (codeOk(result.code)) {
        setTypeList(result.data?.items ?? []);
      }
    })
  }, []);

  return (
    <CheckCard.Group
      onChange={(v: any) => {
        if (onChange) {
          onChange(v);
        }
      }}
      defaultValue={value}
    >
      {typeList && typeList.map((item: any) => (
        <CheckCard
          key={item.only_name}
          title={item.name}
          description={item?.illustrate ?? '-'}
          value={item.only_name}
        />
      ))}
    </CheckCard.Group>
  )
}

export default WorkflowTypeSelect;
