"use client";

import { AppContext } from "@/app/context/AppProvider";
import Link from "next/link";
import { useContext } from "react";

export default function HeaderComponent() {
  const { handleSidebar, menuVisible } = useContext(AppContext);

  return (
    <>
      <div className="w-full h-full flex items-center">
        <div className="w-full flex items-center">
          {!menuVisible ? (
            <div className="px-2 flex gap-2 items-center">
              <button
                onClick={handleSidebar}
                type="button"
                title="Sidebar"
                className="text-xl p-2 aspect-square hover:bg-[var(--hover)] rounded-md">
                <i className="fa-solid fa-window-restore"></i>
              </button>
            </div>
          ) : null}

          <Link href="/" className="font-bold text-xl px-4">
            {process.env.NEXT_PUBLIC_APP_NAME}{" "}
            {process.env.NEXT_PUBLIC_APP_VERSION}
          </Link>
        </div>
      </div>
    </>
  );
}
