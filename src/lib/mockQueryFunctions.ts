import type { FetchParams, Order, PaginatedResult } from "../components/NTable/types";

export async function fetchOrdersFake(params: FetchParams): Promise<PaginatedResult<Order>> {
  const { pagination } = params;

  const ALL_ITEMS = 125; // общее количество фиктивных заказов
  const mockOrders: Order[] = Array.from({ length: ALL_ITEMS }).map((_, i) => ({
    id: i + 1,
    number: `IM-${100000 + i}`,
    company: `Company ${i % 7}`,
    creation_time: "2025-11-01 12:00",
    creation_datetime: "2025-11-01 12:00",
    status: ["Создан", "В работе", "Закрыт"][i % 3],
    short_description: `Описание заказа #${i + 1}`,
    asset_group: `АРМ_${(i % 15) + 1}`,
    tags: [
      {
        text: "Тест",
        description: "Описание тега",
        color: "hsla(0, 80%, 30%, 1.0)",
        background_color: "hsla(0, 90%, 90%, 1.0)"
      }
    ]
  }));
  const start = (pagination.pageIndex) * pagination.pageSize;
  const end = start + pagination.pageSize;
  const paginatedData = mockOrders.slice(start, end);
  await new Promise(res => setTimeout(res, 300));
  return {
    results: paginatedData,
    total: ALL_ITEMS,
  };
}
