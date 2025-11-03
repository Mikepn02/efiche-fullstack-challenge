import React from 'react'
import { Button, Popconfirm } from 'antd'
import { DeleteOutlined, ClockCircleOutlined, UserOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons'
import { Session, SessionType, SessionFrequency } from '@/types'
import dayjs, { Dayjs } from 'dayjs'

const getSessionTypeConfig = (type: SessionType) => {
  const config = {
    [SessionType.ONE_ON_ONE]: { icon: <UserOutlined />, color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'One-on-One' },
    [SessionType.GROUP]: { icon: <TeamOutlined />, color: 'bg-green-100 text-green-700 border-green-200', label: 'Group' },
    [SessionType.CONSULTATION]: { icon: <CalendarOutlined />, color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Consultation' },
  }
  return config[type]
}

export const createSessionTableColumns = (
  handleRemoveSession: (sessionId: string) => void
) => [
  {
    title: 'Session Details',
    key: 'details',
    render: (_: any, record: Session) => (
      <div>
        <div className="mb-1">
          <span className="font-semibold text-gray-900">{record.title}</span>
        </div>
        <span className="text-xs text-gray-500">
          {record.description.length > 60
            ? `${record.description.substring(0, 60)}...`
            : record.description}
        </span>
      </div>
    ),
  },
  {
    title: 'Date & Time',
    dataIndex: 'date',
    key: 'date',
    width: 150,
    render: (date: string | Dayjs) => {
      const d = dayjs(date)
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-sm text-gray-900">
            {d.format('MMM DD, YYYY')}
          </span>
          <span className="text-xs text-gray-500">
            <ClockCircleOutlined className="mr-1" /> {d.format('HH:mm')}
          </span>
        </div>
      )
    },
  },
  {
    title: 'Type',
    dataIndex: 'sessionType',
    key: 'sessionType',
    width: 130,
    render: (type: SessionType) => {
      const config = getSessionTypeConfig(type)
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium border ${config.color}`}>
          {config.icon}
          {config.label}
        </span>
      )
    },
  },
  {
    title: 'Frequency',
    dataIndex: 'frequency',
    key: 'frequency',
    width: 100,
    render: (frequency: SessionFrequency) => (
      <span className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
        {frequency}
      </span>
    ),
  },
  {
    title: '',
    key: 'action',
    width: 80,
    align: 'center' as const,
    render: (_: any, record: Session) => (
      <Popconfirm
        title="Remove session?"
        onConfirm={() => handleRemoveSession(record.id)}
        okText="Remove"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <Button danger type="text" icon={<DeleteOutlined />} size="small" />
      </Popconfirm>
    ),
  },
]

