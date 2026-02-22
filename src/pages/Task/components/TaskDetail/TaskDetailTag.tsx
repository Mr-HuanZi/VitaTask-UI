import React, {FC, useCallback, useState} from "react";
import styles from "@/pages/Task/components/TaskDetail/index.less";
import {Button, Card, Col, Form, FormProps, Row, Space, Tag, Typography, Radio} from "antd";
import UserItem from "@/components/UserItem";
import moment from "moment/moment";
import MemberSelect from "@/components/MemberSelect";
import WEditor from "@/components/WEditor";
import {TaskAPI} from "@/services/task/typings";
import TaskInfo from "./TaskInfo";
import type { CheckboxGroupProps } from 'antd/es/checkbox';

const { Paragraph, Text, Title } = Typography;

interface TaskInfoDomProps {
  taskData: TaskAPI.Task;
}

const options: CheckboxGroupProps<string>['options'] = [
  { label: '实现中（当前）', value: 'Apple', className: 'label-1' },
  { label: '已实现', value: 'Pear', className: 'label-2' },
  { label: '已拒绝', value: 'Orange', title: 'Orange', className: 'label-3' },
];

const TaskDetailTag: FC<TaskInfoDomProps> = (props) => {
  const { taskData } = props;

  const [commentHtml, setCommentHtml] = useState<string>('');

  const handleFormFinish: FormProps['onFinishFailed'] = useCallback((formData) => {
    console.log('Submit: ',formData);
    console.log('commentHtml:', commentHtml);
    console.log('taskData:', taskData);
  }, [taskData]);

  return (
    <>
      <div className={styles.header}>
        <Title level={4}>
          { taskData?.id && <Tag color="blue">{taskData?.id}</Tag> }
          { taskData?.title }
        </Title>
        <Space size="small" className={styles.content}>
          <UserItem users={taskData?.creator?.user_info} />
          <Text type="secondary">
            创建于{moment(taskData?.create_time).format('YYYY年M月D日 HH:mm')}，最后更新于
            {moment(taskData?.update_time).format('YYYY年M月D日 HH:mm')}
          </Text>
        </Space>
      </div>
      <Row>
        <Col xxl={17} xl={15} md={12} xs={24}>
          <Text type="secondary" strong>描述：</Text>
          <div className={styles.describe}><Paragraph><div dangerouslySetInnerHTML={{ __html: taskData?.describe ?? '' }} /></Paragraph></div>
        </Col>
        <Col xxl={7} xl={9} md={12} xs={24}>
          <TaskInfo
            leaderInfo={taskData?.leader?.user_info}
            collaborator={taskData?.collaborator}
            projectName={taskData?.project?.name ?? ''}
            groupName={taskData?.group?.name ?? ''}
            planTime={taskData?.plan_time ?? []}
          />
        </Col>
      </Row>
      <Card variant="borderless">
        <Form
          name="nextData"
          onFinish={handleFormFinish}
          autoComplete="off"
        >
          <Form.Item label="流转到">
            <Radio.Group options={options} optionType="button" name="step" />
          </Form.Item>
          <Form.Item
            label="处理人"
            name="handle_user_id"
            rules={[{required: true, message: '请选择处理人'}]}
            wrapperCol={{span: 6}}
          >
            <MemberSelect />
          </Form.Item>
          <Form.Item label="评论">
            <WEditor
              border
              height="150px"
              html={commentHtml}
              onChange={(e) => setCommentHtml(e.getHtml())}
            />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              流转
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default TaskDetailTag;
