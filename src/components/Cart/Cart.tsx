import React from 'react';
import { useCartStore } from '../../store/cartStore';
import { Container, Row, Col, Button, Table } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import './Cart.scss';
import ConfirmModal from '../UI/ConfirmModal/ConfirmModal';

type CartVariant = 'page' | 'drawer' | 'inline' | 'checkout';

interface CartProps {
  variant?: CartVariant;
  onClose?: () => void; // for drawer variant
}

export const Cart: React.FC<CartProps> = ({ variant = 'page', onClose }) => {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const total = getTotal();
  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmTarget, setConfirmTarget] = React.useState<{
    id?: string;
    name?: string;
    pendingQuantity?: number | undefined;
  }>({});

  const openRemoveConfirm = (id: string, name?: string) => {
    setConfirmTarget({ id, name });
    setConfirmOpen(true);
  };

  const openRemoveConfirmForQty = (id: string, name?: string, pendingQuantity?: number) => {
    setConfirmTarget({ id, name, pendingQuantity });
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (!confirmTarget.id) {
      setConfirmOpen(false);
      return;
    }
    if (confirmTarget.pendingQuantity !== undefined) {
      const q = confirmTarget.pendingQuantity;
      if (q > 0) {
        updateQuantity(String(confirmTarget.id), q);
      } else {
        removeItem(String(confirmTarget.id));
      }
    } else {
      removeItem(String(confirmTarget.id));
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
          <th>Product</th>
          {variant !== 'inline' && <th>Price</th>}
          <th>Size</th>
          <th>Color</th>
          <th>Quantity</th>
          <th>Total</th>
          {variant === 'page' && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="cart-item">
            <td>
              <div className="item-info">
                <img src={item.image} alt={item.name} className="item-image" />
                <span>{item.name}</span>
              </div>
            </td>
            {variant !== 'inline' && <td>${item.price.toFixed(2)}</td>}
            <td>{item.size ?? '-'}</td>
            <td>{item.color ?? '-'}</td>
            <td>
              <div className="quantity-control">
                <button
                  onClick={() => {
                    const newQ = item.quantity - 1;
                    if (newQ <= 0) {
                      openRemoveConfirmForQty(String(item.id), item.name, newQ);
                    } else {
                      updateQuantity(String(item.id), newQ);
                    }
                  }}
                >
                  -
                </button>
                <input
                  type="string"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (Number.isNaN(v)) return;
                    if (v <= 0) {
                      openRemoveConfirmForQty(String(item.id), item.name, v);
                    } else {
                      updateQuantity(String(item.id), v);
                    }
                  }}
                />
                <button onClick={() => updateQuantity(String(item.id), item.quantity + 1)}>+</button>
              </div>
            </td>
            <td>${(item.price * item.quantity).toFixed(2)}</td>
            {variant === 'page' && (
              <td>
                <button className="btn btn-sm btn-danger" onClick={() => openRemoveConfirm(String(item.id), item.name)}>
                  <Trash2 size={16} />
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );

  // Drawer variant (compact) content
  if (variant === 'drawer') {
    return (
      <>
        <ConfirmModal
          isOpen={confirmOpen}
          title="Remove item"
          message={confirmTarget.name ? `Are you sure you want to remove "${confirmTarget.name}"?` : 'Are you sure?'}
          confirmText="Remove"
          cancelText="Cancel"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
        <div className="cart-drawer-content">
          {items.length === 0 ? (
            <div className="empty">Your cart is empty</div>
          ) : (
            <div>
              <ul className="drawer-list">
                {items.map((item) => (
                  <li className="drawer-item" key={item.id}>
                    <img src={item.image} alt={item.name} className="drawer-thumb" />
                    <div className="info">
                      <div className="name">{item.name}</div>
                      <div className="meta">Color: {item.color ?? '-'} • Size: {item.size ?? '-'}</div>
                      <div className="qty">
                        <button
                          onClick={() => {
                            const newQ = item.quantity - 1;
                            if (newQ <= 0) {
                              openRemoveConfirmForQty(String(item.id), item.name, newQ);
                            } else {
                              updateQuantity(String(item.id), newQ);
                            }
                          }}
                        >
                          -
                        </button>
                        <input
                          type="string"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            if (Number.isNaN(v)) return;
                            if (v <= 0) {
                              openRemoveConfirmForQty(String(item.id), item.name, v);
                            } else {
                              updateQuantity(String(item.id), v);
                            }
                          }}
                        />
                        <button onClick={() => updateQuantity(String(item.id), item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <div className="actions">
                      <div className="price">${(item.price * item.quantity).toFixed(2)}</div>
                      <button className="remove" onClick={() => openRemoveConfirm(String(item.id), item.name)} aria-label={`Remove ${item.name}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="drawer-footer">
                <div className="subtotal">Subtotal: <strong>${total.toFixed(2)}</strong></div>
                <div className="buttons">
                  <Button color="primary" onClick={() => { onClose?.(); navigate('/checkout'); }}>
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </div>
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
          title="Remove item"
          message={confirmTarget.name ? `Are you sure you want to remove "${confirmTarget.name}"?` : 'Are you sure?'}
          confirmText="Remove"
          cancelText="Cancel"
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
            title="Remove item"
            message={confirmTarget.name ? `Are you sure you want to remove "${confirmTarget.name}"?` : 'Are you sure?'}
            confirmText="Remove"
            cancelText="Cancel"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
          <div className="text-muted text-center py-3">Your cart is empty</div>
        </>
      );
    }
    return (
      <>
        <ConfirmModal
          isOpen={confirmOpen}
          title="Remove item"
          message={confirmTarget.name ? `Are you sure you want to remove "${confirmTarget.name}"?` : 'Are you sure?'}
          confirmText="Remove"
          cancelText="Cancel"
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
        title="Remove item"
        message={confirmTarget.name ? `Are you sure you want to remove "${confirmTarget.name}"?` : 'Are you sure?'}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <Container className="cart-container py-5">
        <h2 className="mb-4">Shopping Cart</h2>
        <Row>
          <Col lg={8}>{ItemsTable}</Col>
          <Col lg={4}>
            <div className="cart-summary">
              <h4>Order Summary</h4>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>${(total * 0.1).toFixed(2)}</span>
              </div>
              <hr />
              <div className="summary-row total">
                <span>Total:</span>
                <span>${(total * 1.1).toFixed(2)}</span>
              </div>
              <Button color="primary" block className="mt-4 checkout-btn" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </Button>
              <Button color="secondary" outline block className="mt-2" onClick={() => navigate('/')}>
                Continue Shopping
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};
