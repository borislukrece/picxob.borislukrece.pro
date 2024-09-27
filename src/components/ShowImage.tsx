/* eslint-disable @next/next/no-img-element */
"use client";

import { formatDate, handleDownload } from "@/utils/helpers";
import { useEffect, useState } from "react";
import ImageComponent from "./ImageComponent";
import { useImage } from "@/app/context/ImageContext";
import { useGallery } from "@/app/context/GalleryContext";

export default function ShowImage() {
  const { image, setImage } = useImage();
  const { gallery } = useGallery();

  const [display, setDisplay] = useState(true);

  const close = () => {
    setImage(null);
  };

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const isOutside = !target.closest(".image-container");
    if (isOutside) {
      close();
    }
  };

  useEffect(() => {
    if (image) {
      const url = new URL(window.location.href);
      url.searchParams.set("image", image.name);
      window.history.replaceState(null, "", url);
    } else if (typeof window !== "undefined") {
      if (gallery && gallery.length > 0) {
        const url = new URL(window.location.href);
        url.searchParams.delete("image");
        window.history.replaceState(null, "", url);
      }
    }
  }, [gallery, image]);

  return (
    image && (
      <section
        className="w-full h-full bg-[var(--background-above)] fixed top-0 left-0 z-50"
        onClick={handleClickOutside}>
        <div className="w-full h-full flex justify-center items-center">
          <div className="max-w-xl w-full h-full flex justify-center items-center image-container">
            <div className="w-full h-full relative">
              <div className="w-full h-full flex items-center justify-center">
                <ImageComponent
                  image={image}
                  src={image.name}
                  alt={image.name}
                  onContextMenu={(e) => e.preventDefault()}
                  onClick={() => setDisplay(!display)}
                  width="1024"
                  height="1024"
                  crop={{
                    type: "fit",
                    source: true,
                  }}
                />
              </div>
              <div
                className={`w-full absolute top-0 left-0 transition-all duration-150 ${
                  !display && "hidden"
                }`}>
                <div className="w-full py-2 flex justify-between items-center">
                  <div className="px-4">
                    <div className="text-sm text-gray-500 bg-[var(--menu-background)] rounded-md px-2 py-1">
                      AI-generated
                    </div>
                  </div>

                  <div className="px-4 xl:hidden">
                    <button
                      onClick={() => close()}
                      type="button"
                      title="Close"
                      className="w-10 h-10 flex items-center justify-center text-xl text-gray-500 bg-[var(--menu-background)] text-[var(--foreground-nosys)] rounded-full">
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div
                className={`w-full absolute bottom-6 px-4 transition-all duration-150 ${
                  !display && "hidden"
                }`}>
                <div className="bg-[var(--menu-background)] shadow-lg dark:shadow-none shadow-black/[0.150] dark:shadow-white/[0.150] rounded-lg p-2">
                  <div className="w-ful flex justify-between">
                    <div>
                      <button
                        onClick={() => handleDownload(image)}
                        title="Download"
                        type="button"
                        className="bg-[var(--theme)] text-white px-2 py-2 shadow-md shadow-black/[0.3] backdrop-blur-sm rounded-md hover:bg-transparent hover:ring hover:ring-[var(--theme)] hover:text-[var(--theme)] transition-all duration-150 delay-75">
                        <i className="fa-solid fa-download"></i> Download
                      </button>
                    </div>

                    <div className="px-2">
                      <div className="text-sm text-gray-500">
                        Powered by AI on {process.env.NEXT_PUBLIC_APP_NAME}
                      </div>
                      <div className="text-sm text-slate-400">
                        {formatDate(image.created_at)}
                      </div>
                    </div>
                  </div>
                  {image.prompt && (
                    <div
                      className="w-full my-2 line-clamp-2"
                      title={`${image.prompt}`}>
                      {image.prompt}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  );
}
