import React from 'react'
import { Checkbox } from 'antd'
import { IPatient } from '@/types'
import { formatDate } from '@/lib/utils'

export const createPatientColumns = (
  selectedKey: string | null,
  handleCheckBoxChange: (key: string, item: IPatient) => void
) => [
  {
    title: "",
    key: "checkbox",
    render: (_: any, record: IPatient) => (
      <Checkbox
        checked={record.id === selectedKey}
        onChange={() => handleCheckBoxChange(record.id.toString(), record)}
      />
    ),
  },
  {
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName'
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName'
  },
  {
    title: 'DOB',
    dataIndex: 'dateOfBirth',
    key: 'dateOfBirth',
    render: (dateOfBirth: string) => {
      return <span>{formatDate(dateOfBirth)}</span>
    }
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    render: (gender: string) => {
      return <span className="capitalize">{gender}</span>
    }
  },
  {
    title: 'Assigned To',
    dataIndex: 'assignedTo',
    key: 'assignedTo',
    render: (assignedTo: any) => {
      return assignedTo ? `${assignedTo.name}` : '-';
    }
  },
]

