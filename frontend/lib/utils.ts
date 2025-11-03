import { ProgramStatus, SessionType } from "@/types";
import { CalendarOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";

/* 
    Format the username to be more user-friendly
  */
export const formatUsername = (name?: string) => {
  return name ?? '';
}


/* 
    Format the avatar initials for advanced UI
  */
export const formatAvatarInitials = (name?: string) => {
  if (!name) return '';

  const parts = name.trim().split(' ');

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  const first = parts[0].charAt(0).toUpperCase();
  const last = parts[parts.length - 1].charAt(0).toUpperCase();

  return `${first}${last}`;
}


export const paginate = (data: any[], pageSize: number, currentPage: number) => {
  const offset = (currentPage - 1) * pageSize;
  return data.slice(offset, offset + pageSize);
};

export const getStatusConfig = (status: ProgramStatus) => {
  const configs = {
    [ProgramStatus.ONGOING]: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Ongoing' },
    [ProgramStatus.COMPLETED]: { color: 'bg-green-100 text-green-700 border-green-200', label: 'Completed' },
    [ProgramStatus.ARCHIVED]: { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Archived' },
  };
  return configs[status];
};


export const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null; // SSR-safe
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

export const formatDate = (isoString: string, options?: Intl.DateTimeFormatOptions) => {
  if (!isoString) return '';

  const date = new Date(isoString);

  // Default format: "Apr 15, 1990"
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  };

  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

