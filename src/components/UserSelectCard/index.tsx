import type {CSSProperties} from 'react';
import React, {useEffect, useState} from 'react';
import {ProFormText, QueryFilter, CheckCard} from '@ant-design/pro-components';
import {MemberLists} from '@/services/member/api';
import {Avatar, Modal, Pagination} from 'antd';
import type {FormLayout} from 'antd/lib/form/Form';
import {errorMessage} from "@/units";

interface UserSelectCardPropsI {
  onConfirm: (values: MemberAPI.Member[]) => void;
  multiple?: boolean;
  // 是否在浮层显示
  modalWidth?: string | number;
  // 浮层的显示状态
  visible?: boolean;
  // 关闭浮层的回调
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
  style?: CSSProperties;
  layout?: FormLayout;
  // 设置 Modal 的 z-index
  zIndex?: number;
}

const UserSelectCard: React.FC<UserSelectCardPropsI> = ({
                                                          multiple = false,
                                                          visible = false,
                                                          onCancel,
                                                          onConfirm,
                                                          style,
                                                          modalWidth = '60vw',
                                                          layout = 'horizontal',
                                                          zIndex = 1000,
                                                        }) => {
  const [userList, setUserList] = useState<MemberAPI.Member[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [queryParams, setQueryParams] = useState<any>(0);

  const getUserList = () => {
    setLoading(true);
    MemberLists({
      page: current,
      pageSize: pageSize,
      ...queryParams,
    }).then((result) => {
      const { data, code, message: msg } = result;
      if (code === 200) {
        setUserList(data?.items ?? []);
        setTotal(data?.total ?? 0);
      } else {
        errorMessage(msg);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    setCurrent(1);
  }, []);

  useEffect(() => {
    getUserList();
  }, [current, pageSize, queryParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConfirm = () => {
    if (selected.length <= 0) onConfirm([]);
    else {
      onConfirm(
        userList.filter(function (item) {
          return selected.indexOf(item.id, 0) !== -1;
        }),
      );
    }
  };

  return (
    <Modal
      open={visible}
      title="选择成员"
      width={modalWidth}
      onCancel={onCancel}
      onOk={handleConfirm}
      style={style}
      bodyStyle={{ maxHeight: '600px', overflowY: 'auto' }}
      zIndex={zIndex}
    >
      <QueryFilter<{
        name: string;
        company: string;
      }>
        onFinish={async (values) => {
          setCurrent(1); // 每次搜索后重置为第1页
          setQueryParams(values);
        }}
        layout={layout}
        collapsed={false}
      >
        <ProFormText name="username" label="用户名" />
        <ProFormText name="nickname" label="昵称" />
        <ProFormText name="email" label="邮箱" />
      </QueryFilter>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <CheckCard.Group
          loading={loading}
          multiple={multiple}
          onChange={(value) => {
            // 单选模式时 value 是一个数字
            const ids: number[] = multiple ? [...(value as number[])] : [value as number];
            setSelected(ids);
          }}
        >
          {userList?.map((item) => {
            return (
              <CheckCard
                key={item.id}
                title={item.userNickname ?? ''}
                value={item.id}
                avatar={<Avatar src={item.avatar} size="large" />}
              />
            );
          })}
        </CheckCard.Group>
      </div>
      <Pagination
        current={current}
        onChange={(page, currPageSize) => {
          setPageSize(currPageSize);
          setCurrent(page);
        }}
        total={total}
        size="small"
      />
    </Modal>
  );
};

export default UserSelectCard;
