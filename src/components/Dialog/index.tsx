import React, {useEffect, useRef, useState} from "react";
import type {ProFormInstance} from "@ant-design/pro-form";
import {ProForm, ProFormTextArea} from "@ant-design/pro-form";
import styles from "./index.less";
import DialogList from "@/components/Dialog/DialogList";
import type {DialogItemProps} from "@/components/Dialog/DialogItem";
import {dialogMsgList, dialogSendText} from "@/services/dialog/api";
import {codeOk, errorMessage, timestampToString} from "@/units";
import {useModel} from "@@/plugin-model/useModel";

interface DialogProps {
  dialogId?: number;
}

const Dialog: React.FC<DialogProps> = ({dialogId}) => {
  const formRef = useRef<ProFormInstance>();
  const {messages} = useModel('chat');

  const [dialogList, setDialogList] = useState<DialogItemProps[]>([]);

  /**
   * 处理消息列表
   * @param data
   */
  function handleDialogList(data: DialogAPI.DialogMsg[]) {
    const msgList = data.map((item: DialogAPI.DialogMsg) => {
      // 转换时间戳
      let timestamp: string|string[] = timestampToString(item.create_time);
      if (Array.isArray(timestamp)) {
        timestamp = timestamp.shift() ?? '-'
      }
      return {
        author: item?.user_info?.userNickname ?? '-',
        avatar: item?.user_info?.avatar ?? '',
        content: item.content,
        datetime: timestamp,
        userId: item.user_id,
        id: item.id,
      }
    });
    setDialogList(list => [
      ...list,
      ...msgList
    ]);
  }

  useEffect(() => {
    // 先清空对话列表
    setDialogList([]);
    if (dialogId && dialogId > 0) {
      dialogMsgList(dialogId).then(({code, data}) => {
        if (codeOk(code) && data) {
          handleDialogList(data);
        }
      });
    }
  }, [dialogId]);

  useEffect(() => {
    if (messages && messages?.module === 'chat') {
      console.log(messages);
      handleDialogList([messages.data]);
    }
  }, [messages]);

  const onFinish = async (formData: any) => {
    if (!dialogId) {
      errorMessage('该任务未创建对话，无法发送消息');
      return;
    }
    dialogSendText({
      dialog_id: dialogId,
      content: formData?.message ?? '',
    }).then(({code, data}) => {
      if (codeOk(code) && data) {
        handleDialogList([data]);
        formRef.current?.resetFields();
      }
    });
  }

  return (
    <div className={styles.wrapper}>
      <DialogList
        dataSource={dialogList}
      />
      <ProForm
        formRef={formRef}
        onFinish={onFinish}
        isKeyPressSubmit={false}
        autoFocusFirstInput={true}
        submitter={{
          resetButtonProps: false,
          submitButtonProps: {style: {padding: "0 30px"}},
          searchConfig: {submitText: '发送',},
          render: (_, dom) => (<div className={'flex-end'}>{dom}</div>)
        }}
      >
        <ProFormTextArea name="message"/>
      </ProForm>
    </div>
  );
}


export default Dialog;
