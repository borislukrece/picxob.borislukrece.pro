"use client";

import { useEffect, useRef } from "react";
import ChatBOX from "../../public/ChatXOB.png";
import Image from "next/image";
import Gallery from "./Gallery";
import Sidebar from "./Icon/Sidebar";
import { useSidebar } from "@/app/context/SidebarContext";
import { useGrid } from "@/app/context/GridContext";
import { useGallery } from "@/app/context/GalleryContext";
import { useUser } from "@/app/context/UserContext";

export default function MenuLinks() {
  const { handleSidebar } = useSidebar();
  const { grid, setGrid } = useGrid();
  const { gallery, loadingGallery, getGallery } = useGallery();
  const { isUserLoggedIn } = useUser();
  const { handleDisplayImages, displayImage } = useGallery();

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollTop + clientHeight >= scrollHeight - 10 && !loadingGallery) {
        getGallery();
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [getGallery, loadingGallery]);

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
              <Sidebar className="w-7 h-7" />
            </button>
            <button
              onClick={() => setGrid(!grid)}
              type="button"
              title="Display"
              className={`text-xl p-2 px-3 aspect-square hover:bg-[var(--hover)] rounded-md ${
                !gallery && "hidden"
              }`}>
              {grid ? (
                <i className="fa-solid fa-grip"></i>
              ) : (
                <i className="fa-solid fa-table-list"></i>
              )}
            </button>
          </div>
        </div>
        {isUserLoggedIn() && (
          <div className="w-full grid grid-cols-2 gap-2 py-2">
            <button
              onClick={() => {
                handleDisplayImages("public");
              }}
              type="button"
              className={`text-sm px-2 py-2 rounded-md truncate ${
                displayImage !== "public"
                  ? "bg-[var(--background)]"
                  : "bg-[var(--theme)] text-black"
              }`}>
              <i className="fas fa-images"></i> All images
            </button>
            <button
              onClick={() => {
                handleDisplayImages("private");
              }}
              type="button"
              className={`text-sm px-2 py-2 rounded-md truncate ${
                displayImage !== "private"
                  ? "bg-[var(--background)]"
                  : "bg-[var(--theme)] text-black"
              }`}>
              <i className="fas fa-user"></i> My images
            </button>
          </div>
        )}

        <div
          ref={containerRef}
          className="flex-1 custom-scroll-bar overflow-x-hidden">
          <nav className="w-full">
            <Gallery gallery={gallery} />
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
