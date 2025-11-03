'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App as AntApp } from 'antd';
import { useState } from 'react';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        colorPrimary: '#0000FF',
                    },
                },
            }}
        >
            <AntdRegistry>
                <QueryClientProvider client={queryClient}>
                 {children}
                </QueryClientProvider>
            </AntdRegistry>
        </ConfigProvider>
    );
}
