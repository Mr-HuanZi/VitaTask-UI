import type {MutableRefObject} from 'react';
import type {ProFormInstance} from '@ant-design/pro-form';
import {API_OK} from "@/constants";
import {message} from "antd";
import moment from 'moment';

export type FormFieldSign = {
  file?: string[];
  select?: string[];
}

export function toArray(input: any) {
  if (input instanceof String) {
    if (input === '') return [];
    else return [input];
  } else if (input instanceof Number) {
    return [input];
  } else if (input instanceof Array) return input;
  else return [];
}

/**
 * 格式化上传文件列表
 * @param files
 */
export function formatUploadFiles(
  files: {
    uid: string;
    name: string;
    status?: string;
    response?: { code: number; data: any };
    url?: string;
    height?: number;
    width?: number;
    size?: number;
  }[],
): API.FileSimple[] {
  const format: API.FileSimple[] = [];
  for (const file of files) {
    if (file.status === 'done' && codeOk(file?.response?.code)) {
      format.push({
        url: file?.response?.data?.url ?? '',
        uid: file.uid,
        name: file.name,
        height: file?.response?.data?.height ?? file?.height ?? 0,
        width: file?.response?.data?.width ?? file?.width ?? 0,
        size: file?.response?.data?.size ?? file?.size ?? 0,
      });
    } else if (file?.url && !file?.response?.code) {
      // 一般情况下是后端返回的数据
      format.push({
        url: file?.url ?? '',
        uid: file?.uid ?? '',
        name: file?.name ?? '',
        height: file?.height ?? 0,
        width: file?.width ?? 0,
        size: file?.size ?? 0,
      });
    }
  }
  return format;
}

/**
 * 格式化字典数据并且过滤表单
 * @param values
 */
export function formatDictAndFilter(values: any) {
  for (const valuesKey in values) {
    if (!values.hasOwnProperty(valuesKey)) continue;

    const t = values[valuesKey];
    // 字典多选
    if (t instanceof Array) {
      const res: number[] = [];
      let skip: boolean = false;
      // 如果是数组
      for (const value of t) {
        if (typeof value === 'object' && 'value' in value && 'name' in value) {
          res.push(value.value);
        } else {
          // 如果不是上面的结构，就没必要继续了
          skip = true;
          break;
        }
      }
      // 如果被跳过，说明不是这该函数需要的结构
      if (!skip) {
        values[valuesKey] = res;
      }
    } else if (typeof t === 'object' && 'value' in t && 'name' in t) {
      // 字典单选
      // 如果是下拉菜单结构
      values[valuesKey] = t.value;
    } else {
      // 非字典表单过滤空置
      if (t === '[]' || t === '{}') {
        values[valuesKey] = ''; // 如果是空数组或空对象
      }
    }
  }
  return values;
}

/**
 * 判断变量是否为空
 * @param v
 * @returns {boolean}
 */
export function isEmpty(v: any) {
  switch (typeof v) {
    case 'undefined':
      return true;
    case 'string':
      if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
      break;
    case 'boolean':
      if (!v) return true;
      break;
    case 'number':
      if (0 === v || isNaN(v)) return true;
      break;
    case 'object':
      if (null === v || v.length === 0) return true;
      for (const i in v) {
        if (!v.hasOwnProperty(i)) continue;
        return false;
      }
      return true;
    case 'bigint':
    case 'symbol':
    case 'function': {
      throw new Error('不支持的类型');
    }
  }
  return false;
}

/**
 * 根据Ref来设置ProForm表单值
 * @param ref
 * @param input
 */
export function setProFormDataByRef(
  ref: MutableRefObject<ProFormInstance | undefined>,
  input: any,
) {
  const formData: any = {};
  const data = ref.current?.getFieldsValue();
  for (const dataKey in data) {
    if (!data.hasOwnProperty(dataKey)) continue;

    if (!isEmpty(input?.[dataKey])) formData[dataKey] = input[dataKey];
  }

  ref.current?.setFieldsValue(formData);
}

/**
 * 组装单个表单
 * @param formData
 * @param fieldSign
 * @param callback
 */
export async function assembleSingleFormData(
  formData: object,
  fieldSign?: FormFieldSign,
  callback?: (values: any) => any,
) {
  // 深拷贝参数，避免修改了源对象
  const formDataFormat = Object.assign({}, formData);
  // 字段标记处理
  if (fieldSign?.file) {
    // 文件上传处理
    for (const string of fieldSign.file) {
      if (formDataFormat.hasOwnProperty(string)) // 属性是否存在
        formDataFormat[string] = formatUploadFiles(formDataFormat[string]);
    }
  }
  if (fieldSign?.select) {
    // 下拉选择框组件处理
    for (const string of fieldSign.select) {
      if (formDataFormat.hasOwnProperty(string)) // 属性是否存在
        formDataFormat[string] = getProSelectComponentValue(formDataFormat[string]);
    }
  }

  // 回调函数处理
  if (callback)
    return callback(formDataFormat);

  return formDataFormat;
}

/**
 * 组装多个表单
 * @param refList
 * @param fileField
 * @param callback
 * @param globalCallback
 */
export async function assembleMultipleFormData(
  refList?: Record<string, MutableRefObject<ProFormInstance | undefined>>,
  fileField?: Record<string, FormFieldSign>,
  callback?: Record<string, (values: any) => any>,
  globalCallback?: (values: any) => any,
) {
  const formDataFormat: any = {};

  for (const refKey in refList) {
    if (!refList.hasOwnProperty(refKey)) continue;

    // 获取表单数据
    const formData = await refList[refKey].current?.validateFieldsReturnFormatValue?.();

    formDataFormat[refKey] = assembleSingleFormData(
      formData,
      fileField?.[refKey] ?? undefined,
      callback?.[refKey] ?? undefined,
    );
  }

  if (globalCallback)
    return globalCallback(formDataFormat);

  return formDataFormat;
}

/**
 * 根据Key去重
 * @param data
 * @param key
 */
export function objectUnique(data: any, key: string): any {
  const obj: Record<string, boolean> = {};
  return data.reduce((item: any[], next: any) => {
    if (!obj[next[key]]) {
      item.push(next);
      obj[next[key]] = true;
    }
    return item;
  }, []);
}

/**
 * 组装ProSelect组件的值
 * @param data 要处理的值。是数组就返回数组，不是数组就返回对象
 * @param fieldMap
 */
export function proSelectComponentAssembleValue(
  data: any,
  fieldMap: { value: string; label: string } = { value: "value", label: "label" },
) {
  if (!isEmpty(data)) {
    if (Array.isArray(data)) {
      return data.map((item: any) => {
        return { value: item?.[fieldMap.value], label: item?.[fieldMap.label] };
      });
    } else {
      return { value: data?.[fieldMap.value], label: data?.[fieldMap.label] };
    }
  }
  return data;
}

/**
 * 获取ProSelect组件的值
 * @param options
 * @param fieldMap
 */
export function getProSelectComponentValue(
  options: any,
  fieldMap: { value: string } = { value: 'value' },
) {
  if (!isEmpty(options)) {
    if (Array.isArray(options)) {
      return options.map((item: any) => {
        if (typeof item === 'string' || typeof item === 'number') return item;

        return item?.[fieldMap.value];
      });
    } else if (typeof options === 'string' || typeof options === 'number') {
      return options;
    } else {
      return options?.[fieldMap.value];
    }
  }
  return undefined;
}

/**
 * 状态码是否OK
 * @param code
 */
export function codeOk(code?: number) {
  return code === API_OK;
}

/**
 * 操作成功提醒
 */
export function successMessage() {
  message.success('操作成功').then();
}

/**
 * 失败提醒
 * @param msg
 */
export function errorMessage(msg?: string) {
  message.error(msg ?? '操作失败').then();
}

/**
 * 将驼峰转换成 _ ，例如 snakeCase 转换成 snake_case
 * @param str
 */
export function snake(str: string) {
  return str
    .replace(/[A-Z]/g, function (s) {
      return ' ' + s.toLowerCase();
    })
    .trim()
    .replaceAll(' ', '_');
}

/**
 * 下划线转小驼峰
 * @param str
 */
export function camel(str: string) {
  return str.toLowerCase().replace(/_([a-z])/g, function (s, s1) {
    return s1.toUpperCase();
  });
}

/**
 * XHR或Fetch文件下载
 * @param r 二进制文件
 * @param filePrefix 文件前缀
 * @param fileSuffix 文件后缀
 * @param fileName 完整文件名。如果传入该参数则filePrefix与fileSuffix失效
 */
export function fetchFileDownload(
  r: any,
  filePrefix?: string,
  fileSuffix?: string,
  fileName?: string,
) {
  const blob = new Blob([r]);
  const objectURL = URL.createObjectURL(blob);
  let btn: HTMLAnchorElement | null = document.createElement('a');
  if (fileName) {
    btn.download = fileName;
  } else {
    btn.download = `${filePrefix}-${new Date().getTime()}.${fileSuffix}`;
  }
  btn.href = objectURL;
  btn.click();
  URL.revokeObjectURL(objectURL);
  btn = null;
}

/**
 * 时间戳转字符串
 * @param time 时间数组
 * @param format 输出格式
 * @param inputFormat 输入格式，默认是毫秒时间戳
 */
export function timestampToString(
  time: string | number | (number | string)[],
  format: string = 'YYYY-MM-DD HH:mm:ss',
  inputFormat: string = 'x',
) {
  if (Array.isArray(time)) {
    return time.map(function (item) {
      return moment(item, inputFormat).format(format);
    });
  }

  return moment(time, inputFormat).format(format);
}
