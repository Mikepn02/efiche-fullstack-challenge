'use client'
import SearchInput from '@/components/forms/SearchInput';
import CreateModal from '@/components/modals/CreateModal';
import DataTable from '@/components/table/DataTable';
import { useCreateUser, useUsers } from '@/hooks/use-auth';
import { IEnrollment, IUser } from '@/types';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Tag } from 'antd';
import React, { useState } from 'react'

const Users = () => {
    const [searchValue, setSearchValue] = useState("");
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const registerUserMutation = useCreateUser();
    const { data: users, isLoading, refetch } = useUsers();

    const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };


    console.log(users)


    const userFields: {
    name: keyof IUser;
    label: string;
    inputType?: "text" | "number" | "email" | "password";
    rules?: any[];
    placeholder?: string;
  }[] = [
    {
      name: "name",
      label: "Names",
      placeholder: "Enter full Names",
      rules: [{ required: true, message: "Names are required" }],
    },
    {
      name: "email",
      label:"Email",
      placeholder: "Enter email",
      rules: [{ required: true, message: "email is required" }],
    },
    {
      name: "password",
      label: "Password",
      inputType: "password",
      placeholder: "Enter password",
      rules: [{ required: true, message: "password is required" }],
    },
  ];



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
                render: (_: any, record: IEnrollment) => (
                    <Checkbox
                        checked={record.id === selectedKey}
                        onChange={() => handleCheckBoxChange(record.id.toString(), record)}
                    />
                ),
            },
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: 'Staff Name',
                dataIndex: 'name',
                key: 'name'
            },
             {
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
            },
           
         
        ]

        return baseColumns;
    }

    const handleCreateUser = async(values: {name: string, email: string , password: string}) => {
        await registerUserMutation.mutate({ name: values.name ,email:values.email , password: values.password});
        refetch()
    }

    return (
        <div className='px-1 md:px-10 py-6 rounded-lg'>
            <div className='flex flex-1 sm:flex-row flex-col gap-y-4 justify-between pb-6'>
                <div className='flex flex-col space-y-1'>
                    <h1 className='text-base font-medium'>Manage Users</h1>
                    <p className='text-gray-500 text-[14px]'>View, Edit and Delete Users below.</p>
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
                        onClick={() => setShowCreateModal(true)}
                    >
                        <h1 className='text-white font-bold text-sm sm:text-base'>Create Staff</h1>
                    </Button>
                </div>
            </div>

            <DataTable
                data={users ?? []}
                searchQuery={searchValue}
                columns={columns}
                rowKey='id'
            />
            
            {showCreateModal && (
                <CreateModal<IUser>
                    visible={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    item={null}
                    title="Create New User"
                    fields={userFields}
                    onSubmit={handleCreateUser}
                />
            )}
        </div>
    )
}

export default Users