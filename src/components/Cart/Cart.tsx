import React from 'react';
import { useCartStore } from '../../store/cartStore';
import { useProducts } from '../../api/products/queries';
import { Container, Row, Col, Button, Table } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Trash2 } from 'lucide-react';
import { QuantityControl } from '../UI/QuantityControl/QuantityControl';
import './Cart.scss';
import ConfirmModal from '../UI/ConfirmModal/ConfirmModal';

type CartVariant = 'page' | 'drawer' | 'inline' | 'checkout';
type QuantitySizeVariant = 'small' | 'medium' | 'large';

interface CartProps {
  variant?: CartVariant;
  onClose?: () => void; // for drawer variant
  quantitySize?: QuantitySizeVariant; // for controlling quantity button size
}

export const Cart: React.FC<CartProps> = ({ variant = 'page', onClose, quantitySize = 'small' }) => {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const { data: allProducts = [] } = useProducts();
  const total = getTotal();
  const navigate = useNavigate();

  // Helper function to get product image from API
  const getProductImage = (productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      const img = Array.isArray(product.image) ? product.image[0] : product.image;
      return img?.startsWith('http') ? img : `/images${img}`;
    }
    return '/images/placeholder.png'; // fallback image
  };

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmTarget, setConfirmTarget] = React.useState<{
    itemKey?: string;
    name?: string;
    pendingQuantity?: number | undefined;
  }>({});

  const openRemoveConfirm = (itemKey: string, name?: string) => {
    setConfirmTarget({ itemKey, name });
    setConfirmOpen(true);
  };

  const openRemoveConfirmForQty = (itemKey: string, name?: string, pendingQuantity?: number) => {
    setConfirmTarget({ itemKey, name, pendingQuantity });
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (!confirmTarget.itemKey) {
      setConfirmOpen(false);
      return;
    }
    if (confirmTarget.pendingQuantity !== undefined) {
      const q = confirmTarget.pendingQuantity;
      if (q > 0) {
        updateQuantity(confirmTarget.itemKey, q);
      } else {
        removeItem(confirmTarget.itemKey);
      }
    } else {
      removeItem(confirmTarget.itemKey);
    }
    setConfirmOpen(false);
    setConfirmTarget({});
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setConfirmTarget({});
  };

  // Items list used in multiple variants
  const ItemsTable = (
    <Table hover className={variant === 'inline' ? 'cart-table cart-table--inline' : 'cart-table'}>
      <thead>
        <tr>
          <th>Sản Phẩm</th>
          <th>Giá</th>
          <th>Kích Cỡ</th>
          <th>Màu</th>
          <th>Số Lượng</th>
          <th>Tổng</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const itemKey = `${item.id}-${item.size || 'default'}-${item.color || 'default'}`;
          return (
            <tr key={itemKey} className="cart-item">
            <td>
              <div className="item-info">
                <img src={getProductImage(item.id)} alt={item.name} className="item-image" />
                <span>{item.name}</span>
              </div>
            </td>
            <td>{item.price.toLocaleString('vi-VN')}.000đ</td>
            <td>{item.size ?? '-'}</td>
            <td>{item.color ?? '-'}</td>
            <td>
              <div className="quantity-with-action">
                <QuantityControl
                  quantity={item.quantity}
                  onDecrease={() => {
                    const newQ = item.quantity - 1;
                    if (newQ <= 0) {
                      openRemoveConfirmForQty(itemKey, item.name, newQ);
                    } else {
                      updateQuantity(itemKey, newQ);
                    }
                  }}
                  onIncrease={() => updateQuantity(itemKey, item.quantity + 1)}
                  onChange={(v) => {
                    if (v <= 0) {
                      openRemoveConfirmForQty(itemKey, item.name, v);
                    } else {
                      updateQuantity(itemKey, v);
                    }
                  }}
                  size={quantitySize}
                />
                {(variant === 'page' || variant === 'checkout') && (
                  <button className="cart-delete-btn" onClick={() => openRemoveConfirm(itemKey, item.name)} aria-label={`Xóa ${item.name}`}>
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            </td>
            <td>{(item.price * item.quantity).toLocaleString('vi-VN')}.000đ</td>
          </tr>
          );
        })}
      </tbody>
    </Table>
  );

  // Drawer variant (compact) content
  if (variant === 'drawer') {
    return (
      <>
        <ConfirmModal
          isOpen={confirmOpen}
          title="Xóa Sản Phẩm"
          message={confirmTarget.name ? `Bạn có chắc chắn muốn xóa "${confirmTarget.name}"?` : 'Bạn có chắc chắn?'}
          confirmText="Xóa"
          cancelText="Hủy"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
        <div className="cart-drawer-content">
          {items.length === 0 ? (
            <div className="empty">Giỏ hàng của bạn trống</div>
          ) : (
            <>
              <ul className="drawer-list">
                {items.map((item) => (
                  <li className="drawer-item" key={`${item.id}-${item.size}-${item.color}`}>
                    <img src={getProductImage(item.id)} alt={item.name} className="drawer-thumb" />
                    <div className="info">
                      <div className="name">{item.name}</div>
                      <div className="meta">Color: {item.color ?? '-'} • Size: {item.size ?? '-'}</div>
                      <div className="qty">
                        <QuantityControl
                          quantity={item.quantity}
                          onDecrease={() => {
                            const newQ = item.quantity - 1;
                            if (newQ <= 0) {
                              openRemoveConfirmForQty(`${item.id}-${item.size}-${item.color}`, item.name, newQ);
                            } else {
                              updateQuantity(`${item.id}-${item.size}-${item.color}`, newQ);
                            }
                          }}
                          onIncrease={() => updateQuantity(`${item.id}-${item.size}-${item.color}`, item.quantity + 1)}
                          onChange={(v) => {
                            if (v <= 0) {
                              openRemoveConfirmForQty(`${item.id}-${item.size}-${item.color}`, item.name, v);
                            } else {
                              updateQuantity(`${item.id}-${item.size}-${item.color}`, v);
                            }
                          }}
                          size="small"
                        />
                      </div>
                    </div>
                    <div className="actions">
                      <div className="price">{(item.price * item.quantity).toLocaleString('vi-VN')}.000đ</div>
                      <button className="remove" onClick={() => openRemoveConfirm(`${item.id}-${item.size}-${item.color}`, item.name)} aria-label={`Remove ${item.name}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="drawer-footer">
                <div className="subtotal">Subtotal: <strong>{total.toLocaleString('vi-VN')}.000đ</strong></div>
                <div className="buttons">
                  <Button className="checkout-btn-accent" onClick={() => { onClose?.(); navigate('/checkout'); }}>
                    Thanh Toán <ChevronRight/>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  }

  // Inline variant (for embedding into checkout page) — only items
  if (variant === 'inline') {
    return (
      <>
        <ConfirmModal
          isOpen={confirmOpen}
          title="Xóa Sản Phẩm"
          message={confirmTarget.name ? `Bạn có chắc chắn muốn xóa "${confirmTarget.name}"?` : 'Bạn có chắc chắn?'}
          confirmText="Xóa"
          cancelText="Hủy"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
        <div className="cart-inline">{ItemsTable}</div>
      </>
    );
  }

  // Checkout variant (full table with all columns at top of checkout) — same as page but without summary
  if (variant === 'checkout') {
    if (items.length === 0) {
      return (
        <>
          <ConfirmModal
            isOpen={confirmOpen}
            title="Xóa Sản Phẩm"
            message={confirmTarget.name ? `Bạn có chắc chắn muốn xóa "${confirmTarget.name}"?` : 'Bạn có chắc chắn?'}
            confirmText="Xóa"
            cancelText="Hủy"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
          <div className="text-muted text-center py-3">Giỏ hàng của bạn trống</div>
        </>
      );
    }
    return (
      <>
        <ConfirmModal
          isOpen={confirmOpen}
          title="Xóa Sản Phẩm"
          message={confirmTarget.name ? `Bạn có chắc chắn muốn xóa "${confirmTarget.name}"?` : 'Bạn có chắc chắn?'}
          confirmText="Xóa"
          cancelText="Hủy"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
        <div className="cart-checkout">{ItemsTable}</div>
      </>
    );
  }

  // Page variant (full page): show items and order summary
  return (
    <>
      <ConfirmModal
        isOpen={confirmOpen}
        title="Xóa Sản Phẩm"
        message={confirmTarget.name ? `Bạn có chắc chắn muốn xóa "${confirmTarget.name}"?` : 'Bạn có chắc chắn?'}
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <Container className="cart-container py-5">
        <h2 className="mb-4">Giỏ Hàng</h2>
        <Row>
          <Col lg={8}>{ItemsTable}</Col>
          <Col lg={4}>
            <div className="cart-summary">
              <h4>Tóm Tắt Đơn Hàng</h4>
              <div className="summary-row">
                <span>Tổng Phụ:</span>
                <span>{total.toLocaleString('vi-VN')}.000đ</span>
              </div>
              <div className="summary-row">
                <span>Vận Chuyển:</span>
                <span>Miễn Phí</span>
              </div>
              <div className="summary-row">
                <span>Thuế:</span>
                <span>{(total * 0.1).toLocaleString('vi-VN')}.000đ</span>
              </div>
              <hr />
              <div className="summary-row total">
                <span>Tổng Cộng:</span>
                <span>{(total * 1.1).toLocaleString('vi-VN')}.000đ</span>
              </div>
              <Button className="mt-4 checkout-btn" onClick={() => navigate('/checkout')}>
                Thanh Toán <ChevronRight/>
              </Button>
              <Button color="secondary" outline block className="mt-2" onClick={() => navigate('/')} style={{ color: '#173036', borderColor: '#ddd' }}>
                Tiếp Tục Mua Sắm
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};
