import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { PixelCompareConfig } from '../types';

interface CompareConfigProps {
  config: PixelCompareConfig;
  onChange: (config: PixelCompareConfig) => void;
}

export function CompareConfig({ config, onChange }: CompareConfigProps) {
  const handleThresholdChange = (value: number[]) => {
    onChange({
      ...config,
      threshold: value[0]
    });
  };

  const handleColorToleranceChange = (value: number[]) => {
    onChange({
      ...config,
      colorTolerance: value[0]
    });
  };

  const handleToggleChange = (key: keyof PixelCompareConfig) => (checked: boolean) => {
    onChange({
      ...config,
      [key]: checked
    });
  };

  const handleRegionChange = (field: 'x' | 'y' | 'width' | 'height') => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...config,
      regionMask: {
        x: field === 'x' ? (parseInt(e.target.value) || 0) : (config.regionMask?.x ?? 0),
        y: field === 'y' ? (parseInt(e.target.value) || 0) : (config.regionMask?.y ?? 0),
        width: field === 'width' ? (parseInt(e.target.value) || 0) : (config.regionMask?.width ?? 0),
        height: field === 'height' ? (parseInt(e.target.value) || 0) : (config.regionMask?.height ?? 0)
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparison Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pixel Precision Controls */}
          <div className="space-y-4">
            <h3 className="font-medium">Pixel Precision</h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="threshold">Threshold</Label>
                <span className="text-sm text-gray-500">
                  {(config.threshold * 100).toFixed(0)}%
                </span>
              </div>
              <Slider
                id="threshold"
                min={0}
                max={1}
                step={0.01}
                value={[config.threshold]}
                onValueChange={handleThresholdChange}
              />
              <p className="text-xs text-gray-500">
                Adjust the sensitivity of pixel difference detection
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="colorTolerance">Color Tolerance</Label>
                <span className="text-sm text-gray-500">
                  {(config.colorTolerance * 100).toFixed(0)}%
                </span>
              </div>
              <Slider
                id="colorTolerance"
                min={0}
                max={1}
                step={0.01}
                value={[config.colorTolerance]}
                onValueChange={handleColorToleranceChange}
              />
              <p className="text-xs text-gray-500">
                Adjust the tolerance for color differences
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="antiAliasing"
                checked={config.antiAliasing}
                onCheckedChange={handleToggleChange('antiAliasing')}
              />
              <Label htmlFor="antiAliasing">Handle Anti-aliasing</Label>
            </div>
          </div>

          {/* AI Enhancement Options */}
          {/* <div className="space-y-4">
            <h3 className="font-medium">AI Enhancements</h3>

            <div className="flex items-center space-x-2">
              <Switch
                id="useAI"
                checked={config.useAI}
                onCheckedChange={handleToggleChange('useAI')}
              />
              <Label htmlFor="useAI">Enable AI Analysis</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="elementDetection"
                checked={config.elementDetection}
                disabled={!config.useAI}
                onCheckedChange={handleToggleChange('elementDetection')}
              />
              <Label htmlFor="elementDetection">UI Element Detection</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="semanticAnalysis"
                checked={config.semanticAnalysis}
                disabled={!config.useAI}
                onCheckedChange={handleToggleChange('semanticAnalysis')}
              />
              <Label htmlFor="semanticAnalysis">Semantic Analysis</Label>
            </div>
          </div> */}

          {/* Performance Options */}
          {/* <div className="space-y-4">
            <h3 className="font-medium">Performance</h3>

            <div className="flex items-center space-x-2">
              <Switch
                id="useParallel"
                checked={config.useParallel}
                onCheckedChange={handleToggleChange('useParallel')}
              />
              <Label htmlFor="useParallel">Parallel Processing</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="cacheResults"
                checked={config.cacheResults}
                onCheckedChange={handleToggleChange('cacheResults')}
              />
              <Label htmlFor="cacheResults">Cache Results</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="progressiveLoading"
                checked={config.progressiveLoading}
                onCheckedChange={handleToggleChange('progressiveLoading')}
              />
              <Label htmlFor="progressiveLoading">Progressive Loading</Label>
            </div>
          </div> */}

          {/* Region Selection */}
          {config.regionMask && (
            <div className="space-y-4">
              <h3 className="font-medium">Region Selection</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="regionX">X Position</Label>
                  <input
                    type="number"
                    id="regionX"
                    value={config.regionMask?.x ?? 0}
                    onChange={handleRegionChange('x')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regionY">Y Position</Label>
                  <input
                    type="number"
                    id="regionY"
                    value={config.regionMask?.y ?? 0}
                    onChange={handleRegionChange('y')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regionWidth">Width</Label>
                  <input
                    type="number"
                    id="regionWidth"
                    value={config.regionMask?.width ?? 0}
                    onChange={handleRegionChange('width')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regionHeight">Height</Label>
                  <input
                    type="number"
                    id="regionHeight"
                    value={config.regionMask?.height ?? 0}
                    onChange={handleRegionChange('height')}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
