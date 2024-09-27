"use client";

import HomeLayout from "./layouts/Home";
import { useEffect, useState } from "react";
import MessageComponent from "@/components/MessageComponent";
import Logo from "@/components/Icon/Logo";
import { generateUUID, getRandomPrompt } from "@/utils/helpers";
import { useMessage } from "./context/MessageContext";
import { useGallery } from "./context/GalleryContext";
import { useImage } from "./context/ImageContext";

export default function Home(param: {
  searchParams: {
    image?: string;
  };
}) {
  const { messages, setMessages, loadingMessage } = useMessage();
  const { gallery } = useGallery();
  const { setImage } = useImage();

  const [randomPhrase, setRandomPhrase] = useState("");

  useEffect(() => {
    setRandomPhrase(getRandomPrompt());
  }, []);

  useEffect(() => {
    if (param && param.searchParams) {
      const imageParam = param.searchParams.image;
      if (imageParam && imageParam !== undefined) {
        const decodedImageParam = decodeURIComponent(imageParam);
        const image = gallery.find((item) => {
          return item.name === decodedImageParam;
        });
        if (image && image !== undefined) {
          setImage(image);
        } else {
          if (gallery && gallery.length > 0) {
            const msg_error = {
              token: generateUUID(),
              type: "__error",
              message: "Sorry, I couldn't find the image you requested.",
            };

            setMessages((prevMessages) => {
              if (prevMessages) {
                return [...prevMessages, msg_error];
              } else {
                return [msg_error];
              }
            });
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <HomeLayout>
        <div className="w-full flex flex-col">
          {messages && messages.length > 0 ? (
            <>
              {messages.map((item, index) => {
                return <MessageComponent message={item} key={index} />;
              })}
              {loadingMessage && <MessageComponent />}
            </>
          ) : (
            <div className="h-full flex items-center">
              <div className="w-full text-center text-gray-500">
                <div className="w-full flex justify-center">
                  <div className="w-[60%] sm:w-[40%] md:w-[20%] h-auto flex justify-center">
                    <Logo />
                  </div>
                </div>
                <p className="font-bold">{randomPhrase}</p>
              </div>
            </div>
          )}
        </div>
      </HomeLayout>
    </>
  );
}
