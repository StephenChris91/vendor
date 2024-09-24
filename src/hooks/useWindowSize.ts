// hooks/useWindowSize.ts
"use client";

import { useState, useEffect } from "react";

export default function useWindowSize() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    // Set the initial width
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}