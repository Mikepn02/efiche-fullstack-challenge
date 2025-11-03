'use client'
import SearchInput from '@/components/forms/SearchInput';
import CreateModal from '@/components/modals/CreateModal';
import DataTable from '@/components/table/DataTable';
import { useUsers } from '@/hooks/use-auth';
import { usePatients, useCreateProgram } from '@/hooks/use-patient';
import { IPatient } from '@/types';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useMemo, useState } from 'react'
import dayjs from 'dayjs';
import { createPatientColumns } from './columns';
import { createPatientFields } from './patientFields';


const Patients = () => {
    const [searchValue, setSearchValue] = useState("");
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const { data: patients, isLoading, refetch } = usePatients();
    const { data: users } = useUsers();
    const { mutateAsync: createPatient } = useCreateProgram();

    console.log(patients)

    const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const userOptions = useMemo(() => {
        if (!users) return [];
        return users.map((user: any) => {
            console.log(user)
            return {
            label: user.name,
            value: String(user.id),
        }
        });
    }, [users]);

    const patientFields = useMemo(() => createPatientFields(userOptions), [userOptions]);

    const handleOpenCreateModal = () => {
        if (!users || users.length === 0) {
            message.warning('Loading users data. Please wait...');
            return;
        }
        setShowCreateModal(true);
    };

    const handleCreatePatient = async (values: any) => {
        try {
            const patientData = {
                ...values,
                dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : ''
            };
            await createPatient(patientData);
            message.success('Patient created successfully');
            setShowCreateModal(false);
            refetch();
        } catch (error) {
            message.error('Failed to create patient');
        }
    };

    const columns = (
        selectedKey: string | null,
        handleEditRow: (patient: IPatient) => void,
        handleDeleteRow: () => void,
        handleCheckBoxChange: (key: string, item: IPatient) => void
    ) => {
        return createPatientColumns(selectedKey, handleCheckBoxChange)
    }

    return (
        <div className='px-1 md:px-10 py-6 rounded-lg'>
            <div className='flex flex-1 sm:flex-row flex-col gap-y-4 justify-between pb-6'>
                <div className='flex flex-col space-y-1'>
                    <h1 className='text-base font-medium'>Manage Patients</h1>
                    <p className='text-gray-500 text-[14px]'>View, Edit and Delete Patients below.</p>
                </div>

                <div className='flex flex-col md:flex-row items-stretch sm:items-center gap-2 sm:w-auto'>
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
                        <h1 className='text-white font-bold text-sm sm:text-base'>New Patient</h1>
                    </Button>
                </div>
            </div>

            <DataTable
                data={patients ?? []}
                searchQuery={searchValue}
                columns={columns}
                rowKey='id'
            />

            {showCreateModal && (
                <CreateModal
                    visible={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    item={null}
                    title="Create New Patient"
                    fields={patientFields}
                    onSubmit={handleCreatePatient}
                />
            )}
        </div>
    )
}

export default Patients