"use client";

import React from "react";

type ContextValue = {
  isOpen: boolean;
  open: (prefill?: string) => void;
  close: () => void;
  prefill: string;
  clearPrefill: () => void;
};

const ConciergeContext = React.createContext<ContextValue | null>(null);

export function ConciergeProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [prefill, setPrefill] = React.useState("");

  const open = React.useCallback((text?: string) => {
    setIsOpen(true);
    if (text) setPrefill(text);
  }, []);

  const close = React.useCallback(() => setIsOpen(false), []);
  const clearPrefill = React.useCallback(() => setPrefill(""), []);

  return (
    <ConciergeContext.Provider value={{ isOpen, open, close, prefill, clearPrefill }}>
      {children}
    </ConciergeContext.Provider>
  );
}

export function useConcierge() {
  const ctx = React.useContext(ConciergeContext);
  if (!ctx) throw new Error("useConcierge must be used inside ConciergeProvider");
  return ctx;
}
