'use client'
import SearchInput from '@/components/forms/SearchInput';
import CreateModal from '@/components/modals/CreateModal';
import { enrollmentColumns } from '@/components/table/columns/enrollment';
import DataTable from '@/components/table/DataTable';
import { useEnrollments, useEnrollPatient } from '@/hooks/use-enrollments';
import { usePatientsAssignedTo } from '@/hooks/use-patient';
import { usePrograms } from '@/hooks/use-program';
import { EnrollPatientDto } from '@/services/enrollment.service';
import { useUserStore } from '@/store/user-store';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Spin } from 'antd';
import React, { useMemo, useState } from 'react';

const Enrollments = () => {
    const { user } = useUserStore();
    const [searchValue, setSearchValue] = useState("");
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const { data: enrollments, isLoading, refetch } = useEnrollments();
    const { data: programs } = usePrograms();
    const userId = user?.id
    const { data: patients } = usePatientsAssignedTo(userId);
    const { mutateAsync: enrollPatient } = useEnrollPatient();

    const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const summaryStats = useMemo(() => {
        if (!enrollments) return { total: 0, activePrograms: 0, avgAttendance: 0, recentEnrollments: 0 };

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const activePrograms = new Set(
            enrollments
                .filter((e: { program: { status: string; }; }) => e.program?.status === 'ONGOING')
                .map((e: { programId: any; }) => e.programId)
        ).size;

        const totalAttendance = enrollments.reduce((sum: any, e: { stats: { attendanceRate: any; }; }) => sum + (e.stats?.attendanceRate || 0), 0);
        const avgAttendance = enrollments.length > 0 ? totalAttendance / enrollments.length : 0;

        const recentEnrollments = enrollments.filter((e: { enrolledAt: any; createdAt: any; }) => {
            const enrollDate = new Date(e.enrolledAt || e.createdAt);
            return enrollDate >= weekAgo;
        }).length;

        return {
            total: enrollments.length,
            activePrograms,
            avgAttendance,
            recentEnrollments
        };
    }, [enrollments]);

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

    return (
        <div className='px-1 md:px-10 py-6 rounded-lg'>
            <div className='flex flex-1 sm:flex-row flex-col gap-y-4 justify-between pb-6'>
                <div className='flex flex-col space-y-1'>
                    <h1 className='text-base font-medium'>Manage Enrollments</h1>
                    <p className='text-gray-500 text-[14px]'>View, Edit and Delete Enrollments below.</p>
                </div>

                <div className='flex flex-col md:flex-row items-stretch sm:items-center gap-2 sm:w-auto'>
                    <div className='flex-1 sm:flex-initial sm:min-w-[250px] md:min-w-[300px]'>
                        <SearchInput searchQueryValue={searchValue} handleSearchQueryValue={handleSearchQueryChange} />
                    </div>
                    <Button type="primary" icon={<PlusOutlined />} className='h-10 sm:h-auto sm:w-auto' style={{ padding: '18px' }} onClick={handleOpenCreateModal}>
                        <h1 className='text-white font-bold text-sm sm:text-base'>Enroll Patient</h1>
                    </Button>
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
                    <p className='text-gray-500 text-sm mb-1'>Total Enrollments</p>
                    <h2 className='text-2xl font-bold text-gray-800'>{summaryStats.total}</h2>
                </div>
                <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
                    <p className='text-gray-500 text-sm mb-1'>Active Programs</p>
                    <h2 className='text-2xl font-bold text-blue-600'>{summaryStats.activePrograms}</h2>
                </div>
                <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
                    <p className='text-gray-500 text-sm mb-1'>Avg Attendance</p>
                    <h2 className='text-2xl font-bold text-green-600'>{summaryStats.avgAttendance.toFixed(1)}%</h2>
                </div>
                <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
                    <p className='text-gray-500 text-sm mb-1'>This Week</p>
                    <h2 className='text-2xl font-bold text-purple-600'>{summaryStats.recentEnrollments}</h2>
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
                    columns={enrollmentColumns}
                    rowKey='id'
                />
            )}

            {showCreateModal && (
                <CreateModal
                    visible={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    item={undefined}
                    title="Enroll Patient in Program"
                    fields={enrollmentFields}
                    onSubmit={handleCreateEnrollment}
                />
            )}
        </div>
    )
}

export default Enrollments