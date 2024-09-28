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
import { useUser } from "./UserContext";
import { generateUUID, APP_ENDPOINT } from "@/utils/helpers";
import { useGallery } from "./GalleryContext";

interface MessageContextProps {
  messages: Message[] | null;
  setMessages: Dispatch<SetStateAction<Message[] | null>>;
  sendMessage: (msg: string) => Promise<Gallery | null | undefined>;
  loadingMessage: boolean;
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

  const { credentials } = useUser();
  const { setGallery } = useGallery();

  async function query(data: { inputs: string }) {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const result = await response.blob();
      return result;
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  const sendMessage = useCallback(
    async (msg: string) => {
      if (!loadingMessage && msg) {
        let img: Gallery | null = null;
        try {
          setLoadingMessage(true);

          const imageBlob = await query({ inputs: msg });
          if (imageBlob && imageBlob !== undefined) {
            img = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(imageBlob);

              reader.onloadend = async () => {
                const resReader = reader.result;
                if (typeof resReader === "string") {
                  const base64data = resReader.split(",")[1];

                  try {
                    const uploadToCloudinary = await fetch("/api/upload", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        image: base64data,
                      }),
                    });

                    const _res = await uploadToCloudinary.json();
                    const uri = _res.data.uri;

                    const data = {
                      name: uri,
                      prompt: msg,
                    };

                    const image: Gallery | null = await new Promise(
                      async (res) => {
                        try {
                          const response = await fetch(
                            `${APP_ENDPOINT()}/images`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + credentials,
                              },
                              body: JSON.stringify(data),
                            }
                          );

                          if (response.ok) {
                            const { image } = await response.json();
                            res(image);
                          } else {
                            res(null);
                          }
                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        } catch (err) {
                          res(null);
                        }
                      }
                    );

                    resolve(image);
                  } catch (uploadError) {
                    reject(uploadError);
                  }
                } else {
                  reject(new Error("FileReader result is not a string."));
                }
              };

              reader.onerror = () => {
                reject(new Error("Error reading the file."));
              };
            });
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoadingMessage(false);
          return img;
        }
      }
    },
    [credentials, loadingMessage]
  );

  const value = {
    messages,
    setMessages,
    sendMessage,
    loadingMessage,
  };

  useEffect(() => {
    if (messages) {
      // Get the last message sent
      const lastMessage = messages[messages.length - 1];
      if (
        lastMessage &&
        lastMessage.type === "user" &&
        lastMessage.token !== lastProcessedMessageToken
      ) {
        setLastProcessedMessageToken(lastMessage.token);
        (async () => {
          const msg = lastMessage.message as string;
          await sendMessage(msg)
            .then((res) => {
              if (res && res !== undefined) {
                const bot = {
                  token: generateUUID(),
                  type: "bot",
                  message: [res],
                };

                setMessages((prevMessages) => {
                  if (prevMessages) {
                    return [...prevMessages, bot];
                  } else {
                    return [bot];
                  }
                });

                bot.message.map((i) => {
                  setGallery((prevGallery) => {
                    if (prevGallery) {
                      return [i, ...prevGallery];
                    } else {
                      return [i];
                    }
                  });
                });
              } else {
                const msg_error = {
                  token: generateUUID(),
                  type: "__error",
                  message:
                    "An excepted error occurred while processing the message. Please try again, if the error persists, contact our support.",
                };

                setMessages((prevMessages) => {
                  if (prevMessages) {
                    return [...prevMessages, msg_error];
                  } else {
                    return [msg_error];
                  }
                });
              }
            })
            .catch((error) => {
              const msg_error = {
                token: generateUUID(),
                type: "bot",
                message: "Error sending message to bot: " + error.message,
              };

              setMessages((prevMessages) => {
                if (prevMessages) {
                  return [...prevMessages, msg_error];
                } else {
                  return [msg_error];
                }
              });

              console.error("Error sending message to bot: ", error);
            });
        })();
      }
    }
  }, [lastProcessedMessageToken, messages, sendMessage, setGallery]);

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
