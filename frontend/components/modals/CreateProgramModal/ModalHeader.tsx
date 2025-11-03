import React from 'react'
import { CheckCircleOutlined } from '@ant-design/icons'

interface ModalHeaderProps {
  currentStep: number
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ currentStep }) => {
  return (
    <div className="-mx-6 -mt-5 mb-0 pt-6 pb-5 px-6 bg-primary rounded-t-lg">
      <div className="flex flex-col gap-3 w-full">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-white">
            Create New Program
          </span>
          <span className="px-3 py-1 rounded-full text-sm text-white bg-white/30 border border-white/40">
            Step {currentStep + 1} of 2
          </span>
        </div>

        <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= 0 ? 'bg-white shadow-lg' : 'bg-white/30'
                }`}>
                {currentStep > 0 ? (
                  <CheckCircleOutlined className="text-indigo-600 text-xl" />
                ) : (
                  <span className={`font-semibold ${currentStep === 0 ? 'text-indigo-600' : 'text-white/60'}`}>
                    1
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-white text-sm">
                  Program Details
                </span>
                <span className="text-xs text-white/80">
                  Basic information
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= 1 ? 'bg-white shadow-lg' : 'bg-white/30'
                }`}>
                <span className={`font-semibold ${currentStep === 1 ? 'text-indigo-600' : 'text-white/60'}`}>
                  2
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-white text-sm">
                  Add Sessions
                </span>
                <span className="text-xs text-white/80">
                  Create sessions
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300 shadow-sm shadow-white/50"
              style={{ width: `${((currentStep + 1) / 2) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalHeader

