import type { ColumnDef, ColumnFilter, PaginationState, SortingState, Table } from "@tanstack/react-table";
import type { ReactNode } from "react";

export type Order = {
  id: number,
  number: string,
  company: string,
  creation_time: string,
  status: string,
  short_description: string,
  asset_group: string,
  tags: Tag[]
}

export type Tag = {
  text: string,
  description: string,
  color: string,
  background_color: string,
}

export interface FetchParams {
  pagination: PaginationState;
  sorting: SortingState;
  filters: ColumnFilter[];
}

export interface PaginatedResult<T> {
  results: T[];
  total: number;
}


export interface NTableProps<
  TData extends object,
  TQueryParams extends FetchParams
> {
  fetchFn: (params: TQueryParams) => Promise<PaginatedResult<TData>>;
  queryKey: string,
  onQueryParamsChange?: (params: TQueryParams) => void;
  columns: ColumnDef<TData, any>[];
  enableColumnVisibilityControls?: boolean;
  enabledPagination?: boolean;
  initialPageSize?: number;
  enableSorting?: boolean;
  enableFilters?: boolean;
  enableRowSelection?: boolean;
  enableEdit?: boolean;
  onEdit?: (id: string, patch: Partial<TData>) => Promise<unknown>;
  onDelete?: (ids: string[] | string) => Promise<unknown>;
  enableBulkActions?: boolean;
  bulkActions?: {
    id: string;
    label: string;
    icon?: React.ReactNode;
    actionModal: (table: Table<TData>, close?: () => void) => ReactNode
  }[];
  enableRefetchButton?: boolean;
  enableLoadingOverlay?: boolean;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  filterDebounceMs?: number;
  instanceKey?: string;
}
