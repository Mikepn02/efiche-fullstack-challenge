'use client'
import SearchInput from '@/components/forms/SearchInput';
import CreateModal from '@/components/modals/CreateModal';
import DataTable from '@/components/table/DataTable';
import { useEnrollments, useEnrollPatient } from '@/hooks/use-enrollments';
import { usePatients } from '@/hooks/use-patient';
import { usePrograms } from '@/hooks/use-program';
import { EnrollPatientDto } from '@/services/enrollment.service';
import { IEnrollment } from '@/types';
import { PlusOutlined, UserOutlined, FileTextOutlined, CalendarOutlined, BarChartOutlined } from '@ant-design/icons';
import { Button, Checkbox, message, Spin, Tag, Tooltip } from 'antd';
import React, { useMemo, useState } from 'react'
import { formatDate } from '@/lib/utils';

const Enrollments = () => {
    const [searchValue, setSearchValue] = useState("");
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const { data: enrollments, isLoading, refetch } = useEnrollments();
    const { data: patients } = usePatients();
    const { data: programs } = usePrograms();
    const { mutateAsync: enrollPatient } = useEnrollPatient();

    const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const patientOptions = useMemo(() => {
        if (!patients) return [];
        return patients.map((patient: any) => ({
            label: `${patient.firstName} ${patient.lastName}`,
            value: patient.id,
        }));
    }, [patients]);

    const programOptions = useMemo(() => {
        if (!programs) return [];
        return programs.map((program: any) => ({
            label: program.name,
            value: program.id,
        }));
    }, [programs]);

    const enrollmentFields = useMemo(() => [
        {
            name: "patientId",
            label: "Patient",
            inputType: "select" as const,
            placeholder: "Select Patient",
            options: patientOptions,
            rules: [{ required: true, message: "Patient is required" }],
        },
        {
            name: "programId",
            label: "Program",
            inputType: "select" as const,
            placeholder: "Select Program",
            options: programOptions,
            rules: [{ required: true, message: "Program is required" }],
        },
    ], [patientOptions, programOptions]);

    const handleCreateEnrollment = async (values: any) => {
        try {
            const enrollmentData: EnrollPatientDto = {
                patientId: values.patientId,
                programId: values.programId,
            };
            await enrollPatient(enrollmentData);
            message.success('Patient enrolled successfully');
            setShowCreateModal(false);
            refetch();
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Failed to enroll patient');
        }
    };

    const handleOpenCreateModal = () => {
        if (!patients || patients.length === 0) {
            message.warning('Loading patients data. Please wait...');
            return;
        }
        if (!programs || programs.length === 0) {
            message.warning('Loading programs data. Please wait...');
            return;
        }
        setShowCreateModal(true);
    };


    const columns = (
        selectedKey: string | null,
        handleEditRow: (enrollment: IEnrollment) => void,
        handleDeleteRow: () => void,
        handleCheckBoxChange: (key: string, item: IEnrollment) => void
    ) => {
        const baseColumns = [
            {
                title: "",
                key: "checkbox",
                width: 50,
                fixed: 'left' as const,
                render: (_: any, record: IEnrollment) => (
                    <Checkbox
                        checked={record.id === selectedKey}
                        onChange={() => handleCheckBoxChange(record.id.toString(), record)}
                    />
                ),
            },
            {
                title: 'ID',
                key: 'rowIndex',
                width: 60,
                fixed: 'left' as const,
                render: (_: any, __: IEnrollment, index: number) => (
                    <span className="font-medium">{index + 1}</span>
                ),
            },
            {
                title: 'Patient Name',
                key: 'patientName',
                width: 180,
                ellipsis: true,
                render: (_: any, record: IEnrollment) => {
                    const patientName = record.patient ? `${record.patient.firstName} ${record.patient.lastName}` : 'N/A';
                    return (
                        <Tooltip title={patientName}>
                            <div className="flex items-center gap-2">
                                <UserOutlined className="text-gray-400 shrink-0" />
                                <span className="font-medium truncate">{patientName}</span>
                            </div>
                        </Tooltip>
                    );
                },
            },
            {
                title: 'Program Name',
                key: 'programName',
                width: 180,
                ellipsis: true,
                render: (_: any, record: IEnrollment) => {
                    const programName = record.program?.name || 'N/A';
                    return (
                        <Tooltip title={record.program?.description || programName}>
                            <div className="flex items-center gap-2">
                                <FileTextOutlined className="text-gray-400 shrink-0" />
                                <span className="truncate">{programName}</span>
                            </div>
                        </Tooltip>
                    );
                },
            },
            {
                title: 'Status',
                key: 'programStatus',
                width: 100,
                render: (_: any, record: IEnrollment) => {
                    const status = record.program?.status;
                    const statusConfig: Record<string, { color: string; label: string }> = {
                        'ONGOING': { color: 'blue', label: 'Ongoing' },
                        'COMPLETED': { color: 'green', label: 'Completed' },
                        'ARCHIVED': { color: 'default', label: 'Archived' },
                    };
                    const config = statusConfig[status || ''] || { color: 'default', label: status || 'N/A' };
                    return <Tag color={config.color}>{config.label}</Tag>;
                },
            },
            {
                title: 'Enrolled By',
                key: 'enrolledBy',
                width: 140,
                ellipsis: true,
                render: (_: any, record: IEnrollment) => {
                    const enrolledByName = record.enrolledBy?.name || 'N/A';
                    return (
                        <Tooltip title={enrolledByName}>
                            <span className="truncate block">{enrolledByName}</span>
                        </Tooltip>
                    );
                },
            },
            {
                title: 'Enrolled At',
                key: 'enrolledAt',
                width: 130,
                render: (_: any, record: IEnrollment) => {
                    const dateStr = record.enrolledAt 
                        ? formatDate(record.enrolledAt) 
                        : record.createdAt 
                            ? formatDate(record.createdAt) 
                            : 'N/A';
                    return (
                        <div className="flex items-center gap-2">
                            <CalendarOutlined className="text-gray-400 shrink-0" />
                            <span className="truncate">{dateStr}</span>
                        </div>
                    );
                },
            },
            {
                title: 'Statistics',
                key: 'stats',
                width: 160,
                render: (_: any, record: IEnrollment) => {
                    const attended = record.stats?.attendedSessions || 0;
                    const total = record.stats?.totalSessions || 0;
                    const rate = record.stats?.attendanceRate?.toFixed(1) || '0.0';
                    const statsText = `${attended}/${total} • ${rate}%`;
                    return (
                        <Tooltip title={`Sessions: ${attended}/${total} | Rate: ${rate}%`}>
                            <div className="flex items-center gap-2">
                                <BarChartOutlined className="text-gray-400 shrink-0" />
                                <span className="text-sm truncate">{statsText}</span>
                            </div>
                        </Tooltip>
                    );
                },
            },
        ]

        return baseColumns;
    }


    return (
        <div className='px-1 md:px-10 py-6 rounded-lg'>
            <div className='flex flex-1 sm:flex-row flex-col gap-y-4 justify-between pb-6'>
                <div className='flex flex-col space-y-1'>
                    <h1 className='text-base font-medium'>Manage Enrollments</h1>
                    <p className='text-gray-500 text-[14px]'>View, Edit and Delete Enrollments below.</p>
                </div>

                <div className='flex flex-col md:flex-row items-stretch  sm:items-center gap-2 sm:w-auto'>
                    <div className='flex-1 sm:flex-initial sm:min-w-[250px] md:min-w-[300px]'>
                        <SearchInput
                            searchQueryValue={searchValue}
                            handleSearchQueryValue={handleSearchQueryChange}
                        />
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className='h-10 sm:h-auto sm:w-auto'
                        style={{ padding: '18px' }}
                        onClick={handleOpenCreateModal}
                    >
                        <h1 className='text-white font-bold text-sm sm:text-base'>Enroll Patient</h1>
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <Spin size="large" />
                </div>
            ) : (
                <DataTable
                    data={enrollments?.map((enrollment: { patient: { firstName: any; lastName: any; }; program: { name: any; }; enrolledBy: { name: any; }; }, index: number) => ({
                        ...enrollment,
                        rowIndex: index + 1,
                        patientName: enrollment.patient ? `${enrollment.patient.firstName} ${enrollment.patient.lastName}` : '',
                        programName: enrollment.program?.name || '',
                        enrolledByName: enrollment.enrolledBy?.name || '',
                    })) ?? []}
                    searchQuery={searchValue}
                    columns={columns}
                    rowKey='id'
                />
            )}

            {showCreateModal && (
                <CreateModal
                    visible={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    item={null}
                    title="Enroll Patient in Program"
                    fields={enrollmentFields}
                    onSubmit={handleCreateEnrollment}
                />
            )}
        </div>
    )
}

export default Enrollments