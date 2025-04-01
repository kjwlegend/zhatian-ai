import { FileText, HelpCircle, LayoutDashboard, Library, MessageCircle, Users } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  items?: NavItem[];
};

// const navItems: NavItem[] = [
//   { href: '/about', label: '介绍', icon: <HelpCircle className="mr-2 h-4 w-4" /> },
//   { href: '/chats', label: '聊天', icon: <MessageCircle className="mr-2 h-4 w-4" /> },
//   { href: '/bd', label: 'BD助手', icon: <MessageCircle className="mr-2 h-4 w-4" /> },

//   {
//     href: '/workspace',
//     label: '工作区',
//     icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
//   },
//   {
//     href: '/market-place',
//     label: '组件市场',
//     icon: <Library className="mr-2 h-4 w-4" />,
//     // disabled: true,
//   },
//   { href: '/faq', label: '常见问题', icon: <FileText className="mr-2 h-4 w-4" /> },
//   { href: '/founders', label: '创始人', icon: <Users className="mr-2 h-4 w-4" /> },
// ];

export const navItems: NavItem[] = [
  {
    title: '介绍',
    href: '/about',
    icon: HelpCircle,
    items: [
      {
        title: '产品介绍',
        href: '/about',
        icon: HelpCircle,
        description: '产品介绍',
      },
      {
        title: '团队成员',
        href: '/founders',
        icon: Users,
        description: '团队成员介绍',
      },
    ],
  },
  {
    title: '聊天',
    href: '/chats',
    icon: MessageCircle,
  },
  {
    title: '项目助手',
    href: '/agents',
    icon: MessageCircle,
  },
  {
    title: 'BD助手',
    href: '/bd',
    icon: MessageCircle,
  },
  {
    title: '工作区',
    href: '/workspace',
    icon: LayoutDashboard,
    // items: [
    //   { title: '个人空间', href: '/workspace/personal', description: '管理您的个人项目和设置' },
    //   { title: '团队空间', href: '/workspace/team', description: '与团队成员协作的共享空间' },
    //   { title: '项目管理', href: '/workspace/projects', description: '查看和管理所有项目' },
    // ],
  },
  {
    title: 'UI-Compare',
    href: '/pixelCompare',
    icon: FileText,
  },
  {
    title: '组件市场',
    href: '/market-place',
    icon: Library,
    // items: [
    //   {
    //     title: '基础组件',
    //     href: '/market-place/basic',
    //     description: '常用的基础UI组件，包括按钮、表单等',
    //   },
    //   {
    //     title: '高级组件',
    //     href: '/market-place/advanced',
    //     description: '复杂的业务组件，包括数据表格、图表等',
    //   },
    //   {
    //     title: 'AI组件',
    //     href: '/market-place/ai',
    //     description: '智能化的AI组件，包括对话框、推荐系统等',
    //   },
    // ],
  },
  {
    title: '开发计划',
    href: '/roadmap',
    icon: FileText,
  },
  {
    title: '其他',
    href: '/others',
    icon: FileText,
    items: [
      {
        title: '常见问题',
        href: '/faq',
        icon: FileText,
      },
    ],
  },
];
