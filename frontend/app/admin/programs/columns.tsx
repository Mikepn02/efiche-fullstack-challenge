import React from 'react'
import { Checkbox, Tag, Tooltip, Button } from 'antd'
import { EyeOutlined, CalendarOutlined } from '@ant-design/icons'
import { IProgram } from '@/types'
import dayjs from 'dayjs'

export const createProgramColumns = (
  selectedKey: string | null,
  handleCheckBoxChange: (key: string, item: IProgram) => void,
  handleViewSessions: (program: IProgram) => void,
  handleAddSessions: (program: IProgram) => void
) => [
  {
    title: "",
    key: "checkbox",
    width: 50,
    render: (_: any, record: IProgram) => (
      <Checkbox
        checked={record.id === selectedKey}
        onChange={() => handleCheckBoxChange(record.id.toString(), record)}
      />
    ),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    render: (name: string) => {
      const truncatedName = name.length > 40 ? `${name.substring(0, 40)}...` : name;
      return name.length > 40 ? (
        <Tooltip title={name}>
          <span className='font-medium'>{truncatedName}</span>
        </Tooltip>
      ) : (
        <span className='font-medium'>{name}</span>
      );
    }
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    render: (description: string) => {
      const truncatedDesc = description.length > 60 ? `${description.substring(0, 60)}...` : description;
      return description.length > 60 ? (
        <Tooltip title={description}>
          <span className='text-sm text-gray-600'>{truncatedDesc}</span>
        </Tooltip>
      ) : (
        <span className='text-sm text-gray-600'>{description}</span>
      );
    }
  },
  {
    title: 'Start Date',
    dataIndex: 'startDate',
    key: 'startDate',
    width: 130,
    render: (date: string) => (
      <span className='text-sm'>
        {dayjs(date).format('MMM DD, YYYY')}
      </span>
    )
  },
  {
    title: 'End Date',
    dataIndex: 'endDate',
    key: 'endDate',
    width: 130,
    render: (date: string) => (
      <span className='text-sm'>
        {dayjs(date).format('MMM DD, YYYY')}
      </span>
    )
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    render: (status: string) => {
      let color = 'default'

      switch (status.toLowerCase()) {
        case 'ongoing':
          color = 'green'
          break
        case 'completed':
          color = 'blue'
          break
        case 'archived':
          color = 'orange'
          break
        default:
          color = 'default'
      }

      return <Tag color={color} className="capitalize">{status}</Tag>
    }
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
    align: 'center' as const,
    render: (_: any, record: IProgram) => (
      <div className="flex gap-1">
        <Tooltip title="View Sessions">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewSessions(record)}
            className="text-blue-600 hover:text-blue-700"
          />
        </Tooltip>
        <Tooltip title="Add Sessions">
          <Button
            type="text"
            icon={<CalendarOutlined />}
            onClick={() => handleAddSessions(record)}
            className="text-green-600 hover:text-green-700"
          />
        </Tooltip>
      </div>
    )
  },
]

