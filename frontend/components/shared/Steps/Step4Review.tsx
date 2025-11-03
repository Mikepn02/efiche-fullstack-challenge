import React from 'react'
import { Card, Alert, Table, Tag, Row, Col } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { MedicationFrequency } from '@/services/medication.service'
import { Patient, Session, PrescribedMedication, SelectedMedication } from './types'

interface Step4ReviewProps {
  selectedPatient: Patient | null
  selectedSession: Session | null
  attendanceStatus: string
  attendanceReason: string
  sessionNotes: string
  prescribedMedications: PrescribedMedication[]
  selectedMedications: SelectedMedication[]
  medicationColumns: any[]
  dispensationNotes: string
}

const Step4Review: React.FC<Step4ReviewProps> = ({
  selectedPatient,
  selectedSession,
  attendanceStatus,
  attendanceReason,
  sessionNotes,
  prescribedMedications,
  selectedMedications,
  medicationColumns,
  dispensationNotes
}) => {
  return (
    <Card title="Review & Confirm" className="min-h-[300px] sm:min-h-[400px]">
      <Alert 
        message="Review all information before submitting" 
        type="success" 
        icon={<CheckCircleOutlined />} 
        showIcon 
        className="mb-4 text-xs sm:text-sm" 
      />
      <Card size="small" title="Patient Information" className="mb-4">
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={8} md={8}>
            <div className="text-xs text-gray-600">Name</div>
            <div className="font-medium text-xs sm:text-sm break-words">{selectedPatient?.name}</div>
          </Col>
          <Col xs={24} sm={8} md={8}>
            <div className="text-xs text-gray-600">ID</div>
            <div className="font-medium text-xs sm:text-sm break-words">{selectedPatient?.id}</div>
          </Col>
          <Col xs={24} sm={8} md={8}>
            <div className="text-xs text-gray-600">Program</div>
            <div className="font-medium text-xs sm:text-sm break-words">{selectedPatient?.programName}</div>
          </Col>
        </Row>
      </Card>
      <Card size="small" title="Session Details" className="mb-4">
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12} md={12}>
            <div className="text-xs text-gray-600">Session</div>
            <div className="font-medium text-xs sm:text-sm break-words">{selectedSession?.sessionName}</div>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <div className="text-xs text-gray-600">Date & Time</div>
            <div className="font-medium text-xs sm:text-sm">
              {selectedSession?.scheduledDate} at {selectedSession?.scheduledTime}
            </div>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <div className="text-xs text-gray-600">Attendance</div>
            <div>
              {attendanceStatus === 'attended' && <Tag color="success" className="text-xs">Attended</Tag>}
              {attendanceStatus === 'missed' && <Tag color="error" className="text-xs">Missed</Tag>}
              {attendanceStatus === 'canceled' && <Tag color="warning" className="text-xs">Canceled</Tag>}
            </div>
          </Col>
          {attendanceReason && (
            <Col xs={24} sm={24} md={24}>
              <div className="text-xs text-gray-600">Reason</div>
              <div className="font-medium text-xs sm:text-sm break-words">{attendanceReason}</div>
            </Col>
          )}
          {sessionNotes && (
            <Col xs={24} sm={24} md={24}>
              <div className="text-xs text-gray-600">Notes</div>
              <div className="text-xs sm:text-sm break-words">{sessionNotes}</div>
            </Col>
          )}
        </Row>
      </Card>
      {prescribedMedications.length > 0 && (
        <Card size="small" title={`Prescribed Medications (${prescribedMedications.length})`} className="mb-4">
          <div className="overflow-x-auto">
            <Table 
              columns={[
                { title: 'Medication', dataIndex: 'name', key: 'name', width: 200 },
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
                }
              ]} 
              dataSource={prescribedMedications} 
              pagination={false} 
              rowKey={(r) => r.assignmentId} 
              size="small"
              scroll={{ x: true }}
            />
          </div>
        </Card>
      )}
      <Card size="small" title={`Dispensed Medications (${selectedMedications.length})`}>
        {selectedMedications.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table 
                columns={medicationColumns.filter(c => c.key !== 'action')} 
                dataSource={selectedMedications} 
                pagination={false} 
                rowKey={(r, i) => `${r.medicationId}-${i}`} 
                size="small"
                scroll={{ x: true }}
              />
            </div>
            {dispensationNotes && (
              <div className="mt-3 p-2 bg-gray-50 rounded">
                <div className="text-xs text-gray-600 mb-1">Dispensation Notes</div>
                <div className="text-xs sm:text-sm break-words">{dispensationNotes}</div>
              </div>
            )}
          </>
        ) : (
          <Alert message="No medications dispensed" type="info" showIcon className="text-xs sm:text-sm" />
        )}
      </Card>
    </Card>
  )
}

export default Step4Review

