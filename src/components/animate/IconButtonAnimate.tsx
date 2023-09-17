import { m } from "framer-motion";
import React, { forwardRef } from "react";
import { Box, IconButton, IconButtonProps } from "@mui/material";

const IconButtonAnimate: React.ForwardRefRenderFunction<HTMLButtonElement, IconButtonProps> = (
  { children, size = "medium", ...other },
  ref
) => (
  <AnimateWrap size={size}>
    <IconButton size={size} ref={ref} {...other}>
      {children}
    </IconButton>
  </AnimateWrap>
);

const varSmall = {
  hover: { scale: 1.1 },
  tap: { scale: 0.95 },
};

const varMedium = {
  hover: { scale: 1.09 },
  tap: { scale: 0.97 },
};

const varLarge = {
  hover: { scale: 1.08 },
  tap: { scale: 0.99 },
};

const AnimateWrap: React.FC<{ size?: IconButtonProps["size"]; children: React.ReactNode }> = ({ size, children }) => {
  const isSmall = size === "small";
  const isLarge = size === "large";

  return (
    <Box
      component={m.div}
      whileTap="tap"
      whileHover="hover"
      variants={(isSmall && varSmall) || (isLarge && varLarge) || varMedium}
      sx={{
        display: "inline-flex",
      }}
    >
      {children}
    </Box>
  );
};

export default forwardRef(IconButtonAnimate);
