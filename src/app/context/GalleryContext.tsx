"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Gallery } from "@/utils/interface";
import { APP_ENDPOINT } from "@/utils/helpers";
import { fetcher } from "@/utils/fetcher";

interface GalleryContextProps {
  gallery: Gallery[];
  setGallery: React.Dispatch<React.SetStateAction<Gallery[]>>;
  loadingGallery: boolean;
  getGallery: (entries?: number) => Promise<void>;
  displayImage: "public" | "private";
  handleDisplayImages: (dis: "public" | "private") => void;
}

const GalleryContext = createContext<GalleryContextProps | undefined>(
  undefined
);

export const GalleryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [pageGallery, setPageGallery] = useState(1);
  const [totalPageGallery, setTotalPageGallery] = useState<null | number>(null);
  const [displayImage, setDisplayImage] = useState<"public" | "private">(
    "public"
  );

  const getGallery = async (entries = 50) => {
    if (loadingGallery) return;

    if (totalPageGallery !== null) {
      if (pageGallery >= totalPageGallery) return;
    }

    let uris: Gallery[] | null = null;

    try {
      setLoadingGallery(true);

      const endpoint =
        displayImage === "private"
          ? `${
              APP_ENDPOINT() ?? ""
            }/users/images?page=${pageGallery}&entries=${entries}`
          : `${
              APP_ENDPOINT() ?? ""
            }/images?page=${pageGallery}&entries=${entries}`;

      uris = await new Promise(async (resolve, reject) => {
        try {
          const response = await fetcher(endpoint, {
            method: "GET",
            cache: "no-store",
          });

          const ttPage = response.totalPage;
          if (ttPage && typeof ttPage === "number") {
            setTotalPageGallery(ttPage);
          } else {
            setTotalPageGallery(1);
          }
          resolve(response.images);
        } catch (uploadError) {
          reject(uploadError);
        }
      });
    } catch (error) {
      const err = error as Error;
      console.error("Error: ", err.message);
    } finally {
      if (uris && typeof uris === "object") {
        setGallery((prevGallery) => {
          if (uris) {
            return [...prevGallery, ...uris];
          } else {
            return [...prevGallery];
          }
        });
        setPageGallery((prevPage) => prevPage + 1);
      }
      setLoadingGallery(false);
    }
  };

  const handleDisplayImages = (display: "public" | "private") => {
    if (display === displayImage) return;
    setGallery([]);
    setPageGallery(1);
    setTotalPageGallery(null);
    setLoadingGallery(false);
    setDisplayImage(display);
  };

  const value = {
    gallery,
    setGallery,
    loadingGallery,
    getGallery,
    displayImage,
    handleDisplayImages,
  };

  useEffect(() => {
    (async () => {
      await getGallery();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayImage]);

  return (
    <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
  );
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error("useGallery must be used within a GalleryProvider");
  }
  return context;
};
