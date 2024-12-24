'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AuthForm } from './components/auth-form';

export default function AuthPage() {
  const router = useRouter();

  const handleAuthSuccess = () => {
    router.push('/');
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900">
            <Image
              src="https://picsum.photos/seed/auth/1200/1600"
              alt="Authentication background"
              fill
              className="object-cover opacity-50"
              priority
            />
          </div>
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            AI 组件库
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;这个平台让我的开发效率提升了10倍，AI辅助让编程变得如此简单和有趣。&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">登录账户</h1>
              <p className="text-sm text-muted-foreground">
                输入您的邮箱开始使用，或使用以下方式快速登录
              </p>
            </div>
            <AuthForm onSuccess={handleAuthSuccess} />
            <p className="px-8 text-center text-sm text-muted-foreground">
              点击继续，即表示您同意我们的{' '}
              <a href="/terms" className="underline underline-offset-4 hover:text-primary">
                服务条款
              </a>{' '}
              和{' '}
              <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
                隐私政策
              </a>
              。
            </p>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
