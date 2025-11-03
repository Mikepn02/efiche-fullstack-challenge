import React from 'react'
import { Card, Alert, Select, Input, Button, Table, Tag, Row, Col } from 'antd'
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Medication, SelectedMedication } from './types'

const { Option } = Select

interface Step3DispenseMedicationProps {
  selectedMedicationId: string
  setSelectedMedicationId: (id: string) => void
  availableForDispensing?: Medication[]
  medicationQuantity: number
  setMedicationQuantity: (quantity: number) => void
  medicationNotes: string
  setMedicationNotes: (notes: string) => void
  handleAddMedication: () => void
  selectedMedications: SelectedMedication[]
  medicationColumns: any[]
  dispensationNotes: string
  setDispensationNotes: (notes: string) => void
}

const Step3DispenseMedication: React.FC<Step3DispenseMedicationProps> = ({
  selectedMedicationId,
  setSelectedMedicationId,
  availableForDispensing = [],
  medicationQuantity,
  setMedicationQuantity,
  medicationNotes,
  setMedicationNotes,
  handleAddMedication,
  selectedMedications,
  medicationColumns,
  dispensationNotes,
  setDispensationNotes
}) => {
  return (
    <Card title="Dispense Medications" className="min-h-[300px] sm:min-h-[400px]">
      <Alert 
        message="Dispense prescribed medications" 
        description="Only medications that have been prescribed can be dispensed" 
        type="info" 
        icon={<InfoCircleOutlined />} 
        showIcon 
        className="mb-4 text-xs sm:text-sm" 
      />
      {availableForDispensing.length === 0 ? (
        <Alert 
          message="No medications available for dispensing" 
          description="Please prescribe medications first in the previous step" 
          type="warning" 
          showIcon
          className="text-xs sm:text-sm"
        />
      ) : (
        <>
          <Card size="small" className="mb-4 bg-gray-50">
            <h3 className="font-medium mb-3 text-xs sm:text-sm">Add Medication for Dispensation</h3>
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={12}>
                <label className="block text-xs font-medium mb-1">Prescribed Medication</label>
                <Select 
                  placeholder="Select medication..." 
                  value={selectedMedicationId} 
                  onChange={setSelectedMedicationId} 
                  style={{ width: '100%' }}
                  className="w-full"
                >
                  {availableForDispensing.map(m => (
                    <Option key={m.id} value={m.id} disabled={!m.canDispenseToday}>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                        <span className="text-xs sm:text-sm">{m.name} - {m.dose}</span>
                        {!m.canDispenseToday && <Tag color="red" className="text-xs">Already Dispensed</Tag>}
                      </div>
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={16} sm={6} md={6}>
                <label className="block text-xs font-medium mb-1">Quantity</label>
                <Input 
                  type="number" 
                  min={1} 
                  value={medicationQuantity} 
                  onChange={(e) => setMedicationQuantity(parseInt(e.target.value) || 1)}
                  className="text-xs sm:text-sm"
                />
              </Col>
              <Col xs={8} sm={6} md={6}>
                <label className="block text-xs font-medium mb-1">&nbsp;</label>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={handleAddMedication} 
                  block
                  className="text-xs sm:text-sm"
                >
                  Add
                </Button>
              </Col>
              <Col xs={24} sm={24} md={24}>
                <label className="block text-xs font-medium mb-1">Notes (Optional)</label>
                <Input 
                  placeholder="Special instructions..." 
                  value={medicationNotes} 
                  onChange={(e) => setMedicationNotes(e.target.value)}
                  className="text-xs sm:text-sm"
                />
              </Col>
            </Row>
          </Card>
          <h3 className="font-medium mb-2 text-xs sm:text-sm">Selected Medications ({selectedMedications.length})</h3>
          {selectedMedications.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table 
                  columns={medicationColumns} 
                  dataSource={selectedMedications} 
                  pagination={false} 
                  rowKey={(r, i) => `${r.medicationId}-${i}`} 
                  size="small"
                  scroll={{ x: true }}
                />
              </div>
              <div className="mt-4">
                <label className="block text-xs sm:text-sm font-medium mb-2">Dispensation Notes</label>
                <Input.TextArea 
                  rows={3} 
                  placeholder="Overall notes..." 
                  value={dispensationNotes} 
                  onChange={(e) => setDispensationNotes(e.target.value)}
                  className="text-xs sm:text-sm"
                />
              </div>
            </>
          ) : (
            <Alert message="No medications added yet" type="warning" showIcon className="text-xs sm:text-sm" />
          )}
        </>
      )}
    </Card>
  )
}

export default Step3DispenseMedication

