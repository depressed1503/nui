import type { CellContext } from "@tanstack/react-table";

export function NStatusCell<TData, TValue>(ctx: CellContext<TData, TValue>) {
  const value = ctx.getValue();

  const options =
    (
      ctx.column.columnDef.meta as {
        options: Array<{ value: unknown; label: string; color: string }>;
      }
    )?.options ??
    ([] as Array<{ value: unknown; label: string; color: string }>);

  const opt = options.find((o) => o.value === value);

  const color = opt?.color ?? "#a1a1a1";
  const label = opt?.label ?? String(value);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--s)",
      }}
    >
      {/* Вертикальная полоска */}
      <div
        style={{
          width: 4,
          height: "100%",
          borderRadius: 2,
          backgroundColor: color,
        }}
      />

      <span style={{ color }}>{label}</span>
    </div>
  );
}
