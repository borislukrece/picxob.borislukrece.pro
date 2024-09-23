/* eslint-disable @next/next/no-img-element */
"use client";

import { useContext } from "react";
import { AppContext } from "@/app/context/AppProvider";
import { Gallery as GalleryInterface } from "@/utils/interface";
import { addParamToURL } from "@/utils/helpers";

export default function Gallery({ gallery }: { gallery: GalleryInterface[] }) {
  const { grid, loadingGallery, setShowImg } = useContext(AppContext);

  const handleImageClick = (image: GalleryInterface) => {
    setShowImg(image);
    addParamToURL("image", image.name);
  };

  return (
    <div>
      <div className="w-full">
        <h1 className="font-bold mb-2 px-2 select-none hidden">Gallery</h1>
      </div>
      {loadingGallery ? (
        <div className="flex items-center justify-center w-full h-full">
          <span className="loader2"></span>
        </div>
      ) : (
        <div
          className={`grid ${grid ? "grid-cols-1" : "grid-cols-3"} gap-4 px-2`}>
          {gallery.map((image, index) => {
            return (
              <button
                type="button"
                key={index}
                onClick={() => handleImageClick(image)}>
                <div className="w-full h-full bg-[var(--hover)] overflow-hidden rounded-md shadow-lg shadow-black/[0.3] cursor-pointer">
                  <img
                    src={`${
                      image.name.startsWith("http")
                        ? image.name
                        : process.env.NEXT_PUBLIC_APP_URL +
                          "/images/" +
                          image.name
                    }`}
                    alt={image.name}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
