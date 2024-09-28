"use client";

import Link from "next/link";
import Sidebar from "./Icon/Sidebar";
import GoogleLogin from "./Action/GoogleLogin";
import Dropdown from "./Dropdown";
import React from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { useSidebar } from "@/app/context/SidebarContext";

const HeaderComponent = React.memo(function HeaderComponent() {
  const { handleTheme, theme } = useTheme();
  const { handleSidebar, menuVisible } = useSidebar();

  const handleBtnTheme = (_theme: "dark" | "light" | "system") => {
    handleTheme(_theme);
  };

  const IconTheme = ({ _theme }: { _theme: "dark" | "light" | "system" }) => {
    let icon = <i className="fa-solid fa-desktop"></i>;
    switch (_theme) {
      case "dark":
        icon = <i className="fa-solid fa-moon text-xl"></i>;
        break;
      case "light":
        icon = <i className="fa-solid fa-sun text-xl"></i>;
        break;
    }
    return icon;
  };

  return (
    <>
      <div className="w-full h-full flex items-center justify-between">
        <div className="flex-1 flex items-center">
          {!menuVisible ? (
            <div className="px-2 flex gap-2 items-center">
              <button
                onClick={handleSidebar}
                type="button"
                title="Sidebar"
                className="text-xl p-2 aspect-square hover:bg-[var(--hover)] rounded-md">
                <Sidebar className="w-7 h-7" />
              </button>
            </div>
          ) : null}

          <Link href="/" className="font-bold text-xl px-4">
            {process.env.NEXT_PUBLIC_APP_NAME}{" "}
            {process.env.NEXT_PUBLIC_APP_VERSION}
          </Link>
        </div>
        <div className="px-4 flex items-center">
          <div className="px-4">
            <Dropdown
              Button={() => {
                return (
                  <button
                    type="button"
                    title="Theme"
                    className="w-10 h-10 flex items-center justify-center">
                    <IconTheme _theme={theme} />
                  </button>
                );
              }}>
              <div>
                <div className="p-2 grid gap-1">
                  <button
                    onClick={() => handleBtnTheme("dark")}
                    type="button"
                    className="w-full flex items-center hover:bg-[var(--hover)] px-2 py-1 rounded-md transition-all duration-150">
                    <div>
                      <IconTheme _theme="dark" />
                    </div>
                    <div className="px-2">Dark</div>
                  </button>
                  <button
                    onClick={() => handleBtnTheme("light")}
                    type="button"
                    className="w-full flex items-center hover:bg-[var(--hover)] px-2 py-1 rounded-md transition-all duration-150">
                    <div>
                      <IconTheme _theme="light" />
                    </div>
                    <div className="px-2">Light</div>
                  </button>
                  <button
                    onClick={() => handleBtnTheme("system")}
                    type="button"
                    className="w-full flex items-center hover:bg-[var(--hover)] px-2 py-1 rounded-md transition-all duration-150">
                    <div>
                      <IconTheme _theme="system" />
                    </div>
                    <div className="px-2">System</div>
                  </button>
                </div>
              </div>
            </Dropdown>
          </div>

          <div>
            <GoogleLogin />
          </div>
        </div>
      </div>
    </>
  );
});

export default HeaderComponent;
