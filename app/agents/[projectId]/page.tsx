'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { IFRAME_SRC } from '@/app/config/iframeSrc';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function ProjectPage() {
  const params = useParams();
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (password === 'xiaoguang666') {
      setIsVerified(true);
      setError('');
      const iframeSrc = IFRAME_SRC[params.projectId as string] || IFRAME_SRC.default;
      window.open(`${iframeSrc}/`, '_blank');
    } else {
      setError('密码错误，请重试');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  if (!isVerified) {
    return (
      <div className="container mx-auto py-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>访问验证</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="请输入访问密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button className="w-full" onClick={handleVerify}>
                验证
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
  const iframeSrc = IFRAME_SRC[params.projectId as string] || IFRAME_SRC.default;

  return (
    <div className="container mx-auto py-6">
      <div className="aspect-[16/9] w-full">
        <iframe
          src={`${iframeSrc}`}
          className="w-full h-full border-0 rounded-lg"
          allow="camera; microphone"
        />
      </div>
    </div>
  );
}
