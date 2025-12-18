import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Search, Package, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import './UserOrders.scss';
import { useAuthStore } from '../../../store/authStore';
import OrderDetailModal from '../../Admin/ManageOrders/OrderDetailModal';

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

const UserOrders: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  // Load orders from localStorage on mount
  useEffect(() => {
    loadUserOrders();
  }, [user?.id]);

  const loadUserOrders = () => {
    try {
      const allOrders = localStorage.getItem('orders');
      if (allOrders) {
        const parsed = JSON.parse(allOrders);
        // Filter orders for current user
        const userOrders = Array.isArray(parsed)
          ? parsed.filter((order: Order) => order.userId === user?.id)
          : [];
        setOrders(userOrders);
        console.log('📦 User orders loaded:', userOrders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const filteredOrders = orders.filter((order) =>
    (order.id?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (order.customerName?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  );

  const openDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const updateOrderStatus = (id: string, newStatus: Order['status']) => {
    if (!selectedOrder) return;

    const updatedOrder = {
      ...selectedOrder,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    try {
      const allOrders = localStorage.getItem('orders');
      const parsed = allOrders ? JSON.parse(allOrders) : [];
      const updatedOrders = parsed.map((o: Order) =>
        o.id === id ? updatedOrder : o
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders.filter((o: Order) => o.userId === user?.id));
      setSelectedOrder(updatedOrder);
      toast.success('Cập nhật trạng thái thành công!');
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const removeOrder = (id: string) => {
    try {
      const allOrders = localStorage.getItem('orders');
      const parsed = allOrders ? JSON.parse(allOrders) : [];
      const orderToDelete = parsed.find((o: Order) => o.id === id);

      // Check if order status is pending before allowing deletion
      if (orderToDelete?.status !== 'pending') {
        toast.error('Chỉ có thể xóa đơn hàng có trạng thái "Chờ xử lý"');
        setPendingDelete(null);
        return;
      }

      const updatedOrders = parsed.filter((o: Order) => o.id !== id);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders.filter((o: Order) => o.userId === user?.id));
      setShowDetailModal(false);
      setPendingDelete(null);
      toast.success('Đơn hàng đã bị xóa');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Lỗi khi xóa đơn hàng');
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'processing':
        return <Package size={16} />;
      case 'shipped':
        return <Truck size={16} />;
      case 'delivered':
        return <CheckCircle2 size={16} />;
      case 'cancelled':
        return <AlertCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đã gửi';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Chưa xác định';
    }
  };

  if (!user) {
    return (
      <div className="user-orders">
        <div className="empty-state">
          <AlertCircle size={48} />
          <p>Vui lòng đăng nhập để xem đơn hàng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-orders">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Đơn hàng của tôi</h1>
          <p className="page-subtitle">Theo dõi trạng thái các đơn hàng của bạn</p>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Tìm kiếm theo ID hoặc tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <Package size={48} />
          <p>Bạn chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              {/* Card Header */}
              <div className="card-header">
                <div className="order-info">
                  <div className="order-id">#{order.id?.slice(-8).toUpperCase()}</div>
                  <div className="order-date">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString('vi-VN')
                      : '-'}
                  </div>
                </div>
                <div className={`status-badge status-${order.status || 'pending'}`}>
                  <span className="status-icon">{getStatusIcon(order.status)}</span>
                  <span className="status-text">
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="card-body">
                {/* Items Preview */}
                <div className="items-preview">
                  <div className="items-count">
                    {order.items?.length || 0} sản phẩm
                  </div>
                  {order.items?.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="item-preview">
                      {item.image && (
                        <img src={item.image} alt={item.productName} />
                      )}
                      <div className="item-info">
                        <div className="item-name">{item.productName}</div>
                        <div className="item-qty">x{item.quantity}</div>
                      </div>
                    </div>
                  ))}
                  {(order.items?.length || 0) > 2 && (
                    <div className="items-more">
                      +{(order.items?.length || 0) - 2} sản phẩm khác
                    </div>
                  )}
                </div>

                {/* Order Total */}
                <div className="order-total">
                  <span className="label">Tổng tiền:</span>
                  <span className="price">
                    {(order.total || 0).toLocaleString('vi-VN')}.000₫
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="card-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => openDetailModal(order)}
                >
                  <Eye size={16} />
                  Chi tiết
                </button>
                <button
                  className={`btn btn-danger ${order.status !== 'pending' ? 'disabled' : ''}`}
                  onClick={() => order.status === 'pending' && setPendingDelete(order.id)}
                  title={order.status === 'pending' ? 'Xóa đơn hàng' : 'Chỉ có thể xóa đơn hàng chờ xử lý'}
                  disabled={order.status !== 'pending'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          isOpen={showDetailModal}
          order={selectedOrder}
          onClose={() => setShowDetailModal(false)}
          onStatusChange={(newStatus) =>
            updateOrderStatus(selectedOrder.id, newStatus)
          }
          onDelete={() => setPendingDelete(selectedOrder.id)}
        />
      )}

      {/* Delete Confirmation */}
      {pendingDelete && (
        <div className="delete-confirmation-overlay" onClick={() => setPendingDelete(null)}>
          <div className="delete-confirmation" onClick={(e) => e.stopPropagation()}>
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa đơn hàng này?</p>
            <div className="confirmation-buttons">
              <button
                className="btn btn-secondary"
                onClick={() => setPendingDelete(null)}
              >
                Hủy
              </button>
              <button
                className="btn btn-danger"
                onClick={() => removeOrder(pendingDelete)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
