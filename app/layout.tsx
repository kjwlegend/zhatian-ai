// 'use client'
import React from 'react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { theme } from '../theme';
import AppLayout from './components/AppLayout/AppLayout';
import '@mantine/core/styles.css';
import './styles/global.scss';

export const metadata = {
  title: '下一代吊炸天的语言控制CMS生成一体化平台',
  description: 'Chat interface for AI-assisted coding',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <AppLayout>
            {children}
          </AppLayout>
        </MantineProvider>
      </body>
    </html>
  );
}
