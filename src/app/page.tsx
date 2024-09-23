"use client";

import HomeLayout from "./layouts/Home";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "./context/AppProvider";
import MessageComponent from "@/components/MessageComponent";
import Logo from "@/components/Icon/Logo";
import { getRandomPrompt } from "@/utils/helpers";
import crypto from "crypto";

export default function Home(param: {
  searchParams: {
    image?: string;
  };
}) {
  const { messages, setMessages, loadingMessage, gallery, setShowImg } =
    useContext(AppContext);

  const [randomPhrase, setRandomPhrase] = useState("");

  useEffect(() => {
    setRandomPhrase(getRandomPrompt());
  }, []);

  useEffect(() => {
    if (param && param.searchParams) {
      const imageParam = param.searchParams.image;
      if (imageParam && imageParam !== undefined) {
        const image = gallery.find((item) => {
          return item.name === imageParam;
        });
        if (image && image !== undefined) {
          setShowImg(image);
        } else {
          const msg_error = {
            token: crypto.randomBytes(16).toString("hex"),
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
  }, [gallery, param, setMessages, setShowImg]);

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
