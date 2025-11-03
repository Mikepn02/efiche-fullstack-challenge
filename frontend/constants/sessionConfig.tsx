import React from 'react';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined
} from '@ant-design/icons';

export const STATUS_CONFIG = {
  attended: {
    color: 'success',
    icon: <CheckCircleOutlined />,
    text: 'Attended'
  },
  missed: {
    color: 'error',
    icon: <CloseCircleOutlined />,
    text: 'Missed'
  },
  canceled: {
    color: 'warning',
    icon: <CloseCircleOutlined />,
    text: 'Canceled'
  },
  scheduled: {
    color: 'processing',
    icon: <ClockCircleOutlined />,
    text: 'Scheduled'
  }
};

export const TYPE_CONFIG = {
  'one-on-one': {
    color: 'blue',
    icon: <UserOutlined />,
    text: 'One-on-One'
  },
  'group': {
    color: 'purple',
    icon: <TeamOutlined />,
    text: 'Group'
  },
  'consultation': {
    color: 'cyan',
    icon: <FileTextOutlined />,
    text: 'Consultation'
  }
};