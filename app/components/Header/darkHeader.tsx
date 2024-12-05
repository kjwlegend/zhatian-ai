'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function DarkHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm border-b border-slate-700/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo-w.png" alt="Logo" className="h-8 w-8" />
              <span className="text-lg font-bold text-white">AI Assistant</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-6">
            <Link
              href="/about"
              className={cn(
                'text-sm font-medium transition-colors hover:text-white/80',
                pathname === '/about' ? 'text-white' : 'text-white/60'
              )}
            >
              关于
            </Link>
            <Link
              href="/docs"
              className={cn(
                'text-sm font-medium transition-colors hover:text-white/80',
                pathname === '/docs' ? 'text-white' : 'text-white/60'
              )}
            >
              文档
            </Link>
            <Button
              variant="ghost"
              className="border border-slate-700 hover:bg-slate-800/50 text-white"
            >
              登录
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
