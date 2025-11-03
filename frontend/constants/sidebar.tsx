import {
  DashboardOutlined,
  AppstoreOutlined,
  TeamOutlined,
  SolutionOutlined,
  UserAddOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  ProfileOutlined,
} from '@ant-design/icons';

export const adminSidebarItems = [
  {
    id: 1,
    name: 'Overview',
    href: '/admin',
    icon: <DashboardOutlined />,
  },
   {
    id: 2,
    name: 'Users',
    href: '/admin/users',
    icon: <UserAddOutlined />,
  },
  {
    id: 3,
    name: 'Programs',
    href: '/admin/programs',
    icon: <AppstoreOutlined />,
  },
  {
    id: 4,
    name: 'Patients',
    href: '/admin/patients',
    icon: <TeamOutlined />,
  },
  {
    id: 5,
    name: 'Enrollments',
    href: '/admin/enrollments',
    icon: <SolutionOutlined />,
  },
];

export const staffSidebarItems = [
  {
    id: 1,
    name: 'Overview',
    href: '/staff',
    icon: <DashboardOutlined />,
  },
  {
    id: 2,
    name: 'My Patients',
    href: '/staff/patients',
    icon: <TeamOutlined />,
  },
  {
    id: 3,
    name: 'Sessions',
    href: '/staff/sessions',
    icon: <CalendarOutlined />,
  },
    {
    id: 4,
    name: 'Enrollments',
    href: '/staff/enrollments',
    icon: <SolutionOutlined />,
  },
];

export const guestSidebarItems = [
  {
    id: 1,
    name: 'Overview',
    href: '/guests',
    icon: <DashboardOutlined />,
  },
];

