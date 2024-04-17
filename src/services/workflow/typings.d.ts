// @ts-ignore
/* eslint-disable */

declare namespace WorkflowAPI {
  type Workflow = {
    id: number;
    type_id: number;
    type_name: string;
    org_id: number;
    serials: string;
    title: string;
    promoter: number;
    nickname: string;
    status: number;
    node: number;
    end: boolean;
    status_text?: string;
    remarks?: string;
    submit_num: number;
    create_time?: string;
    update_time?: string;
    node_info?: WorkflowNode;
    operator?: WorkflowOperators[];
  };

  type WorkflowType = {
    id: number;
    name: string;
    illustrate: string;
    org_id: number;
    only_name: string;
    system: number;
    create_time: string;
    update_time?: string;
  };

  type WorkflowNode = {
    id: number;
    type_id: number;
    node: number;
    name: string;
    action?: string;
    action_value?: number | number[];
    everyone?: number;
    create_time?: string;
    update_time?: string;
    // todo 以下部分暂未实现
    condition?: string;
    condition_fail?: string;
  };

  type WorkflowLog = {
    id: number;
    step: number;
    workflow_id: number;
    userid: number;
    nickname: string;
    explain: string;
    action: string;
    action_name: string;
    created_at?: string;
    updated_at?: string;
    step_info?: WorkflowTypeStep;
  };

  type WorkflowLogVo = {
    id: number;
    node: number;
    workflow_id: number;
    operator: number;
    nickname: string;
    explain: string;
    action: string;
    create_time?: string;
    node_info?: WorkflowNode;
  };

  type WorkflowOperators = {
    id: number;
    workflow_id: number;
    userid: number;
    nickname: string;
    handled: number;
    node: number;
  }

  type WorkflowDetail = {
    [x: string]: any[];
    workflow: Workflow;
    node: WrorkflowNode;
    operators: WorkflowOperators[];
    workflow_type: WorkflowType;
  };

  type WorkflowDetailRefResponse = {
    success: boolean;
    data?: any;
    message?: string;
  };

  type PageParams = API.PageParams & {
    type_id?: number;
    workflow_id?: number;
  };

  type NodePageParams = API.PageParams & {
    type_id?: number;
    name?: string;
    action?: string;
  };

  type WorkflowFootprintOperator = {
    uid: number;
    nickname: string;
  }

  type WorkflowFootprint = {
    node: number;
    name: string;
    curr: boolean;
    explain: string;
    operators: WorkflowFootprintOperator[];
    time: string;
  }

  interface DetailContentRef {
    submit: () => Promise<WorkflowDetailRefResponse>;
    overrule: () => Promise<WorkflowDetailRefResponse>;
  }
}
