import React from 'react'
import { Checkbox } from 'antd'
import { FileTextOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons'
import { IAttendanceTable } from '@/types'
import { getSessionTypeTag, getStatusTag } from './utils'

export const createSessionColumns = (
  selectedKey: string | null,
  handleCheckBoxChange: (key: string, row: { id: string }) => void
) => [
  {
    title: "",
    key: "checkbox",
    width: 50,
    render: (_: any, record: IAttendanceTable) => (
      <Checkbox
        checked={record.id === selectedKey}
        onChange={() => handleCheckBoxChange(record.id.toString(), record)}
      />
    ),
  },
  {
    title: "Patient Name",
    dataIndex: "patientName",
    key: "patientName",
    render: (text: string) => (
      <div className="flex items-center gap-2">
        <UserOutlined className="text-gray-400" />
        <span className="font-medium">{text}</span>
      </div>
    )
  },
  {
    title: "Program",
    dataIndex: "programName",
    key: "programName",
    render: (text: string) => (
      <div className="flex items-center gap-2">
        <FileTextOutlined className="text-gray-400" />
        <span>{text}</span>
      </div>
    )
  },
  {
    title: "Scheduled Date",
    dataIndex: "schelduredDate",
    key: "schelduredDate",
    render: (text: string) => (
      <div className="flex items-center gap-2">
        <CalendarOutlined className="text-gray-400" />
        <span>{text}</span>
      </div>
    )
  },
  {
    title: "Status",
    dataIndex: "sessionStatus",
    key: "sessionStatus",
    render: (status: string) => getStatusTag(status)
  },
  {
    title: "Session Type",
    dataIndex: "sessionType",
    key: "sessionType",
    render: (type: string) => getSessionTypeTag(type)
  },
  {
    title: "Attended At",
    dataIndex: "attendedAt",
    key: "attendedAt",
  },
  {
    title: "Cancel Reason",
    dataIndex: "cancelReason",
    key: "cancelReason",
    render: (text: string) => (
      <span className={text === '-' ? 'text-gray-400' : ''}>{text}</span>
    )
  },
]

