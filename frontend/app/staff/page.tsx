"use client"
import StatsCard from '@/components/cards/StatCard'
import React, { useMemo } from 'react'
import {
    TeamOutlined,
    CalendarOutlined,
    SolutionOutlined,
} from '@ant-design/icons'
import ChartsSection from '@/components/shared/ChartSection'
import { usePatientsAssignedTo } from '@/hooks/use-patient'
import { useAllSessions } from '@/hooks/use-program'
import { useEnrollments } from '@/hooks/use-enrollments'
import { useUserStore } from '@/store/user-store'
import { Spin } from 'antd'
import dayjs from 'dayjs'

const Overview = () => {
    const { user } = useUserStore()
    const { data: patients, isLoading: isLoadingPatients } = usePatientsAssignedTo(user?.id)
    const { data: allSessions, isLoading: isLoadingSessions } = useAllSessions()
    const { data: enrollments, isLoading: isLoadingEnrollments } = useEnrollments()

    const stats = useMemo(() => {
        const totalPatients = patients?.length || 0
        const totalEnrollments = enrollments?.length || 0
        
        // Filter upcoming sessions (sessions with date in the future)
        const now = dayjs()
        const upcomingSessions = allSessions?.filter((session: any) => {
            const sessionDate = dayjs(session.date)
            return sessionDate.isAfter(now)
        })?.length || 0

        return {
            totalPatients,
            totalEnrollments,
            upcomingSessions
        }
    }, [patients, enrollments, allSessions])

    

    return (
        <div className="w-full flex flex-col gap-y-6">
            <p className="text-gray-500 font-serif">
                Hello there! Here is a summary for you!
            </p>

      
                <>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatsCard
                            title="My Patients"
                            subtitle="Total assigned patients"
                            value={stats.totalPatients}
                            link="/staff/patients"
                            icon={<TeamOutlined className="text-blue-500 text-2xl" />}
                        />

                        <StatsCard
                            title="Upcoming Sessions"
                            subtitle="Scheduled program sessions"
                            value={stats.upcomingSessions}
                            link="/staff/sessions"
                            icon={<CalendarOutlined className="text-green-500 text-2xl" />}
                        />

                        <StatsCard
                            title="Enrollments"
                            subtitle="Total participant enrollments"
                            value={stats.totalEnrollments}
                            link="/staff/enrollments"
                            icon={<SolutionOutlined className="text-purple-500 text-2xl" />}
                        />
                    </div>

                    <div>
                        <ChartsSection enrollments={enrollments || []} programs={[]} />
                    </div>
                </>
    
        </div>
    )
}

export default Overview
