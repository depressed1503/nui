import { useEffect } from "react";

export default function useOutsideClick<T extends HTMLElement | null>(
  ref: React.RefObject<T>,
  handler: () => void
) {
  useEffect(() => {
    function listener(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) handler();
    }

    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}
