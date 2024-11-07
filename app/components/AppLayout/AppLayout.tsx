'use client';

import React from 'react';
import { AppShell } from '@mantine/core';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import HeaderNew from '../Header/headernew';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <>
      <HeaderNew />
      {children}
      <Footer />
    </>
  );
};

export default AppLayout;
