import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

export const sessionStats = [
  {
    title: "Today's Sessions",
    value: 4,
    prefix: <CalendarOutlined />,
    valueStyle: { color: '#1890ff' },
  },
  {
    title: "Attended",
    value: 10,
    prefix: <CheckCircleOutlined />,
    valueStyle: { color: '#52c41a' },
  },
  {
    title: "Missed",
    value: 1,
    prefix: <CloseCircleOutlined />,
    valueStyle: { color: '#ff4d4f' },
    badgeCount: 3,
  },
  {
    title: "Upcoming",
    value: 4,
    prefix: <ClockCircleOutlined />,
    valueStyle: { color: '#faad14' },
  },
];

