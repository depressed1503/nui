import type { CSSProperties, ReactNode } from "react";
import "./NHoverButton.css";

export default function NHoverButton({
  img,
  text,
  onClick,
  style,
}: {
  img: ReactNode;
  text: string;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  return (
    <button className="custom-button" style={style} onClick={onClick}>
      {img}
      <div className="custom-button__text">{text}</div>
    </button>
  );
}
