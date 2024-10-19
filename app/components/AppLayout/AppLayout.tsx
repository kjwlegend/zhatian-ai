'use client'
import React from 'react';
import { AppShell } from '@mantine/core';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        {children}
      </AppShell.Main>

      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};

export default AppLayout;
