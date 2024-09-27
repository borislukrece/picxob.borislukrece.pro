"use client";

import Dropdown from "../Dropdown";
import Image from "next/image";
import React from "react";
import { useUser } from "@/app/context/UserContext";

const GoogleLogin = React.memo(function GoogleLogin() {
  const { isUserLoggedIn, logout, user, loadingLogin } = useUser();

  const handleLogout = () => {
    logout();
  };

  return !loadingLogin ? (
    <>
      <div className="flex items-center gap-2">
        <div
          id="googleSignInButton"
          className={`${isUserLoggedIn() ? "hidden" : ""}`}></div>

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
              <div className="p-2 grid gap-1">
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
    <></>
  );
});

export default GoogleLogin;
