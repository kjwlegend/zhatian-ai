// 'use client';

import React from 'react';
import AppLayout from './components/AppLayout/AppLayout';

import './styles/global.scss';

import { MantineProvider } from '@mantine/core';

export const metadata = {
  title: '下一代吊炸天的网站加小程序页面自然语言一站式生成系统',
  description: 'Chat interface for AI-assisted coding',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider>
          <AppLayout>{children}</AppLayout>
        </MantineProvider>
      </body>
    </html>
  );
}
