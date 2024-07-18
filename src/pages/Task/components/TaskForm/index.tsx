import React from "react";
import {ProForm, ProFormDateRangePicker, ProFormSelect, ProFormText} from "@ant-design/pro-components";
import MemberProSelect from "@/components/MemberProSelect";
import {projectSimpleList} from "@/services/project/api";
import WEditor from "@/components/WEditor";
import {Typography} from "antd";
import {taskGroupSimpleList} from "@/services/task/api";

const {Text} = Typography;

const levelEnum = [
  {
    label: '不重要',
    value: 0,
  },
  {
    label: '次要',
    value: 1,
  },
  {
    label: '主要',
    value: 2,
  },
  {
    label: '紧急',
    value: 3,
  },
  {
    label: '非常紧急',
    value: 4,
  },
]

interface TaskFormProps {
  projectId?: number;
  editorHtml?: string;
  onEditorChange?: (html: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({projectId, onEditorChange, editorHtml}) => {
  return (
    <>
      <ProFormText
        name="title"
        label="任务标题"
        placeholder="请填写任务标题"
        rules={[{ required: true }]}
      />
      <ProForm.Group>
        <MemberProSelect
          showSearch
          name="leader"
          label="负责人"
          placeholder="请选择任务负责人"
          rules={[{ required: true }]}
          colProps={{
            span: 12,
          }}
        />
        <MemberProSelect
          showSearch
          name="collaborator"
          label="协助人"
          placeholder="请选择任务协助人"
          multiple
          pageSize={0}
          colProps={{
            span: 12,
          }}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          name="level"
          label="优先级"
          placeholder="请选择任务优先级"
          rules={[{ required: true }]}
          options={levelEnum}
          colProps={{
            span: 12,
          }}
        />
        <ProFormDateRangePicker
          name="plan_time"
          label="计划时间"
          colProps={{
            span: 12,
          }}
          fieldProps={{
            format: 'YYYY-MM-DD',
          }}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          name="project"
          label="所属项目"
          placeholder="请选择所属项目"
          rules={[{ required: true }]}
          request={async (params) => {
            const { data } = await projectSimpleList(params);
            return data ?? [];
          }}
          fieldProps={{
            fieldNames: {value: 'id', label: 'name'}
          }}
          colProps={{
            span: 12,
          }}
        />
        <ProFormSelect
          name="group"
          label="任务组"
          placeholder="请选择任务组"
          params={{id: projectId ?? 0}}
          request={async (params) => {
            if (params.id && params.id > 0) {
              const { data } = await taskGroupSimpleList(params.id);
              return data ?? [];
            } else {
              return [];
            }
          }}
          colProps={{
            span: 12,
          }}
        />
      </ProForm.Group>
      <div>
        <Text>任务描述</Text>
        <WEditor
          border
          height="300px"
          html={editorHtml}
          onChange={(e) => onEditorChange && onEditorChange(e.getHtml())}
        />
      </div>
    </>
  );
}

export default TaskForm;
