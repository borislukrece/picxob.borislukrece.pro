/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import ChatBox from "../../public/ChatXOB.png";
import { Message } from "@/utils/interface";
import { useState } from "react";

export default function MessageComponent({ message }: { message?: Message }) {
  const [isBot] = useState(message?.type === "bot");

  return message ? (
    <div
      className={`message-container w-full my-2 text-[var(--foreground-nosys)] font-light flex ${
        !isBot && "justify-end"
      }`}
      id={`${message.token}`}>
      <div
        className={`flex px-2 py-1 ${
          isBot ? "items-start" : "bg-[var(--hover)] rounded-3xl"
        }`}>
        {isBot && (
          <div>
            <Image
              src={ChatBox}
              alt={`${process.env.NEXT_PUBLIC_APP_NAME}`}
              className="w-10 h-10 rounded-full shadow shadow-black/[0.4]"
            />
          </div>
        )}
        <div className="flex-1 flex items-end">
          <div className="min-h-10 flex px-2 mx-2 rounded-r-[5rem] rounded-tl-[5rem]">
            <div className="py-2">
              {typeof message.message === "string" ? (
                <>
                  {isBot && message.message === "__error" ? (
                    <div className="py-1 px-4 bg-red-500 rounded-3xl">
                      <span className="text-white">
                        An excepted error occurred while processing the message.
                        Please try again, if the error persists, contact our
                        support.
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="py-1">{message.message}</span>
                    </>
                  )}
                </>
              ) : (
                message.message.map((value, index) => {
                  return (
                    <div key={index} className="py-1 grid grid-cols-2">
                      <div className="w-full h-full overflow-hidden rounded-md">
                        <img
                          src={`${value}`}
                          alt="Image generated"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      className={`message-container w-full my-2 text-[var(--foreground-nosys)] font-light flex`}>
      <div className={`flex px-2 py-1 items-start`}>
        <div>
          <Image
            src={ChatBox}
            alt={`${process.env.NEXT_PUBLIC_APP_NAME}`}
            className="w-10 h-10 rounded-full shadow shadow-black/[0.4]"
          />
        </div>
        <div className="flex-1 flex items-end">
          <div className="min-h-10 flex px-2 mx-2 rounded-r-[5rem] rounded-tl-[5rem]">
            <div className="py-2">
              <div className="p-2 bg-[var(--foreground)] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
