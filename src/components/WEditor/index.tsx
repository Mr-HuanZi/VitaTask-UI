import type {CSSProperties} from 'react';
import React, {useEffect, useState} from 'react';
import '@wangeditor/editor/dist/css/style.css';
import {Editor, Toolbar} from '@wangeditor/editor-for-react';
import type {IDomEditor, IEditorConfig, IToolbarConfig} from '@wangeditor/editor';
import './index.less';
import {codeOk, errorMessage} from "@/units";

interface WEditorPropsI {
  onChange: (e: IDomEditor) => void;
  html?: string;
  style?: CSSProperties | undefined;
  border?: boolean;
  height?: string;
}

type InsertFnType = (url: string, alt: string, href: string) => void;

const WEditor: React.FC<WEditorPropsI> = ({
                                            html,
                                            style,
                                            border = false,
                                            onChange,
                                            height = '500px',
                                          }) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null); // 存储 editor 实例
  const [wrapStyle, setWrapStyle] = useState<CSSProperties>({ zIndex: 100 });
  const [value, setValue] = useState<string>('');

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {};

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    MENU_CONF: {
      // 图片上传
      uploadImage: {
        server: '/v1/files/upload?type=image',
        headers: { Authorization: localStorage.getItem('Authorization') ?? '' },
        maxFileSize: 50 << 20, // 50M
        base64LimitSize: 5 * 1024, // 如果文件大小小于5kb，则插入base64格式
        fieldName: 'file',
        // 超时时间，默认为 10 秒
        timeout: 30 * 1000, // 30 秒
        // 自定义插入图片
        customInsert(res: API.CResult<API.FileVo>, insertFn: InsertFnType) {
          const { data, code, message: msg } = res;
          if (!codeOk(code) || !data) {
            errorMessage(msg);
            return;
          }
          // 缩略图放在 src
          insertFn(data.file_path, data.file_tag, data?.file_path ?? '#');
        },
      },
      // 视频上传
      // 超时默认为30秒，这个应该不用修改
      uploadVideo: {
        server: '/v1/files/upload?type=media',
        headers: { Authorization: localStorage.getItem('Authorization') ?? '' },
        maxFileSize: 100 << 20, // 100M
        fieldName: 'file',
        // 自定义插入图片
        customInsert(res: API.CResult<API.FileVo>, insertFn: any) {
          const { data, code, message: msg } = res;
          if (!codeOk(code) || !data) {
            errorMessage(msg);
            return;
          }
          // 缩略图放在 src
          insertFn(data?.file_path);
        },
      },
    },
  };

  // 及时销毁 editor
  useEffect(() => {
    if (border) {
      setWrapStyle({ ...wrapStyle, border: '1px solid #ccc' });
    }
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor, border]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setValue(html ?? '');
  }, [html]);

  return (
    <div style={{ ...wrapStyle, ...style }}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: '1px solid #ccc' }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={value}
        onCreated={setEditor}
        onChange={onChange}
        mode="default"
        style={{ height: height }}
      />
    </div>
  );
};

export default WEditor;
