import type { Table } from "@tanstack/react-table";
import { useState } from "react";
import "./ColumnSettings.css";
import { Form } from "react-bootstrap";

interface Props<TData> {
  table: Table<TData>;
  onClose?: () => void;
}

export default function ColumnSettings<TData>({
  table,
  onClose,
}: Props<TData>) {
  const columns = table.getAllLeafColumns();

  const [order, setOrder] = useState(columns.map((c) => c.id));

  const allVisible = columns.every((c) => c.getIsVisible());
  const someVisible = columns.some((c) => c.getIsVisible());

  function toggleAll() {
    const shouldShow = !allVisible;
    columns.forEach((col) => col.toggleVisibility(shouldShow));
  }

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, id: string) {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, targetId: string) {
    const draggedId = e.dataTransfer.getData("text/plain");
    if (!draggedId || draggedId === targetId) return;

    const newOrder = [...order];
    const fromIndex = newOrder.indexOf(draggedId);
    const toIndex = newOrder.indexOf(targetId);

    newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, draggedId);

    setOrder(newOrder);
    table.setColumnOrder(newOrder);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();

    const container = e.currentTarget.closest(
      ".column-settings"
    ) as HTMLElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;

    const scrollZone = 60; // область в px где начинается автоскролл
    const scrollSpeed = 2; // скорость

    // тянуть вниз
    if (offsetY > rect.height - scrollZone) {
      container.scrollTop += scrollSpeed;
    }

    // тянуть вверх
    if (offsetY < scrollZone) {
      container.scrollTop -= scrollSpeed;
    }
  }

  return (
    <div className="column-settings">
      {/* HEADER */}
      <div className="column-settings__header">
        <label className="column-settings__select-all">
          <Form.Check
            type="checkbox"
            checked={allVisible}
            ref={(el) => {
              if (el) el.indeterminate = !allVisible && someVisible;
            }}
            onChange={toggleAll}
          />
          Выбрать все
        </label>

        {onClose && (
          <button className="column-settings__close" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      {/* COLUMN LIST */}
      {order.map((colId) => {
        const column = columns.find((c) => c.id === colId)!;

        const title =
          typeof column.columnDef.header === "string" && column.columnDef.header
            ? column.columnDef.header
            : column.id;

        return (
          <div
            key={column.id}
            className="column-settings__item"
            draggable
            onDragStart={(e) => handleDragStart(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
            onDragOver={handleDragOver}
          >
            <label className="column-settings__label">
              <Form.Check
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={() => column.toggleVisibility()}
              />
              {title}
            </label>

            <div className="column-settings__drag-handle">⋮⋮</div>
          </div>
        );
      })}
    </div>
  );
}
