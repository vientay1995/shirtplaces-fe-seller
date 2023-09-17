import React from "react";
import { LocalizationProvider as MuiLocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <MuiLocalizationProvider dateAdapter={AdapterDayjs}>{children}</MuiLocalizationProvider>;
};
