import React from "react";
import { Menu } from "@headlessui/react";
import { CodeBracketIcon, Bars3Icon } from "@heroicons/react/24/solid";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-tech-dark-light text-tech-text p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 hover:text-tech-highlight transition-colors"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <CodeBracketIcon className="h-8 w-8 mr-2 text-tech-highlight" />
          <h1 className="text-xl font-bold">Light 组件快速配置项编写</h1>
        </div>
        <Menu as="div" className="relative">
          <Menu.Button className="bg-tech-accent px-4 py-2 rounded-md hover:bg-tech-highlight transition-colors">
            Menu
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-56 bg-tech-dark-light rounded-md shadow-lg">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={`${
                    active ? "bg-tech-accent" : ""
                  } block px-4 py-2 text-sm text-tech-text`}
                >
                  Main
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={`${
                    active ? "bg-tech-accent" : ""
                  } block px-4 py-2 text-sm text-tech-text`}
                >
                  Docs
                </a>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
