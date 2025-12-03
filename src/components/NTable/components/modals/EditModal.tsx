import type { Column, Row, Table } from "@tanstack/react-table";
import { Save } from "lucide-react";
import { Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";
import MultiSelect from "../../../MultiSelect";
import type { SelectOption } from "../../../MultiSelect/MultiSelect";
import type { FilterType } from "../generic/NFilterBar/types";
import Calendar from "../../../Calendar";

type ColumnMeta =
  | {
      filterType?: FilterType;
      options?: SelectOption[];
      filterValueField?: string;
      filterLabelField?: string;
      inputFormat?: string;
      outputFormat?: string;
      editable?: boolean;
    }
  | undefined;

export default function EditModal<TData extends Record<string, unknown>>({
  table,
  row,
  onSave,
}: {
  table: Table<TData>;
  row: Row<TData>;
  onClose: () => void;
  onSave: (data: Partial<TData>) => void;
}) {
  const [newData, setNewData] = useState<Partial<TData>>({});

  // типобезопасный setter
  function setField<K extends keyof TData>(key: K, value: TData[K]) {
    setNewData((prev) => ({ ...prev, [key]: value }));
  }

  function getInitial(col: Column<TData, unknown>) {
    try {
      return row.getValue(col.id as keyof TData as string);
    } catch {
      return undefined;
    }
  }

  function renderField(col: Column<TData, unknown>) {
    const key = col.id as keyof TData;
    const meta = col.columnDef.meta as ColumnMeta;
    const filterType: FilterType = meta?.filterType ?? "text";
    const initialValue = getInitial(col);

    switch (filterType) {
      case "text":
        return (
          <Form.Control
            value={(newData[key] ?? initialValue ?? "") as string}
            onChange={(e) =>
              setField(key, e.target.value as TData[keyof TData])
            }
          />
        );

      case "text-multi":
        return (
          <Form.Control
            as="textarea"
            rows={3}
            value={(newData[key] ?? initialValue ?? "") as string}
            onChange={(e) =>
              setField(key, e.target.value as TData[keyof TData])
            }
          />
        );

      case "range": {
        const init =
          typeof initialValue === "object" && initialValue
            ? (initialValue as { from: string; to: string })
            : { from: "", to: "" };

        return (
          <div style={{ display: "flex", gap: "var(--s)" }}>
            <Form.Control
              type="number"
              placeholder="От"
              defaultValue={init.from}
              onChange={(e) =>
                setField(key, {
                  ...init,
                  from: e.target.value,
                } as TData[typeof key])
              }
            />
            <Form.Control
              type="number"
              placeholder="До"
              defaultValue={init.to}
              onChange={(e) =>
                setField(key, {
                  ...init,
                  to: e.target.value,
                } as TData[typeof key])
              }
            />
          </div>
        );
      }
      case "date-range":
        return (
          <Calendar
            mode="single"
            value={
              (newData[key] ?? initialValue ?? { from: null, to: null }) as any
            }
            onChange={(v) => setField(key, v as TData[keyof TData])}
          />
        );

      case "select":
        return (
          <MultiSelect
            multiple={false}
            value={(newData[key] ?? initialValue) as SelectOption}
            onChange={(v) => setField(key, v as TData[keyof TData])}
            options={meta?.options ?? []}
            valueField={meta?.filterValueField ?? "value"}
            labelField={meta?.filterLabelField ?? "label"}
          />
        );

      case "multi-select":
        return (
          <MultiSelect
            multiple={true}
            value={(newData[key] ?? initialValue) as SelectOption[]}
            onChange={(v) => setField(key, v as TData[keyof TData])}
            options={meta?.options ?? []}
            valueField={meta?.filterValueField ?? "value"}
            labelField={meta?.filterLabelField ?? "label"}
          />
        );

      default:
        return (
          <Form.Control
            defaultValue={(initialValue as unknown as string) ?? ""}
            onChange={(e) =>
              setField(key, e.target.value as TData[keyof TData])
            }
          />
        );
    }
  }

  return (
    <div className="edit-modal">
      <Modal.Body className="edit-modal__body">
        {table.getAllLeafColumns().map((col) => {
          const label =
            typeof col.columnDef.header === "string"
              ? col.columnDef.header
              : col.id;

          const editable =
            (col.columnDef.meta as ColumnMeta)?.editable ?? false;
          if (!editable) return null;

          return (
            <Form.Group key={col.id} className="mb-3">
              <Form.Label>{label}</Form.Label>
              {renderField(col)}
            </Form.Group>
          );
        })}
      </Modal.Body>

      <Modal.Footer className="edit-modal__footer">
        <Button onClick={() => onSave(newData)}>
          <Save />
          &nbsp;Сохранить
        </Button>
      </Modal.Footer>
    </div>
  );
}
