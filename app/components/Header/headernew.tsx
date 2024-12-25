'use client';

import * as React from 'react';
import { Logo } from './logo';
import { MainNav } from './main-nav';
import { SideNav } from './side-nav';

const NewHeader = () => {
  return (
    <div className="sticky p-2  top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container  flex h-14 items-center">
        <Logo />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-start">
          <MainNav />
        </div>
        <SideNav />
      </div>
    </div>
  );
};

export default NewHeader;
