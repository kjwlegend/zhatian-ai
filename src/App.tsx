import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { Header } from "./components/Header/Header";
import Main from "./pages/Main";
import Doc from "./pages/Doc";
import Library from "./pages/Library";
import Faq from "./pages/Faq";
import Founders from "./pages/Founders";
import Chat from "./pages/Chat";
import "./styles/global.scss";
import "@mantine/core/styles.css";

const App: React.FC = () => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={
        {
          /** 在这里添加你的主题配置 */
        }
      }
    >
      <Router>
        <div className="app">
          <Header />
          <div className="app__content">
            <main className="app__main">
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/doc" element={<Doc />} />
                <Route path="/library" element={<Library />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/founders" element={<Founders />} />
                <Route path="/chat" element={<Chat />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </MantineProvider>
  );
};

export default App;
