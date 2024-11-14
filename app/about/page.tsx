'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AboutPage() {
  const [activeTab, setActiveTab] = useState('features');
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const features = [
    {
      icon: 'IconPlaceholder',
      title: '组件式模块化开发',
      description: '基于组件的灵活开发模式，提高代码复用性和维护性',
    },
    { icon: 'IconPlaceholder', title: '全栈代码生成', description: '自动生成前端、后端和测试代码' },
    {
      icon: 'IconPlaceholder',
      title: '自然语言理解',
      description: '通过对话即可完成复杂的开发任务',
    },
    {
      icon: 'IconPlaceholder',
      title: '图像识别集成',
      description: '支持图片识别，快速转化设计为代码',
    },
    { icon: 'IconPlaceholder', title: '实时协作', description: '多人实时协作，提高团队效率' },
    { icon: 'IconPlaceholder', title: '持续学习', description: 'AI持续学习，不断优化开发建议' },
    {
      icon: 'IconPlaceholder',
      title: 'ACE CLI 框架对接',
      description: '无缝集成ACE CLI框架，提升开发效率',
    },
    {
      icon: 'IconPlaceholder',
      title: 'CMS模板支持',
      description: '支持WordPress, Magento, Drupal等CMS模板开发',
    },
    { icon: 'IconPlaceholder', title: '组件市场', description: '丰富的组件市场，加速开发进程' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      <main className="">
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div className="text-center z-10" style={{ opacity, scale }}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-blue-800">
              全栈开发的智能助手
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-600">
              从需求到测试，一站式AI驱动的开发解决方案
            </p>
            <Button size="lg" asChild>
              <a href="#cta">立即体验</a>
            </Button>
          </motion.div>
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-blue-200 opacity-50"></div>
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
                backgroundSize: ['100% 100%', '200% 200%'],
              }}
              transition={{
                duration: 20,
                ease: 'linear',
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                backgroundImage: 'url("/placeholder.svg?height=1080&width=1920")',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>
        </section>

        <section id="features" className="container mx-auto px-4 py-20">
          <h2 className="text-4xl font-bold mb-12 text-center text-blue-800">主要特性</h2>
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="features">功能特性</TabsTrigger>
              <TabsTrigger value="tech">技术亮点</TabsTrigger>
            </TabsList>
            <TabsContent value="features">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.slice(0, 6).map((feature, index) => (
                  <Card key={index}>
                    <CardContent className="flex flex-col items-center text-center p-6">
                      <div className="mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-4 text-blue-600">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="tech">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.slice(6).map((feature, index) => (
                  <Card key={index}>
                    <CardContent className="flex flex-col items-center text-center p-6">
                      <div className="mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-4 text-blue-600">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section id="demo" className="container mx-auto px-4 py-20 bg-blue-50">
          <h2 className="text-4xl font-bold mb-12 text-center text-blue-800">产品演示</h2>
          <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
            <img
              src="/placeholder.svg?height=720&width=1280"
              alt="Product Demo"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        <section id="cta" className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl font-bold mb-6 text-blue-800">准备好革新您的开发流程了吗？</h2>
          <p className="text-xl mb-12 text-gray-600">加入我们，体验AI驱动的全新开发方式</p>
          <Button size="lg" className="animate-pulse">
            开始免费试用 <ChevronDown className="ml-2" />
          </Button>
        </section>
      </main>
    </div>
  );
}

AboutPage.displayName = 'AboutPage';

export default AboutPage;
