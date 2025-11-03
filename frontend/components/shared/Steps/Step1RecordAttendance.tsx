import React from 'react'
import { Card, Alert, Select, Radio, Space, Tag, Row, Col, Input } from 'antd'
import { 
  InfoCircleOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  WarningOutlined 
} from '@ant-design/icons'
import { Session } from './types'

const { TextArea } = Input
const { Option } = Select

interface Step1RecordAttendanceProps {
  selectedSession: Session | null
  setSelectedSession: (session: Session | null) => void
  sessions: Session[]
  attendanceStatus: string
  setAttendanceStatus: (status: string) => void
  attendanceReason: string
  setAttendanceReason: (reason: string) => void
  sessionNotes: string
  setSessionNotes: (notes: string) => void
}

const Step1RecordAttendance: React.FC<Step1RecordAttendanceProps> = ({
  selectedSession,
  setSelectedSession,
  sessions,
  attendanceStatus,
  setAttendanceStatus,
  attendanceReason,
  setAttendanceReason,
  sessionNotes,
  setSessionNotes
}) => {
  return (
    <Card title="Record Session Attendance" className="min-h-[300px] sm:min-h-[400px]">
      <Alert 
        message="Mark session attendance and add notes" 
        type="info" 
        icon={<InfoCircleOutlined />} 
        showIcon 
        className="mb-4 text-xs sm:text-sm" 
      />
      <div className="mb-4">
        <label className="block text-xs sm:text-sm font-medium mb-2">Select Session *</label>
        <Select 
          size="large" 
          placeholder="Choose scheduled session..." 
          value={selectedSession?.sessionId} 
          onChange={(v) => setSelectedSession(sessions.find(s => s.sessionId === v) || null)} 
          style={{ width: '100%' }}
          className="w-full"
        >
          {sessions.map(s => (
            <Option key={s.sessionId} value={s.sessionId}>
              <span className="text-xs sm:text-sm truncate block">{s.sessionName} - {s.scheduledDate} at {s.scheduledTime}</span>
            </Option>
          ))}
        </Select>
      </div>
      {selectedSession && (
        <Card size="small" className="bg-gray-50 mb-4">
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={12}>
              <div className="text-xs text-gray-600">Session</div>
              <div className="font-medium text-xs sm:text-sm break-words">{selectedSession.sessionName}</div>
            </Col>
            <Col xs={24} sm={12}>
              <div className="text-xs text-gray-600">Type</div>
              <Tag color="blue" className="text-xs">{selectedSession.sessionType}</Tag>
            </Col>
            <Col xs={24} sm={12}>
              <div className="text-xs text-gray-600">Date</div>
              <div className="text-xs sm:text-sm"><CalendarOutlined className="mr-1" /> {selectedSession.scheduledDate}</div>
            </Col>
            <Col xs={24} sm={12}>
              <div className="text-xs text-gray-600">Time</div>
              <div className="text-xs sm:text-sm"><ClockCircleOutlined className="mr-1" /> {selectedSession.scheduledTime}</div>
            </Col>
          </Row>
        </Card>
      )}
      <div className="mb-4">
        <label className="block text-xs sm:text-sm font-medium mb-2">Attendance Status *</label>
        <Radio.Group 
          value={attendanceStatus} 
          onChange={(e) => setAttendanceStatus(e.target.value)} 
          className="w-full"
        >
          <Space direction="vertical" className="w-full">
            <Radio value="attended" className="text-xs sm:text-sm">
              <CheckCircleOutlined style={{ color: '#52c41a' }} /> Attended
            </Radio>
            <Radio value="missed" className="text-xs sm:text-sm">
              <WarningOutlined style={{ color: '#ff4d4f' }} /> Missed
            </Radio>
            <Radio value="canceled" className="text-xs sm:text-sm">
              <WarningOutlined style={{ color: '#faad14' }} /> Canceled
            </Radio>
          </Space>
        </Radio.Group>
      </div>
      {(attendanceStatus === 'missed' || attendanceStatus === 'canceled') && (
        <div className="mb-4">
          <label className="block text-xs sm:text-sm font-medium mb-2">Reason *</label>
          <TextArea 
            rows={3} 
            placeholder="Enter reason..." 
            value={attendanceReason} 
            onChange={(e) => setAttendanceReason(e.target.value)}
            className="text-xs sm:text-sm"
          />
        </div>
      )}
      <div>
        <label className="block text-xs sm:text-sm font-medium mb-2">Session Notes</label>
        <TextArea 
          rows={4} 
          placeholder="Add session notes..." 
          value={sessionNotes} 
          onChange={(e) => setSessionNotes(e.target.value)}
          className="text-xs sm:text-sm"
        />
      </div>
    </Card>
  )
}

export default Step1RecordAttendance

