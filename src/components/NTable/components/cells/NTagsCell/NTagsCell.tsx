import type { CellContext } from "@tanstack/react-table";
import type { Tag } from "../../../types";
import TagPill from "../../generic/NTagPill/TagPill";

export function NTagsCell<TData>(ctx: CellContext<TData, Tag[]>) {
  const tags = ctx.getValue() ?? [];

  if (!Array.isArray(tags) || tags.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--s)",
        alignItems: "center",
      }}
    >
      {tags.map((tag, i) => (
        <TagPill key={i} tag={tag} />
      ))}
    </div>
  );
}
