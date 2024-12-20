'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Braces,
  Brain,
  Check,
  Code,
  Code2,
  Component,
  Database,
  FileCode,
  FileSearch,
  GitBranch,
  GitFork,
  HeartHandshake,
  Layers,
  LayoutTemplate,
  MessageSquare,
  Puzzle,
  Rocket,
  Settings,
  TestTube,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 核心应用数据
const coreApps = [
  {
    icon: <FileSearch className="w-8 h-8" />,
    title: '售前支持',
    description: '历史投标检索、品牌新闻分析、投标方案评估、演讲稿生成演练',
    features: ['历史投标检索', '品牌新闻分析', '投标方案评估', '演讲稿生成演练'],
    color: 'from-slate-700 to-slate-800',
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: '需求分析',
    description: '业务需求分析、基于设计稿生成、快速需求文档撰写、产品文档撰写',
    features: ['业务需求分析', '基于设计稿生成', '快速需求文档撰写', '产品文档撰写'],
    color: 'from-slate-700 to-slate-800',
  },
  {
    icon: <Code2 className="w-8 h-8" />,
    title: '开发辅助',
    description:
      '快速前端框架代码、宝塔UNEX/LIGHT配置、UNEX接口生成对接、测试用例编写、测试脚本生成',
    features: [
      '快速前端框架代码',
      '宝塔UNEX/LIGHT配置',
      'UNEX接口生成对接',
      '测试用例编写',
      '测试脚本生成',
    ],
    color: 'from-slate-700 to-slate-800',
  },
  {
    icon: <HeartHandshake className="w-8 h-8" />,
    title: '运营支持',
    description: '自然语言式快速生成页面内容、客服话术演练',
    features: ['自然语言式快速生成页面内容', '客服话术演练'],
    color: 'from-slate-700 to-slate-800',
  },
];

// 在coreApps数据后添加以下features数据
const features = [
  {
    category: '3集成',
    items: [
      {
        icon: <Code className="w-6 h-6 text-white" />,
        title: 'ACE/UNEX框架集成',
        description: '基于TIC ACE/UNEX团队开发框架文档，训练大模型输出前后端标准文档',
      },
      {
        icon: <Braces className="w-6 h-6 text-white" />,
        title: '多开发语言集成',
        description: '集成vue, React, python, nodejs, Java进行全栈语言开发',
      },
      {
        icon: <LayoutTemplate className="w-6 h-6 text-white" />,
        title: '基于CMS框架标准集成',
        description: '目前对接wordpress, drupal等CMS体系，具备直接生成静态页面能力',
      },
    ],
  },
  {
    category: '3沉淀',
    items: [
      {
        icon: <FileCode className="w-6 h-6 text-white" />,
        title: '售前BD方法论沉淀',
        description: '基于TIC内部实施和BD投标经验，周期总结提炼并给出下一次指南建议',
      },
      {
        icon: <Component className="w-6 h-6 text-white" />,
        title: '开发组件库沉淀',
        description: '当验证组件越来越多，新项目的复用性会大幅度提升',
      },
      {
        icon: <BookOpen className="w-6 h-6 text-white" />,
        title: '技术经验沉淀',
        description: '持续学习主导WIKI知识库，跨团队经验交流 AI 智能回答',
      },
    ],
  },
  {
    category: '3调优',
    items: [
      {
        icon: <Settings className="w-6 h-6 text-white" />,
        title: '输出调优',
        description: '输出模板根据团队需求或宝塔SOP链路，进行针对调优',
      },
      {
        icon: <GitFork className="w-6 h-6 text-white" />,
        title: '链路调优',
        description: '根据工作流来对上下文场景以及语义分析进行针对性调优',
      },
      {
        icon: <Layers className="w-6 h-6 text-white" />,
        title: '底层调优',
        description: '对大模型推演、逻辑思考过程进行思维链调优',
      },
    ],
  },
];

function AboutPage() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white [&>header]:bg-transparent [&>header]:backdrop-blur-sm [&>header]:border-slate-700/50 [&>header]:text-white [&>header_a]:text-white/60 [&>header_a:hover]:text-white/80 [&>header_.active]:text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-between overflow-hidden px-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-gray-700/50 to-gray-900/80 mix-blend-multiply" />
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
              backgroundSize: ['100% 100%', '150% 150%'],
            }}
            transition={{
              duration: 20,
              ease: 'linear',
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              backgroundImage: 'url("/grid.svg")',
              opacity: 0.1,
            }}
          />
        </div>

        <div className="flex items-center justify-between w-full">
          <motion.div
            className="relative z-10 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 text-left">
              快，但不只是快！
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-300 text-left">
              从需求到交付，AI 赋能全流程，让创意闪电般实现
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={() => (window.location.href = '/chats')}
            >
              开始体验 <ArrowRight className="ml-2" />
            </Button>
          </motion.div>

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-[600px] h-[600px] rounded-lg overflow-hidden relative">
              <Image src="/banner.jpg" alt="Banner image" fill className="object-cover" priority />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Apps Section */}
      <section className="container mx-auto px-4 py-32">
        <h2 className="text-4xl font-bold text-center mb-20">核心应用</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreApps.map((app, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <Card className="h-full p-6 bg-slate-800/90 backdrop-blur-lg border-slate-700 hover:border-slate-600 transition-all">
                <div
                  className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${app.color}`}
                >
                  {app.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-100">{app.title}</h3>
                <p className="text-gray-400 mb-6">{app.description}</p>
                <ul className="space-y-2">
                  {app.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-300">
                      <Check className="w-4 h-4 mr-2 text-blue-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section - 保持原有的features数据，但改变展示方式 */}
      <section ref={ref} className="container mx-auto px-4 py-32 relative">
        <h2 className="text-4xl font-bold text-center mb-20">核心特性</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features
            .flatMap((category) => category.items)
            .map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full bg-slate-800/90 backdrop-blur-lg border-slate-700 hover:border-slate-600 transition-all p-6">
                  <div className="mb-4 w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-4 text-gray-100">{feature.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold mb-8">准备好开始了吗？</h2>
            <p className="text-xl mb-12 text-gray-300">加入我们，体验AI驱动的全新开发方式</p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={() => (window.location.href = '/chats')}
            >
              立即开始 <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
