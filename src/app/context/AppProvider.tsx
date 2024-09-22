"use client";

import { Message, Gallery } from "@/utils/interface";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import crypto from "crypto";

interface ValueProps {
  handleSidebar: () => void;
  menuVisible: boolean;
  grid: boolean;
  setGrid: Dispatch<SetStateAction<boolean>>;
  sendMessage: (msg: string) => Promise<string | null | undefined>;
  messages: Message[] | null;
  setMessages: Dispatch<SetStateAction<Message[] | null>>;
  loadingMessage: boolean;
  gallery: Gallery[];
}

interface AppProps {
  children: ReactNode;
}

export const AppContext = createContext({} as ValueProps);

export const AppProvider: React.FC<AppProps> = ({ children }) => {
  const [menuVisible, setMenuVisible] = useState(true);
  const [grid, setGrid] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [lastProcessedMessageToken, setLastProcessedMessageToken] = useState<
    string | null
  >(null);
  const [gallery, setGallery] = useState<Gallery[]>([]);

  const handleSidebar = () => {
    setMenuVisible(!menuVisible);
  };

  async function getGallery() {
    let uris: Gallery[] | null = null;

    try {
      uris = await new Promise(async (resolve, reject) => {
        try {
          const response = await fetch("/api/images", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            resolve(data.data.images);
          } else {
            const errorText = await response.text();
            reject(
              new Error(
                `HTTP error! status: ${response.status}, message: ${errorText}`
              )
            );
          }
        } catch (uploadError) {
          reject(uploadError);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      if (uris && typeof uris === "object") {
        setGallery(uris);
        console.log(uris);
      }
    }
  }

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
      if (!loadingMessage) {
        let uri: string | null = null;
        try {
          setLoadingMessage(true);

          const imageBlob = await query({ inputs: msg });
          if (imageBlob && imageBlob !== undefined) {
            uri = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(imageBlob);

              reader.onloadend = async () => {
                const resReader = reader.result;
                if (typeof resReader === "string") {
                  const base64data = resReader.split(",")[1];

                  try {
                    const uploadResponse = await fetch("/api/upload", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ imageBlob: base64data }),
                    });

                    if (uploadResponse.ok) {
                      const data = await uploadResponse.json();
                      resolve(data.data.uri);
                    } else {
                      const errorText = await uploadResponse.text();
                      reject(
                        new Error(
                          `HTTP error! status: ${uploadResponse.status}, message: ${errorText}`
                        )
                      );
                    }
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
          return uri;
        }
      }
    },
    [loadingMessage]
  );

  const value: ValueProps = {
    handleSidebar,
    menuVisible,
    grid,
    setGrid,
    sendMessage,
    messages,
    setMessages,
    loadingMessage,
    gallery,
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

        console.log(lastMessage);

        (async () => {
          const msg = lastMessage.message as string;
          await sendMessage(msg)
            .then((res) => {
              if (res && res !== undefined) {
                const bot = {
                  token: crypto.randomBytes(16).toString("hex"),
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
                  // Date format YYYY-MM-DD H:i:s
                  const date = new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", "");
                  const image = {
                    name: i,
                    date: date,
                  };
                  setGallery((prevGallery) => {
                    if (prevGallery) {
                      return [image, ...prevGallery];
                    } else {
                      return [image];
                    }
                  });
                });
              } else {
                const msg_error = {
                  token: crypto.randomBytes(16).toString("hex"),
                  type: "bot",
                  message: "__error",
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
                token: crypto.randomBytes(16).toString("hex"),
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
  }, [lastProcessedMessageToken, messages, sendMessage]);

  useEffect(() => {
    getGallery();
  }, []);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
