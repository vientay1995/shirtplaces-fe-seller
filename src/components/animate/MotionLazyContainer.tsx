import { LazyMotion } from "framer-motion";
import { ReactNode } from "react";

const loadFeatures = () => import("./features").then((res) => res.default);

export default function MotionLazyContainer({ children }: { children: ReactNode }) {
  return (
    <LazyMotion strict features={loadFeatures}>
      {children}
    </LazyMotion>
  );
}
