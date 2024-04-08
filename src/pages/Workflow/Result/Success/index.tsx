import { Button, Card, Descriptions, Divider, Result, Space, Steps, Typography } from 'antd';
import type { FC, SetStateAction} from 'react';
import {Fragment, useEffect, useState} from 'react';
import {GridContent} from '@ant-design/pro-layout';

import styles from './index.less';
import {history, useParams} from 'umi';
import {fetchWorkflowDetail, QueryFootprint} from '@/services/workflow/api';
import {codeOk} from "@/units";
import moment from "moment/moment";

const {Step} = Steps;

const Desc: FC<{ operators?: WorkflowAPI.WorkflowFootprintOperator[], explain?: string }> = ({operators, explain}) => {
  return (
    <div className={styles.title}>

      {
        operators && (
          <div style={{margin: '8px 0 4px'}}>
            <Space split={<Divider type="vertical" />}>
            {
              operators.map(item => <Typography.Link key={item.uid}>{item.nickname}</Typography.Link>)
            }
            </Space>
          </div>
        )
      }
      {
        explain && <div>操作说明：{explain}</div>
      }
    </div>
  );
};

const Success: FC = () => {
  const routeParams: any = useParams();

  const [footprint, setFootprint] = useState<WorkflowAPI.WorkflowFootprint[]>();
  const [curr, setCurr] = useState<number>(0);
  const [workflowId, setWorkflowId] = useState<number>(0);
  const [workflowDetail, setWorkflowDetail] = useState<any>();

  useEffect(() => {
    const {id} = routeParams;
    setWorkflowId(id);
    QueryFootprint(parseInt(id)).then((result) => {
      if (codeOk(result.code)) {
        const d = result?.data ?? [];
        setFootprint(d);
        // SetStateAction<number> 是IDE给的，我也不知道为啥
        d.map((item: WorkflowAPI.WorkflowFootprint, index: SetStateAction<number>) => {
          if (item.curr) {
            setCurr(index);
          }
        });
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
      <Steps progressDot current={workflowDetail?.workflow?.status === 1 ? (footprint ? footprint.length - 1 : 0) : curr}>
        {footprint?.map((item) => {
          if (item?.name) {
            return (
              <Step
                title={<span style={{ fontSize: 14 }}>{item.name}</span>}
                description={<Desc operators={item.operators} explain={item?.explain} />}
                subTitle={item?.time ? moment(item.time).format('YYYY-MM-DD HH:mm') : undefined}
              />
            );
          } else return <Step title={<span style={{ fontSize: 14 }}>未知</span>} />;
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
