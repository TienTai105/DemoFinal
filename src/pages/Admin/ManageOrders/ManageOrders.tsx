import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, Trash2, Search } from "lucide-react";
import ConfirmModal from "../../../components/UI/ConfirmModal/ConfirmModal";
import OrderDetailModal from "./OrderDetailModal";
import './ManageOrders.scss';

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

type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
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

const ManageOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [localOrders, setLocalOrders] = useState<Order[]>([]);

  const API_URL = "https://68ef2e22b06cc802829c5e18.mockapi.io/api/orders";

  // Load orders from localStorage
  React.useEffect(() => {
    try {
      const ordersFromStorage = localStorage.getItem('orders');
      if (ordersFromStorage) {
        const parsed = JSON.parse(ordersFromStorage);
        setLocalOrders(Array.isArray(parsed) ? parsed : []);
        console.log('📦 Loaded orders from localStorage:', parsed);
      }
    } catch (error) {
      console.error('Error loading orders from localStorage:', error);
    }
  }, []);

  // Fetch orders from MockAPI
  const { data: apiOrders = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        const response = await axios.get(API_URL);
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Merge both sources - localStorage takes priority
  const allOrders = [...localOrders, ...apiOrders].reduce((unique, order) => {
    if (!unique.find((o: Order) => o.id === order.id)) {
      unique.push(order);
    }
    return unique;
  }, [] as Order[]);

  const filteredOrders = allOrders.filter((order: Order) =>
    (order.id?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (order.customerName?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (order.customerEmail?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (order.customerPhone ?? "").includes(searchTerm)
  );

  const openDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const updateOrderStatus = (id: string, newStatus: Order["status"]) => {
    if (!selectedOrder) return;

    const updatedOrder = { ...selectedOrder, status: newStatus, updatedAt: new Date().toISOString() };

    // First, update in localStorage
    try {
      const ordersFromStorage = localStorage.getItem('orders');
      const orders = ordersFromStorage ? JSON.parse(ordersFromStorage) : [];
      const updatedOrders = orders.map((o: Order) => o.id === id ? updatedOrder : o);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setLocalOrders(updatedOrders);
      console.log('✅ Order status updated in localStorage');
    } catch (error) {
      console.error('Error updating order in localStorage:', error);
    }

    // Also try to update in MockAPI if available
    axios
      .put(`${API_URL}/${id}`, updatedOrder)
      .then(() => {
        refetch();
        setSelectedOrder(updatedOrder);
        toast.success("Cập nhật trạng thái đơn hàng thành công!");
      })
      .catch(() => {
        // Still show success since we updated localStorage
        toast.success("Cập nhật trạng thái đơn hàng thành công!");
        setSelectedOrder(updatedOrder);
      });
  };

  const removeOrderConfirmed = (id: string) => {
    // First, delete from localStorage
    try {
      const ordersFromStorage = localStorage.getItem('orders');
      const orders = ordersFromStorage ? JSON.parse(ordersFromStorage) : [];
      const updatedOrders = orders.filter((o: Order) => o.id !== id);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setLocalOrders(updatedOrders);
      console.log('✅ Order deleted from localStorage');
    } catch (error) {
      console.error('Error deleting order from localStorage:', error);
    }

    // Also try to delete from MockAPI if available
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        refetch();
        setPendingDelete(null);
        setShowDetailModal(false);
        toast.success("Đã xóa đơn hàng thành công");
      })
      .catch(() => {
        // Still show success since we deleted from localStorage
        setPendingDelete(null);
        setShowDetailModal(false);
        toast.success("Đã xóa đơn hàng thành công");
      });
  };

  if (isLoading) {
    return (
      <div className="manage-orders">
        <div className="loading-state">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="manage-orders">
        <div className="error-state">Có lỗi khi tải dữ liệu</div>
      </div>
    );
  }

  return (
    <div className="manage-orders">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý đơn hàng</h1>
          <p className="page-subtitle">Tổng cộng {filteredOrders.length} đơn hàng</p>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Tìm kiếm theo ID, tên khách, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <p>Không có đơn hàng nào</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="orders-table">
            {/* Header Row */}
            <div className="table-header">
              <div className="header-cell order-id-header">Mã đơn</div>
              <div className="header-cell customer-header">Khách hàng</div>
              <div className="header-cell contact-header">Liên hệ</div>
              <div className="header-cell items-header">Sản phẩm</div>
              <div className="header-cell status-header">Trạng thái</div>
              <div className="header-cell total-header">Tổng tiền</div>
              <div className="header-cell date-header">Ngày đặt</div>
              <div className="header-cell actions-header">Thao tác</div>
            </div>

            {/* Data Rows */}
            {filteredOrders.map((order: Order) => (
              <div key={order.id} className="table-row">
                <div className="table-cell order-id-cell">
                  <span className="order-id-text">#{order.id?.slice(-8).toUpperCase()}</span>
                </div>

                <div className="table-cell customer-cell">
                  <span className="customer-name">{order.customerName || "N/A"}</span>
                </div>

                <div className="table-cell contact-cell">
                  <div className="contact-info">
                    <div className="contact-email">{order.customerEmail || "-"}</div>
                    <div className="contact-phone">{order.customerPhone || "-"}</div>
                  </div>
                </div>

                <div className="table-cell items-cell">
                  <span className="items-badge">{order.items?.length || 0}</span>
                </div>

                <div className="table-cell status-cell">
                  <span className={`status-badge status-${order.status || "pending"}`}>
                    {order.status === "pending" && "Chờ xử lý"}
                    {order.status === "processing" && "Đang xử lý"}
                    {order.status === "shipped" && "Đã gửi"}
                    {order.status === "delivered" && "Đã giao"}
                    {order.status === "cancelled" && "Đã hủy"}
                  </span>
                </div>

                <div className="table-cell total-cell">
                  <span className="total-price">
                    {(order.total || 0).toLocaleString('vi-VN')}.000₫
                  </span>
                </div>

                <div className="table-cell date-cell">
                  <span className="date-text">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : "-"}
                  </span>
                </div>

                <div className="table-cell actions-cell">
                  <div>
                    <button
                      className="action-btn action-btn-view"
                      title="Xem chi tiết"
                      onClick={() => openDetailModal(order)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="action-btn action-btn-delete"
                      title="Xóa"
                      onClick={() => setPendingDelete(order.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailModal
          isOpen={showDetailModal}
          order={selectedOrder}
          onClose={() => setShowDetailModal(false)}
          onStatusChange={(newStatus: Order["status"]) => updateOrderStatus(selectedOrder.id, newStatus)}
          onDelete={() => setPendingDelete(selectedOrder.id)}
        />
      )}

      <ConfirmModal
        isOpen={!!pendingDelete}
        title="Xác nhận xóa đơn hàng"
        message={<span>Bạn có chắc chắn muốn xóa đơn hàng <strong>#{pendingDelete?.slice(-8)}</strong> ?</span>}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => removeOrderConfirmed(pendingDelete!)}
        cancelText="Hủy"
        confirmText="Xác nhận xóa"
      />
    </div>
  );
};

export default ManageOrders;
