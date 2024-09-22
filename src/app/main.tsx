"use client";

import { AppContext } from "@/app/context/AppProvider";
import MenuComponent from "@/components/MenuComponent";
import { useContext } from "react";

export default function Main({ children }: { children: React.ReactNode }) {
  const { menuVisible } = useContext(AppContext);

  return (
    <>
      <main className="w-full min-h-screen">
        <div className="w-full h-full flex">
          <MenuComponent />

          <div
            className={`h-full ${
              menuVisible ? "w-[calc(100vw-var(--menu-width))]" : "w-full"
            }`}>
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
