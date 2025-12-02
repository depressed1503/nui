export type FilterType =
  | "text"
  | "text-multi"
  | "select"
  | "multi-select"
  | "range"
  | "date-range";

export interface ColumnFilterMeta {
  type: FilterType;
  placeholder?: string;

  options?: Record<string, unknown>[];
  /** Для диапазонов */
  min?: number;
  max?: number;
  /** Для даты */
  dateFormat?: string;
  /** Для передачи на сервер, если не совпадает с column.id */
  serverKey?: string;
}
