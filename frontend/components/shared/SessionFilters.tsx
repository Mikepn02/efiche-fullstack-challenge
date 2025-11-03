import React from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

interface SessionFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  sessionTypeFilter: string;
  onSessionTypeFilterChange: (value: string) => void;
}

const SessionFilters: React.FC<SessionFiltersProps> = ({
  searchValue,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  statusFilter,
  onStatusFilterChange,
  sessionTypeFilter,
  onSessionTypeFilterChange,
}) => {
  const filterConfigs = [
    {
      value: dateFilter,
      onChange: onDateFilterChange,
      options: [
        { value: 'all', label: 'All Dates' },
        { value: 'today', label: 'Today' },
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'past', label: 'Past' }
      ]
    },
    {
      value: statusFilter,
      onChange: onStatusFilterChange,
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'attended', label: 'Attended' },
        { value: 'missed', label: 'Missed' },
        { value: 'canceled', label: 'Canceled' }
      ]
    },
    {
      value: sessionTypeFilter,
      onChange: onSessionTypeFilterChange,
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'one-on-one', label: 'One-on-One' },
        { value: 'group', label: 'Group' },
        { value: 'consultation', label: 'Consultation' }
      ]
    }
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch sm:items-center gap-2">
      <Search
        placeholder="Search by patient, session..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ width: 250 }}
        prefix={<SearchOutlined />}
        allowClear
      />
      {filterConfigs.map((filter, i) => (
        <Select
          key={i}
          value={filter.value}
          onChange={filter.onChange}
          style={{ width: 150 }}
          suffixIcon={<FilterOutlined />}
        >
          {filter.options.map(opt => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
      ))}
    </div>
  );
};

export default SessionFilters;