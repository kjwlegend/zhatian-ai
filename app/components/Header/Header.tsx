'use client';

import React from 'react';
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

export function Header() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="header">
      <Container size="xxl" className="inner">
        <Group justify="space-between" w="100%">
          <Group>
            <Button component={Link} href="/" variant="subtle">
              下一代吊炸天的网站加小程序页面自然语言一站式生成系统
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
}

export default Header;
