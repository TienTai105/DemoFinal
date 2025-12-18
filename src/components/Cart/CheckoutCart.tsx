import React from 'react';
import { useCartStore } from '../../store/cartStore';
import { useProducts } from '../../api/products/queries';
import { Table } from 'reactstrap';
import { Trash2 } from 'lucide-react';
import { QuantityControl } from '../UI/QuantityControl/QuantityControl';
import './CheckoutCart.scss';
import ConfirmModal from '../UI/ConfirmModal/ConfirmModal';

export const CheckoutCart: React.FC = () => {
  const { items, removeItem, updateQuantity } = useCartStore();
  const { data: allProducts = [] } = useProducts();

  // Helper function to get product image from API
  const getProductImage = (productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      const img = Array.isArray(product.image) ? product.image[0] : product.image;
      return img?.startsWith('http') ? img : `/images${img}`;
    }
    return '/images/placeholder.png';
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

  if (items.length === 0) {
    return (
      <div className="checkout-cart-wrapper">
        <div className="cart-header">
          <h4>Giỏ Hàng</h4>
        </div>
        <div className="empty-cart">Giỏ hàng của bạn trống</div>
      </div>
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
      <div className="checkout-cart-wrapper">
        <div className="cart-header">
          <h4>Giỏ Hàng</h4>
        </div>
        <Table hover className="checkout-cart-table">
          <thead>
            <tr>
              <th className="col-product">Sản Phẩm</th>
              <th className="col-quantity">Số Lượng</th>
              <th className="col-size">Kích Cỡ</th>
              <th className="col-color">Màu</th>
              <th className="col-total">Tổng</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const itemKey = `${item.id}-${item.size || 'default'}-${item.color || 'default'}`;
              return (
                <tr key={itemKey} className="cart-item-row">
                  <td className="col-product">
                    <div className="product-cell">
                      <img src={getProductImage(item.id)} alt={item.name} className="product-image" />
                      <div className="product-info">
                        <div className="product-name">{item.name}</div>
                        <div className="product-sku">Mã: {item.id}</div>
                        <div className="product-price">{item.price.toLocaleString('vi-VN')}.000đ</div>
                      </div>
                    </div>
                  </td>
                  <td className="col-quantity">
                    <div className="quantity-wrapper">
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
                        size="large"
                      />
                      <button
                        className="delete-btn"
                        onClick={() => openRemoveConfirm(itemKey, item.name)}
                        aria-label={`Xóa ${item.name}`}
                        title="Xóa"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                  <td className="col-size">
                    <select className="size-select">
                      <option>{item.size ?? '-'}</option>
                    </select>
                  </td>
                  <td className="col-color">
                    <select className="color-select">
                      <option>{item.color ?? '-'}</option>
                    </select>
                  </td>
                  <td className="col-total">
                    <span className="total-price">{(item.price * item.quantity).toLocaleString('vi-VN')}.000đ</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
};
