import type { Tag } from "../../../types";
import "./TagPill.css";

export default function TagPill({ tag }: { tag: Tag }) {
  return (
    <div
      className="tag-pill"
      style={{
        color: tag.color,
        backgroundColor: tag.background_color,
        borderColor: tag.color,
      }}
    >
      {tag.text}
    </div>
  );
}
