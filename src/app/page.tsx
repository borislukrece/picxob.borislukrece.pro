"use client";

import HomeLayout from "./layouts/Home";
import { useContext } from "react";
import { AppContext } from "./context/AppProvider";
import MessageComponent from "@/components/MessageComponent";
import Logo from "@/components/Icon/Logo";

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
              <div className="w-full text-center text-gray-500">
                <div className="w-full flex justify-center">
                  <div className="w-[80%] sm:w-[50%] md:w-[30%] h-auto flex justify-center">
                    <Logo />
                  </div>
                </div>
                <p className="font-bold">What can I do for you today!?</p>
              </div>
            </div>
          )}
        </div>
      </HomeLayout>
    </>
  );
}
