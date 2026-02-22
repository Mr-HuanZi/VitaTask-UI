import React, {forwardRef, useEffect, useRef, useState} from "react";
import {Select} from "antd";
import type {SelectProps, RefSelectProps} from 'antd';
import {QueryMemberSimpleLists} from "@/services/member/api";
import {codeOk, errorMessage, objectUnique} from "@/units";

// 使用 ComponentPropsWithoutRef 获取不含 ref 和 children 的 props
type BaseSelectProps = Omit<SelectProps<number | number[]>, 'onChange' | 'children'>;

export interface MemberSelectProps extends BaseSelectProps {
  multiple?: boolean;
  onChange?: (
    value: number | number[],
    members: MemberAPI.Simple[]
  ) => void;
}

const MemberSelect = forwardRef<RefSelectProps, MemberSelectProps>(
  (props, ref) => {
    const {
      multiple,
      onChange,
      ...rest
    } = props;

    // 记录组件的卸载状态
    const mountedRef = useRef(false);

    const [loading, setLoading] = useState(false);
    const [memberList, setMemberList] = useState<MemberAPI.Simple[]>([]);

    const getUserList = () => {
      setLoading(true);
      QueryMemberSimpleLists().then((r: API.CResult<any>) => {
        if (!mountedRef.current) return; // 组件已卸载，不执行

        const {data, code, message: msg} = r;
        if (codeOk(code)) {
          setMemberList(objectUnique([...memberList, ...(data ?? [])], 'value'));
        } else {
          errorMessage(msg);
        }
        setLoading(false);
      });
    };

    const handleChange: SelectProps['onChange'] = (val: number | number[]) => {
      if (onChange) {
        const members: MemberAPI.Simple[] = memberList.filter(member =>
          Array.isArray(val)
            ? val.includes(member.value)
            : member.value === val
        );
        onChange(val, members);
      }
    };

    useEffect(() => {
      mountedRef.current = true; // 先设置，再发起请求
      getUserList();

      return () => {
        // 组件被卸载
        mountedRef.current = false;
      };
    }, []);

    return (
      <Select
        ref={ref}
        {...rest}
        mode={multiple ? 'multiple' : undefined}
        options={memberList}
        loading={loading}
        onChange={handleChange}
      />
    )
  })

export default MemberSelect;
