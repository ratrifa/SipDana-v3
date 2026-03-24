export interface ReceiptItem {
  name: string;
  qty: number;
  price: number;
}

export interface ReceiptScanResult {
  store: string;
  date?: string;
  items: ReceiptItem[];
  total: number;
}

export const scanReceipt = async (file: File): Promise<ReceiptScanResult> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("receipt", file);

  const res = await fetch("/api/scan-receipt", {
    method: "POST",
    body: formData,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Scan receipt failed: ${res.status} ${res.statusText} - ${errorText}`);
  }

  const json = (await res.json()) as unknown;
  if (!json || typeof json !== "object") {
    throw new Error(`Invalid response format from scan service. Received: ${JSON.stringify(json)}`);
  }

  const payload = json as any;

  const store = typeof payload.store === "string" ? payload.store : "";
  const date = typeof payload.date === "string" ? payload.date : undefined;
  const total = typeof payload.total === "number" ? payload.total : Number(payload.total) || 0;

  const itemsRaw = Array.isArray(payload.items) ? payload.items : [];
  const items: ReceiptItem[] = itemsRaw.map((item: any) => ({
    name: typeof item?.name === "string" ? item.name : "",
    qty: typeof item?.qty === "number" ? item.qty : Number(item?.qty) || 0,
    price: typeof item?.price === "number" ? item.price : Number(item?.price) || 0,
  }));

  return {
    store,
    date,
    items,
    total,
  };
};
