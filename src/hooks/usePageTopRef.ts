import { useCallback, useEffect, useRef } from "react";

type UsePageTopRefOptions = {
  scrollOnMount?: boolean;
  initialBehavior?: ScrollBehavior;
};

export function usePageTopRef(options: UsePageTopRefOptions = {}) {
  const { scrollOnMount = true, initialBehavior = "auto" } = options;
  const pageTopRef = useRef<HTMLDivElement | null>(null);

  const scrollToTop = useCallback((behavior: ScrollBehavior = "auto") => {
    pageTopRef.current?.scrollIntoView({ behavior, block: "start" });
  }, []);

  useEffect(() => {
    if (!scrollOnMount) {
      return;
    }

    scrollToTop(initialBehavior);
  }, [initialBehavior, scrollOnMount, scrollToTop]);

  return {
    pageTopRef,
    scrollToTop,
  };
}