export interface ReceiptItem {
  name: string;
  qty?: number;
  price: number;
}

export interface ReceiptScanResult {
  store: string;
  merchant: string; // kept for backwards compatibility
  date?: string;
  items: ReceiptItem[];
  total: number;
  rawText?: string;
  croppedImage?: string; // Optional, can be used by UI if available
}

interface N8nReceiptItem {
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface N8nReceiptResponse {
  store_name: string;
  transaction_date: string;
  items: N8nReceiptItem[];
  total_payment: number;
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

  // n8n can return either an array (default) or a single object depending on how the workflow is configured.
  const payload = Array.isArray(json) && json.length ? json[0] : json;

  if (!payload || typeof payload !== "object") {
    throw new Error(`Invalid response format from scan service. Expected object or array; got: ${JSON.stringify(json)}`);
  }

  const store = (payload as any).store_name || (payload as any).store || (payload as any).merchant || "";
  const date = (payload as any).transaction_date || (payload as any).date;
  const total = (payload as any).total_payment || (payload as any).total || (payload as any).amount;

  const rawItems = (payload as any).items || (payload as any).line_items || (payload as any).products;

  if (!store || !rawItems || !Array.isArray(rawItems)) {
    throw new Error(`Scan service returned unexpected data format. Received: ${JSON.stringify(payload)}`);
  }

  const items: ReceiptItem[] = rawItems.map((item: any) => ({
    name: item.name || item.product || item.description || "",
    qty: item.quantity || item.qty || item.count,
    price: item.unit_price || item.price || item.amount || 0,
  }));

  return {
    store,
    merchant: store,
    date,
    items,
    total: typeof total === "number" ? total : Number(total) || 0,
    rawText: JSON.stringify(payload),
  };
};
