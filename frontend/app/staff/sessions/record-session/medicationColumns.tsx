import React from 'react'
import { Button, Tag, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

interface SelectedMedication {
  medicationId: string
  name: string
  dose: string
  frequency: string
  quantity: number
  notes: string
  assignmentId?: string
}

export const createMedicationColumns = (
  selectedMedications: SelectedMedication[],
  setSelectedMedications: React.Dispatch<React.SetStateAction<SelectedMedication[]>>
) => [
  { 
    title: 'Medication', 
    key: 'medication', 
    render: (r: SelectedMedication) => (
      <div>
        <div className="font-medium">{r.name}</div>
        <div className="text-xs text-gray-500">{r.dose}</div>
      </div>
    ) 
  },
  { title: 'Frequency', dataIndex: 'frequency', key: 'frequency', render: (f: string) => <Tag color="blue">{f}</Tag> },
  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
  { title: 'Notes', dataIndex: 'notes', key: 'notes', render: (n: string) => n || '-' },
  { 
    title: 'Action', 
    key: 'action', 
    render: (_: any, r: SelectedMedication, i: number) => (
      <Button 
        type="text" 
        danger 
        icon={<DeleteOutlined />} 
        onClick={() => { 
          setSelectedMedications(selectedMedications.filter((_, idx) => idx !== i))
          message.info('Removed')
        }}
      >
        Remove
      </Button>
    ) 
  }
]

