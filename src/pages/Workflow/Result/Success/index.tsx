import { Button, Card, Descriptions, Result, Space, Steps } from 'antd';
import type { FC } from 'react';
import { Fragment, useEffect, useState } from 'react';
import { GridContent } from '@ant-design/pro-layout';

import styles from './index.less';
import { history, useParams } from 'umi';
import { QueryFootprint, QueryWorkflowDetail } from '@/services/workflow/api';

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

  const [steps, setSteps] = useState<WorkflowAPI.WorkflowTypeStep[]>();
  const [curr, setCurr] = useState<number>(0);
  const [workflowId, setWorkflowId] = useState<number>(0);
  const [workflowDetail, setWorkflowDetail] = useState<any>();

  useEffect(() => {
    const { id } = routeParams;
    setWorkflowId(id);
    QueryFootprint(id).then((result) => {
      if (result.code === 1) {
        setSteps(result.data?.steps);
        setCurr(parseInt(result.data?.curr) - 1);
      }
    });
    QueryWorkflowDetail(id).then((result) => {
      if (result.code === 1) {
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
          {workflowDetail?.workflow?.user?.clerk?.nickname ?? ''}
        </Descriptions.Item>
        <Descriptions.Item label="发起时间">
          {workflowDetail?.workflow?.created_at ?? '-'}
        </Descriptions.Item>
      </Descriptions>
      <br />
      <Steps progressDot current={curr}>
        {steps?.map((item) => {
          if (item?.auditors) {
            return (
              <Step
                title={<span style={{ fontSize: 14 }}>{item.name}</span>}
                description={<Desc auditors={item.auditors} />}
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
