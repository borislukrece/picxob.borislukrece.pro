"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { Gallery, Message } from "@/utils/interface";
import { generateUUID, APP_ENDPOINT } from "@/utils/helpers";
import { useGallery } from "./GalleryContext";
import { fetcher } from "@/utils/fetcher";

interface MessageContextProps {
  messages: Message[] | null;
  loadingMessage: boolean;
  setMessages: Dispatch<SetStateAction<Message[] | null>>;
  newMessage(type: "user" | "bot" | "__error", msg: string | []): Promise<void>;
  sendMessage: (prompt: string) => Promise<Gallery | null>;
}

const MessageContext = createContext<MessageContextProps | undefined>(
  undefined
);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [lastProcessedMessageToken, setLastProcessedMessageToken] = useState<
    string | null
  >(null);

  const { setGallery } = useGallery();

  const newMessage = useCallback(
    async (type: "user" | "bot" | "__error", msg: string | Gallery[]) => {
      const message = {
        token: generateUUID(),
        type,
        message: msg,
      };
      setMessages((prevMessages) => {
        if (prevMessages) {
          return [...prevMessages, message];
        } else {
          return [message];
        }
      });
      if (Array.isArray(message.message)) {
        message.message.map((i) => {
          setGallery((prevGallery) => {
            if (prevGallery) {
              return [i, ...prevGallery];
            } else {
              return [i];
            }
          });
        });
      }
    },
    [setGallery]
  );

  const sendMessage = useCallback(async (prompt: string) => {
    setLoadingMessage(true);
    let image: Gallery | null = null;
    try {
      image = await new Promise(async (resolve, reject) => {
        try {
          const response = await fetcher(`${APP_ENDPOINT()}/send-message`, {
            method: "POST",
            body: JSON.stringify({
              prompt,
            }),
          });

          const { image } = response;
          resolve(image);
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      const err = error as Error;
      console.error("Error sending message to bot: ", err.message);
    } finally {
      setLoadingMessage(false);
      return image;
    }
  }, []);

  const value = {
    messages,
    loadingMessage,
    setMessages,
    sendMessage,
    newMessage,
  };

  useEffect(() => {
    if (messages) {
      const lastMessage = messages[messages.length - 1];
      if (
        lastMessage &&
        lastMessage.type === "user" &&
        lastMessage.token !== lastProcessedMessageToken
      ) {
        setLastProcessedMessageToken(lastMessage.token);
        (async () => {
          const message = lastMessage.message as string;
          try {
            const image = await sendMessage(message);
            if (!image) {
              throw new Error("No image returned from the bot");
            }
            newMessage("bot", [image]);
          } catch (error) {
            newMessage(
              "__error",
              "An excepted error occurred while processing the message. Please try again, if the error persists, contact our support."
            );
            console.error("Error sending message to bot: ", error);
          }
        })();
      }
    }
  }, [lastProcessedMessageToken, messages, newMessage, sendMessage]);

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};
