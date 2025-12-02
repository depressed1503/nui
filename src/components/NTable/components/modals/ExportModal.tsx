import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import type { Table } from "@tanstack/react-table";
import "./_modal.css";

export default function ExportModal<TData>({
  table,
  onClose,
}: {
  table: Table<TData>;
  onClose?: () => void;
}) {
  const [mode, setMode] = useState<"all" | "selected">("all");
  const [email, setEmail] = useState("");

  const selectedRows = Object.keys(table.getState().rowSelection).length;

  function handleSubmit() {
    const payload = {
      mode,
      email,
      selectedIds:
        mode === "selected"
          ? table.getSelectedRowModel().rows.map((r) => r.original)
          : [],
    };

    console.log("EXPORT PAYLOAD", payload);
    onClose?.();
  }

  return (
    <div className="bulk-modal">
      <h3>Выгрузка</h3>

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

        <Form.Group className="mt-3">
          <Form.Label>Email для получения файла:</Form.Label>
          <Form.Control
            type="email"
            placeholder="example@mail.ru"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <div className="mt-4" style={{ display: "flex", gap: 10 }}>
          <Button variant="primary" onClick={handleSubmit}>
            Экспорт
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
        </div>
      </Form>
    </div>
  );
}
