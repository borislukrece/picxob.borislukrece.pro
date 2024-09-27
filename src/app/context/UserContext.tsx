"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import { User as UserInterface } from "@/utils/interface";

interface UserContextProps {
  credentials: string | null;
  user: UserInterface | null;
  loadingLogin: boolean;
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCredentialResponse = (response: { credential: string }) => {
    login(response.credential);
  };

  const GoogleInitialized = useRef(false);
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
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInButton"),
          {
            theme: "filled_blue",
            size: "large",
            text: "signin_with",
            type: "standard",
          }
        );
        window.google.accounts.id.prompt();
      }
    }
  };

  const login = async (token: string) => {
    setLoadingLogin(true);
    setLoadingLogin(true);
    let auth: UserInterface | null = null;
    try {
      auth = await new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_DB_ENDPOINT}/users`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              cache: "no-store",
            }
          );

          if (response.ok) {
            const _user: UserInterface = await response.json();
            resolve(_user);
          } else {
            const errorText = await response.text();
            if (response.status === 401) {
              setCredentials(null);
              setUser(null);
            }
            reject(
              new Error(
                `HTTP error! status: ${response.status}, message: ${errorText}`
              )
            );
          }
        } catch (error) {
          reject(error);
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
    login,
    logout,
    isUserLoggedIn,
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("userToken");
      (async () => {
        if (savedToken) {
          await login(savedToken);
        } else {
          await initGoogle();
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
