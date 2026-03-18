export interface ReceiptItem {
  name: string;
  qty?: number;
  price: number;
}

export interface ParsedReceipt {
  store: string;
  merchant: string; // kept for backwards compatibility
  date?: string;
  items: ReceiptItem[];
  total: number;
}

const normalizeDate = (year: number, month: number, day: number) => {
  const y = year.toString().padStart(4, "0");
  const m = month.toString().padStart(2, "0");
  const d = day.toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const parseDateFromLine = (line: string): string | undefined => {
  // Common date formats: YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
  const patterns = [
    /(?<year>\d{4})[\/\-](?<month>\d{1,2})[\/\-](?<day>\d{1,2})/, // 2024-06-18
    /(?<day>\d{1,2})[\/\-](?<month>\d{1,2})[\/\-](?<year>\d{4})/, // 18/06/2024
    /(?<day>\d{1,2})\.(?<month>\d{1,2})\.(?<year>\d{4})/, // 18.06.2024
  ];

  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match && match.groups) {
      const y = parseInt(match.groups.year, 10);
      const m = parseInt(match.groups.month, 10);
      const d = parseInt(match.groups.day, 10);
      if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
        return normalizeDate(y, m, d);
      }
    }
  }

  return undefined;
};

/**
 * Parse OCR text into structured receipt data.
 *
 * This is a heuristic parser. It will:
 * - take the first non-empty line as store/merchant name
 * - detect lines with an item name followed by a numeric price
 * - detect a total line containing keywords like "total" or "subtotal"
 * - detect a date field if present
 */
export const parseReceiptText = (text: string): ParsedReceipt => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const store = lines.length > 0 ? lines[0] : "";
  const items: ReceiptItem[] = [];
  let total = 0;
  let date: string | undefined;

  const totalKeywords = /total|subtotal|jumlah|grand total|totalnya|bayar/i;
  const ignoreKeywords = /(cash|card|visa|mastercard|debit|change|tax|ppn|vat|no\s*\d)/i;

  for (const line of lines) {
    const normalized = line.toLowerCase();

    // Try to detect date in any line
    if (!date) {
      const parsedDate = parseDateFromLine(line);
      if (parsedDate) {
        date = parsedDate;
      }
    }

    // Skip common non-item lines
    if (ignoreKeywords.test(normalized) && !totalKeywords.test(normalized)) {
      continue;
    }

    // Look for a total line
    if (totalKeywords.test(normalized)) {
      const priceMatch = line.match(/([0-9]+[\d.,]*)/g);
      if (priceMatch) {
        const lastMatch = priceMatch[priceMatch.length - 1];
        const price = parseInt(lastMatch.replace(/[^0-9]/g, ""), 10);
        if (!Number.isNaN(price)) {
          total = price;
        }
      }
      continue;
    }

    // Item + price line (e.g. "Indomie 9000")
    const itemMatch = line.match(/^(.+?)\s+([0-9]+[\d.,]*)$/);
    if (itemMatch) {
      const name = itemMatch[1].trim();
      const price = parseInt(itemMatch[2].replace(/[^0-9]/g, ""), 10);
      if (name && !Number.isNaN(price) && price > 0) {
        items.push({ name, price, qty: 1 });
      }
    }
  }

  if (!total && items.length > 0) {
    total = items.reduce((sum, item) => sum + item.price, 0);
  }

  return {
    store,
    merchant: store,
    date,
    items,
    total,
  };
};
