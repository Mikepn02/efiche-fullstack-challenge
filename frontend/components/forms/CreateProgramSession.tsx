import { getStatusConfig } from '@/lib/utils'
import { ProgramFormValues, Session, SessionFormValues, SessionFrequency, SessionType } from '@/types'
import { CalendarOutlined, CheckCircleOutlined, PlusOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, FormInstance, Input, Select, Table } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React from 'react'
import { createSessionTableColumns } from './CreateProgramSession/sessionTableColumns'

const CreateProgramSession = ({
    programData,
    sessions,
    form,
    handleAddSession,
    handleRemoveSession
}: {
    programData: ProgramFormValues | null;
    form: FormInstance<SessionFormValues>
    sessions: Session[];
    handleAddSession: (values: SessionFormValues) => void;
    handleRemoveSession: (id: string) => void;
}) => {
    const columns = createSessionTableColumns(handleRemoveSession)
    return (
        <div>
            {programData && (
                <div className="mb-5 p-5 rounded-lg bg-primary border-none">
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold text-white text-base">
                            {programData.name}
                        </span>
                        <div className="flex items-center gap-4">
                            <span className="text-white/90 text-xs">
                                <CalendarOutlined className="mr-1" />
                                {programData.startDate.format('MMM DD')} - {programData.endDate.format('MMM DD, YYYY')}
                            </span>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusConfig(programData.status).color}`}>
                                {programData.status}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-5 border border-gray-200 rounded-lg">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2 font-medium text-gray-900">
                        <PlusOutlined /> Add Session
                    </div>
                </div>
                <div className="p-4">
                    e             <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleAddSession}
                        initialValues={{
                            frequency: SessionFrequency.ONCE,
                            sessionType: SessionType.ONE_ON_ONE
                        }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Form.Item
                                name="title"
                                label={<span className="font-semibold text-gray-700">Title</span>}
                                rules={[{ required: true, message: 'Required' }]}
                            >
                                <Input placeholder="Session title" className="rounded-lg" />
                            </Form.Item>

                            <Form.Item
                                name="date"
                                label={<span className="font-semibold text-gray-700">Date & Time</span>}
                                rules={[{ required: true, message: 'Required' }]}
                            >
                                <DatePicker
                                    className="w-full rounded-lg"
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                    placeholder="Select date"
                                />
                            </Form.Item>

                            <div className="md:col-span-2">
                                <Form.Item
                                    name="description"
                                    label={<span className="font-semibold text-gray-700">Description</span>}
                                    rules={[{ required: true, message: 'Required' }]}
                                >
                                    <TextArea
                                        rows={2}
                                        placeholder="Session description..."
                                        className="rounded-lg"
                                    />
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="sessionType"
                                label={<span className="font-semibold text-gray-700">Type</span>}
                                rules={[{ required: true, message: 'Required' }]}
                            >
                                <Select className="w-full">
                                    <Select.Option value={SessionType.ONE_ON_ONE}>
                                        <UserOutlined /> One-on-One
                                    </Select.Option>
                                    <Select.Option value={SessionType.GROUP}>
                                        <TeamOutlined /> Group
                                    </Select.Option>
                                    <Select.Option value={SessionType.CONSULTATION}>
                                        <CalendarOutlined /> Consultation
                                    </Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="frequency"
                                label={<span className="font-semibold text-gray-700">Frequency</span>}
                                rules={[{ required: true, message: 'Required' }]}
                            >
                                <Select className="w-full">
                                    <Select.Option value={SessionFrequency.ONCE}>Once</Select.Option>
                                    <Select.Option value={SessionFrequency.DAILY}>Daily</Select.Option>
                                    <Select.Option value={SessionFrequency.WEEKLY}>Weekly</Select.Option>
                                    <Select.Option value={SessionFrequency.MONTHLY}>Monthly</Select.Option>
                                </Select>
                            </Form.Item>
                        </div>

                        <Button
                            type="dashed"
                            htmlType="submit"
                            icon={<PlusOutlined />}
                            block
                            className="rounded-lg"
                        >
                            Add Session
                        </Button>
                    </Form>
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="relative inline-flex items-center">
                            <CheckCircleOutlined className="text-lg" />
                            {sessions?.length > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs font-bold text-white bg-green-500 rounded-full">
                                    {sessions.length}
                                </span>
                            )}
                        </div>
                        <span className="font-medium text-gray-900">Sessions ({sessions.length})</span>
                    </div>
                </div>
                <div className="p-4">
                    {sessions.length > 0 ? (
                        <Table
                            dataSource={sessions}
                            columns={columns}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            scroll={{ y: 300 }}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="text-gray-400 mb-2">
                                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-5a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-500">No sessions added yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreateProgramSession