"use client";

import { useCallback, useEffect, useState } from "react";

type Size = {
  width: number;
  height: number;
};

const INITIAL_SIZE: Size = { width: 0, height: 0 };

const useResizeObserver = <T extends HTMLElement>() => {
  const [node, setNode] = useState<T | null>(null);
  const [size, setSize] = useState<Size>(INITIAL_SIZE);

  const ref = useCallback((element: T | null) => {
    setNode(element);
  }, []);

  useEffect(() => {
    if (!node) {
      return undefined;
    }

    let frame = 0;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      const { width, height } = entry.contentRect;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setSize({ width, height });
      });
    });

    observer.observe(node);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [node]);

  return { ref, size };
};

export default useResizeObserver;
