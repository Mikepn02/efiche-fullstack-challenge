'use client'
import SearchInput from '@/components/forms/SearchInput';
import CreateProgramModal from '@/components/modals/CreateProgramModal';
import AddProgramSessionsModal from '@/components/modals/CreateSessionModal';
import ViewProgramSessions from '@/components/drawers/ViewProgramSessions';
import DataTable from '@/components/table/DataTable';
import { usePrograms } from '@/hooks/use-program';
import { IProgram } from '@/types';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import React, { useState } from 'react'
import { createProgramColumns } from './columns'

const Programs = () => {
    const [searchValue, setSearchValue] = useState("");
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [showSessionsDrawer, setShowSessionsDrawer] = useState<boolean>(false);
    const [showAddSessionsModal, setShowAddSessionsModal] = useState<boolean>(false);
    const [selectedProgram, setSelectedProgram] = useState<IProgram | null>(null);
    const { data: programs, isLoading, refetch } = usePrograms();

    const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleProgramCreated = () => {
        refetch();
        console.log('Program created successfully');
    };

    const handleViewSessions = (program: IProgram) => {
        setSelectedProgram(program);
        setShowSessionsDrawer(true);
    };

    const handleAddSessions = (program: IProgram) => {
        setSelectedProgram(program);
        setShowAddSessionsModal(true);
    };

    const handleSessionsAdded = () => {
        refetch();
        console.log('Sessions added successfully');
    };

    const columns = (
        selectedKey: string | null,
        handleEditRow: (program: IProgram) => void,
        handleDeleteRow: () => void,
        handleCheckBoxChange: (key: string, item: IProgram) => void
    ) => {
        return createProgramColumns(selectedKey, handleCheckBoxChange, handleViewSessions, handleAddSessions)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className='px-1 md:px-10 py-6 rounded-lg'>
            <div className='flex flex-1 sm:flex-row flex-col gap-y-4 justify-between pb-6'>
                <div className='flex flex-col space-y-1'>
                    <h1 className='text-base font-medium'>Manage Programs</h1>
                    <p className='text-gray-500 text-[14px]'>View, Edit and Delete programs below.</p>
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
                        onClick={() => setShowCreateModal(true)}
                    >
                        <h1 className='text-white font-bold text-sm sm:text-base'>New Program</h1>
                    </Button>
                </div>
            </div>

            <DataTable
                data={programs || []}
                searchQuery={searchValue}
                columns={columns}
                rowKey='id'
            />

            <CreateProgramModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleProgramCreated}
            />

            <AddProgramSessionsModal
                visible={showAddSessionsModal}
                onClose={() => {
                    setShowAddSessionsModal(false);
                    setSelectedProgram(null);
                }}
                program={selectedProgram}
                onSuccess={handleSessionsAdded}
            />

            <ViewProgramSessions
                visible={showSessionsDrawer}
                onClose={() => {
                    setShowSessionsDrawer(false);
                    setSelectedProgram(null);
                }}
                program={selectedProgram}
            />
        </div>
    )
}

export default Programs