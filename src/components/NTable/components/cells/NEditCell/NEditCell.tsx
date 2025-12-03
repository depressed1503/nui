import { useState } from "react";
import { Pencil } from "lucide-react";
import { Modal } from "react-bootstrap";
import type { Row, Table } from "@tanstack/react-table";
import EditModal from "../../modals/EditModal";

export default function NEditCell<TData extends Record<string, unknown>>({
  row,
  table,
}: {
  row: Row<TData>;
  table: Table<TData>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px",
        }}
        onClick={() => setOpen(true)}
      >
        <Pencil />
      </div>

      <Modal show={open} onHide={() => setOpen(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Редактирование записи</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <EditModal<TData>
            table={table}
            row={row}
            onClose={() => setOpen(false)}
            onSave={(data: Record<string, unknown>) => {
              console.log("PATCH:", data);
              setOpen(false);
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}
