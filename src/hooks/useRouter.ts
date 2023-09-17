import { useRouteChangeContext } from "@/contexts/RouteChangeContext";
import { PrefetchOptions, NavigateOptions } from "next/dist/shared/lib/app-router-context";
import { useRouter as useNextRouter } from "next/navigation";

export const useRouter = () => {
  const { back, forward, prefetch, push, refresh, replace } = useNextRouter();
  const { onRouteChangeStart } = useRouteChangeContext();

  return {
    refresh,
    back: () => {
      onRouteChangeStart();
      back();
    },
    forward: () => {
      onRouteChangeStart();
      forward();
    },
    prefetch: (href: string, options?: PrefetchOptions) => {
      onRouteChangeStart();
      prefetch(href, options);
    },
    push: (href: string, options?: NavigateOptions) => {
      onRouteChangeStart();
      push(href, options);
    },
    replace: (href: string, options?: NavigateOptions) => {
      onRouteChangeStart();
      replace(href, options);
    },
  };
};
