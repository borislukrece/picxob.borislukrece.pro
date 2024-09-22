"use client";

import Image from "next/image";
import ChatBOX from "../../public/ChatXOB.png";
import HomeLayout from "./layouts/Home";
import { useContext } from "react";
import { AppContext } from "./context/AppProvider";
import MessageComponent from "@/components/MessageComponent";

export default function Home() {
  const { messages, loadingMessage } = useContext(AppContext);

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
              <div className="w-full text-center">
                <div className="w-full flex justify-center">
                  <Image
                    src={ChatBOX}
                    placeholder="empty"
                    loading="eager"
                    priority={true}
                    alt="Logo"
                    className="w-[80%] sm:w-[50%] md:w-[30%] h-auto"
                  />
                </div>
                <p className="font-bold text-gray-600">
                  What can I do for you today!?
                </p>
              </div>
            </div>
          )}
        </div>
      </HomeLayout>
    </>
  );
}
