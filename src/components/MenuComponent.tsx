"use client";

import { AppContext } from "@/app/context/AppProvider";
import { useContext } from "react";
import MenuLinks from "./MenuLinks";

export default function MenuComponent() {
  const { menuVisible } = useContext(AppContext);

  return (
    <>
      <div
        className={`w-[var(--menu-width)] h-full ${!menuVisible && "hidden"}`}>
        <div className="flex flex-col w-full bg-[var(--menu-background)] h-screen shadow-md shadow-black/[0.5] px-2">
          <MenuLinks />
        </div>
      </div>
    </>
  );
}
