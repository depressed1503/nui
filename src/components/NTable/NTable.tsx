import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnSizingState,
  type PaginationState,
} from "@tanstack/react-table";
import "./NTable.css";
import type { FetchParams, NTableProps } from "./types";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import NTablePagination from "./components/generic/NTablePagination";
import NFilterBar from "./components/generic/NFilterBar";
import { Eye, Funnel, RotateCw } from "lucide-react";
import NHoverButton from "./components/generic/NHoverButton";
import NSelectCell from "./components/cells/NSelectCell/NSelectCell";
import NSelectHeader from "./components/cells/NSelectHeader/NSelectHeader";
import ColumnSettings from "./components/generic/ColumnSettings";
import DropdownPortal from "../DropDownPortal";
import useOutsideClick from "./hooks/useOutsideClick";
import Skeleton from "../Sceleton";
import NEditCell from "./components/cells/NEditCell";

export default function Ntable<
  TData extends Record<string, unknown>,
  TQueryParams extends FetchParams
>(props: NTableProps<TData, TQueryParams>) {
  const columnHelper = createColumnHelper<TData>();
  const [rowSelection, setRowSelection] = useState({});

  const systemColumns = [
    columnHelper.display({
      id: "Выбор",
      header: NSelectHeader,
      cell: NSelectCell,
      enableResizing: false,
      size: 20,
    }),
    props.enableEdit &&
      columnHelper.display({
        id: "edit",
        header: "",
        cell: ({ row, table }) => <NEditCell row={row} table={table} />,
        enableResizing: false,
        size: 28,
      }),
  ].filter(Boolean);
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [props.queryKey, pagination],
    queryFn: () => props.fetchFn({ pagination } as unknown as TQueryParams),
    placeholderData: (prev) => prev,
  });
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data?.results || [],
    columns: [...systemColumns, ...props.columns] as ColumnDef<TData>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    state: {
      pagination,
      rowSelection,
      columnSizing,
    },
    onColumnSizingChange: setColumnSizing,
    meta: {
      total: data?.total || 0,
    },
  });
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [filtersVisible, setFiltersVisible] = useState<boolean>(false);
  const [columnSettingsShow, setColumnSettingsShow] = useState<boolean>(false);
  const eyeButtonRef = useRef(null);
  const columnSettingsDropDownRef = useRef(null);
  useOutsideClick(columnSettingsDropDownRef, () =>
    setColumnSettingsShow(false)
  );
  return (
    <div className="table-with-functions">
      <div className="ntable__tools">
        <div className="ntable__tools__block">
          {props.enableRefetchButton && (
            <RotateCw
              onClick={() => !isLoading && refetch()}
              className={`icon ${isFetching ? "spinning" : ""}`}
            />
          )}
          {props.enableColumnVisibilityControls && (
            <Eye
              onClick={() => setColumnSettingsShow(true)}
              ref={eyeButtonRef}
            />
          )}
          {props.enableFilters && (
            <Funnel onClick={() => setFiltersVisible(!filtersVisible)} />
          )}
        </div>
        {props.enableColumnVisibilityControls && columnSettingsShow && (
          <DropdownPortal anchorRef={eyeButtonRef}>
            <ColumnSettings
              table={table}
              onClose={() => setColumnSettingsShow(false)}
            ></ColumnSettings>
          </DropdownPortal>
        )}
        {props.enableBulkActions && (
          <div className="ntable__tools__block">
            {props.bulkActions?.map((action) => (
              <div key={action.id}>
                <NHoverButton
                  img={action.icon}
                  text={action.label}
                  onClick={() =>
                    setActiveActionId((prev) =>
                      prev === action.id ? null : action.id
                    )
                  }
                />

                {activeActionId === action.id && (
                  <div className="ntable__tools__modal">
                    {action.actionModal(table, () => setActiveActionId(null))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {props.enableFilters && (
        <div className={`ntable__filters ${filtersVisible ? "opened" : ""}`}>
          <NFilterBar table={table}></NFilterBar>
        </div>
      )}
      <div className="ntable__wrapper">
        <table className="ntable">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  return (
                    <th key={header.id} style={{ width: header.getSize() }}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className="col-resize-handle"
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {!isLoading
              ? table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              : // 10 строк скелетонов
                Array.from({ length: 10 }).map((_, rowIndex) => (
                  <tr key={`skeleton-row-${rowIndex}`}>
                    {table.getVisibleLeafColumns().map((col) => (
                      <td key={`skeleton-cell-${rowIndex}-${col.id}`}>
                        <Skeleton />
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {props.enabledPagination && <NTablePagination table={table} />}
    </div>
  );
}
