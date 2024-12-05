import React from 'react';
import Footer from './Footer/Footer';
import HeaderNew from './Header/headernew';

export function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderNew />
      {children}
      <Footer />
    </>
  );
}
