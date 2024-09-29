"use client";

import Dropdown from "../Dropdown";
import Image from "next/image";
import React, { useEffect } from "react";
import { useUser } from "@/app/context/UserContext";

const GoogleLogin = React.memo(function GoogleLogin() {
  const { isUserLoggedIn, login, logout, initGoogle, user, loadingLogin } =
    useUser();

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const initGoogleAuth = () => {
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
    };

    initGoogleAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !loadingLogin ? (
    <>
      <div className="flex items-center gap-2">
        <div id="googleSignInButton"></div>

        {isUserLoggedIn() && user && (
          <>
            <Dropdown
              Button={() => {
                return (
                  <>
                    <button
                      title={user.name}
                      type="button"
                      className={`w-10 h-10 flex items-center justify-center rounded-full overflow-hidden active:ring active:ring-black/[0.2] dark:active:ring-black/[0.1]`}>
                      <Image
                        width={40}
                        height={40}
                        priority={false}
                        src={`${user.picture}`}
                        alt="User Avatar"
                        className="w-full h-full"
                      />
                    </button>
                  </>
                );
              }}>
              <div className="w-full p-2 grid gap-1">
                <div className="w-full truncate px-4 cursor-default">
                  {user.email}
                </div>
                <div className="w-full h-[1px] bg-gray-500/10">&nbsp;</div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block px-4 py-2 hover:bg-[var(--hover)] rounded-md">
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            </Dropdown>
          </>
        )}
      </div>
    </>
  ) : (
    <>
      <div className="w-[65px] flex items-center">
        <button title="Loading" type="button">
          <div className="loader6"></div>
        </button>
      </div>
    </>
  );
});

export default GoogleLogin;
