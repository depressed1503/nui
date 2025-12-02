import type { HeaderContext } from "@tanstack/react-table";
import IndeterminateCheckbox from "../../../../IndeterminateCheckbox/IndeterminateCheckbox";

export default function NSelectHeader<TData>(
  ctx: HeaderContext<TData, unknown>
) {
  const table = ctx.table;

  return (
    <div style={{ display: "flex", gap: "var(--s)" }}>
      <IndeterminateCheckbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        style={{ cursor: "pointer" }}
      />
      <span>{table.getSelectedRowModel().rows.length}</span>
    </div>
  );
}
