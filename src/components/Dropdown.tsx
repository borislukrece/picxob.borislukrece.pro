import React, { useEffect, useRef, useState } from "react";

export default function Dropdown({
  Button,
  children,
}: {
  Button: () => React.JSX.Element;
  children: React.ReactNode;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className={`flex items-center justify-center hover:bg-[var(--hover)] ${
          showDropdown && "bg-[var(--hover)]"
        } overflow-hidden active:ring active:ring-black/[0.2] dark:active:ring-black/[0.1] rounded-md`}>
        <Button />
      </div>
      <div
        className={`dropdown absolute end-4 z-10 mt-2 min-w-32 max-w-sm rounded-md bg-[var(--menu-background)] shadow-md ${
          !showDropdown && "hidden"
        }`}>
        {children}
      </div>
    </div>
  );
}
