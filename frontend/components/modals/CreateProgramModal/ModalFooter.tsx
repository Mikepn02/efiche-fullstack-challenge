import React from 'react'
import { Button } from 'antd'
import { CheckCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'

interface ModalFooterProps {
  currentStep: number
  loadingProgram: boolean
  loadingSessions: boolean
  sessionsCount: number
  onBack: () => void
  onSkip: () => void
  onNext: () => void
  onSubmit: () => void
}

const ModalFooter: React.FC<ModalFooterProps> = ({
  currentStep,
  loadingProgram,
  loadingSessions,
  sessionsCount,
  onBack,
  onSkip,
  onNext,
  onSubmit
}) => {
  if (currentStep === 0) {
    return [
      <Button key="cancel" onClick={onBack} className="rounded-lg">
        Cancel
      </Button>,
      <Button
        key="submit"
        type="primary"
        loading={loadingProgram}
        onClick={onNext}
        icon={<ArrowRightOutlined />}
        className="rounded-lg"
      >
        Next: Add Sessions
      </Button>,
    ]
  }

  return [
    <Button
      key="back"
      icon={<ArrowLeftOutlined />}
      onClick={onBack}
      className="rounded-lg"
    >
      Back
    </Button>,
    <Button
      key="skip"
      onClick={onSkip}
      className="rounded-lg"
    >
      Skip & Finish
    </Button>,
    <Button
      key="submit"
      type="primary"
      loading={loadingSessions}
      onClick={onSubmit}
      disabled={sessionsCount === 0}
      icon={<CheckCircleOutlined />}
      className="rounded-lg"
    >
      Save All ({sessionsCount})
    </Button>,
  ]
}

export default ModalFooter

