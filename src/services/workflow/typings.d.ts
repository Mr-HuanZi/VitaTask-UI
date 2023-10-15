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
    node_info?: WorkflowNode;
    operator?: WorkflowAuditor[];
    submit_num: number;
    create_time?: string;
    update_time?: string;
  };

  type WorkflowType = {
    id: number;
    name: string;
    illustrate: string;
    org_id: number;
    only_name: string;
    system: number;
    created_at: string;
    updated_at?: string;
  };

  type WorkflowNode = {
    id: number;
    workflow_type_id: number;
    name: string;
    step: number;
    action?: string;
    action_value?: number | number[];
    condition?: string;
    condition_fail?: string;
    everyone?: number;
    created_at?: string;
    updated_at?: string;
    [x: string]: any[];
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

  type WorkflowAuditor = {
    id: number;
    step: number;
    workflow_id: number;
    userid: number;
    nickname: string;
    handled: number;
    created_at?: string;
    updated_at?: string;
  };

  type WorkflowDetail = {
    [x: string]: any[];
    workflow: Workflow;
    workflowData: any;
    workflowType: WorkflowType;
    currAuditors: WorkflowAuditor[];
    currStep: WorkflowTypeStep;
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

  interface DetailContentRef {
    submit: () => Promise<WorkflowDetailRefResponse>;
    overrule: () => Promise<WorkflowDetailRefResponse>;
  }
}
