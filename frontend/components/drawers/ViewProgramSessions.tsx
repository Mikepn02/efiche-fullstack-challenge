// components/drawers/ViewProgramSessions.tsx
import { useProgramSessions } from '@/hooks/use-program';
import { IProgram, Session, SessionFrequency, SessionType } from '@/types';
import { CalendarOutlined, ClockCircleOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Drawer, Empty, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

interface ViewProgramSessionsProps {
    visible: boolean;
    onClose: () => void;
    program: IProgram | null;
}

const ViewProgramSessions: React.FC<ViewProgramSessionsProps> = ({
    visible,
    onClose,
    program
}) => {
    const { data: sessions, isLoading } = useProgramSessions(program?.id || null);

    const getSessionTypeConfig = (type: SessionType) => {
            const config = {
                [SessionType.ONE_ON_ONE]: { icon: <UserOutlined />, color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'One-on-One' },
                [SessionType.GROUP]: { icon: <TeamOutlined />, color: 'bg-green-100 text-green-700 border-green-200', label: 'Group' },
                [SessionType.CONSULTATION]: { icon: <CalendarOutlined />, color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Consultation' },
            };
            return config[type];
        };

    return (
        <Drawer
            title={
                <div className="flex flex-col gap-2">
                    <span className="text-lg font-semibold">Program Sessions</span>
                    {program && (
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-900">{program.name}</span>
                            <span className="text-xs text-gray-500">
                                <CalendarOutlined className="mr-1" />
                                {dayjs(program.startDate).format('MMM DD, YYYY')} - {dayjs(program.endDate).format('MMM DD, YYYY')}
                            </span>
                        </div>
                    )}
                </div>
            }
            placement="right"
            onClose={onClose}
            open={visible}
            width={600}
        >
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Spin size="large" />
                </div>
            ) : sessions && sessions.length > 0 ? (
                <div className="space-y-4">
                    {sessions.map((session: Session) => {
                        const sessionConfig = getSessionTypeConfig(session.sessionType);
                        return (
                            <div
                                key={session.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-gray-900 text-base">
                                        {session.title}
                                    </h3>
                                    <Tag
                                        className={`${sessionConfig.color} border-0`}
                                        icon={sessionConfig.icon}
                                    >
                                        {sessionConfig.label}
                                    </Tag>
                                </div>

                                <p className="text-sm text-gray-600 mb-3">
                                    {session.description}
                                </p>

                                <div className="flex flex-wrap gap-3 text-sm">
                                    <div className="flex items-center gap-1 text-gray-700">
                                        <CalendarOutlined className="text-blue-500" />
                                        <span>{dayjs(session.date).format('MMM DD, YYYY')}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-700">
                                        <ClockCircleOutlined className="text-green-500" />
                                        <span>{dayjs(session.date).format('HH:mm')}</span>
                                    </div>
                                    <Tag color="purple" className="border-purple-200">
                                        {session.frequency}
                                    </Tag>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <Empty
                    description="No sessions found for this program"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            )}
        </Drawer>
    );
};

export default ViewProgramSessions;