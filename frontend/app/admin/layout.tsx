"use client";

import Sidebar from "@/components/shared/Sidebar";
import { formatAvatarInitials, formatUsername } from "@/lib/utils";
import { useUserStore } from "@/store/user-store";
import { MenuOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import React, { useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserStore();
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-primary transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:block`}
      >
        <Sidebar />
      </aside>

      <div className="flex flex-col flex-1 w-full relative overflow-y-auto bg-white rounded-l-3xl ml-0 lg:-ml-5 z-10 md:z-30">
        {/* Header */}
        <header className="sticky top-0 z-20 shadow-sm bg-white">
          <div className="flex items-center justify-between md:justify-end px-4 py-3 lg:px-6">
            <button
              onClick={toggleSidebar}
              className="p-2 flex lg:hidden text-gray-600 rounded-md hover:bg-gray-100 transition"
              aria-label="Toggle sidebar"
            >
              <MenuOutlined />
            </button>

            <div className="flex items-center px-3 py-2 space-x-3 rounded-xl">
              <div className="flex-col hidden sm:flex justify-end items-end">
                <h1 className="text-sm font-medium">
                  {formatUsername(user?.name)}
                </h1>
                <p className="text-xs text-gray-500 truncate max-w-[150px]">
                  {user?.email}
                </p>
              </div>
              <Avatar>{formatAvatarInitials(user?.name)}</Avatar>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <div className="pt-12 px-4 md:px-8 flex-1 overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
