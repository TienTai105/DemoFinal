
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../../../components/UI/ConfirmModal/ConfirmModal"; 
import './ManageUsers.scss';

type UserRec = {
  id: string;
  name?: string;
  email: string;
  role?: "admin" | "user";
  createdAt?: string;
};

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<UserRec[]>([]);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    try {
      const arr = JSON.parse(localStorage.getItem("users") || "[]");
      setUsers(Array.isArray(arr) ? arr : []);
    } catch {
      setUsers([]);
    }
  };

  const save = (list: UserRec[]) => {
    localStorage.setItem("users", JSON.stringify(list));
    setUsers(list);
  };

  const toggleRole = (id: string) => {
    const next = users.map((u): UserRec => {
      if (u.id !== id) return u;
      const nextRole: UserRec["role"] = u.role === "admin" ? "user" : "admin";
      return { ...u, role: nextRole };
    });
    save(next);
  };

  const removeUserConfirmed = (id: string) => {
    const next = users.filter((u) => u.id !== id);
    save(next);
    setPendingDelete(null);
    toast.success("Đã xóa người dùng");
  };


  return (
    <div className="manage-users">
      <ConfirmModal
        isOpen={!!pendingDelete}
        title="Xác nhận xóa người dùng"
        message={pendingDelete ? <span>Bạn có chắc chắn muốn xóa người dùng <strong>{pendingDelete}</strong> ?</span> : ""}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => removeUserConfirmed(pendingDelete!)}
        cancelText="Hủy"
        confirmText="Xác nhận xóa"
      />

      <div className="admin-header">
        <h2 className="page-title">Quản lý người dùng</h2>
        <button onClick={load} className="btn">Tải lại</button>
      </div>

      <div className="users-grid">
        {users.length === 0 ? (
          <div className="empty-placeholder">Chưa có người dùng.</div>
        ) : (
          users.map((u) => (
            <div key={u.id} className="user-card">
              <div className="user-info">
                <div className="user-name">{u.name || u.email}</div>
                <div className="user-email">{u.email}</div>
                <div className="user-joined">Tham gia: {new Date(u.createdAt || Date.now()).toLocaleDateString()}</div>
              </div>
              <div className="user-actions">
                <div className={`user-role ${u.role === "admin" ? "is-admin" : "is-user"}`}>
                  {u.role || "user"}
                </div>
                <button onClick={() => toggleRole(u.id)} className="btn btn--small">Đổi role</button>
                <button onClick={() => setPendingDelete(u.id)} className="btn btn--small btn--danger">Xóa</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
