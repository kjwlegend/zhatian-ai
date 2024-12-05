'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useBidRequirements } from '../../hooks/useBidRequirements';

export function BidRequirements() {
  const { bidRequirements, setBidRequirements, handleSubmit } = useBidRequirements();

  return (
    <Card>
      <CardHeader>
        <CardTitle>输入新的投标需求</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">投标背景</label>
          <Textarea
            placeholder="请输入投标背景..."
            className="mt-1"
            value={bidRequirements.background}
            onChange={(e) =>
              setBidRequirements({
                ...bidRequirements,
                background: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">需求范围</label>
          <Textarea
            placeholder="请输入需求范围..."
            className="mt-1"
            value={bidRequirements.scope}
            onChange={(e) =>
              setBidRequirements({
                ...bidRequirements,
                scope: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">投标方向</label>
          <Textarea
            placeholder="请输入投标方向..."
            className="mt-1"
            value={bidRequirements.direction}
            onChange={(e) =>
              setBidRequirements({
                ...bidRequirements,
                direction: e.target.value,
              })
            }
          />
        </div>
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={
            !bidRequirements.background || !bidRequirements.scope || !bidRequirements.direction
          }
        >
          提交需求
        </Button>
      </CardContent>
    </Card>
  );
}
