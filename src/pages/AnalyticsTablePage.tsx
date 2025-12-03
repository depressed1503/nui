import { useMemo } from "react";
import NTable from "../components/NTable";
import { fetchOrdersFake } from "../lib/mockQueryFunctions";
import { createColumnHelper } from "@tanstack/react-table";
import type { Order } from "../components/NTable/types";
import { ChartColumnBig, Download, Send } from "lucide-react";
import { NTagsCell } from "../components/NTable/components/cells/NTagsCell/NTagsCell";
import { NCell } from "../components/NTable/components/cells/NCell/NCell";
import { NStatusCell } from "../components/NTable/components/cells/NReadMoreCell/NReadMoreCell";
import { NDateCell } from "../components/NTable/components/cells/NDateCell/NDateCell";
import AnalyzeModal from "../components/NTable/components/modals/actions/AnalyzeModal";
import ExportModal from "../components/NTable/components/modals/actions/ExportModal";
import SendModal from "../components/NTable/components/modals/actions/SendModal";

export default function AnalyticsTablePage() {
  const columnHelper = createColumnHelper<Order>();
  const columns = useMemo(() => {
    return [
      columnHelper.display({
        id: "Анализ",
        header: "",
        cell: () => <ChartColumnBig />,
        enableResizing: false,
        size: 20,
        meta: {
          editable: true,
        },
      }),
      columnHelper.accessor((order) => order.number, {
        id: "number",
        header: "Номер",
        cell: NCell,
        meta: {
          filterType: "range",
        },
      }),
      columnHelper.accessor((order) => order.company, {
        id: "company",
        header: "ДО",
        cell: NCell,
        meta: {
          editable: true,
        },
      }),
      columnHelper.accessor((order) => order.creation_time, {
        id: "creation_time",
        header: "Время регистрации",
        cell: NDateCell,
        meta: {
          inputFormat: "yyyy-MM-dd HH:mm", // входящий формат
          outputFormat: "dd.MM.yyyy HH:mm", // формат для отображения
          filterType: "date-range",
          editable: true,
        },
      }),
      columnHelper.accessor((order) => order.status, {
        id: "status",
        header: "Статус",
        cell: NStatusCell,
        meta: {
          filterType: "multi-select",
          options: [
            { label: "Статус 1", value: "Статус 1" },
            { label: "Статус 2", value: "Статус 2" },
            { label: "Статус 3", value: "Статус 3" },
            { label: "Статус 4", value: "Статус 4" },
          ],
          editable: true,
        },
      }),
      columnHelper.accessor((order) => order.short_description, {
        id: "short_description",
        header: "Краткое описание",
        cell: NCell,
        meta: {
          editable: true,
        },
      }),
      columnHelper.accessor((order) => order.tags, {
        id: "tags",
        header: "Теги",
        cell: NTagsCell,
        meta: {
          editable: true,
        },
      }),
    ];
  }, [columnHelper]);
  return (
    <>
      <NTable
        columns={columns}
        fetchFn={fetchOrdersFake}
        queryKey={"orders"}
        enableRefetchButton
        enableColumnVisibilityControls
        enabledPagination
        enableRowSelection
        enableEdit
        enableFilters
        enableBulkActions
        bulkActions={[
          {
            id: "export",
            icon: <Download />,
            label: "Выгрузка",
            actionModal: (table, onClose) => (
              <ExportModal table={table} onClose={onClose} />
            ),
          },
          {
            id: "send",
            icon: <Send />,
            label: "Рассылка",
            actionModal: (table, onClose) => (
              <SendModal table={table} onClose={onClose} />
            ),
          },
          {
            id: "analyze",
            icon: <ChartColumnBig />,
            label: "Анализ",
            actionModal: (table, onClose) => (
              <AnalyzeModal table={table} onClose={onClose} />
            ),
          },
        ]}
      ></NTable>
    </>
  );
}
