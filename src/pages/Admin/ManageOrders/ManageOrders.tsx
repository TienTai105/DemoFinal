import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../../../components/UI/ConfirmModal/ConfirmModal"; 
import './ManageOrders.scss';

type Order = {
  id: string;
  user?: {
    id?: string | null;
    name?: string;
    email?: string;
    phone?: string;
    addresses?: any[];
    shippingAddressId?: string | null;
  };
  items: any[];
  subtotal?: number;
  total?: number;
  status?: string;
  statusHistory?: { status: string; at: string; note?: string }[];
  updatedAt?: string;
  createdAt?: string;
};

const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  useEffect(() => {
    load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "orders") load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const load = () => {
    try {
      const arr = JSON.parse(localStorage.getItem("orders") || "[]");

      setOrders(Array.isArray(arr) ? arr.slice().reverse() : []);
    } catch {
      setOrders([]);
    }
  };


  const updateStatus = (id: string, status: string) => {
    try {
      const raw = JSON.parse(localStorage.getItem("orders") || "[]");
      const now = new Date().toISOString();
      const updated = raw.map((o: any) => {
        if (o.id !== id) return o;
        const history = Array.isArray(o.statusHistory) ? o.statusHistory.slice() : [];
        history.push({ status, at: now, note: "Cập nhật bởi admin" });
        return { ...o, status, statusHistory: history, updatedAt: now };
      });
      localStorage.setItem("orders", JSON.stringify(updated));
      setOrders(updated.slice().reverse());
      toast.success("Cập nhật trạng thái thành công");
      if (selected?.id === id) setSelected((s) => s ? { ...s, status, statusHistory: (s.statusHistory || []).concat([{ status, at: now, note: "Cập nhật bởi admin" }]) } : s);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const removeOrderConfirmed = (id: string) => {
    try {
      const raw = JSON.parse(localStorage.getItem("orders") || "[]");
      const updated = raw.filter((o: any) => o.id !== id);
      localStorage.setItem("orders", JSON.stringify(updated));
      setOrders(updated.slice().reverse());
      if (selected?.id === id) setSelected(null);
      toast.success("Đã xóa đơn hàng");
    } catch (err) {
      console.error(err);
      toast.error("Xóa không thành công");
    } finally {
      setPendingDelete(null);
    }
  };

  const formatAddress = (a: any) => {
    if (!a) return "-";
    const parts = [];
    if (a.street) parts.push(a.street);
    if (a.city) parts.push(a.city);
    if (a.state) parts.push(a.state);
    if (a.postalCode) parts.push(a.postalCode);
    if (a.country) parts.push(a.country);
    return parts.join(", ");
  };

  return (
    <div className="manage-orders">
      <div className="orders-grid">
        <div className="orders-list">
          <div className="admin-header">
            <h2 className="page-title">Quản lý đơn hàng</h2>
            <div className="header-actions">
              <button onClick={load} className="btn">Tải lại</button>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="empty-placeholder">Chưa có đơn hàng.</div>
          ) : (
            <div className="order-list">
              {orders.map((o) => (
                <div key={o.id} className="order-item">
                  <div className="order-meta">
                    <div className="order-id">Đơn #{o.id}</div>
                    <div className="order-customer">Khách: {o.user?.name || o.user?.email || "-"}</div>
                    <div className="order-date">Ngày: {new Date(o.createdAt || Date.now()).toLocaleString()}</div>
                  </div>
                  <div className="order-actions">
                    <div className="order-total">{(o.total || o.subtotal || 0).toLocaleString('vi-VN')}.000 VND</div>
                    <div className={`order-status ${o.status === "Delivered" ? "is-delivered" : "pending"}`}>
                      {o.status || "Pending"}
                    </div>
                    <button onClick={() => setSelected(o)} className="btn btn--small">Chi tiết</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="order-detail">
          <div className="detail-card">
            <h3 className="detail-title">Chi tiết đơn hàng</h3>
            {!selected ? (
              <div className="empty-placeholder">Chọn một đơn để xem chi tiết.</div>
            ) : (
              <>
                <div className="detail-row"><strong>Đơn:</strong> {selected.id}</div>
                <div className="detail-row"><strong>Khách:</strong> {selected.user?.name || selected.user?.email}</div>
                <div className="detail-row"><strong>Số điện thoại:</strong> {selected.user?.phone || "-"}</div>

                <div className="detail-row">
                  <strong>Địa chỉ giao hàng:</strong>
                  <div className="address-list">
                    {Array.isArray(selected.user?.addresses) && selected.user!.addresses.length > 0 ? (
                      selected.user!.addresses.map((a: any, idx: number) => (
                        <div key={a.id || idx} className={`address-item ${selected.user?.shippingAddressId === a.id ? "is-default" : ""}`}>
                          <div className="address-title">{a.label || `Địa chỉ ${idx + 1}`}</div>
                          <div className="address-text">{formatAddress(a)}</div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-placeholder">Không có địa chỉ</div>
                    )}
                  </div>
                </div>

                <div className="detail-row">
                  <h4 className="detail-subtitle">Sản phẩm</h4>
                  <ul className="product-list">
                    {selected.items.map((it: any, idx: number) => (
                      <li key={idx} className="product-row">
                        <div className="product-left">
                          <img src={it.image || "/no-image.png"} alt={it.name} className="product-thumb-small" />
                          <div>
                            <div className="product-name">{it.name}</div>
                            <div className="product-meta-small">{it.size ? `Size: ${it.size}` : ""} • x{it.quantity}</div>
                          </div>
                        </div>
                        <div className="product-price">{((it.price || 0) * (it.quantity || 0)).toLocaleString('vi-VN')}.000 VND</div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="detail-row">
                  <label className="detail-label">Trạng thái</label>
                  <select
                    value={selected.status || "Pending"}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setSelected({ ...selected, status: newStatus });
                      updateStatus(selected.id, newStatus);
                    }}
                    className="select"
                  >
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>

                <div className="detail-actions">
                  <button onClick={() => setPendingDelete(selected.id)} className="btn btn--danger">Xóa</button>
                  <button onClick={() => setSelected(null)} className="btn">Đóng</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!pendingDelete}
        title="Xác nhận xóa đơn hàng"
        message={<span>Bạn có chắc chắn muốn xóa đơn <strong>{pendingDelete}</strong> ?</span>}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => removeOrderConfirmed(pendingDelete!)}
        cancelText="Hủy"
        confirmText="Xác nhận xóa"
      />
    </div>
  );
};

export default ManageOrders;
