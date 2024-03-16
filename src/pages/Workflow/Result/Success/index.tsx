import { Button, Card, Descriptions, Result, Space, Steps } from 'antd';
import type { FC } from 'react';
import { Fragment, useEffect, useState } from 'react';
import { GridContent } from '@ant-design/pro-layout';

import styles from './index.less';
import { history, useParams } from 'umi';
import {fetchWorkflowDetail, QueryFootprint} from '@/services/workflow/api';
import {codeOk} from "@/units";
import moment from "moment/moment";

const { Step } = Steps;

const Desc: FC<{ auditors: any }> = ({ auditors }) => {
  return (
    <div className={styles.title}>
      <div style={{ margin: '8px 0 4px' }}>
        <Space>{auditors}</Space>
      </div>
    </div>
  );
};

const Success: FC = () => {
  const routeParams: any = useParams();

  const [nodes, setNodes] = useState<WorkflowAPI.WorkflowNode[]>();
  const [curr, setCurr] = useState<number>(0);
  const [workflowId, setWorkflowId] = useState<number>(0);
  const [workflowDetail, setWorkflowDetail] = useState<any>();

  useEffect(() => {
    const { id } = routeParams;
    setWorkflowId(id);
    QueryFootprint(id).then((result) => {
      if (codeOk(result.code)) {
        setNodes(result.data?.nodes);
        setCurr(parseInt(result.data?.curr) - 1);
      }
    });
    fetchWorkflowDetail(id).then((result) => {
      if (codeOk(result.code)) {
        const { data } = result;
        setWorkflowDetail(data ?? {});
      }
    });
  }, [routeParams]);

  const extra = (
    <Fragment>
      <Button
        type="primary"
        onClick={() => {
          history.push('/workflow/to-do');
        }}
      >
        待办列表
      </Button>
      <Button
        onClick={() => {
          history.push(`/workflow/detail/${workflowId}`);
        }}
      >
        查看项目
      </Button>
    </Fragment>
  );

  const content = (
    <>
      <Descriptions title={workflowDetail?.workflow?.title ?? ''}>
        <Descriptions.Item label="项目编号">
          {workflowDetail?.workflow?.serials ?? '-'}
        </Descriptions.Item>
        <Descriptions.Item label="发起人">
          {workflowDetail?.workflow?.nickname ?? ''}
        </Descriptions.Item>
        <Descriptions.Item label="发起时间">
          {
            workflowDetail?.workflow?.create_time ?
              moment(workflowDetail?.workflow?.create_time).format('YYYY-MM-DD HH:mm:ss') : '-'
          }
        </Descriptions.Item>
      </Descriptions>
      <br />
      <Steps progressDot current={curr}>
        {nodes?.map((item) => {
          if (item?.name) {
            return (
              <Step
                title={<span style={{ fontSize: 14 }}>{item.name}</span>}
                description={<Desc auditors={item.name} />}
              />
            );
          } else return <Step title={<span style={{ fontSize: 14 }}>{item.name}</span>} />;
        })}
      </Steps>
    </>
  );

  return (
    <GridContent>
      <Card bordered={false}>
        <Result status="success" title="提交成功" extra={extra} style={{ marginBottom: 16 }}>
          {content}
        </Result>
      </Card>
    </GridContent>
  );
};

export default Success;
