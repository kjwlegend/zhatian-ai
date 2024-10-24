'use client'
import React from 'react'
import Link from 'next/link'
import {
  Container,
  Group,
  Button,
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import { IconSun, IconMoonStars } from '@tabler/icons-react'
import { useState } from 'react'
// import { notifications } from '@mantine/notifications'
import { useChatStore } from '@/app/store/chatStore'

// import classes from "./Header.module.css";
import './Header.scss'

export function Header() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  const [isPackaging, setIsPackaging] = useState(false);

  const handlePackageDownload = async () => {
    setIsPackaging(true);
    try {
      const currentTopic = useChatStore.getState().currentTopic;
      const response = await fetch('/api/package-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentTopic }),
      });
      console.log('response', response);
      if (response.ok) {
        console.log('打包成功');
        // 处理成功情况...
      } else {
        throw new Error('打包失败');
      }
    } catch (error) {
      console.log('打包失败', error);
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
            <Button component={Link} href="/" variant="subtle">
              下一代吊炸天的语言控制CMS生成一体化平台
            </Button>
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

            <Button
              onClick={handlePackageDownload}
              loading={isPackaging}
              disabled={isPackaging}
            >
              {isPackaging ? '打包中...' : '打包下载'}
            </Button>

            <ActionIcon
              variant="outline"
              color={computedColorScheme === 'dark' ? 'yellow' : 'blue'}
              onClick={toggleColorScheme}
              title="Toggle color scheme"
            >
              {computedColorScheme === 'dark' ? (
                <IconSun size={18} />
              ) : (
                <IconMoonStars size={18} />
              )}
            </ActionIcon>
          </Group>
        </Group>
      </Container>
    </header>
  )
}

export default Header
