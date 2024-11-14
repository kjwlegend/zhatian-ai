'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Container,
  Group,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
// import classes from "./Header.module.css";
import './Header.scss';

import Image from 'next/image';
import { CodeContent } from '@/app/services/db/schema';
import { useChatStore } from '@/app/store/chatStore';

const Header = () => {
  const { currentTopic, getTopicCode, customTabs } = useChatStore();

  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  const [isPackaging, setIsPackaging] = useState(false);

  const handlePackageDownload = async () => {
    setIsPackaging(true);
    try {
      let topicCode = {} as Record<string, string>;
      await Promise.all(
        customTabs.map(async (type) => {
          const res = await getTopicCode(currentTopic, type as keyof CodeContent);
          topicCode[type] = res;
        })
      );

      const response = await fetch('/api/package-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentTopic, topicCode }),
      });
      console.error('API response:', response);
      if (response.ok) {
        console.log('打包成功');
        // 处理成功情况...
      } else {
        throw new Error('打包失败');
      }
    } catch (error) {
      console.error('打包失败', error);
      // 处理错误情况...
    } finally {
      setIsPackaging(false);
    }
  };

  return (
    <header className="header">
      <Container size="xxl" className="inner">
        <Group justify="space-between" w="100%">
          <Group>
            <a href="/" className="logo-container">
              <Image width={160} height={50} src={'/logo1.png'} alt="logo" />
              <span className="logo-text">
                下一代吊炸天的网站加小程序页面自然语言一站式生成系统
              </span>
            </a>
          </Group>

          <Group>
            <Button component={Link} href="/chat" variant="subtle">
              工作区
            </Button>
            <Button component={Link} href="/library" variant="subtle">
              组件市场
            </Button>
            <Button component={Link} href="/doc" variant="subtle">
              使用说明
            </Button>

            <Button component={Link} href="/faq" variant="subtle">
              介绍
            </Button>
            <Button component={Link} href="/founders" variant="subtle">
              创始人
            </Button>

            <Button onClick={handlePackageDownload} loading={isPackaging} disabled={isPackaging}>
              {isPackaging ? '打包中...' : '打包下载'}
            </Button>

            <ActionIcon
              variant="outline"
              color={computedColorScheme === 'dark' ? 'yellow' : 'blue'}
              onClick={toggleColorScheme}
              title="Toggle color scheme"
            >
              {computedColorScheme === 'dark' ? <IconSun size={18} /> : <IconMoonStars size={18} />}
            </ActionIcon>
          </Group>
        </Group>
      </Container>
    </header>
  );
};

export default Header;
