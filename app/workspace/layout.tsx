'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-6">
        <nav className="flex gap-4 border-b">
          <Link
            href="/workspace/projects"
            className={cn(
              "px-4 py-2 hover:text-primary transition-colors",
              pathname === '/workspace/projects' 
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            )}
          >
            Projects
          </Link>
          <Link
            href="/workspace/library"
            className={cn(
              "px-4 py-2 hover:text-primary transition-colors",
              pathname === '/workspace/library'
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            )}
          >
            Component Library
          </Link>

          <Link
            href="/workspace/page-manage"
            className={cn(
              "px-4 py-2 hover:text-primary transition-colors",
              pathname === '/workspace/page-manage'
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            )}
          >
            Page Manage
          </Link>
        </nav>
        {children}
      </div>
    </div>
  );
} 