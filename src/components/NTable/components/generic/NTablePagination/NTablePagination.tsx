import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import "./NTablePagination.css";
import type { Table } from "@tanstack/react-table";

export default function NTablePagination<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  const { pageIndex, pageSize } = table.getState().pagination;

  const pageCount = table.getPageCount();

  const displayPage = pageIndex + 1;

  function handlePageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw === "") {
      table.setPageIndex(0);
      return;
    }

    let value = Number(raw);

    if (isNaN(value)) value = 0;

    value = Math.max(0, Math.min(value - 1, pageCount - 1));

    table.setPageIndex(value);
  }

  function handlePageSizeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;

    if (raw === "") {
      table.setPageSize(0);
      return;
    }

    let value = Number(raw);
    if (isNaN(value)) value = 0;

    value = Math.max(0, value);
    table.setPageSize(value);
  }

  return (
    <div className="ntable-pagination">
      <div
        className="ntable-pagination__button"
        onClick={() => table.firstPage()}
      >
        <ChevronsLeft />
      </div>
      <div
        className="ntable-pagination__button"
        onClick={() => table.previousPage()}
      >
        <ChevronLeft />
      </div>
      <input
        className="ntable-pagination__input"
        onChange={handlePageChange}
        value={displayPage}
      ></input>
      <div
        className="ntable-pagination__button"
        onClick={() => table.nextPage()}
      >
        <ChevronRight />
      </div>
      <div
        className="ntable-pagination__button"
        onClick={() => table.lastPage()}
      >
        <ChevronsRight />
      </div>
      <span>
        Результатов на страницу:{" "}
        <input
          className="ntable-pagination__input"
          min={0}
          value={pageSize}
          onChange={handlePageSizeChange}
        ></input>
      </span>
      <span>Всего: {(table.options.meta as { total: number })?.total}</span>
    </div>
  );
}
