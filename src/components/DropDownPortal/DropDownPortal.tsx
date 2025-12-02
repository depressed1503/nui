import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  anchorRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}

export default function DropdownPortal({ anchorRef, children }: Props) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const dropdownWidth = 260; // можешь менять
    const viewportWidth = window.innerWidth;

    let left = rect.left;

    // если справа нет места → открыть слева
    if (rect.left + dropdownWidth > viewportWidth) {
      left = rect.right - dropdownWidth;
    }

    setPos({
      top: rect.bottom + 6,
      left,
    });
  }, [anchorRef]);

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        zIndex: 999999,
      }}
    >
      {children}
    </div>,
    document.body
  );
}
