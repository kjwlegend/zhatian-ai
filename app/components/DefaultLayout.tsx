import React from 'react';
import Footer from './Footer/Footer';
import NewHeader from './Header/headernew';

export function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NewHeader />
      {children}
      <Footer />
    </>
  );
}
