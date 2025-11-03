import React, { useState, useEffect } from 'react';
import { Modal, Card, Radio, Space, Input } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { STATUS_CONFIG, TYPE_CONFIG } from '@/constants/sessionConfig';

const { TextArea } = Input;

interface SessionRecord {
  sessionName: string;
  patientName: string;
  scheduledDate: string;
  scheduledTime: string;
  sessionType: string;
}

interface MarkAttendanceModalProps {
  visible: boolean;
  onClose: () => void;
  record: SessionRecord | null;
  onSubmit: (data: { status: string; reason: string; notes: string }) => void;
}

const MarkAttendanceModal: React.FC<MarkAttendanceModalProps> = ({
  visible,
  onClose,
  record,
  onSubmit,
}) => {
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!visible) {
      setAttendanceStatus('');
      setReason('');
      setNotes('');
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!attendanceStatus) {
      alert('Please select attendance status');
      return;
    }
    if ((attendanceStatus === 'missed' || attendanceStatus === 'canceled') && !reason) {
      alert('Please provide a reason');
      return;
    }
    onSubmit({ status: attendanceStatus, reason, notes });
  };

  const getTag = (value: string, config: any) => {
    const cfg = config[value];
    return (
      <span>
        {cfg.icon} {cfg.text}
      </span>
    );
  };

  return (
    <Modal
      title="Mark Session Attendance"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Submit Attendance"
      width={600}
    >
      {record && (
        <div>
          <Card size="small" className="mb-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Session', record.sessionName],
                ['Patient', record.patientName],
                ['Date & Time', `${record.scheduledDate} at ${record.scheduledTime}`],
                ['Type', getTag(record.sessionType, TYPE_CONFIG)]
              ].map(([label, value], i) => (
                <div key={i}>
                  <div className="text-xs text-gray-500">{label}</div>
                  <div className="font-medium">{value}</div>
                </div>
              ))}
            </div>
          </Card>

          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Attendance Status *</div>
            <Radio.Group value={attendanceStatus} onChange={(e) => setAttendanceStatus(e.target.value)}>
              <Space direction="vertical">
                <Radio value="attended">
                  <CheckCircleOutlined style={{ color: '#52c41a' }} /> Attended
                </Radio>
                <Radio value="missed">
                  <CloseCircleOutlined style={{ color: '#ff4d4f' }} /> Missed
                </Radio>
                <Radio value="canceled">
                  <CloseCircleOutlined style={{ color: '#faad14' }} /> Canceled
                </Radio>
              </Space>
            </Radio.Group>
          </div>

          {(attendanceStatus === 'missed' || attendanceStatus === 'canceled') && (
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Reason *</div>
              <TextArea
                rows={3}
                placeholder="Enter reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          )}

          <div>
            <div className="text-sm font-medium mb-2">Notes (Optional)</div>
            <TextArea
              rows={3}
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default MarkAttendanceModal;