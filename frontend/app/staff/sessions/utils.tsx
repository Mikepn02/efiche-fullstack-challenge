import React from 'react'
import { Tag } from 'antd'
import { 
  FileTextOutlined, 
  TeamOutlined, 
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'

export const getSessionTypeTag = (type: string) => {
  const normalizedType = type.toLowerCase().replace(/_/g, '-')
  const typeConfig = {
    'one-on-one': { color: 'blue', icon: <UserOutlined />, text: 'One-on-One' },
    'group': { color: 'purple', icon: <TeamOutlined />, text: 'Group' },
    'consultation': { color: 'cyan', icon: <FileTextOutlined />, text: 'Consultation' }
  }
  const config = typeConfig[normalizedType as keyof typeof typeConfig]
  return config ? (
    <Tag icon={config.icon} color={config.color}>{config.text}</Tag>
  ) : (
    <Tag color="default">{type}</Tag>
  )
}

export const getStatusTag = (status: string) => {
  const normalizedStatus = status.toLowerCase().replace(/_/g, '-')
  const statusConfig = {
    'completed': { color: 'success', icon: <CheckCircleOutlined />, text: 'Completed' },
    'attended': { color: 'success', icon: <CheckCircleOutlined />, text: 'Attended' },
    'cancelled': { color: 'error', icon: <CloseCircleOutlined />, text: 'Cancelled' },
    'canceled': { color: 'error', icon: <CloseCircleOutlined />, text: 'Canceled' },
    'scheduled': { color: 'processing', icon: <ClockCircleOutlined />, text: 'Scheduled' },
    'no-show': { color: 'warning', icon: <CloseCircleOutlined />, text: 'No Show' }
  }
  const config = statusConfig[normalizedStatus as keyof typeof statusConfig]
  return config ? (
    <Tag icon={config.icon} color={config.color}>{config.text}</Tag>
  ) : (
    <Tag color="default">{status}</Tag>
  )
}

