'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBrandSelector } from '../../hooks/useBrandSelector';
import { useBdStore } from '../../store/useBdStore';

export function BrandSelector() {
  const { brandList } = useBdStore();
  const { selectedBrand, customBrand, setCustomBrand, handleBrandSelect, handleCustomBrandSubmit } =
    useBrandSelector();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>选择品牌</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="select" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">选择品牌</TabsTrigger>
            <TabsTrigger value="input">输入品牌</TabsTrigger>
          </TabsList>
          <TabsContent value="select">
            <Select onValueChange={handleBrandSelect} value={selectedBrand}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择目标品牌" />
              </SelectTrigger>
              <SelectContent>
                {brandList.map((brand) => (
                  <SelectItem key={brand.id} value={brand.value}>
                    {brand.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TabsContent>
          <TabsContent value="input">
            <div className="flex space-x-2">
              <Input
                placeholder="输入品牌名称"
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
              />
              <Button onClick={handleCustomBrandSubmit}>提交</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
