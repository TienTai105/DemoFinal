
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, Edit2, Trash2, Shield, Search } from "lucide-react";
import ConfirmModal from "../../../components/UI/ConfirmModal/ConfirmModal";
import UserDetailModal from "./UserDetailModal";
import "./ManageUsers.scss";

const API_URL = "https://68ef2e22b06cc802829c5e18.mockapi.io/api/users";

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

type User = {
  id: string;
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  createdAt: string;
  addresses: Address[];
};

const ManageUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  // Fetch users from MockAPI
  const { data: users = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await axios.get(API_URL);
        return response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
  });

  const filteredUsers = users.filter((user: User) =>
    (user.fullName?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (user.phone ?? "").includes(searchTerm)
  );

  const openDetailModal = (user: User) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const toggleRole = (id: string) => {
    const userToUpdate = users.find((u: User) => u.id === id);
    if (!userToUpdate) return;

    const nextRole = userToUpdate.role === "admin" ? "user" : "admin";
    const updatedUser = { ...userToUpdate, role: nextRole };

    axios
      .put(`${API_URL}/${id}`, updatedUser)
      .then(() => {
        refetch();
        toast.success(
          `Thay đổi role thành ${nextRole === "admin" ? "Admin" : "User"}`
        );
      })
      .catch(() => {
        toast.error("Có lỗi khi cập nhật role");
      });
  };

  const toggleStatus = (id: string) => {
    const userToUpdate = users.find((u: User) => u.id === id);
    if (!userToUpdate) return;

    const nextStatus: User["status"] = userToUpdate.status === "active" ? "inactive" : "active";
    const updatedUser = { ...userToUpdate, status: nextStatus };

    axios
      .put(`${API_URL}/${id}`, updatedUser)
      .then(() => {
        refetch();
        toast.success(
          `Cập nhật trạng thái thành ${nextStatus === "active" ? "Đang hoạt động" : "Không hoạt động"}`
        );
      })
      .catch(() => {
        toast.error("Có lỗi khi cập nhật trạng thái");
      });
  };

  const removeUserConfirmed = (id: string) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        refetch();
        setPendingDelete(null);
        toast.success("Đã xóa người dùng thành công");
      })
      .catch(() => {
        toast.error("Có lỗi khi xóa người dùng");
      });
  };

  if (isLoading) {
    return (
      <div className="manage-users">
        <div className="loading-state">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="manage-users">
        <div className="error-state">Có lỗi khi tải dữ liệu</div>
      </div>
    );
  }

  return (
    <div className="manage-users">
      <ConfirmModal
        isOpen={!!pendingDelete}
        title="Xác nhận xóa người dùng"
        message={
          pendingDelete ? (
            <span>
              Bạn có chắc chắn muốn xóa người dùng{" "}
              <strong>{users.find((u: User) => u.id === pendingDelete)?.fullName}</strong> ?
            </span>
          ) : (
            ""
          )
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => removeUserConfirmed(pendingDelete!)}
        cancelText="Hủy"
        confirmText="Xác nhận xóa"
      />

      <UserDetailModal isOpen={showDetailModal} user={selectedUser} onClose={() => setShowDetailModal(false)} />

      {/* Header */}
      <div className="manage-users-header">
        <div className="header-top">
          <h2 className="page-title">Quản lý người dùng</h2>
          <span className="users-count">{users.length} người dùng</span>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-wrapper">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <p>{searchTerm ? "Không tìm thấy người dùng" : "Chưa có người dùng"}</p>
          </div>
        ) : (
          <div className="users-list">
            {filteredUsers.map((user: User) => (
              <div key={user.id} className="user-row">
                {/* Avatar & Basic Info */}
                <div className="user-col user-col-info">
                  <img src={user.avatar} alt={user.fullName} className="user-avatar" />
                  <div className="user-info">
                    <p className="user-name">{user.fullName}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                </div>

                {/* Contact */}
                <div className="user-col user-col-contact">
                  <p className="user-phone">{user.phone}</p>
                </div>

                {/* Role Badge */}
                <div className="user-col user-col-role">
                  <span className={`role-badge ${user.role}`}>
                    <Shield size={16} />
                    {user.role === "admin" ? "Admin" : "User"}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="user-col user-col-status">
                  <span className={`status-badge ${user.status}`}>
                    {user.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
                  </span>
                </div>

                {/* Joined Date */}
                <div className="user-col user-col-date">
                  <p>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</p>
                </div>

                {/* Actions */}
                <div className="user-col user-col-actions">
                  <button
                    className="action-btn action-btn-view"
                    title="Xem chi tiết"
                    onClick={() => openDetailModal(user)}
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    className="action-btn action-btn-role"
                    title="Đổi role"
                    onClick={() => toggleRole(user.id)}
                  >
                    <Shield size={18} />
                  </button>
                  <button
                    className="action-btn action-btn-status"
                    title="Đổi trạng thái"
                    onClick={() => toggleStatus(user.id)}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className="action-btn action-btn-delete"
                    title="Xóa"
                    onClick={() => setPendingDelete(user.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
