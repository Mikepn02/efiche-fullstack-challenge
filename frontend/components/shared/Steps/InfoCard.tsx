import React from 'react'
import { Card, Row, Col } from 'antd'

interface InfoCardProps {
  title?: string
  data: { label: string; value: any }[]
}

const InfoCard: React.FC<InfoCardProps> = ({ title, data }) => (
  <Card size="small" className="bg-gray-50 mb-4">
    {title && <h3 className="font-medium mb-2 text-xs sm:text-sm">{title}</h3>}
    <Row gutter={[8, 8]}>
      {data.map((d, i) => (
        <Col xs={24} sm={12} md={12} key={i}>
          <div className="text-xs text-gray-600">{d.label}</div>
          <div className="font-medium text-xs sm:text-sm break-words">{d.value}</div>
        </Col>
      ))}
    </Row>
  </Card>
)

export default InfoCard

