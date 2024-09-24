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
  sendMessage: (msg: string) => Promise<Gallery | null | undefined>;
  messages: Message[] | null;
  setMessages: Dispatch<SetStateAction<Message[] | null>>;
  loadingMessage: boolean;
  getGallery: () => Promise<void>;
  gallery: Gallery[];
  loadingGallery: boolean;
  setLoadingGallery: Dispatch<SetStateAction<boolean>>;
  showImg: Gallery | null;
  setShowImg: Dispatch<SetStateAction<Gallery | null>>;
}

interface AppProps {
  children: ReactNode;
}

export const AppContext = createContext({} as ValueProps);

export const AppProvider: React.FC<AppProps> = ({ children }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [grid, setGrid] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [lastProcessedMessageToken, setLastProcessedMessageToken] = useState<
    string | null
  >(null);
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [showImg, setShowImg] = useState<Gallery | null>(null);

  const handleSidebar = () => {
    setMenuVisible(!menuVisible);
  };

  const getGallery = async () => {
    if (loadingGallery) return;

    let uris: Gallery[] | null = null;

    try {
      setLoadingGallery(true);

      uris = await new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_DB_ENDPOINT}/images`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization:
                  "Bearer " + process.env.NEXT_PUBLIC_DB_ACCESS_TOKEN,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            resolve(data.images);
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
      }
      setLoadingGallery(false);
    }
  };

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
                    const uploadResponse = await fetch("/api/upload", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ image: base64data, prompt: msg }),
                    });

                    if (uploadResponse.ok) {
                      const data = await uploadResponse.json();
                      resolve(data.data.image);
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
          return img;
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
    getGallery,
    gallery,
    loadingGallery,
    setLoadingGallery,
    showImg,
    setShowImg,
  };

  useEffect(() => {
    const _isLg = typeof window !== "undefined" && window.innerWidth >= 1024;
    setMenuVisible(_isLg);
  }, []);

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
                  token: crypto.randomBytes(16).toString("hex"),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
