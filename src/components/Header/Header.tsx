import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Group,
  Button,
  Burger,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import classes from "./Header.module.css";
import "./Header.scss";

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <header className="header">
      <Container size="md" className={classes.inner}>
        <Group justify="space-between" w="100%">
          <Group>
            <Burger opened={opened} onClick={toggle} size="sm" />
            <Button component={Link} to="/" variant="subtle">
              AI Chat to Code
            </Button>
          </Group>

          <Group>
            <Button component={Link} to="/chat" variant="subtle">
              Chat
            </Button>
            <Button component={Link} to="/doc" variant="subtle">
              Doc
            </Button>
            <Button component={Link} to="/library" variant="subtle">
              Library
            </Button>
            <Button component={Link} to="/faq" variant="subtle">
              FAQ
            </Button>
            <Button component={Link} to="/founders" variant="subtle">
              Founders
            </Button>
            <ActionIcon
              variant="outline"
              color={dark ? "yellow" : "blue"}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
            </ActionIcon>
          </Group>
        </Group>
      </Container>
    </header>
  );
}

export default Header;
