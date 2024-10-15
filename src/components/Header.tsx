import React from "react";
import { Menu } from "@headlessui/react";
import { CodeBracketIcon, Bars3Icon, UserCircleIcon } from "@heroicons/react/24/solid";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // 模拟登录状态

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
        <div className="flex items-center">
          <Menu as="div" className="relative mr-4">
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
          <button
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-tech-accent hover:bg-tech-highlight transition-colors"
          >
            {isLoggedIn ? (
              <img src="path_to_user_avatar.jpg" alt="User Avatar" className="w-8 h-8 rounded-full" />
            ) : (
              <UserCircleIcon className="w-8 h-8 text-tech-text" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
