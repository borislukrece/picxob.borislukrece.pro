"use client";

import { useContext } from "react";
import { AppContext } from "@/app/context/AppProvider";
import ChatBOX from "../../public/ChatXOB.png";
import Image from "next/image";
import Gallery from "./Gallery";

export default function MenuLinks() {
  const { handleSidebar, gallery, grid, setGrid } = useContext(AppContext);

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="w-full min-h-[4.5rem] flex items-center py-1">
          <div className="w-full flex justify-between items-center">
            <button
              onClick={handleSidebar}
              type="button"
              title="Sidebar"
              className="text-xl p-2 aspect-square hover:bg-[var(--hover)] rounded-md">
              <i className="fa-solid fa-window-restore"></i>
            </button>
            <button
              onClick={() => setGrid(!grid)}
              type="button"
              title="Display"
              className={`text-xl p-2 aspect-square hover:bg-[var(--hover)] rounded-md ${
                !gallery && "hidden"
              }`}>
              {grid ? (
                <i className="fa-solid fa-grip"></i>
              ) : (
                <i className="fa-solid fa-list"></i>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 custom-scroll-bar overflow-x-hidden">
          <nav className="w-full">
            <Gallery />
          </nav>
        </div>

        <div className="w-full">
          <div className="w-full my-2">
            <button
              type="button"
              title={`${process.env.NEXT_PUBLIC_APP_NAME}`}
              className="w-full px-2 py-2 hover:bg-[var(--hover)] rounded-md">
              <div className="w-full flex items-center">
                <div className="text-xl">
                  <Image
                    src={ChatBOX}
                    placeholder="empty"
                    priority={true}
                    alt={`Logo ${process.env.NEXT_PUBLIC_APP_NAME}`}
                    className="w-8 h-auto"
                  />
                </div>
                <div className="text-left px-2 text-sm">
                  <div className="font-medium">
                    {process.env.NEXT_PUBLIC_APP_NAME}
                  </div>
                  <div className="text-gray-800 dark:text-gray-500">
                    <span>
                      © 2024 {process.env.NEXT_PUBLIC_APP_NAME}. All rights
                      reserved.
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
