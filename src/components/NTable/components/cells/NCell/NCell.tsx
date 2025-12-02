import type { CellContext } from "@tanstack/react-table";

export function NCell<TData, TValue>(ctx: CellContext<TData, TValue>) {
  const value = ctx.getValue();
  //   const row = ctx.row.original;
  //   const column = ctx.column;

  return <>{String(value)}</>;
}
