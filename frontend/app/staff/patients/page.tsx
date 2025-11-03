'use client'
import SearchInput from '@/components/forms/SearchInput';
import CreateModal from '@/components/modals/CreateModal';
import DataTable from '@/components/table/DataTable';
import { useUsers } from '@/hooks/use-auth';
import { usePatients, useCreateProgram, usePatientsAssignedTo } from '@/hooks/use-patient';
import { formatDate } from '@/lib/utils';
import { IPatient } from '@/types';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, message } from 'antd';
import React, { useMemo, useState } from 'react'
import dayjs from 'dayjs';
import { useUserStore } from '@/store/user-store';



const Patients = () => {
    const [searchValue, setSearchValue] = useState("");
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const { user } = useUserStore();
    const userId = user?.id;
    const { data: patients, isLoading, refetch } = usePatientsAssignedTo(userId);


    console.log(patients)

    const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };




  



  
    const columns = (
        selectedKey: string | null,
        handleEditRow: (patient: IPatient) => void,
        handleDeleteRow: () => void,
        handleCheckBoxChange: (key: string, item: IPatient) => void
    ) => {
        const baseColumns = [
            {
                title: "",
                key: "checkbox",
                render: (_: any, record: IPatient) => (
                    <Checkbox
                        checked={record.id === selectedKey}
                        onChange={() => handleCheckBoxChange(record.id.toString(), record)}
                    />
                ),
            },
            {
                title: 'First Name',
                dataIndex: 'firstName',
                key: 'firstName'
            },
            {
                title: 'Last Name',
                dataIndex: 'lastName',
                key: 'lastName'
            },
            {
                title: 'DOB',
                dataIndex: 'dateOfBirth',
                key: 'dateOfBirth',
                render: (dateOfBirth: string) => {
                    return <span>{formatDate(dateOfBirth)}</span>
                }
            },
            {
                title: 'Gender',
                dataIndex: 'gender',
                key: 'gender',
                render: (gender: string) => {
                    return <span className="capitalize">{gender}</span>
                }
            }
        ]

        return baseColumns;
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
                
                </div>
            </div>

            <DataTable
                data={patients ?? []}
                searchQuery={searchValue}
                columns={columns}
                rowKey='id'
            />

      
        </div>
    )
}

export default Patients