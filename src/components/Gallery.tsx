/* eslint-disable @next/next/no-img-element */
"use client";

import { Gallery as GalleryInterface } from "@/utils/interface";
import ImageComponent from "./ImageComponent";
import { useGallery } from "@/app/context/GalleryContext";
import { useGrid } from "@/app/context/GridContext";
import { useImage } from "@/app/context/ImageContext";
import { useEffect, useState } from "react";

export default function Gallery({ gallery }: { gallery: GalleryInterface[] }) {
  const { loadingGallery } = useGallery();
  const { grid } = useGrid();
  const { setImage } = useImage();

  const [groupedImages, setGroupedImages] = useState<
    Record<string, GalleryInterface[]>
  >({});

  const handleImageClick = (image: GalleryInterface) => {
    setImage(image);
  };

  useEffect(() => {
    if (gallery) {
      const _groupImagesByDate = (images: GalleryInterface[]) => {
        const groupedImages: Record<string, GalleryInterface[]> = {};

        images.forEach((image) => {
          const date = new Date(image.created_at).toLocaleDateString();
          if (!groupedImages[date]) {
            groupedImages[date] = [];
          }
          groupedImages[date].push(image);
        });

        return groupedImages;
      };

      const _groupedImages = _groupImagesByDate(gallery);
      setGroupedImages(_groupedImages);
    }
  }, [gallery]);

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
        <>
          {Object.keys(groupedImages).length > 0 ? (
            Object.keys(groupedImages).map((date, index) => (
              <div key={index} className="pb-2">
                <div className="font-semibold text-xs text-center mb-2 px-2 text-slate-500 sticky top-0 z-10">
                  <h2 className="bg-[var(--background)] py-2 rounded-b-md shadow-md shadow-black/[0.5] dark:shadow-black/[0.4]">
                    {date}
                  </h2>
                </div>
                <div
                  className={`grid ${
                    grid ? "grid-cols-1" : "grid-cols-3"
                  } gap-4 px-2`}>
                  {groupedImages[date].map((image) => (
                    <button
                      title="Thumbnail"
                      type="button"
                      key={image.token}
                      onClick={() => handleImageClick(image)}>
                      <div className="w-full h-full bg-[var(--hover)] overflow-hidden rounded-md shadow-lg shadow-black/[0.3] cursor-pointer">
                        <div className="w-full h-full hover:scale-110 transition-all duration-150">
                          <ImageComponent
                            image={image}
                            src={image.uri}
                            alt={image.uri}
                            width="500"
                            height="500"
                            quality={50}
                            crop={{
                              type: "thumb",
                              source: true,
                            }}
                          />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-sm text-gray-500 text-center py-2">
              No images found
            </div>
          )}
        </>
      )}
    </div>
  );
}
