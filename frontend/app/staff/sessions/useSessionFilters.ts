import { useState, useMemo } from 'react'
import { IAttendanceResponse, IAttendanceTable } from '@/types'
import dayjs from 'dayjs'

export const useSessionFilters = (sessions: IAttendanceResponse[] | undefined) => {
  const [searchValue, setSearchValue] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [sessionTypeFilter, setSessionTypeFilter] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null)

  const tableData: IAttendanceTable[] = useMemo(() => {
    let filtered = (sessions ?? []).map((a: IAttendanceResponse) => ({
      id: String(a.id),
      patientName: a.patientName,
      programName: a.programName ?? '-', 
      attendedAt: new Date(a.attendedAt).toLocaleString(),
      sessionStatus: a.sessionStatus,
      cancelReason: a.cancelReason ? a.cancelReason : '-',
      schelduredDate: new Date(a.schelduredDate).toLocaleDateString(),
      sessionType: a.sessionType,
      attendanceMarkedBy: a.attendanceMarkedBy,
      _rawScheduledDate: a.schelduredDate,
    }))


    if (statusFilter.length > 0) {
      filtered = filtered.filter((item: { sessionStatus: string }) =>
        statusFilter.includes(item.sessionStatus.toUpperCase())
      )
    }

    if (sessionTypeFilter.length > 0) {
      filtered = filtered.filter((item: { sessionType: string }) =>
        sessionTypeFilter.includes(item.sessionType.toUpperCase())
      )
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((item: { _rawScheduledDate: string | number | dayjs.Dayjs | Date | null | undefined }) => {
        const itemDate = dayjs(item._rawScheduledDate)
        return itemDate.isAfter(dateRange[0]) && itemDate.isBefore(dateRange[1])
      })
    }

    return filtered
  }, [sessions, statusFilter, sessionTypeFilter, dateRange])

  const handleClearFilters = () => {
    setStatusFilter([])
    setSessionTypeFilter([])
    setDateRange(null)
    setSearchValue("")
  }

  const hasActiveFilters = statusFilter.length > 0 || sessionTypeFilter.length > 0 || dateRange !== null || searchValue !== ""

  return {
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
  }
}

