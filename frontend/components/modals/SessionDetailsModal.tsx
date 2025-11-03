import React from 'react';
import { Modal, Card, Row, Col, Divider, Alert, Button } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { STATUS_CONFIG, TYPE_CONFIG } from '@/constants//sessionConfig';

interface SessionRecord {
  sessionName: string;
  sessionId: string;
  sessionType: string;
  status: string;
  patientName: string;
  patientId: string;
  programName: string;
  scheduledDate: string;
  scheduledTime: string;
  attendanceMarkedBy?: string;
  attendanceMarkedAt?: string;
  reason?: string;
  notes?: string;
}

interface SessionDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  record: SessionRecord | null;
  onMarkAttendance: () => void;
}

const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({
  visible,
  onClose,
  record,
  onMarkAttendance,
}) => {
  const getTag = (value: string, config: any) => {
    const cfg = config[value];
    return (
      <span style={{ color: cfg.color === 'success' ? '#52c41a' : cfg.color === 'error' ? '#ff4d4f' : cfg.color }}>
        {cfg.icon} {cfg.text}
      </span>
    );
  };

  return (
    <Modal
      title="Session Details"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        record?.status === 'scheduled' && (
          <Button key="mark" type="primary" onClick={onMarkAttendance}>
            Mark Attendance
          </Button>
        )
      ]}
      width={700}
    >
      {record && (
        <div>
          <Card size="small" className="mb-4">
            <Row gutter={[16, 16]}>
              {[
                ['Session Name', record.sessionName, 12],
                ['Session ID', record.sessionId, 12],
                ['Session Type', getTag(record.sessionType, TYPE_CONFIG), 12],
                ['Status', getTag(record.status, STATUS_CONFIG), 12]
              ].map(([label, value, span], i) => (
                <Col span={span as number} key={i}>
                  <div className="text-xs text-gray-500 mb-1">{label}</div>
                  <div className={typeof value === 'string' ? 'font-medium' : ''}>
                    {value}
                  </div>
                </Col>
              ))}
            </Row>
          </Card>

          <Divider orientation="left">Patient Information</Divider>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div className="text-xs text-gray-500 mb-1">Patient Name</div>
              <div className="font-medium">{record.patientName}</div>
            </Col>
            <Col span={12}>
              <div className="text-xs text-gray-500 mb-1">Patient ID</div>
              <div className="font-medium">{record.patientId}</div>
            </Col>
            <Col span={24}>
              <div className="text-xs text-gray-500 mb-1">Program</div>
              <div className="font-medium">{record.programName}</div>
            </Col>
          </Row>

          <Divider orientation="left">Schedule</Divider>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div className="text-xs text-gray-500 mb-1">Date</div>
              <div className="font-medium">
                <CalendarOutlined /> {record.scheduledDate}
              </div>
            </Col>
            <Col span={12}>
              <div className="text-xs text-gray-500 mb-1">Time</div>
              <div className="font-medium">
                <ClockCircleOutlined /> {record.scheduledTime}
              </div>
            </Col>
          </Row>

          {record.attendanceMarkedBy && (
            <>
              <Divider orientation="left">Attendance Record</Divider>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="text-xs text-gray-500 mb-1">Marked By</div>
                  <div className="font-medium">{record.attendanceMarkedBy}</div>
                </Col>
                <Col span={12}>
                  <div className="text-xs text-gray-500 mb-1">Marked At</div>
                  <div className="font-medium">{record.attendanceMarkedAt}</div>
                </Col>
                {record.reason && (
                  <Col span={24}>
                    <div className="text-xs text-gray-500 mb-1">Reason</div>
                    <Alert message={record.reason} type="info" showIcon />
                  </Col>
                )}
                {record.notes && (
                  <Col span={24}>
                    <div className="text-xs text-gray-500 mb-1">Notes</div>
                    <Card size="small" className="bg-gray-50">
                      {record.notes}
                    </Card>
                  </Col>
                )}
              </Row>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};

export default SessionDetailsModal;