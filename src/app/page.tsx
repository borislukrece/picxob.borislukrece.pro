"use client";

import HomeLayout from "./layouts/Home";
import { useEffect, useState } from "react";
import MessageComponent from "@/components/MessageComponent";
import Logo from "@/components/Icon/Logo";
import { getRandomPrompt } from "@/utils/helpers";
import { useMessage } from "./context/MessageContext";

export default function Home() {
  const { messages, loadingMessage } = useMessage();

  const [randomPhrase, setRandomPhrase] = useState("");

  useEffect(() => {
    setRandomPhrase(getRandomPrompt());
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
