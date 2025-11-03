"use client";
import React, { useMemo } from "react";
import { usePrograms } from "@/hooks/use-program";
import { Card, Tag, Empty } from "antd";
import {
  AppstoreOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { formatDate } from "@/lib/utils";

const Overview = () => {
  const { data: allPrograms } = usePrograms();

  const activePrograms = useMemo(() => {
    if (!allPrograms) return [];
    return allPrograms.filter((p: any) => p.status === "ONGOING");
  }, [allPrograms]);

  return (
    <div className="w-full flex flex-col gap-y-8">
      <div className="text-gray-700 flex items-center gap-2">
        <InfoCircleOutlined className="text-blue-500" />
        <p className="text-lg font-medium">
          Welcome! Here's your overview of active programs.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <AppstoreOutlined className="text-green-600 text-xl" />
        <h2 className="text-2xl font-semibold text-gray-900">
          Active Programs{" "}
          <span className="text-gray-500">({activePrograms.length})</span>
        </h2>
      </div>


      {activePrograms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {activePrograms.map((program: any) => (
            <Card
              key={program.id}
              hoverable
              className="transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md rounded-xl"
              style={{ padding: "1.2rem" }}
            >
              <div className="flex flex-col gap-4">
    
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-gray-900 leading-snug">
                    {program.name}
                  </h3>
                  <Tag color="green" className="font-medium">
                    Active
                  </Tag>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {program.description}
                </p>


                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CalendarOutlined className="text-gray-500" />
                    <span>
                      <strong>Start:</strong> {formatDate(program.startDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarOutlined className="text-gray-500" />
                    <span>
                      <strong>End:</strong> {formatDate(program.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex justify-center py-12">
          <Empty
            description={
              <span className="text-gray-500">No active programs yet</span>
            }
          />
        </div>
      )}
    </div>
  );
};

export default Overview;
