import { flexRender, type Column, type Table } from "@tanstack/react-table";
import "./NFilterBar.css";
import { useRef, useState } from "react";
import { FunnelPlus, X } from "lucide-react";
import NFilterUnit from "../NFilterUnit";
import DropdownPortal from "../../../../DropDownPortal";

function AddFilteredColumnDropDown<TData>({
  table,
  addColumn,
  handleClose,
}: {
  table: Table<TData>;
  addColumn: (column: Column<TData>) => void;
  handleClose: () => void;
}) {
  return (
    <div className="add-filtered-column-dropdown">
      <div className="add-filtered-column-dropdown__header">
        <X style={{ cursor: "pointer" }} onClick={handleClose} />
      </div>
      {table.getHeaderGroups().map((headerGroup) =>
        headerGroup.headers
          .filter((header) => header.column.getCanFilter())
          .map((header) => (
            <div
              key={header.id}
              className="add-filtered-column-dropdown__filter"
              onClick={() => addColumn(header.column)}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </div>
          ))
      )}
    </div>
  );
}

export default function NFilterBar<TData>({ table }: { table: Table<TData> }) {
  const [filteredColumns, sertFilteredColumns] = useState<Column<TData>[]>([]);
  function addFilteredColumn(column: Column<TData>) {
    if (!filteredColumns.map((col) => col.id).includes(column.id)) {
      sertFilteredColumns([...filteredColumns, column]);
      setColumnDropdownVisible(false);
    }
  }

  function removeFilteredColumn(column: Column<TData>) {
    sertFilteredColumns(filteredColumns.filter((col) => col.id !== column.id));
  }

  const [columnDropdownVisible, setColumnDropdownVisible] =
    useState<boolean>(false);
  const addBtnRef = useRef<HTMLButtonElement>(null);
  function handleDropdownClose() {
    setColumnDropdownVisible(false);
  }
  return (
    <div className="filter-bar">
      {filteredColumns.map((col) => (
        <NFilterUnit
          key={col.id}
          column={col}
          handleRemove={() => removeFilteredColumn(col)}
        />
      ))}
      <button
        ref={addBtnRef}
        className="filter-bar__column-add"
        onClick={() => setColumnDropdownVisible(true)}
      >
        <FunnelPlus />
      </button>
      {columnDropdownVisible && (
        <DropdownPortal anchorRef={addBtnRef}>
          <AddFilteredColumnDropDown
            table={table}
            addColumn={addFilteredColumn}
            handleClose={handleDropdownClose}
          ></AddFilteredColumnDropDown>
        </DropdownPortal>
      )}
    </div>
  );
}
