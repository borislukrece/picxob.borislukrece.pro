"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface SidebarContextProps {
  menuVisible: boolean;
  handleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSidebar = () => {
    setMenuVisible((prev) => !prev);
  };

  const value = {
    menuVisible,
    handleSidebar,
  };

  useEffect(() => {
    const _isLg = typeof window !== "undefined" && window.innerWidth >= 1024;
    setMenuVisible(_isLg);
  }, []);

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
