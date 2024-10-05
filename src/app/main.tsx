"use client";

import MenuComponent from "@/components/MenuComponent";
import ShowImage from "@/components/ShowImage";
import { useSidebar } from "./context/SidebarContext";
import React from "react";

export default function Main({ children }: { children: React.ReactNode }) {
  const { menuVisible } = useSidebar();

  return (
    <>
      <main className="w-full full-height overflow-hidden">
        <div className="w-full h-full flex">
          <MenuComponent />

          <div
            className={`h-full ${
              menuVisible
                ? "w-full lg:w-[calc(100vw-var(--menu-width))]"
                : "w-full"
            }`}>
            {children}
          </div>
        </div>
      </main>

      <ShowImage />
    </>
  );
}
