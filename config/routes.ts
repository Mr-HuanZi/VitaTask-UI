export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {name: '登录', path: '/user/login', component: './user/Login'},
      {component: './404'},
    ],
  },
  // 暂时不用 2023年5月6日
  {path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome', hideInMenu: true},
  {
    name: '工作流',
    icon: 'ProfileOutlined',
    path: '/workflow',
    routes: [
      { path: '/workflow', redirect: '/workflow/to-do' },
      { path: '/workflow/list', name: '我发起的', icon: 'smile', component: './Workflow' },
      { path: '/workflow/to-do', name: '我的待办', icon: 'smile', component: './Workflow/Todo' },
      {
        path: '/workflow/handled',
        name: '我的已办',
        icon: 'smile',
        component: './Workflow/Handled',
      },
      {
        path: '/workflow/statistics',
        name: '数据查看',
        icon: 'smile',
        component: './Workflow/Statistics',
        access: 'WorkflowAdmin',
      },
      {
        path: '/workflow/success/:id',
        name: '操作成功',
        icon: 'smile',
        component: './Workflow/Result/Success',
        hideInMenu: true,
      },
      {
        path: '/workflow/manage',
        name: '工作流管理',
        icon: 'smile',
        component: './Workflow/Manage',
        access: 'Admin',
      },
      {
        path: '/workflow/manage/nodes/:id',
        name: '工作流节点',
        icon: 'smile',
        component: './Workflow/Manage/Nodes',
        hideInMenu: true,
      },
      {
        path: '/workflow/detail/:id',
        name: '工作流详情',
        icon: 'smile',
        component: './Workflow/Detail',
        hideInMenu: true,
      },
      {
        path: '/workflow/initiate/:name',
        name: '发起工作流',
        icon: 'smile',
        component: './Workflow/Detail/Initiate',
        hideInMenu: true,
      },
    ],
  },
  {
    path: '/project',
    name: '项目',
    icon: 'ProjectOutlined',
    routes: [
      {path: '/project', name: '项目', component: './Project', icon: 'smile', hideInMenu: true},
      {path: '/project/detail/:id', name: '项目详情', component: './Project/Detail', icon: 'smile', hideInMenu: true},
    ]
  },
  {path: '/task', name: '任务', icon: 'ProfileOutlined', component: './Task'},
  {path: '/member', name: '成员', icon: 'TeamOutlined', component: './Member'},
  {
    path: '/account',
    name: '个人',
    icon: 'UserOutlined',
    hideInMenu: true,
    routes: [
      {path: '/account', redirect: '/account/center'},
      {path: '/account/settings', name: '个人设置', component: './account/settings', hideInMenu: true},
      {path: '/account/center', name: '个人中心', component: './account/center', hideInMenu: true},
    ],
  },
  {path: '/', redirect: '/account/center'},
  {component: './404'},
];
