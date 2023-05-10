import {Request, Response} from 'express';

const getTaskCompletionRateList = (req: Request, res: Response) => {
  res.json({
    code: 200,
    data: [
      {
        "country": "已完成",
        "date": "2023-03-01",
        "value": 5
      },
      {
        "country": "已完成",
        "date": "2023-03-02",
        "value": 8
      },
      {
        "country": "已完成",
        "date": "2023-03-03",
        "value": 3
      },
      {
        "country": "已完成",
        "date": "2023-03-04",
        "value": 0
      },
      {
        "country": "已完成",
        "date": "2023-03-05",
        "value": 0
      },
      {
        "country": "已完成",
        "date": "2023-03-06",
        "value": 10
      },
      {
        "country": "已完成",
        "date": "2023-03-07",
        "value": 4
      },
      {
        "country": "已完成",
        "date": "2023-03-08",
        "value": 6
      },
      {
        "country": "已完成",
        "date": "2023-03-09",
        "value": 9
      },
      {
        "country": "已完成",
        "date": "2023-03-10",
        "value": 5
      },
      {
        "country": "未完成",
        "date": "2023-03-01",
        "value": 10
      },
      {
        "country": "未完成",
        "date": "2023-03-02",
        "value": 5
      },
      {
        "country": "未完成",
        "date": "2023-03-03",
        "value": 8
      },
      {
        "country": "未完成",
        "date": "2023-03-04",
        "value": 10
      },
      {
        "country": "未完成",
        "date": "2023-03-05",
        "value": 9
      },
      {
        "country": "未完成",
        "date": "2023-03-06",
        "value": 18
      },
      {
        "country": "未完成",
        "date": "2023-03-07",
        "value": 15
      },
      {
        "country": "未完成",
        "date": "2023-03-08",
        "value": 10
      },
      {
        "country": "未完成",
        "date": "2023-03-09",
        "value": 1
      },
      {
        "country": "未完成",
        "date": "2023-03-10",
        "value": 2
      },
      {
        "country": "新增",
        "date": "2023-03-01",
        "value": 2
      },
      {
        "country": "新增",
        "date": "2023-03-02",
        "value": 8
      },
      {
        "country": "新增",
        "date": "2023-03-03",
        "value": 1
      },
      {
        "country": "新增",
        "date": "2023-03-04",
        "value": 3
      },
      {
        "country": "新增",
        "date": "2023-03-05",
        "value": 8
      },
      {
        "country": "新增",
        "date": "2023-03-06",
        "value": 4
      },
      {
        "country": "新增",
        "date": "2023-03-07",
        "value": 2
      },
      {
        "country": "未完成",
        "date": "2023-03-08",
        "value": 1
      },
      {
        "country": "新增",
        "date": "2023-03-09",
        "value": 5
      },
      {
        "country": "新增",
        "date": "2023-03-10",
        "value": 7
      },
    ],
    msg: "操作成功",
  });
};

export default {
  'POST /v1/mock/task/completion-rate': getTaskCompletionRateList,
};
