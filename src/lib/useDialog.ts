"use client";

import { useEffect, useRef } from "react";

/** Drives a native <dialog> as a modal from React state; Esc and backdrop clicks call onClose. */
export function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onCloseEvent = () => closeRef.current();
    // Clicks on the ::backdrop target the dialog element itself.
    const onClick = (e: MouseEvent) => e.target === d && d.close();
    d.addEventListener("close", onCloseEvent);
    d.addEventListener("click", onClick);
    return () => {
      d.removeEventListener("close", onCloseEvent);
      d.removeEventListener("click", onClick);
    };
  }, []);

  return ref;
}
