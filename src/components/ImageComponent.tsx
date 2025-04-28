"use client";

import { Gallery } from "@/utils/interface";
import { CldImage, CldImageProps } from "next-cloudinary";
import { useState } from "react";

interface ImageComponentProps extends CldImageProps {
  image: Gallery;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ImageComponent: React.FC<ImageComponentProps> = ({ image, ...props }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  return (
    <div className="w-full h-full flex items-center justify-center relative transition-all duration-150">
      <div
        className={`w-full h-full flex items-center justify-center absolute top-0 bg-[var(--background-above)] ${!loading && "hidden"
          }`}>
        <div className="loader4"></div>
      </div>
      <CldImage
        onContextMenu={(e: { preventDefault: () => any; }) => e.preventDefault()}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        className={`${loading ? "opacity-100" : error ? "opacity-0" : "opacity-100"
          }`}
        {...props}
      />
      <div
        className={`w-full h-full flex items-center justify-center absolute top-0 bg-[--background-above] ${!error && "hidden"
          }`}>
        <i className="fa-solid fa-ban text-red-500 text-xl"></i>
      </div>
    </div>
  );
};

export default ImageComponent;
