import type {FC} from 'react';
import {useEffect, useRef, useState} from 'react';
import {ProFormSelect} from '@ant-design/pro-form';
import type {ProFormSelectProps} from '@ant-design/pro-form/lib/components/Select';
import {Avatar, Space, Typography} from 'antd';
import {QueryMemberSimpleLists} from '@/services/member/api';
import {debounce} from 'lodash';
import {codeOk, errorMessage, objectUnique} from '@/units';

const { Text } = Typography;

interface MemberProSelectPropsI {
  multiple?: boolean;
  onChange?: (members: MemberAPI.Simple[]) => void;
  pageSize?: number;
}

type queryParam = {
  page: number;
  pageSize: number;
  nickname?: string,
  mobile?: string,
}

const MemberProSelect: FC<MemberProSelectPropsI & ProFormSelectProps> = (props) => {
  const { multiple = false, onChange, pageSize = 10 } = props;

  // 记录组件的卸载状态
  const mountedRef = useRef(false);

  const [loading, setLoading] = useState(false);
  const [memberList, setMemberList] = useState<MemberAPI.Simple[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [queryParams, setQueryParams] = useState<queryParam>({page: 1, pageSize: pageSize});

  const getUserList = () => {
    setLoading(true);
    QueryMemberSimpleLists(queryParams).then((r: API.CResult<any>) => {
      if (!mountedRef.current) return; // 组件已卸载，不执行

      const { data, code, message: msg } = r;
      if (codeOk(code)) {
        if (data?.items) {
          // 分页数据
          setMemberList(objectUnique([...memberList, ...(data?.items ?? [])], 'value'));
          setTotal(data?.total ?? 0);
        } else {
          // 无分页
          setMemberList(objectUnique([...memberList, ...(data ?? [])], 'value'));
          setTotal(data?.length ?? 0);
        }
      } else {
        errorMessage(msg);
      }
      setLoading(false);
    });
  };

  const scrollEnd = (e: { persist?: any; target?: any }) => {
    e.persist();
    const { target } = e;
    // 滚动 触底 看接口是否还有剩余的值没传过来
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      if (queryParams.page * queryParams.pageSize < total) {
        setQueryParams({
          ...queryParams,
          page: 1,
        });
      }
    }
  };

  // 搜索条件变化时
  const searchDataset = (value: any) => {
    setQueryParams({
      ...queryParams,
      nickname: value,
      mobile: value,
      page: 1, // 当前页数更改为 1
    });
  };

  useEffect(() => {
    getUserList();
  }, [queryParams]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      // 组件被卸载
      mountedRef.current = false;
    };
  }, []);

  return (
    <ProFormSelect
      {...props}
      mode={multiple ? 'multiple' : 'single'}
      // @ts-ignore
      options={memberList}
      fieldProps={{
        loading: loading,
        optionItemRender: (item: MemberAPI.Simple) => {
          return (
            <Space>
              <Avatar src={item?.avatar ?? ''} />
              <Text>
                {item?.label ?? ''}-{item?.text ?? ''}
              </Text>
            </Space>
          );
        },
        onChange: (value) => {
          if (onChange) {
            const members: MemberAPI.Simple[] = [];
            for (const member of memberList) {
              if (Array.isArray(value)) {
                if (value.indexOf(member.value) !== -1) {
                  members.push(member);
                }
              } else {
                // @ts-ignore
                if (member.id === value) {
                  members.push(member);
                }
              }
            }
            onChange(members);
          }
        },
        onPopupScroll: scrollEnd,
        onSearch: debounce(searchDataset, 500),
      }}
    />
  );
};

export default MemberProSelect;
