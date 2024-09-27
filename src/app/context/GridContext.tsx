"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface GridContextProps {
  grid: boolean;
  setGrid: (grid: boolean) => void;
}

const GridContext = createContext<GridContextProps | undefined>(undefined);

export const GridProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [grid, setGrid] = useState(false);

  const value = {
    grid,
    setGrid,
  };

  return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
};

export const useGrid = () => {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error("useGrid must be used within a GridProvider");
  }
  return context;
};
