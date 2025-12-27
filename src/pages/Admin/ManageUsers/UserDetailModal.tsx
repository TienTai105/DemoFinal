import React from "react";
import { X, Phone, Mail, Calendar, Shield, Lock, User } from "lucide-react";
import { User as UserType } from "../../../types";
import "./UserDetailModal.scss";

interface UserDetailModalProps {
  isOpen: boolean;
  user: UserType | null;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ isOpen, user, onClose }) => {
  if (!isOpen || !user) return null;

  const createdDate = new Date(user.createdAt || Date.now()).toLocaleDateString("vi-VN");
  const defaultAddress = user.addresses && Array.isArray(user.addresses) 
    ? user.addresses.find((addr) => addr.isDefault) 
    : undefined;

  return (
    <div className="user-detail-modal-overlay" onClick={onClose}>
      <div className="user-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h3>Chi tiết người dùng</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          {/* User Header Card */}
          <div className="user-header-card">
            <img src={user.avatar || ""} alt={user.fullName || "User"} className="user-avatar-large" />
            <div className="user-header-content">
              <h2>{user.fullName || "N/A"}</h2>
              <p className="username">@{user.username || "N/A"}</p>
              <div className="badges-row">
                <span className={`badge badge-role ${user.role}`}>
                  <Shield size={14} />
                  {user.role === "admin" ? "Admin" : "User"}
                </span>
                <span className={`badge badge-status ${user.status}`}>
                  <span className="dot"></span>
                  {user.status === "active" ? "Đang hoạt động" : "Vô hiệu hóa"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <Calendar size={18} />
              <div>
                <label>Ngày tham gia</label>
                <p>{createdDate}</p>
              </div>
            </div>
          </div>

          {/* Section: Tài khoản */}
          <div className="detail-section">
            <h4 className="section-title">Tài khoản</h4>
            <div className="section-content">
              <div className="info-row">
                <div className="info-label">
                  <User size={16} />
                  <span>Tên đăng nhập</span>
                </div>
                <p className="info-value">{user.username || "N/A"}</p>
              </div>
              <div className="info-row">
                <div className="info-label">
                  <Lock size={16} />
                  <span>Mật khẩu</span>
                </div>
                <p className="info-value password">{"•".repeat(user.password?.length || 8)}</p>
              </div>
            </div>
          </div>

          {/* Section: Thông tin liên hệ */}
          <div className="detail-section">
            <h4 className="section-title">Thông tin liên hệ</h4>
            <div className="section-content">
              <div className="info-row">
                <div className="info-label">
                  <Mail size={16} />
                  <span>Email</span>
                </div>
                <a href={`mailto:${user.email}`} className="info-value email-link">{user.email}</a>
              </div>
              <div className="info-row">
                <div className="info-label">
                  <Phone size={16} />
                  <span>Số điện thoại</span>
                </div>
                <a href={`tel:${user.phone}`} className="info-value phone-link">{user.phone}</a>
              </div>
            </div>
          </div>

          {/* Section: Địa chỉ mặc định */}
          {defaultAddress && (
            <div className="detail-section">
              <h4 className="section-title">Địa chỉ mặc định</h4>
              <div className="address-card default">
                <div className="address-badge">Mặc định</div>
                <div className="address-details">
                  <p className="recipient">
                    <strong>{defaultAddress.receiverName}</strong>
                  </p>
                  <p className="address-text">{defaultAddress.addressLine}</p>
                  <p className="address-text">{defaultAddress.ward}, {defaultAddress.district}</p>
                  <p className="address-text">{defaultAddress.city}</p>
                  <p className="phone-text">
                    <Phone size={14} />
                    <a href={`tel:${defaultAddress.phone}`}>{defaultAddress.phone}</a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section: Tất cả địa chỉ */}
          {user.addresses && Array.isArray(user.addresses) && user.addresses.length > 0 && (
            <div className="detail-section">
              <h4 className="section-title">Tất cả địa chỉ ({user.addresses.length})</h4>
              <div className="addresses-grid">
                {user.addresses.map((addr) => (
                  <div key={addr.id} className={`address-card ${addr.isDefault ? "default" : ""}`}>
                    {addr.isDefault && <div className="address-badge">Mặc định</div>}
                    <div className="address-details">
                      <p className="recipient">
                        <strong>{addr.receiverName}</strong>
                      </p>
                      <p className="address-text">{addr.addressLine}</p>
                      <p className="address-text">{addr.ward}, {addr.district}</p>
                      <p className="address-text">{addr.city}</p>
                      <p className="phone-text">
                        <Phone size={14} />
                        <a href={`tel:${addr.phone}`}>{addr.phone}</a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
