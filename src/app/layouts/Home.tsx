"use client";

import { FormEvent, useContext, useRef, useState } from "react";
import crypto from "crypto";
import { AppContext } from "../context/AppProvider";
import Main from "../main";
import HeaderComponent from "@/components/HeaderComponent";
import ResizableTextArea from "@/components/ResizableTextArea";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const { setMessages, loadingMessage } = useContext(AppContext);

  const [message, setMessage] = useState("");

  const handleInput = (input: FormEvent<HTMLTextAreaElement>) => {
    setMessage(input.currentTarget.value);
  };

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event && event !== undefined) {
      event.preventDefault();
    }

    if (message && !loadingMessage) {
      const msg = {
        token: crypto.randomBytes(16).toString("hex"),
        type: "user",
        message: message,
      };

      setMessages((prevMessages) => {
        if (prevMessages) {
          return [...prevMessages, msg];
        } else {
          return [msg];
        }
      });

      setMessage("");
    }
  };

  const conversationRef = useRef<HTMLDivElement | null>(null);

  return (
    <Main>
      <div className="w-full h-screen flex flex-col">
        <div className="w-full min-h-[4.5rem]">
          <HeaderComponent />
        </div>

        <div
          ref={conversationRef}
          className="container-conversation flex-1 custom-scroll-bar overflow-x-hidden">
          <div className="h-full max-w-3xl mx-auto">
            <div className="w-full h-full px-4">{children}</div>
          </div>
        </div>

        <div className="w-full">
          <div className="max-w-3xl mx-auto py-4 px-4">
            <form
              onSubmit={handleSubmit}
              method="POST"
              action="#"
              className="w-full bg-[var(--hover)] py-2 px-2 rounded-3xl overflow-hidden">
              <div className="w-full h-full flex justify-center items-end">
                <div className="flex-1 px-2">
                  <ResizableTextArea
                    onInput={handleInput}
                    onSubmit={() => handleSubmit()}
                    value={message}
                    placeholder={`Image ${process.env.NEXT_PUBLIC_APP_NAME}`}
                  />
                </div>
                <div className="form-submit transition-all duration-150">
                  <button
                    type="submit"
                    title="Send"
                    className={`text-4xl ${
                      loadingMessage ? null : "text-[var(--foreground-nosys)]"
                    }`}>
                    {!loadingMessage ? (
                      <i className="fa-solid fa-circle-arrow-up"></i>
                    ) : (
                      <div>
                        <span className="loader"></span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default HomeLayout;
