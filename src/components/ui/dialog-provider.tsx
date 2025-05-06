"use client";

import React, { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

interface DialogContextType {
  openDialog: (content: React.ReactNode) => string;
  closeDialog: (id: string) => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dialogs, setDialogs] = useState<Record<string, React.ReactNode>>({});

  // Client-side only portal container
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  React.useEffect(() => {
    // Create portal container on client
    const container = document.createElement("div");
    container.className = "dialog-stack-portal";
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      document.body.removeChild(container);
    };
  }, []);

  const openDialog = (content: React.ReactNode) => {
    const id = `dialog-${Date.now()}`;
    setDialogs((prev) => ({ ...prev, [id]: content }));
    return id;
  };

  const closeDialog = (id: string) => {
    setDialogs((prev) => {
      const newDialogs = { ...prev };
      delete newDialogs[id];
      return newDialogs;
    });
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      {portalContainer &&
        createPortal(
          Object.entries(dialogs).map(([id, content]) => (
            <React.Fragment key={id}>{content}</React.Fragment>
          )),
          portalContainer
        )}
    </DialogContext.Provider>
  );
};
