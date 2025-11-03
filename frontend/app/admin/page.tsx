"use client"
import StatsCard from '@/components/cards/StatCard'
import React, { useMemo } from 'react'
import {
    UserOutlined,
    AppstoreOutlined,
    TeamOutlined,
    SolutionOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
} from '@ant-design/icons'
import ChartsSection from '@/components/shared/ChartSection'
import { usePrograms, useAllSessions, useProgramSessions } from '@/hooks/use-program'
import { useEnrollments } from '@/hooks/use-enrollments'
import { useUsers } from '@/hooks/use-auth'
import { usePatients } from '@/hooks/use-patient'
import { Spin } from 'antd'

const Overview = () => {
    const { data: users, isLoading: isLoadingUsers } = useUsers()
    const { data: programs, isLoading: isLoadingPrograms } = usePrograms()
    const { data: enrollments, isLoading: isLoadingEnrollments } = useEnrollments()
    const { data: patients, isLoading: isLoadingPatients } = usePatients()


    const stats = useMemo(() => {
        const totalUsers = users?.length || 0
        const totalPrograms = programs?.length || 0
        const totalPatients = patients?.length || 0
        const totalEnrollments = enrollments?.length || 0

        const activePrograms = programs?.filter((p: any) => p.status === 'ONGOING')?.length || 0
        const completedPrograms = programs?.filter((p: any) => p.status === 'COMPLETED')?.length || 0

        const staffUsers = users?.filter((u: any) => u.role === 'STAFF')?.length || 0

        return {
            totalUsers,
            totalPrograms,
            totalPatients,
            totalEnrollments,
            activePrograms,
            completedPrograms,
            staffUsers
        }
    }, [users, programs, patients, enrollments])



    return (
        <div className="w-full flex flex-col gap-y-6">
            <p className="text-gray-500 font-serif">
                Hello there! Here is a summary for you!
            </p>
            <>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Users"
                        subtitle="Total system users"
                        value={stats.totalUsers}
                        link="/admin/users"
                        icon={<UserOutlined className="text-blue-500 text-2xl" />}
                    />

                    <StatsCard
                        title="Programs"
                        subtitle="Total health programs"
                        value={stats.totalPrograms}
                        link="/admin/programs"
                        icon={<AppstoreOutlined className="text-green-500 text-2xl" />}
                    />

                    <StatsCard
                        title="Patients"
                        subtitle="Total registered patients"
                        value={stats.totalPatients}
                        link="/admin/patients"
                        icon={<TeamOutlined className="text-purple-500 text-2xl" />}
                    />

                    <StatsCard
                        title="Enrollments"
                        subtitle="Total participant enrollments"
                        value={stats.totalEnrollments}
                        link="/admin/enrollments"
                        icon={<SolutionOutlined className="text-orange-500 text-2xl" />}
                    />
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Active Programs"
                        subtitle="Currently ongoing programs"
                        value={stats.activePrograms}
                        link="/admin/programs"
                        icon={<CheckCircleOutlined className="text-green-500 text-2xl" />}
                    />

                    <StatsCard
                        title="Completed Programs"
                        subtitle="Finished programs"
                        value={stats.completedPrograms}
                        link="/admin/programs"
                        icon={<AppstoreOutlined className="text-gray-500 text-2xl" />}
                    />



                    <StatsCard
                        title="Staff Members"
                        subtitle="Total staff users"
                        value={stats.staffUsers}
                        link="/admin/users"
                        icon={<UserOutlined className="text-indigo-500 text-2xl" />}
                    />
                </div>

                <div className='mb-5'>
                    <ChartsSection enrollments={enrollments || []} programs={programs || []} />
                </div>
            </>

        </div>
    )
}

export default Overview
