"use client";

import { createContext, useContext, useState, ReactNode, useRef } from "react";
import { User as UserInterface } from "@/utils/interface";
import { useTheme } from "./ThemeContext";
import { APP_ENDPOINT } from "@/utils/helpers";
import { fetcher } from "@/utils/fetcher";

interface UserContextProps {
  credentials: string | null;
  user: UserInterface | null;
  loadingLogin: boolean;
  initGoogle: () => Promise<void>;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isUserLoggedIn: () => boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [credentials, setCredentials] = useState<string | null>(null);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const GoogleInitialized = useRef(false);

  const { theme } = useTheme();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCredentialResponse = (response: { credential: string }) => {
    login(response.credential);
  };

  const initGoogle = async () => {
    if (typeof window !== "undefined" && window.google) {
      if (!isUserLoggedIn()) {
        if (!GoogleInitialized.current) {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            auto_select: true,
            use_fedcm_for_prompt: true,
            cancel_on_tap_outside: true,
            prompt_parent_id: "googleSignInButton",
            callback: handleCredentialResponse,
            context: "use",
            ux_mode: "popup",
            select_by: "auto",
          });
          GoogleInitialized.current = true;
        }
        if (document.getElementById("googleSignInButton")) {
          window.google.accounts.id.renderButton(
            document.getElementById("googleSignInButton"),
            {
              theme:
                theme === "system"
                  ? window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "filled_black"
                    : "filled_black"
                  : theme,
              size: "large",
              text: "signin_with",
              type: window.matchMedia("(max-width: 640px)").matches
                ? "icon"
                : "standard",
            }
          );
        } else {
          console.warn("googleSignInButton element doesn't exist.");
        }
        window.google.accounts.id.prompt();
      }
    }
  };

  const login = async (token: string) => {
    setLoadingLogin(true);
    let auth: UserInterface | null = null;
    try {
      auth = await new Promise(async (resolve) => {
        try {
          const response = await fetcher(`${APP_ENDPOINT()}/users`, {
            method: "GET",
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (
            response &&
            typeof response === "object" &&
            Object.keys(response).length > 0
          ) {
            const _user: UserInterface = response;
            resolve(_user);
          } else {
            resolve(null);
          }
        } catch (error) {
          console.log("Login process failed:", error);
          resolve(null);
        }
      });
    } catch (error) {
      console.log(error);
    }

    if (auth) {
      setCredentials(token);
      setUser(auth);
      localStorage.setItem("userToken", token);
      localStorage.setItem("user", JSON.stringify(auth));
    } else {
      await initGoogle();
    }

    setLoadingLogin(false);
  };

  const isUserLoggedIn = () => {
    return credentials !== null && user !== null;
  };

  const logout = () => {
    setCredentials(null);
    setUser(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    if (typeof window !== "undefined" && window.google) {
      window.google.accounts.id.revoke(credentials, () => {
        console.log("User disconnected.");
      });
      window.google.accounts.id.disableAutoSelect();
      window.location.reload();
    }
  };

  const value = {
    credentials,
    user,
    loadingLogin,
    initGoogle,
    login,
    logout,
    isUserLoggedIn,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Hook pour utiliser UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
