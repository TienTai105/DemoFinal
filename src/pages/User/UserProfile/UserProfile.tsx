import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Save, X, Upload, Mail, Phone, MapPin, Calendar, User as UserIcon, Plus, Trash2, Package, CheckCircle2, Clock, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import './UserProfile.scss';
import { useAuthStore } from '../../../store/authStore';
import { useUpdateUser } from '../../../api';
import type { User, Order } from '../../../types';

const UserProfile: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [newAddress, setNewAddress] = useState({
    receiverName: '',
    phone: '',
    addressLine: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false,
  });
  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    username: user?.username || '',
  });
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user addresses from API
  useEffect(() => {
    const fetchUserAddresses = async () => {
      if (!user?.id) return;
      try {
        const API_URL = 'https://68ef2e22b06cc802829c5e18.mockapi.io/api/users';
        const response = await fetch(`${API_URL}/${user.id}`);
        if (response.ok) {
          const userData: User = await response.json();
          console.log('📍 Fetched user data with addresses:', userData);
          console.log('📅 createdAt:', userData.createdAt);
          
          // Update user in store with full data from API
          setUser(userData);
          
          if (userData.addresses) {
            setAddresses(userData.addresses);
          }
          if (userData.avatar) {
            setAvatar(userData.avatar);
          }
        }
      } catch (error) {
        console.error('Error fetching user addresses:', error);
      }
    };

    fetchUserAddresses();
  }, [user?.id, setUser]);

  // Fetch user orders and calculate stats
  useEffect(() => {
    const fetchOrderStats = () => {
      try {
        const ordersRaw = localStorage.getItem('orders');
        const orders: Order[] = ordersRaw ? JSON.parse(ordersRaw) : [];
        
        // Filter orders by current user
        const userOrders = orders.filter(order => order.userId === user?.id);
        
        // Calculate stats
        const stats = {
          total: userOrders.length,
          pending: userOrders.filter(o => o.status === 'pending').length,
          processing: userOrders.filter(o => o.status === 'processing').length,
          shipped: userOrders.filter(o => o.status === 'shipped').length,
          delivered: userOrders.filter(o => o.status === 'delivered').length,
        };
        
        setOrderStats(stats);
        console.log('📦 Order stats:', stats);
      } catch (error) {
        console.error('Error fetching order stats:', error);
      }
    };

    if (user?.id) {
      fetchOrderStats();
    }
  }, [user?.id]);

  React.useEffect(() => {
    console.log('👤 User data:', user);
    console.log('📍 Addresses data:', addresses);
    console.log('📅 Created At:', user?.createdAt);
  }, [user, addresses]);

  if (!user) {
    return (
      <div className="user-profile">
        <div className="empty-state">
          <UserIcon size={48} />
          <p>Vui lòng đăng nhập để xem hồ sơ</p>
        </div>
      </div>
    );
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn một file hình ảnh');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 2MB');
      return;
    }

    // Compress and convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas and compress image
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Scale down if image is large
        if (width > 400) {
          height = Math.round((height * 400) / width);
          width = 400;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to base64 with reduced quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        setAvatar(compressedBase64);
        toast.success('Ảnh đã được chọn. Nhấn Lưu để cập nhật!');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUrlSubmit = () => {
    if (!avatarUrl.trim()) {
      toast.error('Vui lòng nhập URL ảnh');
      return;
    }

    // Validate URL
    try {
      new URL(avatarUrl);
      setAvatar(avatarUrl);
      setAvatarUrl('');
      setShowAvatarOptions(false);
      toast.success('URL ảnh đã được cập nhật. Nhấn Lưu để lưu thay đổi!');
    } catch {
      toast.error('URL không hợp lệ');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateUserMutation = useUpdateUser();

  const handleSave = async () => {
    try {
      // Validate form data
      if (!formData.fullName.trim()) {
        toast.error('Tên không được để trống');
        return;
      }

      if (!formData.email.trim() || !formData.email.includes('@')) {
        toast.error('Email không hợp lệ');
        return;
      }

      const updatedUser: User = {
        ...user,
        fullName: formData.fullName,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        avatar: avatar,
        addresses: addresses,
        // Preserve original data from API
        createdAt: user?.createdAt,
        status: user?.status,
        role: user?.role,
      };

      // Use API hook to update user
      updateUserMutation.mutate(
        { id: user!.id, user: updatedUser },
        {
          onSuccess: (responseData) => {
            // Update in store with API response
            setUser(responseData);
            setIsEditing(false);
            toast.success('Cập nhật hồ sơ thành công!');
            console.log('Profile updated:', responseData);
          },
          onError: (error) => {
            console.error('Error updating profile:', error);
            // Still update locally even if API fails (to maintain UX)
            setUser(updatedUser);
            setIsEditing(false);
            toast.success('Cập nhật hồ sơ thành công!');
          },
        }
      );
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Lỗi khi cập nhật hồ sơ');
    }
  };

  const handleAddAddress = async () => {
    try {
      // Validate address
      if (!newAddress.receiverName.trim()) {
        toast.error('Tên người nhận không được để trống');
        return;
      }

      if (!newAddress.phone.trim()) {
        toast.error('Số điện thoại không được để trống');
        return;
      }

      if (!newAddress.addressLine.trim()) {
        toast.error('Địa chỉ không được để trống');
        return;
      }

      if (!newAddress.city.trim()) {
        toast.error('Thành phố không được để trống');
        return;
      }

      // Create new address with ID
      const addressWithId = {
        ...newAddress,
        id: `${Date.now()}`,
      };

      // If this is the first address or marked as default, set it as default
      const updatedAddresses = newAddress.isDefault || addresses.length === 0
        ? [
            addressWithId,
            ...addresses.map(addr => ({ ...addr, isDefault: false })),
          ]
        : [...addresses, addressWithId];

      const updatedUser: User = {
        ...user,
        addresses: updatedAddresses,
      };

      // Save to API
      const API_URL = 'https://68ef2e22b06cc802829c5e18.mockapi.io/api/users';
      const response = await fetch(`${API_URL}/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        setAddresses(updatedAddresses);
        setUser(updatedUser);
        setNewAddress({
          receiverName: '',
          phone: '',
          addressLine: '',
          ward: '',
          district: '',
          city: '',
          isDefault: false,
        });
        setIsAddingAddress(false);
        toast.success('Thêm địa chỉ thành công!');
      } else {
        throw new Error('Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Lỗi khi thêm địa chỉ');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);

      const updatedUser: User = {
        ...user,
        addresses: updatedAddresses,
      };

      const API_URL = 'https://68ef2e22b06cc802829c5e18.mockapi.io/api/users';
      const response = await fetch(`${API_URL}/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        setAddresses(updatedAddresses);
        setUser(updatedUser);
        toast.success('Xóa địa chỉ thành công!');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Lỗi khi xóa địa chỉ');
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      username: user?.username || '',
    });
    setAvatar(user?.avatar || '');
    setIsEditing(false);
  };

  return (
    <div className="user-profile">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Hồ sơ cá nhân</h1>
        <p className="page-subtitle">Quản lý thông tin tài khoản của bạn</p>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        {/* Avatar Section */}
        <div className="avatar-section">
          <div className="avatar-wrapper">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">
                <UserIcon size={48} />
              </div>
            )}
            {isEditing && (
              <div className="avatar-overlay">
                <div className="avatar-options">
                  <button className="upload-btn" onClick={handleAvatarClick}>
                    <Upload size={16} />
                    <span>Upload</span>
                  </button>
                  <button 
                    className="upload-btn"
                    onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                  >
                    <span>URL</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />

          {/* Avatar URL Input */}
          {showAvatarOptions && isEditing && (
            <div className="avatar-url-input">
              <input
                type="text"
                placeholder="Dán URL ảnh từ https://i.pravatar.cc hoặc nguồn khác"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAvatarUrlSubmit()}
              />
              <button onClick={handleAvatarUrlSubmit} className="btn-confirm">
                Cập nhật
              </button>
              <button 
                onClick={() => setShowAvatarOptions(false)}
                className="btn-cancel"
              >
                Hủy
              </button>
            </div>
          )}

          <div className="avatar-info">
            <h2 className="user-name">{user?.fullName || user?.name || 'User'}</h2>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="profile-info">
          <div className="info-section">
            <h3 className="section-title">Thông tin cá nhân</h3>

            {isEditing ? (
              <div className="form-group">
                <div className="form-field">
                  <label>Họ và tên</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div className="form-field">
                  <label>Tên đăng nhập</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>

                <div className="form-field">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Nhập email"
                  />
                </div>

                <div className="form-field">
                  <label>Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
            ) : (
              <div className="info-display">
                <div className="info-item">
                  <UserIcon size={18} />
                  <div className="info-content">
                    <span className="label">Tên đăng nhập</span>
                    <span className="value">{user?.username || '-'}</span>
                  </div>
                </div>

                <div className="info-item">
                  <Mail size={18} />
                  <div className="info-content">
                    <span className="label">Email</span>
                    <span className="value">{user?.email || '-'}</span>
                  </div>
                </div>

                <div className="info-item">
                  <Phone size={18} />
                  <div className="info-content">
                    <span className="label">Số điện thoại</span>
                    <span className="value">{user?.phone || '-'}</span>
                  </div>
                </div>

                <div className="info-item">
                  <Calendar size={18} />
                  <div className="info-content">
                    <span className="label">Ngày tạo tài khoản</span>
                    <span className="value">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('vi-VN')
                        : '-'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Role Badge */}
          <div className="role-section">
            <span className={`role-badge role-${user?.role || 'user'}`}>
              {user?.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
            </span>
          </div>

          {/* Order Stats Badges */}
          <div className="order-stats-section">
            <h4 className="stats-title">Thống kê đơn hàng</h4>
            <div className="stats-grid">
              <div className="stat-badge stat-total">
                <Package size={20} />
                <div className="stat-content">
                  <span className="stat-value">{orderStats.total}</span>
                  <span className="stat-label">Tổng đơn</span>
                </div>
              </div>

              <div className="stat-badge stat-pending">
                <Clock size={20} />
                <div className="stat-content">
                  <span className="stat-value">{orderStats.pending}</span>
                  <span className="stat-label">Chờ xử lý</span>
                </div>
              </div>

              <div className="stat-badge stat-processing">
                <Truck size={20} />
                <div className="stat-content">
                  <span className="stat-value">{orderStats.processing}</span>
                  <span className="stat-label">Đang xử lý</span>
                </div>
              </div>

              <div className="stat-badge stat-delivered">
                <CheckCircle2 size={20} />
                <div className="stat-content">
                  <span className="stat-value">{orderStats.delivered}</span>
                  <span className="stat-label">Đã nhận</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          {!isEditing ? (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              <Edit2 size={16} />
              Chỉnh sửa
            </button>
          ) : (
            <>
              <button className="btn btn-success" onClick={handleSave}>
                <Save size={16} />
                Lưu
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                <X size={16} />
                Hủy
              </button>
            </>
          )}
        </div>
      </div>

      {/* Additional Info Card */}
      <div className="additional-card">
        <div className="card-header">
          <h3 className="card-title">Địa chỉ giao hàng</h3>
          {!isAddingAddress && (
            <button 
              className="btn-add-address"
              onClick={() => setIsAddingAddress(true)}
            >
              <Plus size={16} />
              Thêm địa chỉ
            </button>
          )}
        </div>

        {/* Add Address Form */}
        {isAddingAddress && (
          <div className="add-address-form">
            <h4 className="form-title">Thêm địa chỉ giao hàng mới</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Tên người nhận *</label>
                <input
                  type="text"
                  value={newAddress.receiverName}
                  onChange={(e) => setNewAddress({ ...newAddress, receiverName: e.target.value })}
                  placeholder="Nhập tên người nhận"
                />
              </div>

              <div className="form-field">
                <label>Số điện thoại *</label>
                <input
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="form-field full-width">
                <label>Địa chỉ *</label>
                <input
                  type="text"
                  value={newAddress.addressLine}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                  placeholder="Nhập địa chỉ chi tiết"
                />
              </div>

              <div className="form-field">
                <label>Phường/Xã</label>
                <input
                  type="text"
                  value={newAddress.ward}
                  onChange={(e) => setNewAddress({ ...newAddress, ward: e.target.value })}
                  placeholder="Phường/Xã"
                />
              </div>

              <div className="form-field">
                <label>Quận/Huyện</label>
                <input
                  type="text"
                  value={newAddress.district}
                  onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                  placeholder="Quận/Huyện"
                />
              </div>

              <div className="form-field">
                <label>Thành phố *</label>
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  placeholder="Thành phố"
                />
              </div>

              <div className="form-field full-width checkbox-field">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                />
                <label htmlFor="isDefault" className="checkbox-label">Đặt làm địa chỉ mặc định</label>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-success" onClick={handleAddAddress}>
                <Save size={16} />
                Lưu địa chỉ
              </button>
              <button className="btn btn-secondary" onClick={() => setIsAddingAddress(false)}>
                <X size={16} />
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Addresses List */}
        {addresses && addresses.length > 0 ? (
          <div className="addresses-list">
            {addresses.map((addr) => (
              <div key={addr.id} className="address-item">
                <div className="address-header">
                  <MapPin size={16} />
                  <span className="address-name">{addr.receiverName}</span>
                  {addr.isDefault && <span className="default-badge">Mặc định</span>}
                </div>
                <div className="address-details">
                  <p>{addr.addressLine}</p>
                  <p>
                    {addr.ward && <span>{addr.ward}, </span>}
                    {addr.district && <span>{addr.district}, </span>}
                    {addr.city}
                  </p>
                  <p className="address-phone">{addr.phone}</p>
                </div>
                <button 
                  className="btn-delete-address"
                  onClick={() => handleDeleteAddress(addr.id)}
                  title="Xóa địa chỉ"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : !isAddingAddress ? (
          <p className="no-data">Bạn chưa thêm địa chỉ giao hàng nào</p>
        ) : null}
      </div>
    </div>
  );
};

export default UserProfile;
