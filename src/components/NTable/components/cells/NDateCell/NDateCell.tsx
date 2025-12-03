import type { CellContext } from "@tanstack/react-table";
import { parse, format } from "date-fns";

type DateMeta = {
  inputFormat: string; // формат строки, которая приходит
  outputFormat: string; // формат строки, которую надо вывести
};

export function NDateCell<TData, TValue>(ctx: CellContext<TData, TValue>) {
  const value = ctx.getValue();
  const meta = ctx.column.columnDef.meta as DateMeta;

  const inputFormat = meta?.inputFormat ?? "yyyy-MM-dd HH:mm:ss";
  const outputFormat = meta?.outputFormat ?? "dd.MM.yyyy HH:mm";

  if (!value) return null;

  let parsed: Date;

  try {
    parsed = parse(value as string, inputFormat, new Date());
    if (isNaN(parsed.getTime())) throw new Error("Invalid date");
  } catch {
    return <span>{value as string}</span>; // fallback если парсинг не удался
  }

  const formatted = format(parsed, outputFormat);

  return <span>{formatted}</span>;
}
