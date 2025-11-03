"use client"
import React, { useState } from 'react';
import { Modal, Form } from 'antd';
import CreateProgram from '../forms/CreateProgram';
import CreateProgramSession from '../forms/CreateProgramSession';
import { CreateProgramDto, CreateProgramModalProps, CreateSessionDto, ProgramFormValues, Session, SessionFormValues } from '@/types';
import { useCreateBulkProgramSessions, useCreateProgram, useCreateProgramSession } from '@/hooks/use-program';
import ModalHeader from './CreateProgramModal/ModalHeader';
import ModalFooter from './CreateProgramModal/ModalFooter';




const CreateProgramModal: React.FC<CreateProgramModalProps> = ({
    visible,
    onClose,
    onSuccess
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [programForm] = Form.useForm<ProgramFormValues>();
    const [sessionForm] = Form.useForm<SessionFormValues>();

    const [programId, setProgramId] = useState<string | null>(null);
    const [programData, setProgramData] = useState<ProgramFormValues | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loadingProgram, setLoadingProgram] = useState(false);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const programMutation = useCreateProgram();
    const sessionMutation = useCreateProgramSession();
    const sessionBulkMutation = useCreateBulkProgramSessions()

    const resetModal = () => {
        setCurrentStep(0);
        setProgramId(null);
        setProgramData(null);
        setSessions([]);
        programForm.resetFields();
        sessionForm.resetFields();
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };




    const handleProgramSubmit = async (values: ProgramFormValues) => {
        setLoadingProgram(true);
        const payload: CreateProgramDto = {
            name: values.name,
            description: values.description,
            startDate: values.startDate.toISOString(),
            endDate: values.endDate.toISOString(),
            status: values.status,
        };
        const createdProgram = await programMutation.mutateAsync(payload);
        setProgramId(createdProgram.id);
        setProgramData(values);
        setCurrentStep(1);
    };

    const handleAddSession = (values: SessionFormValues) => {
        if (!programId) {
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

    const handleBulkSubmit = async () => {
        if (sessions.length === 0) {
            return;
        }

        if (!programId) {
            return;
        }
        const sessionPayloads: CreateSessionDto[] = sessions.map(session => ({
            programId: programId,
            title: session.title,
            description: session.description,
            date: session.date.toISOString(),
            frequency: session.frequency,
            sessionType: session.sessionType,
        }));

        await sessionBulkMutation.mutateAsync(sessionPayloads);

        onSuccess?.();
        handleClose();

    };

    const handleRemoveSession = (sessionId: string) => {
        setSessions(sessions.filter(s => s.id !== sessionId));
    };



    const handleSkipSessions = () => {
        onSuccess?.();
        handleClose();
    };



    const renderProgramForm = () => {
        return <CreateProgram
            form={programForm}
            handleProgramSubmit={handleProgramSubmit}
        />
    };

    const renderSessionsForm = () => {
        return <CreateProgramSession

            programData={programData}
            sessions={sessions}
            form={sessionForm}
            handleAddSession={handleAddSession}
            handleRemoveSession={handleRemoveSession}
        />
    }


    return (
        <Modal
            title={<ModalHeader currentStep={currentStep} />}
            open={visible}
            onCancel={handleClose}
            width={800}
            footer={
                <ModalFooter
                    currentStep={currentStep}
                    loadingProgram={loadingProgram}
                    loadingSessions={loadingSessions}
                    sessionsCount={sessions.length}
                    onBack={currentStep === 0 ? handleClose : () => setCurrentStep(0)}
                    onSkip={handleSkipSessions}
                    onNext={() => programForm.submit()}
                    onSubmit={handleBulkSubmit}
                />
            }
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
                    maxHeight: 'calc(100vh - 350px)',
                    overflowY: 'auto',
                    paddingTop: 24,
                }
            }}

        >
            {currentStep === 0 && renderProgramForm()}
            {currentStep === 1 && renderSessionsForm()}
        </Modal>
    );
};

export default CreateProgramModal;