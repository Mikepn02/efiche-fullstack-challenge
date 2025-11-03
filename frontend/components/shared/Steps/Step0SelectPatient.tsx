import React from 'react'
import { Card, Alert, Select } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import InfoCard from './InfoCard'
import { Patient } from './types'

const { Option } = Select

interface Step0SelectPatientProps {
  selectedPatient: Patient | null
  setSelectedPatient: (patient: Patient | null) => void
  patients: Patient[]
}

const Step0SelectPatient: React.FC<Step0SelectPatientProps> = ({
  selectedPatient,
  setSelectedPatient,
  patients
}) => {
  return (
    <Card title="Select Patient" className="min-h-[300px] sm:min-h-[400px]">
      <Alert 
        message="Select a patient to begin the session" 
        type="info" 
        icon={<InfoCircleOutlined />} 
        showIcon 
        className="mb-4 text-xs sm:text-sm" 
      />
      <div className="mb-4">
        <label className="block text-xs sm:text-sm font-medium mb-2">Patient *</label>
        <Select 
          size="large" 
          placeholder="Search and select patient..." 
          value={selectedPatient?.id} 
          onChange={(v) => setSelectedPatient(patients.find(p => p.id === v) || null)} 
          style={{ width: '100%' }} 
          showSearch
          className="w-full"
        >
          {patients.map(p => (
            <Option key={p.id} value={p.id}>
              <span className="text-xs sm:text-sm">{p.name} ({p.id}) - {p.programName}</span>
            </Option>
          ))}
        </Select>
      </div>
      {selectedPatient && (
        <InfoCard 
          title="" 
          data={[
            { label: 'Patient Name', value: selectedPatient.name }, 
            { label: 'Patient ID', value: selectedPatient.id }, 
            { label: 'Enrolled Program', value: selectedPatient.programName }
          ]} 
        />
      )}
    </Card>
  )
}

export default Step0SelectPatient

