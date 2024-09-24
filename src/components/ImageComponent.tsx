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
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {loading && (
        <div className="w-full h-full flex items-center justify-center absolute top-0 bg-[--background-above]">
          <div className="loader4"></div>
        </div>
      )}
      <CldImage
        onContextMenu={(e) => e.preventDefault()}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        className={loading ? "opacity-0" : "opacity-100"}
        {...props}
      />
    </div>
  );
};

export default ImageComponent;
