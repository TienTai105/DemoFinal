import React from "react";
import { X, Phone, Mail, Calendar } from "lucide-react";
import "./OrderDetailModal.scss";

type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  name?: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
  category?: string;
};

type Address = {
  id: string;
  receiverName: string;
  phone: string;
  addressLine: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
};

type Order = {
  id: string;
  userId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: Address;
  items: OrderItem[];
  subtotal?: number;
  shippingFee?: number;
  total?: number;
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod?: string;
  paymentStatus?: "unpaid" | "paid";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

interface OrderDetailModalProps {
  isOpen: boolean;
  order: Order;
  onClose: () => void;
  onStatusChange: (newStatus: Order["status"]) => void;
  onDelete: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  order,
  onClose,
  onStatusChange,
  onDelete,
}) => {
  if (!isOpen) return null;

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đã gửi";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Chưa xác định";
    }
  };

  const getPaymentStatusLabel = (status?: string) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "unpaid":
        return "Chưa thanh toán";
      default:
        return "Chưa xác định";
    }
  };

  return (
    <div className="order-detail-modal-overlay" onClick={onClose}>
      <div className="order-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Chi tiết đơn hàng</h2>
            <p className="modal-subtitle">Mã đơn: #{order.id?.slice(-8).toUpperCase()}</p>
          </div>
          <button className="modal-close" onClick={onClose} title="Đóng">
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          {/* Order Header Card */}
          <div className="order-header-card">
            <div className="order-header-left">
              <div className="order-number">
                <span className="label">Mã đơn:</span>
                <span className="value">#{order.id?.slice(-8).toUpperCase()}</span>
              </div>
              <div className="order-date">
                <Calendar size={16} />
                <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "-"}</span>
              </div>
            </div>
            <div className={`status-badge status-${order.status || "pending"}`}>
              {getStatusLabel(order.status)}
            </div>
          </div>

          {/* Customer Section */}
          <div className="section">
            <h3 className="section-title">Thông tin khách hàng</h3>
            <div className="section-content">
              <div className="info-row">
                <span className="label">Tên khách:</span>
                <span className="value">{order.customerName || "-"}</span>
              </div>
              <div className="info-row">
                <Mail size={16} />
                <a href={`mailto:${order.customerEmail}`} className="value link">
                  {order.customerEmail || "-"}
                </a>
              </div>
              <div className="info-row">
                <Phone size={16} />
                <a href={`tel:${order.customerPhone}`} className="value link">
                  {order.customerPhone || "-"}
                </a>
              </div>
            </div>
          </div>

          {/* Shipping Address Section */}
          {order.shippingAddress && (
            <div className="section">
              <h3 className="section-title">Địa chỉ giao hàng</h3>
              <div className="section-content">
                <div className="address-card">
                  <div className="address-receiver">{order.shippingAddress.receiverName}</div>
                  <div className="address-line">{order.shippingAddress.addressLine}</div>
                  <div className="address-detail">
                    {order.shippingAddress.ward && <span>{order.shippingAddress.ward}</span>}
                    {order.shippingAddress.district && <span>{order.shippingAddress.district}</span>}
                    {order.shippingAddress.city && <span>{order.shippingAddress.city}</span>}
                  </div>
                  <div className="address-phone">
                    <Phone size={14} />
                    {order.shippingAddress.phone}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Items Section */}
          <div className="section">
            <h3 className="section-title">Sản phẩm ({order.items?.length || 0})</h3>
            <div className="section-content">
              {order.items && order.items.length > 0 ? (
                <div className="items-list">
                  {order.items.map((item, idx) => (
                    <div key={item.id || idx} className="item-row">
                      <div className="item-image-wrapper">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.productName} 
                            className="item-image"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.currentTarget.parentElement!).querySelector('.item-image-placeholder')?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className="item-image-placeholder">
                          <span>Không có ảnh</span>
                        </div>
                      </div>
                      <div className="item-details">
                        <div className="item-name">
                          {item.productName && item.productName !== 'Sản phẩm'
                            ? item.productName
                            : item.name || 'Sản phẩm'}
                        </div>
                        <div className="item-meta">
                          <span>Mã: {item.productId || item.id || "N/A"}</span>
                          {item.category && <span>Danh mục: {item.category}</span>}
                        </div>
                        <div className="item-attributes">
                          {item.size && <span className="attr-item">Size: <strong>{item.size}</strong></span>}
                          {item.color && <span className="attr-item">Màu: <strong>{item.color}</strong></span>}
                        </div>
                        <div className="item-quantity">
                          Số lượng: <strong>{item.quantity}</strong>
                        </div>
                      </div>
                      <div className="item-pricing">
                        <div className="item-unit-price">{item.price.toLocaleString("vi-VN")}.000₫</div>
                        <div className="item-total-price">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}.000₫
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-text">Không có sản phẩm trong đơn hàng</p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="section">
            <h3 className="section-title">Tóm tắt thanh toán</h3>
            <div className="section-content">
              <div className="summary-row">
                <span className="label">Tạm tính:</span>
                <span className="value">{(order.subtotal || 0).toLocaleString("vi-VN")}.000₫</span>
              </div>
              <div className="summary-row">
                <span className="label">Thuế (8%):</span>
                <span className="value">{(order.subtotal ? order.subtotal * 0.08 : 0).toLocaleString("vi-VN")}.000₫</span>
              </div>
              <div className="summary-row">
                <span className="label">Phí vận chuyển:</span>
                <span className="value">{(order.shippingFee || 0).toLocaleString("vi-VN")}.000₫</span>
              </div>
              <div className="summary-row total">
                <span className="label">Tổng cộng:</span>
                <span className="value">{(order.total || 0).toLocaleString("vi-VN")}.000₫</span>
              </div>
              {order.paymentStatus && (
                <div className={`payment-status payment-${order.paymentStatus}`}>
                  {getPaymentStatusLabel(order.paymentStatus)}
                </div>
              )}
            </div>
          </div>

          {/* Status & Notes Section */}
          <div className="section">
            <h3 className="section-title">Cập nhật trạng thái</h3>
            <div className="section-content">
              <select
                value={order.status || "pending"}
                onChange={(e) => onStatusChange(e.target.value as Order["status"])}
                className="status-select"
              >
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipped">Đã gửi</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>
              {order.notes && (
                <div className="notes-box">
                  <strong>Ghi chú:</strong>
                  <p>{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={onDelete}>
            Xóa đơn hàng
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
