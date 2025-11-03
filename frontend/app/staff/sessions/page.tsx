"use client"
import DashboardStatisticCard from '@/components/cards/SessionStatCard'
import SearchInput from '@/components/forms/SearchInput'
import DataTable from '@/components/table/DataTable'
import { useSessionAttendances } from '@/hooks/use-session'
import { 
  FileTextOutlined,
  PlusOutlined,
  FilterOutlined,
  CalendarOutlined,
  DownloadOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { Button, Col, Row, Select, DatePicker, Dropdown, Badge, Spin } from 'antd'
import React, { useMemo } from 'react'
import type { MenuProps } from 'antd'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { useSessionFilters } from './useSessionFilters'
import { createSessionColumns } from './columns'

const { RangePicker } = DatePicker

const SessionAttendance = () => {
  const router = useRouter()
  const { data: sessions, isLoading, refetch } = useSessionAttendances()
  const {
    searchValue,
    setSearchValue,
    statusFilter,
    setStatusFilter,
    sessionTypeFilter,
    setSessionTypeFilter,
    dateRange,
    setDateRange,
    tableData,
    handleClearFilters,
    hasActiveFilters
  } = useSessionFilters(sessions)

  // Calculate real session stats
  const sessionStats = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return [
        {
          title: "Today's Sessions",
          value: 0,
          prefix: <CalendarOutlined />,
          valueStyle: { color: '#1890ff' },
        },
        {
          title: "Attended",
          value: 0,
          prefix: <CheckCircleOutlined />,
          valueStyle: { color: '#52c41a' },
        },
        {
          title: "Missed",
          value: 0,
          prefix: <CloseCircleOutlined />,
          valueStyle: { color: '#ff4d4f' },
        },
        {
          title: "Upcoming",
          value: 0,
          prefix: <ClockCircleOutlined />,
          valueStyle: { color: '#faad14' },
        },
      ]
    }

    const now = dayjs()
    const todayStart = now.startOf('day')
    const todayEnd = now.endOf('day')

    // Today's sessions
    const todaySessions = sessions.filter((session: any) => {
      const sessionDate = dayjs(session.schelduredDate || session.attendedAt)
      return sessionDate.isAfter(todayStart) && sessionDate.isBefore(todayEnd)
    }).length

    // Attended sessions
    const attendedSessions = sessions.filter((session: any) => 
      session.sessionStatus?.toUpperCase() === 'ATTENDED'
    ).length

    // Missed sessions
    const missedSessions = sessions.filter((session: any) => 
      session.sessionStatus?.toUpperCase() === 'MISSED'
    ).length

    // Upcoming sessions (future dates)
    const upcomingSessions = sessions.filter((session: any) => {
      const sessionDate = dayjs(session.schelduredDate || session.attendedAt)
      return sessionDate.isAfter(now)
    }).length

    return [
      {
        title: "Today's Sessions",
        value: todaySessions,
        prefix: <CalendarOutlined />,
        valueStyle: { color: '#1890ff' },
      },
      {
        title: "Attended",
        value: attendedSessions,
        prefix: <CheckCircleOutlined />,
        valueStyle: { color: '#52c41a' },
      },
      {
        title: "Missed",
        value: missedSessions,
        prefix: <CloseCircleOutlined />,
        valueStyle: { color: '#ff4d4f' },
      },
      {
        title: "Upcoming",
        value: upcomingSessions,
        prefix: <ClockCircleOutlined />,
        valueStyle: { color: '#faad14' },
      },
    ]
  }, [sessions])

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'csv',
      label: 'Export as CSV',
      icon: <FileTextOutlined />
    },
    {
      key: 'pdf',
      label: 'Export as PDF',
      icon: <FileTextOutlined />
    }
  ]

  const columns = (
    selectedKey: string | null,
    handleEditRow: (row: { id: string }) => void,
    handleDeleteRow: () => void,
    handleCheckBoxChange: (key: string, row: { id: string }) => void
  ) => {
    return createSessionColumns(selectedKey, handleCheckBoxChange)
  }

  return (
    <div className='px-1 md:px-10 py-6 rounded-lg'>
      {/* Statistics Cards */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8 mb-6">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]} className="mb-6">
          {sessionStats.map((stat, idx) => (
            <Col key={idx} xs={24} sm={12} lg={6}>
              <DashboardStatisticCard {...stat} />
            </Col>
          ))}
        </Row>
      )}

      {/* Header Section */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
          <div className='flex flex-col space-y-1'>
            <h1 className='text-xl font-semibold text-gray-800 flex items-center gap-2'>
              <CalendarOutlined className="text-blue-500" />
              Manage Sessions
            </h1>
            <p className='text-gray-500 text-sm'>View, filter, and manage all session attendances</p>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <Button 
              type="default" 
              icon={<ReloadOutlined />}
              onClick={() => refetch()}
              loading={isLoading}
            >
              Refresh
            </Button>
            <Dropdown menu={{ items: exportMenuItems }}>
              <Button icon={<DownloadOutlined />}>
                Export
              </Button>
            </Dropdown>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              size="middle"
              className="shadow-sm"
              onClick={() => router.push("/staff/sessions/record-session") }
            >
              Record Attendance
            </Button>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6'>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-2 text-gray-700 font-medium'>
            <FilterOutlined />
            <span>Filters</span>
            {hasActiveFilters && (
              <Badge count={
                (statusFilter.length > 0 ? 1 : 0) + 
                (sessionTypeFilter.length > 0 ? 1 : 0) + 
                (dateRange ? 1 : 0) +
                (searchValue ? 1 : 0)
              } />
            )}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='flex flex-col gap-2'>
              <label className='text-sm text-gray-600'>Search</label>
              <SearchInput
                searchQueryValue={searchValue}
                handleSearchQueryValue={handleSearchQueryChange}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-sm text-gray-600'>Status</label>
              <Select
                mode="multiple"
                placeholder="Filter by status"
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { label: 'Completed', value: 'completed' },
                  { label: 'Cancelled', value: 'cancelled' },
                  { label: 'Scheduled', value: 'scheduled' },
                  { label: 'No Show', value: 'no-show' }
                ]}
                suffixIcon={<FilterOutlined />}
                className='w-full'
                maxTagCount='responsive'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-sm text-gray-600'>Session Type</label>
              <Select
                mode="multiple"
                placeholder="Filter by type"
                value={sessionTypeFilter}
                onChange={setSessionTypeFilter}
                options={[
                  { label: 'One-on-One', value: 'one-on-one' },
                  { label: 'Group', value: 'group' },
                  { label: 'Consultation', value: 'consultation' }
                ]}
                className='w-full'
                 suffixIcon={<FilterOutlined />}
                maxTagCount='responsive'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-sm text-gray-600'>Date Range</label>
              <RangePicker 
                value={dateRange}
                onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null)}
                className='w-full'
                format="YYYY-MM-DD"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className='flex justify-end'>
              <Button 
                type="link" 
                onClick={handleClearFilters}
                className='text-sm'
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
        <DataTable
          data={tableData}
          searchQuery={searchValue}
          columns={columns}
          rowKey="id"
        />
      </div>
    </div>
  )
}

export default SessionAttendance