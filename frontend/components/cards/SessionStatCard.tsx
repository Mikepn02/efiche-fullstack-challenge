import React from 'react';
import { Card, Statistic, Row, Col, Badge } from 'antd';

interface DashboardStatisticCardProps {
  title: string;
  value: number;
  prefix?: React.ReactNode;
  valueStyle?: React.CSSProperties;
  badgeCount?: number;
}

const DashboardStatisticCard: React.FC<DashboardStatisticCardProps> = ({
  title,
  value,
  prefix,
  valueStyle,
  badgeCount,
}) => {
  const content = (
    <Statistic
      title={title}
      value={value}
      prefix={prefix}
      valueStyle={valueStyle}
    />
  );

  return (
    <Card>
      {badgeCount ? <Badge count={badgeCount} offset={[10, 0]}>{content}</Badge> : content}
    </Card>
  );
};

export default DashboardStatisticCard;
