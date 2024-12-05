'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Library,
  MessageCircle,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
};

const navItems: NavItem[] = [
  { href: '/about', label: '介绍', icon: <HelpCircle className="mr-2 h-4 w-4" /> },
  { href: '/chats', label: '聊天', icon: <MessageCircle className="mr-2 h-4 w-4" /> },
  { href: '/bd', label: 'BD助手', icon: <MessageCircle className="mr-2 h-4 w-4" /> },

  {
    href: '/workspace',
    label: '工作区',
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
  },
  {
    href: '/market-place',
    label: '组件市场',
    icon: <Library className="mr-2 h-4 w-4" />,
    // disabled: true,
  },
  { href: '/faq', label: '常见问题', icon: <FileText className="mr-2 h-4 w-4" /> },
  { href: '/founders', label: '创始人', icon: <Users className="mr-2 h-4 w-4" /> },
];

export default function Header({ user = null }: { user?: { name: string; image: string } | null }) {
  const pathname = usePathname();

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex-shrink-0">
              <Image src="/logo.png" alt="Logo" width={120} height={40} />
            </Link>
            <nav className="hidden md:flex md:space-x-4">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? 'default' : 'ghost'}
                  disabled={item.disabled}
                  asChild
                >
                  <Link
                    href={item.href}
                    className={`flex items-center ${item.disabled ? 'pointer-events-none opacity-50' : ''}`}
                    aria-disabled={item.disabled}
                    tabIndex={item.disabled ? -1 : undefined}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {user ? (
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">{user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" className="flex items-center space-x-2">
                    登录
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                {user ? (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">m@example.com</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>个人资料</DropdownMenuItem>
                    <DropdownMenuItem>设置</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>登出</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>登录</DropdownMenuItem>
                    <DropdownMenuItem>注册</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
