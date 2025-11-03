import React from 'react'
import { Card, Alert, Select, Input, Button, Table, Tag, Row, Col } from 'antd'
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { MedicationFrequency } from '@/services/medication.service'
import { Medication, PrescribedMedication } from './types'

const { Option } = Select

interface Step2PrescribeMedicationProps {
  prescribeMedicationId?: string
  setPrescribeMedicationId?: (id: string) => void
  prescribeDosage?: string
  setPrescribeDosage?: (dosage: string) => void
  prescribeFrequency?: MedicationFrequency
  setPrescribeFrequency?: (frequency: MedicationFrequency) => void
  handlePrescribeMedication?: () => void
  prescribedMedications?: PrescribedMedication[]
  availableMedications: Medication[]
  isPrescribing?: boolean
}

const Step2PrescribeMedication: React.FC<Step2PrescribeMedicationProps> = ({
  prescribeMedicationId,
  setPrescribeMedicationId,
  prescribeDosage,
  setPrescribeDosage,
  prescribeFrequency,
  setPrescribeFrequency,
  handlePrescribeMedication,
  prescribedMedications = [],
  availableMedications,
  isPrescribing = false
}) => {
  const frequencyOptions = [
    { label: 'Daily', value: MedicationFrequency.DAILY },
    { label: 'Weekly', value: MedicationFrequency.WEEKLY },
    { label: 'Monthly', value: MedicationFrequency.MONTHLY }
  ]

  return (
    <Card title="Prescribe Medications" className="min-h-[300px] sm:min-h-[400px]">
      <Alert 
        message="Prescribe medications to patient" 
        description="Medications must be prescribed before they can be dispensed" 
        type="info" 
        icon={<InfoCircleOutlined />} 
        showIcon 
        className="mb-4 text-xs sm:text-sm" 
      />
      <Card size="small" className="mb-4 bg-gray-50">
        <h3 className="font-medium mb-3 text-xs sm:text-sm">Prescribe Medication</h3>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12} md={12}>
            <label className="block text-xs font-medium mb-1">Medication *</label>
            <Select 
              placeholder="Select medication..." 
              value={prescribeMedicationId} 
              onChange={setPrescribeMedicationId} 
              style={{ width: '100%' }}
              className="w-full"
            >
              {availableMedications.map(m => {
                const alreadyPrescribed = prescribedMedications.some(p => p.medicationId === m.id)
                return (
                  <Option key={m.id} value={m.id} disabled={alreadyPrescribed}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                      <span className="text-xs sm:text-sm">{m.name} - {m.dose}</span>
                      {alreadyPrescribed && <Tag color="blue" className="text-xs">Already Prescribed</Tag>}
                    </div>
                  </Option>
                )
              })}
            </Select>
          </Col>
          <Col xs={24} sm={6} md={6}>
            <label className="block text-xs font-medium mb-1">Dosage *</label>
            <Input 
              placeholder="e.g., 500mg" 
              value={prescribeDosage} 
              onChange={(e) => setPrescribeDosage?.(e.target.value)}
              className="text-xs sm:text-sm"
            />
          </Col>
          <Col xs={24} sm={6} md={6}>
            <label className="block text-xs font-medium mb-1">Frequency *</label>
            <Select 
              placeholder="Frequency" 
              value={prescribeFrequency} 
              onChange={(v) => setPrescribeFrequency?.(v)} 
              style={{ width: '100%' }}
              className="w-full"
            >
              {frequencyOptions.map(opt => (
                <Option key={opt.value} value={opt.value} className="text-xs sm:text-sm">{opt.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handlePrescribeMedication} 
              loading={isPrescribing}
              block
              className="text-xs sm:text-sm"
            >
              Prescribe Medication
            </Button>
          </Col>
        </Row>
      </Card>
      <h3 className="font-medium mb-2 text-xs sm:text-sm">Prescribed Medications ({prescribedMedications.length})</h3>
      {prescribedMedications.length > 0 ? (
        <div className="overflow-x-auto">
          <Table 
            columns={[
              { 
                title: 'Medication', 
                key: 'medication',
                width: 200,
                render: (r: PrescribedMedication) => (
                  <div>
                    <div className="font-medium text-xs sm:text-sm">{r.name}</div>
                    <div className="text-xs text-gray-500">ID: {r.medicationId}</div>
                  </div>
                ) 
              },
              { title: 'Dosage', dataIndex: 'dosage', key: 'dosage', width: 120 },
              { 
                title: 'Frequency', 
                dataIndex: 'frequency', 
                key: 'frequency',
                width: 120,
                render: (f: MedicationFrequency) => {
                  const freqMap: Record<MedicationFrequency, string> = {
                    [MedicationFrequency.DAILY]: 'Daily',
                    [MedicationFrequency.WEEKLY]: 'Weekly',
                    [MedicationFrequency.MONTHLY]: 'Monthly'
                  }
                  return <Tag color="green" className="text-xs">{freqMap[f] || f}</Tag>
                }
              },
              { 
                title: 'Assignment ID', 
                dataIndex: 'assignmentId', 
                key: 'assignmentId',
                width: 150,
                render: (id: string) => <span className="text-xs text-gray-500">{id}</span>
              }
            ]} 
            dataSource={prescribedMedications} 
            pagination={false} 
            rowKey={(r) => r.assignmentId} 
            size="small"
            scroll={{ x: true }}
          />
        </div>
      ) : (
        <Alert message="No medications prescribed yet. You can skip this step if no medications are needed." type="warning" showIcon className="text-xs sm:text-sm" />
      )}
    </Card>
  )
}

export default Step2PrescribeMedication

