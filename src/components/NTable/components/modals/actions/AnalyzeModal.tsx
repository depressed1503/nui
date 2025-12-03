import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import type { Table } from "@tanstack/react-table";
import "./_modal.css";

export default function AnalyzeModal<TData>({
  table,
  onClose,
}: {
  table: Table<TData>;
  onClose?: () => void;
}) {
  const [mode, setMode] = useState<"all" | "selected">("all");
  const selectedRows = Object.keys(table.getState().rowSelection).length;

  function handleSubmit() {
    const payload = {
      mode,
      selectedIds:
        mode === "selected"
          ? table.getSelectedRowModel().rows.map((r) => r.original)
          : [],
    };

    console.log("ANALYZE PAYLOAD", payload);
    onClose?.();
  }

  return (
    <div className="bulk-modal">
      <h3>Анализ</h3>

      <Form>
        <Form.Group>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Form.Check
              type="radio"
              label={`Весь набор данных (${
                (table.options.meta as { total: number }).total
              })`}
              checked={mode === "all"}
              onChange={() => setMode("all")}
            />
            <Form.Check
              type="radio"
              label={`Только выбранные (${selectedRows})`}
              checked={mode === "selected"}
              onChange={() => setMode("selected")}
            />
          </div>
        </Form.Group>

        <div className="mt-4" style={{ display: "flex", gap: 10 }}>
          <Button variant="primary" onClick={handleSubmit}>
            Анализ
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
        </div>
      </Form>
    </div>
  );
}
