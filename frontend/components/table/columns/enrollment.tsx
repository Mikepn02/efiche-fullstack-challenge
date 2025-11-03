import { formatDate } from "@/lib/utils";
import { IEnrollment } from "@/types";
import { BarChartOutlined, CalendarOutlined, FileTextOutlined, UserOutlined } from "@ant-design/icons";
import { Checkbox, Tag, Tooltip } from "antd";

export const enrollmentColumns = (
    selectedKey: string | null,
    handleEditRow: (enrollment: IEnrollment) => void,
    handleDeleteRow: () => void,
    handleCheckBoxChange: (key: string, item: IEnrollment) => void
) => {
    const baseColumns = [
        {
            title: "",
            key: "checkbox",
            width: 50,
            fixed: 'left' as const,
            render: (_: any, record: IEnrollment) => (
                <Checkbox
                    checked={record.id === selectedKey}
                    onChange={() => handleCheckBoxChange(record.id.toString(), record)}
                />
            ),
        },
        {
            title: 'ID',
            key: 'rowIndex',
            width: 60,
            fixed: 'left' as const,
            render: (_: any, __: IEnrollment, index: number) => (
                <span className="font-medium">{index + 1}</span>
            ),
        },
        {
            title: 'Patient Name',
            key: 'patientName',
            width: 180,
            ellipsis: true,
            render: (_: any, record: IEnrollment) => {
                const patientName = record.patient ? `${record.patient.firstName} ${record.patient.lastName}` : 'N/A';
                return (
                    <Tooltip title={patientName}>
                        <div className="flex items-center gap-2">
                            <UserOutlined className="text-gray-400 shrink-0" />
                            <span className="font-medium truncate">{patientName}</span>
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Program Name',
            key: 'programName',
            width: 180,
            ellipsis: true,
            render: (_: any, record: IEnrollment) => {
                const programName = record.program?.name || 'N/A';
                return (
                    <Tooltip title={record.program?.description || programName}>
                        <div className="flex items-center gap-2">
                            <FileTextOutlined className="text-gray-400 shrink-0" />
                            <span className="truncate">{programName}</span>
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Status',
            key: 'programStatus',
            width: 100,
            render: (_: any, record: IEnrollment) => {
                const status = record.program?.status;
                const statusConfig: Record<string, { color: string; label: string }> = {
                    'ONGOING': { color: 'blue', label: 'Ongoing' },
                    'COMPLETED': { color: 'green', label: 'Completed' },
                    'ARCHIVED': { color: 'default', label: 'Archived' },
                };
                const config = statusConfig[status || ''] || { color: 'default', label: status || 'N/A' };
                return <Tag color={config.color}>{config.label}</Tag>;
            },
        },
        {
            title: 'Enrolled By',
            key: 'enrolledBy',
            width: 140,
            ellipsis: true,
            render: (_: any, record: IEnrollment) => {
                const enrolledByName = record.enrolledBy?.name || 'N/A';
                return (
                    <Tooltip title={enrolledByName}>
                        <span className="truncate block">{enrolledByName}</span>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Enrolled At',
            key: 'enrolledAt',
            width: 130,
            render: (_: any, record: IEnrollment) => {
                const dateStr = record.enrolledAt
                    ? formatDate(record.enrolledAt)
                    : record.createdAt
                        ? formatDate(record.createdAt)
                        : 'N/A';
                return (
                    <div className="flex items-center gap-2">
                        <CalendarOutlined className="text-gray-400 shrink-0" />
                        <span className="truncate">{dateStr}</span>
                    </div>
                );
            },
        },
        {
            title: 'Statistics',
            key: 'stats',
            width: 160,
            render: (_: any, record: IEnrollment) => {
                const attended = record.stats?.attendedSessions || 0;
                const total = record.stats?.totalSessions || 0;
                const rate = record.stats?.attendanceRate?.toFixed(1) || '0.0';
                const statsText = `${attended}/${total} • ${rate}%`;
                return (
                    <Tooltip title={`Sessions: ${attended}/${total} | Rate: ${rate}%`}>
                        <div className="flex items-center gap-2">
                            <BarChartOutlined className="text-gray-400 shrink-0" />
                            <span className="text-sm truncate">{statsText}</span>
                        </div>
                    </Tooltip>
                );
            },
        },
    ]

    return baseColumns;
}