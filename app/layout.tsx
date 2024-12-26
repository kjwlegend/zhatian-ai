import React from 'react';

import './styles/global.scss';
import { TALKING_DATA_APPID, VERSION } from './utils/constant';

import { MantineProvider } from '@mantine/core';
import { Toaster } from '@/components/ui/toaster';
import { DefaultLayout } from './components/DefaultLayout';

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
        <script
          async
          src={
            `https://jic.talkingdata.com/app/h5/v1?appid=${TALKING_DATA_APPID}&vn=公测版&vc=${VERSION}`
          }
        ></script>
      </head>
      <body>
        <MantineProvider>
          <DefaultLayout>{children}</DefaultLayout>
          <Toaster />
        </MantineProvider>
      </body>
    </html>
  );
}
