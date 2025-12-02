import type { CellContext } from "@tanstack/react-table";
import IndeterminateCheckbox from "../../../../IndeterminateCheckbox/IndeterminateCheckbox";

export default function NSelectCell<TData>(ctx: CellContext<TData, unknown>) {
  const row = ctx.row;

  return (
    <IndeterminateCheckbox
      checked={row.getIsSelected()}
      indeterminate={row.getIsSomeSelected()}
      disabled={!row.getCanSelect()}
      onChange={row.getToggleSelectedHandler()}
      style={{ cursor: row.getCanSelect() ? "pointer" : "not-allowed" }}
    />
  );
}
