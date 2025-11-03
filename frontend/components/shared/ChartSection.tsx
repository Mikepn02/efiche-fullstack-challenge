'use client'

import React, { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import dayjs from 'dayjs'

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899']

interface ChartsSectionProps {
  enrollments?: any[]
  programs?: any[]
}

const ChartsSection = ({ enrollments = [], programs = [] }: ChartsSectionProps) => {
  // Calculate enrollment data over the last 6 months
  const enrollmentData = useMemo(() => {
    const months: { [key: string]: number } = {}
    const now = dayjs()
    
    // Initialize last 6 months with 0
    for (let i = 5; i >= 0; i--) {
      const month = now.subtract(i, 'month')
      months[month.format('MMM')] = 0
    }

    // Count enrollments by month
    enrollments.forEach((enrollment: any) => {
      const enrollDate = enrollment.enrolledAt || enrollment.createdAt
      if (enrollDate) {
        const month = dayjs(enrollDate).format('MMM')
        if (months.hasOwnProperty(month)) {
          months[month]++
        }
      }
    })

    return Object.entries(months).map(([month, enrollments]) => ({
      month,
      enrollments
    }))
  }, [enrollments])

  // Calculate patient distribution by program
  const patientDistribution = useMemo(() => {
    const programCounts: { [key: string]: number } = {}

    enrollments.forEach((enrollment: any) => {
      const programName = enrollment.program?.name || 'Unknown'
      programCounts[programName] = (programCounts[programName] || 0) + 1
    })

    return Object.entries(programCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6) // Top 6 programs
  }, [enrollments])

  if (enrollments.length === 0 && programs.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-700 font-semibold mb-4">Enrollments Over Time</h3>
          <div className="flex items-center justify-center h-[250px] text-gray-400">
            No enrollment data available
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-700 font-semibold mb-4">Patients by Program</h3>
          <div className="flex items-center justify-center h-[250px] text-gray-400">
            No enrollment data available
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Line Chart */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-gray-700 font-semibold mb-4">
          Enrollments Over Time
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={enrollmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="enrollments"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-gray-700 font-semibold mb-4">
          Patients by Program
        </h3>
        {patientDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={patientDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {patientDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-gray-400">
            No program distribution data available
          </div>
        )}
      </div>
    </div>
  )
}

export default ChartsSection
