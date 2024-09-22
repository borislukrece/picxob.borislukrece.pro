/* eslint-disable @next/next/no-img-element */
"use client";

import { useContext } from "react";
import { AppContext } from "@/app/context/AppProvider";

export default function Gallery() {
  const { gallery, grid } = useContext(AppContext);

  return (
    <div>
      <div className="w-full">
        <h1 className="font-bold mb-2 px-2">Gallery</h1>
      </div>
      <div
        className={`grid ${grid ? "grid-cols-1" : "grid-cols-3"} gap-4 px-2`}>
        {gallery.map((image, index) => {
          return (
            <div key={index}>
              <div className="w-full h-full overflow-hidden rounded-md shadow-lg shadow-black/[0.3]">
                <img
                  src={`${process.env.NEXT_PUBLIC_APP_URL}/images/${image.name}`}
                  alt={image.name}
                  className="w-full h-auto"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
