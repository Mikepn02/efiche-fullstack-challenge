import { DatePicker, Form, FormInstance, Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react'
import { ProgramFormValues, ProgramStatus } from '@/types';

const CreateProgram = ({
    form,
    handleProgramSubmit
}: {
    form: FormInstance<ProgramFormValues>;
    handleProgramSubmit: (values: ProgramFormValues) => void;
}) => {
    return (
        <div>
            <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Program Information</h4>
                <p className="text-sm text-gray-500 mb-0">
                    Provide the basic details for your new program
                </p>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleProgramSubmit}
                initialValues={{ status: ProgramStatus.ONGOING }}
            >
                <Form.Item
                    name="name"
                    label={<span className="font-semibold text-gray-700">Program Name</span>}
                    rules={[{ required: true, message: 'Please enter program name' }]}
                >
                    <Input
                        placeholder="e.g., Advanced Leadership Training"
                        size="large"
                        className="rounded-lg"
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label={<span className="font-semibold text-gray-700">Description</span>}
                    rules={[{ required: true, message: 'Please enter description' }]}
                >
                    <TextArea
                        rows={3}
                        placeholder="Describe the goals, target audience, and key outcomes..."
                        className="rounded-lg"
                    />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        name="startDate"
                        label={<span className="font-semibold text-gray-700">Start Date & Time</span>}
                        rules={[{ required: true, message: 'Please select start date' }]}
                    >
                        <DatePicker
                            className="w-full rounded-lg"
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            placeholder="Select start date"
                        />
                    </Form.Item>

                    <Form.Item
                        name="endDate"
                        label={<span className="font-semibold text-gray-700">End Date & Time</span>}
                        rules={[
                            { required: true, message: 'Please select end date' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || !getFieldValue('startDate')) {
                                        return Promise.resolve();
                                    }
                                    if (value.isAfter(getFieldValue('startDate'))) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('End date must be after start date'));
                                },
                            }),
                        ]}
                    >
                        <DatePicker
                            className="w-full rounded-lg"
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            placeholder="Select end date"
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    name="status"
                    label={<span className="font-semibold text-gray-700">Program Status</span>}
                    rules={[{ required: true, message: 'Please select status' }]}
                >
                    <Select placeholder="Select program status" className="w-full">
                        <Select.Option value={ProgramStatus.ONGOING}>
                            <div className="flex items-center gap-2">
                                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                    Ongoing
                                </span>
                                <span>Active program</span>
                            </div>
                        </Select.Option>
                        <Select.Option value={ProgramStatus.COMPLETED}>
                            <div className="flex items-center gap-2">
                                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                    Completed
                                </span>
                                <span>Finished program</span>
                            </div>
                        </Select.Option>
                        <Select.Option value={ProgramStatus.ARCHIVED}>
                            <div className="flex items-center gap-2">
                                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                    Archived
                                </span>
                                <span>Archived program</span>
                            </div>
                        </Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </div>
    )
}

export default CreateProgram