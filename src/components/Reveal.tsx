"use client";

import React from "react";

/** Scroll-reveal wrapper: IntersectionObserver + the [data-reveal] CSS in globals.css. */
export function Reveal({ children, style, className }: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal className={className} style={style}>
      {children}
    </div>
  );
}
