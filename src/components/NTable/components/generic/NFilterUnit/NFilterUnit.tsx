import type { Column } from "@tanstack/react-table";
import { useMemo, useState, useRef } from "react";
import { X, FunnelX } from "lucide-react";
import type { FilterType } from "../NFilterBar/types";
import useOutsideClick from "../../../hooks/useOutsideClick";
import type { DateRange } from "../../../../Calendar/Calendar";
import Calendar from "../../../../Calendar/Calendar";
import DropdownPortal from "../../../../DropDownPortal";
import "./NFilterUnit.css";
import MultiSelect from "../../../../MultiSelect";
import type { SelectOption } from "../../../../MultiSelect/MultiSelect";

interface Props<TData> {
  column: Column<TData>;
  handleRemove: () => void;
}

export default function NFilterUnit<TData>({
  column,
  handleRemove,
}: Props<TData>) {
  const meta = column.columnDef.meta as
    | {
        filterType?: FilterType;
        options?: SelectOption[];
        filterValueField: string;
        filterLabelField: string;
      }
    | undefined;

  const filterType: FilterType = meta?.filterType ?? "text";

  const headerText = useMemo(
    () =>
      typeof column.columnDef.header === "string"
        ? column.columnDef.header
        : column.id,
    [column]
  );

  const value = column.getFilterValue();
  const update = (v: unknown) => column.setFilterValue(v);

  const [open, setOpen] = useState(false);

  const anchorRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => setOpen(false));

  /* ---------------- FORMAT CURRENT VALUE ---------------- */

  function formatValue() {
    if (value == null || value === "") return "";

    // ----- массив -----
    if (Array.isArray(value)) return value.join(", ");

    // ----- строки и числа -----
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }

    // ----- date-range -----
    if (filterType === "date-range") {
      const dr = value as DateRange;
      const from =
        dr?.from instanceof Date ? dr.from.toLocaleDateString("ru") : "";
      const to = dr?.to instanceof Date ? dr.to.toLocaleDateString("ru") : "";
      return `${from} — ${to}`.trim();
    }

    // ----- range (числовой диапазон) -----
    if (filterType === "range") {
      const r = value as { from?: number | ""; to?: number | "" };
      const from = r.from ?? "";
      const to = r.to ?? "";
      return `${from} — ${to}`.trim();
    }

    return "";
  }

  const formatted = formatValue();

  /* ------------------ RENDER BODY ------------------ */

  function renderBody() {
    switch (filterType) {
      case "text":
        return (
          <input
            value={(value as string | undefined) ?? ""}
            onChange={(e) => update(e.target.value)}
            placeholder="Текст"
          />
        );

      case "text-multi":
        return (
          <textarea
            value={(value as string | undefined) ?? ""}
            onChange={(e) => update(e.target.value)}
            placeholder="Каждая строка — значение"
          />
        );

      case "select":
        return (
          <MultiSelect
            value={value}
            onChange={(e) => update(e)}
            multiple={false}
            options={meta?.options || []}
            valueField={meta?.filterValueField}
            labelField={meta?.filterLabelField}
          />
        );

      case "multi-select": {
        return (
          <MultiSelect
            value={value as SelectOption[]}
            onChange={(e) => update(e as SelectOption[])}
            multiple={true}
            options={meta?.options || []}
            valueField={meta?.filterValueField}
            labelField={meta?.filterLabelField}
          />
        );
      }

      case "range": {
        const r = (value as { from?: number | ""; to?: number | "" }) ?? {
          from: "",
          to: "",
        };
        return (
          <div>
            <input
              placeholder="от"
              type="number"
              value={r.from ?? ""}
              onChange={(e) =>
                update({
                  ...r,
                  from: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            />
            <input
              placeholder="до"
              type="number"
              value={r.to ?? ""}
              onChange={(e) =>
                update({
                  ...r,
                  to: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            />
          </div>
        );
      }

      case "date-range":
        return (
          <Calendar
            mode="range"
            value={(value as DateRange) ?? null}
            onChange={update}
          />
        );

      default:
        return null;
    }
  }

  /* ------------------ RENDER ------------------ */

  return (
    <>
      <div className="filter-unit">
        <div
          className="filter-unit__left"
          style={{ cursor: "pointer" }}
          ref={anchorRef}
          onClick={() => setOpen((o) => !o)}
        >
          <div>{headerText}</div>
          <div className="filter-unit__value">{formatted}</div>
        </div>
        <div className="filter-unit__right">
          <X onClick={() => update(null)} />
          <FunnelX onClick={handleRemove} />
        </div>
      </div>
      {open && (
        <DropdownPortal anchorRef={anchorRef}>
          <div className="filter-unit__dropdown" ref={dropdownRef}>
            {renderBody()}
          </div>
        </DropdownPortal>
      )}
    </>
  );
}
