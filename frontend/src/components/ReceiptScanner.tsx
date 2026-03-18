import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, Button, Spinner, Table, Form, Alert, Row, Col, Badge } from "react-bootstrap";
import { Camera, CheckCircle, Trash, XCircle } from "react-bootstrap-icons";
import { scanReceipt } from "../services/receipt.service";
import type { ReceiptItem, ReceiptScanResult } from "../services/receipt.service";
import { createTransaction } from "../services/transaction.service";
import { fetchCategories } from "../services/utility.service";
import type { Category, TransactionInput } from "../types/transaction.types";

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.floor(value));
};

const ReceiptScanner: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ReceiptScanResult | null>(null);
  const [receiptDate, setReceiptDate] = useState<string>("");
  const [receiptTotal, setReceiptTotal] = useState<number | null>(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number>(0);

  // Create a clean copy of items so we can edit them.
  const [editableItems, setEditableItems] = useState<ReceiptItem[]>([]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  const loadCategories = useCallback(async () => {
    try {
      const cats = await fetchCategories();
      setCategories(cats);
      if (cats.length > 0 && categoryId === 0) {
        setCategoryId(cats[0].id_kategori);
      }
    } catch (err) {
      console.error("Failed load categories", err);
    }
  }, [categoryId]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleFileSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setScanResult(null);
    setEditableItems([]);
    setCroppedPreviewUrl(null);

    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    await handleScan(file);
  };

  const handleScan = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const result = await scanReceipt(file);
      setScanResult(result);
      // Use the date from the receipt, but allow the user to edit it.
      setReceiptDate(result.date ?? "");
      setReceiptTotal(result.total ?? null);
      setEditableItems(
        result.items.map((item) => ({
          ...item,
          qty: item.qty || 1,
        })),
      );
      setCroppedPreviewUrl(result.croppedImage || null);
    } catch (err: any) {
      console.error("Error scanning receipt", err);
      const resp = err?.response?.data;
      const message = resp?.message || err?.message || "Gagal memindai struk. Coba lagi.";
      const details = resp?.details ? ` (${resp.details})` : "";
      setError(`${message}${details}`);
    } finally {
      setLoading(false);
    }
  };

  const handleScanClick = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const handleCancelScan = () => {
    setSelectedFile(null);
    setScanResult(null);
    setReceiptDate("");
    setReceiptTotal(null);
    setEditableItems([]);
    setCroppedPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleItemChange = (index: number, field: "name" | "price" | "qty", value: string) => {
    setEditableItems((prev) => {
      const next = [...prev];
      if (field === "price") {
        const numeric = parseInt(value.replace(/\D/g, ""), 10) || 0;
        next[index] = { ...next[index], price: numeric };
      } else if (field === "qty") {
        const numeric = parseInt(value.replace(/\D/g, ""), 10) || 0;
        next[index] = { ...next[index], qty: numeric };
      } else {
        next[index] = { ...next[index], name: value };
      }
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    setEditableItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    setEditableItems((prev) => [...prev, { name: "", qty: 1, price: 0 }]);
  };

  const totalAmount = useMemo(() => {
    return editableItems.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
  }, [editableItems]);

  const storeName = scanResult ? scanResult.store || scanResult.merchant : "Tidak terdeteksi";
  const receiptDateDisplayed = receiptDate;

  const handleSaveTransactions = async () => {
    if (!scanResult || editableItems.length === 0) {
      setError("Tidak ada item yang bisa disimpan.");
      return;
    }

    if (categoryId === 0) {
      setError("Pilih kategori terlebih dahulu.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const today = new Date().toISOString().split("T")[0];
      const tanggal = receiptDate || today;
      for (const item of editableItems) {
        const qty = item.qty || 1;
        const jumlah = (item.price || 0) * qty;

        const payload: TransactionInput = {
          jenis: "pengeluaran",
          jumlah,
          tanggal,
          keterangan: `${item.name} (x${qty})`,
          id_kategori: categoryId,
        };

        await createTransaction(payload);
      }

      setScanResult(null);
      setCroppedPreviewUrl(null);
      setEditableItems([]);
      setSelectedFile(null);
      setPreviewUrl(null);
      setError(null);
      alert("Semua item berhasil disimpan sebagai transaksi.");
    } catch (err: any) {
      console.error("Gagal menyimpan transaksi:", err);
      setError(err?.response?.data?.message || err?.message || "Gagal menyimpan transaksi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="shadow-sm border-0 mb-4" style={{ borderRadius: "20px" }}>
      <Card.Body>
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between">
          <div>
            <h5 className="mb-1">AI Receipt Scanner</h5>
            <p className="text-muted mb-0">Scan struk belanja untuk mengekstrak item dan harga secara otomatis.</p>
          </div>

          <div className="mt-3 mt-md-0 d-flex gap-2">
            <Button onClick={handleScanClick} className="d-flex align-items-center" variant="primary">
              <Camera className="me-2" /> Scan Receipt
            </Button>
            {(selectedFile || scanResult) && (
              <Button onClick={handleCancelScan} className="d-flex align-items-center" variant="outline-secondary">
                <XCircle className="me-2" /> Cancel
              </Button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileSelection} />
          </div>
        </div>

        {loading && (
          <div className="d-flex align-items-center justify-content-center mt-4">
            <Spinner animation="border" role="status" size="sm" className="me-2" />
            <span>Memindai struk...</span>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="mt-4">
            {error}
          </Alert>
        )}

        {previewUrl && (
          <div className="mt-4 d-flex flex-column flex-lg-row gap-4">
            <div style={{ flex: 1, maxWidth: 360 }}>
              <div className="mb-2 text-muted small">Preview Gambar</div>
              <div className="border rounded-3 overflow-hidden" style={{ background: "#f7f9fc" }}>
                <img src={previewUrl} alt="Receipt preview" style={{ width: "100%", display: "block" }} />
              </div>
            </div>

            {croppedPreviewUrl && (
              <div style={{ flex: 1, maxWidth: 360 }}>
                <div className="mb-2 text-muted small">Preview Crop (area struk)</div>
                <div className="border rounded-3 overflow-hidden" style={{ background: "#f7f9fc" }}>
                  <img src={croppedPreviewUrl} alt="Cropped receipt" style={{ width: "100%", display: "block" }} />
                </div>
              </div>
            )}

            <div style={{ flex: 2 }}>
              {scanResult && (
                <>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <div className="small text-muted">Merchant</div>
                      <h6 className="mb-0">{storeName}</h6>
                      <Form.Group controlId="receiptDate" className="mt-2">
                        <Form.Label className="small text-muted">Tanggal</Form.Label>
                        <Form.Control type="date" value={receiptDateDisplayed || ""} onChange={(e) => setReceiptDate(e.target.value)} size="sm" />
                      </Form.Group>
                      {receiptTotal !== null && <div className="small text-muted mt-1">Total struk: {formatRupiah(receiptTotal)}</div>}
                    </div>
                    <Badge bg="success" className="px-3 py-2">
                      Total: {formatRupiah(totalAmount)}
                    </Badge>
                  </div>

                  <div className="table-responsive">
                    <Table hover size="sm" className="mb-3" style={{ minWidth: 500 }}>
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th className="text-end">Qty</th>
                          <th className="text-end">Harga Unit (Rp)</th>
                          <th className="text-end">Total (Rp)</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {editableItems.map((item, idx) => {
                          const qty = item.qty || 0;
                          const lineTotal = (item.price || 0) * qty;
                          return (
                            <tr key={`${item.name}-${idx}`}>
                              <td style={{ minWidth: 220 }}>
                                <Form.Control size="sm" value={item.name} onChange={(e) => handleItemChange(idx, "name", e.target.value)} placeholder="Nama item" />
                              </td>
                              <td className="text-end" style={{ maxWidth: 80 }}>
                                <Form.Control size="sm" value={qty} onChange={(e) => handleItemChange(idx, "qty", e.target.value)} className="text-end" placeholder="0" />
                              </td>
                              <td className="text-end" style={{ maxWidth: 140 }}>
                                <Form.Control size="sm" value={(item.price || 0).toLocaleString("id-ID")} onChange={(e) => handleItemChange(idx, "price", e.target.value)} className="text-end" placeholder="0" />
                              </td>
                              <td className="text-end" style={{ maxWidth: 140 }}>
                                {formatRupiah(lineTotal)}
                              </td>
                              <td className="text-end">
                                <Button variant="outline-danger" size="sm" onClick={() => handleRemoveItem(idx)} title="Hapus item">
                                  <Trash />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                        {editableItems.length === 0 && (
                          <tr>
                            <td colSpan={5} className="text-center text-muted py-4">
                              Tidak ada item terdeteksi.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>

                  <Row className="align-items-center mb-3">
                    <Col xs={12} md={8} className="mb-2 mb-md-0">
                      <Form.Group controlId="receiptCategory">
                        <Form.Label className="small text-muted">Kategori Transaksi</Form.Label>
                        <Form.Select value={categoryId} onChange={(e) => setCategoryId(parseInt(e.target.value, 10))}>
                          <option value={0} disabled>
                            Pilih kategori...
                          </option>
                          {categories.map((cat) => (
                            <option key={cat.id_kategori} value={cat.id_kategori}>
                              {cat.nama_kategori}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={4} className="text-end">
                      <Button variant="outline-primary" className="me-2" disabled={saving} onClick={handleAddItem}>
                        Tambah Barang
                      </Button>
                      <Button variant="success" disabled={saving || editableItems.length === 0 || categoryId === 0} onClick={handleSaveTransactions}>
                        {saving ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="me-2" />
                            Simpan Transaksi
                          </>
                        )}
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ReceiptScanner;
