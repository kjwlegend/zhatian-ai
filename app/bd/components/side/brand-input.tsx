'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function BrandInput() {
  const [brand, setBrand] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle brand submission
    console.log('Submitted brand:', brand);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>步骤 1: 输入目标品牌</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            placeholder="输入品牌名称"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <Button type="submit">提交</Button>
        </form>
      </CardContent>
    </Card>
  );
}
