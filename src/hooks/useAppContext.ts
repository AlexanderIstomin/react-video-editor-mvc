import { useContext } from "react";

import { AppContext } from "../context/AppContext";

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (context == null) {
    throw new Error("out of context");
  }

  return context;
};
