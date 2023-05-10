export const PROJECT_CREATE = 1,    // 项目创建者	0001 -> 1
  PROJECT_LEADER = 1 << 1,   // 项目负责人	0010 -> 2
  PROJECT_MEMBER = 1 << 2,   // 项目成员 0100 -> 4
  PROJECT_STAR = 1 << 3      // 项目收藏者 1000 -> 8

export const TASK_CREATOR = 1,// 任务创建者 00001 -> 1
  TASK_LEADER = 1 << 1,              // 任务负责人 00010 -> 2
  TASK_MEMBER = 1 << 2,             // 任务普通成员 00100 -> 4
  TASK_FOLLOW = 1 << 3,           // 任务关注者 01000 -> 8
  TASK_TESTER = 1 << 4      // 任务测试员 10000 -> 16
