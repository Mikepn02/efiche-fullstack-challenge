"use client"
import React, { useState } from 'react';
import {
    Modal,
    Form,
    Button,
    notification,
} from 'antd';
import {
    CheckCircleOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import CreateProgramSession from '../forms/CreateProgramSession';
import { CreateSessionDto, IProgram, ProgramFormValues, ProgramStatus, Session, SessionFormValues } from '@/types';
import { useCreateBulkProgramSessions } from '@/hooks/use-program';

interface AddProgramSessionsModalProps {
    visible: boolean;
    onClose: () => void;
    program: IProgram | null;
    onSuccess?: () => void;
}

const AddProgramSessionsModal: React.FC<AddProgramSessionsModalProps> = ({
    visible,
    onClose,
    program,
    onSuccess
}) => {
    const [sessionForm] = Form.useForm<SessionFormValues>();
    const [sessions, setSessions] = useState<Session[]>([]);
    const sessionBulkMutation = useCreateBulkProgramSessions();

    const resetModal = () => {
        setSessions([]);
        sessionForm.resetFields();
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    const handleAddSession = (values: SessionFormValues) => {
        if (!program?.id) {
            return;
        }

        const tempSession: Session = {
            id: `temp-${Date.now()}`,
            title: values.title,
            description: values.description,
            date: values.date,
            frequency: values.frequency,
            sessionType: values.sessionType,
        };

        setSessions([...sessions, tempSession]);
        sessionForm.resetFields();
    };

    const handleRemoveSession = (sessionId: string) => {
        setSessions(sessions.filter(s => s.id !== sessionId));
    };

    const handleSubmit = async () => {
        if (sessions.length === 0 || !program?.id) {
            return;
        }

        try {
            const sessionPayloads: CreateSessionDto[] = sessions.map(session => ({
                programId: program.id,
                title: session.title,
                description: session.description,
                date: session.date.toISOString(),
                frequency: session.frequency,
                sessionType: session.sessionType,
            }));

            await sessionBulkMutation.mutateAsync(sessionPayloads);
            notification.success({
                message: 'Sessions added successfully',
                placement: 'topRight',
            });
            onSuccess?.();
            handleClose();
        } catch (error: any) {
            notification.error({
                message: 'Failed to add sessions',
                description: error?.response?.data?.message || error?.message || 'Please try again.',
                placement: 'topRight',
            });
        }
    };
    const status = program && Object.values(ProgramStatus).includes(program.session as ProgramStatus)
        ? (program.session as ProgramStatus)
        : ProgramStatus.ONGOING;

    const programData: ProgramFormValues | null = program ? {
        name: program.name,
        description: program.description,
        startDate: dayjs(program.startDate),
        endDate: dayjs(program.endDate),
        status,
    } : null;

    return (
        <Modal
            title={
                <div className="-mx-6 -mt-5 mb-0 pt-6 pb-5 px-6 bg-primary rounded-t-lg">
                    <div className="flex flex-col gap-3 w-full">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-white">
                                Add Sessions to Program
                            </span>
                        </div>

                        {program && (
                            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-white">
                                            {program.name}
                                        </span>
                                        <span className="px-2 py-1 rounded text-xs text-white bg-white/20">
                                            {sessions.length} session{sessions.length !== 1 ? 's' : ''} added
                                        </span>
                                    </div>
                                    <p className="text-xs text-white/80">
                                        {program.description}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            }
            open={visible}
            onCancel={handleClose}
            width={800}
            footer={[
                <Button key="cancel" onClick={handleClose} className="rounded-lg">
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={sessionBulkMutation.isPending}
                    onClick={handleSubmit}
                    disabled={sessions.length === 0}
                    icon={<CheckCircleOutlined />}
                    className="rounded-lg"
                >
                    Save Sessions ({sessions.length})
                </Button>,
            ]}
            centered
            destroyOnHidden
            closeIcon={
                <span className="text-white text-xl bg-white/20 w-7 h-7 flex items-center justify-center rounded-full">
                    ×
                </span>
            }
            styles={{
                header: {
                    padding: 0,
                    marginBottom: 0,
                    border: 'none',
                },
                body: {
                    maxHeight: 'calc(100vh - 300px)',
                    overflowY: 'auto',
                    paddingTop: 24,
                    scrollbarWidth: 'none',       
                    msOverflowStyle: 'none',
                }
            }}
        >
            <CreateProgramSession
                programData={programData}
                sessions={sessions}
                form={sessionForm}
                handleAddSession={handleAddSession}
                handleRemoveSession={handleRemoveSession}
            />
        </Modal>
    );
};

export default AddProgramSessionsModal;