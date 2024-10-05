"use client";

import React from "react";
import MenuLinks from "./MenuLinks";
import { useSidebar } from "@/app/context/SidebarContext";

export default function MenuComponent() {
  const { menuVisible, handleSidebar } = useSidebar();

  const close = () => {
    handleSidebar();
  };

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click is outside the red container
    const target = event.target as HTMLDivElement;
    const isOutside = !target.closest(".menu-container");
    if (isOutside) {
      close();
    }
  };

  return (
    <>
      <div
        className={`full-height h-full max-lg:w-full max-lg:absolute max-lg:top-0 max-lg:left-0 z-[45] bg-[var(--background-above)] ${
          !menuVisible && "hidden"
        }`}
        onClick={handleClickOutside}>
        <div
          className={`menu-container max-w-[var(--menu-width)] w-full h-full`}>
          <div className="flex flex-col w-full bg-[var(--menu-background)] h-full shadow-md shadow-black/[0.5] px-2">
            <MenuLinks />
          </div>
        </div>
      </div>
    </>
  );
}
