'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { InfoIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Icons } from '@/app/components/ui/icons';
import { useAuth } from '@/app/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthFormProps {
  onSuccess: () => void;
}

const formSchema = z.object({
  email: z
    .string()
    .email({
      message: '请输入有效的邮箱地址',
    })
    .refine((email) => email.endsWith('@baozun.com'), {
      message: '只支持 @baozun.com 域名的邮箱',
    }),
  password: z
    .string()
    .min(8, {
      message: '密码长度至少为8位',
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: '密码必须包含大小写字母和数字',
    }),
});

export function AuthForm({ onSuccess }: AuthFormProps) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { login } = useAuth();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      await login(values.email, values.password);
      toast.success('登录成功');
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('登录失败，请检查邮箱和密码');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>登录说明</AlertTitle>
        <AlertDescription>
          本系统仅支持宝尊内部员工使用，请使用您的企业邮箱(@baozun.com)进行登录。
          如果您还没有账号，系统会自动为您创建账号。
        </AlertDescription>
      </Alert>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">企业邮箱</Label>
            <Input
              id="email"
              placeholder="your.name@baozun.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">密码</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                disabled={isLoading}
                {...form.register('password')}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '隐藏' : '显示'}
              </Button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
            <p className="text-sm text-muted-foreground">密码至少8位，必须包含大小写字母和数字</p>
          </div>

          <Button disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            登录 / 注册
          </Button>
        </div>
      </form>

      <div className="text-sm text-muted-foreground">
        <p>登录即表示您同意：</p>
        <ul className="list-disc list-inside">
          <li>遵守公司的安全规范</li>
          <li>不向外部分享或泄露系统信息</li>
          <li>为您的账户安全负责</li>
        </ul>
      </div>
    </div>
  );
}
