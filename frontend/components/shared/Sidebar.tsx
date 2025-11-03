"use client"
import { adminSidebarItems , staffSidebarItems, guestSidebarItems } from '@/constants';
import { useLogout } from '@/hooks/use-auth';
import { useUserStore } from '@/store/user-store';
import { LogoutOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Image from 'next/image'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

const Sidebar = () => {
  const pathname = usePathname();
  const logoutMutation = useLogout();
  const { user } = useUserStore();
  
  const isActive = (path: string) => pathname === path;
  
  const handleLogout = () => {
    logoutMutation.mutate();
  }

  const sidebarItems = user?.role === "ADMIN" 
    ? adminSidebarItems 
    : user?.role === "STAFF" 
    ? staffSidebarItems 
    : guestSidebarItems || [];
  
  return (
    <div className='h-full w-72 flex flex-col bg-primary shadow-xl'>
      {/* Logo Section */}
      <Link href={user ? '/' : '/auth/sign-in'} className='flex items-center justify-center h-20 px-6 border-b border-white/10'>
        <Image
          src="/logo.svg"
          alt='logo'
          width={120}
          height={120}
          className='object-contain'
        />
      </Link>
      
      {/* Navigation Section */}
      <nav className='flex-1 py-6 overflow-y-auto'>
        <div className='flex flex-col space-y-1 px-3'>
          {sidebarItems?.map((item) => {
            const active = isActive(item.href)
            return (
              <Link key={item.id} href={item.href}>
                <div
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-lg
                    cursor-pointer transition-all duration-200
                    ${active 
                      ? "bg-white/20 shadow-lg border-l-4 border-white" 
                      : "hover:bg-white/10"
                    }
                  `}
                >
                  <span className={`text-xl ${active ? 'text-white' : 'text-white/80'}`}>
                    {item.icon}
                  </span>
                  <span className={`text-sm font-medium ${active ? 'text-white' : 'text-white/90'}`}>
                    {item.name}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>
      
      {/* Logout Section */}
      {user && (
        <div className="border-t border-white/10 p-4">
          <Button
            onClick={handleLogout}
            type="text"
            className="
              w-full flex items-center justify-start gap-3
              px-4 py-3 rounded-lg
              text-white/90 hover:text-white
              hover:bg-white/10 transition-all duration-200
            "
            style={{ justifyContent: "start"}}
          >
            <span className='text-white'><LogoutOutlined className="text-lg" /></span>
            <span className="text-sm font-bold text-white">Logout</span>
          </Button>
        </div>
      )}
    </div>
  )
}

export default Sidebar
