
import React, { useEffect} from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import './AdminLayout.scss';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.user);

  useEffect(() => {
    const role = localStorage.getItem("role") || authUser?.role;
    if (role !== "admin") {
      alert("Bạn không có quyền truy cập admin.");
      navigate("/", { replace: true });
      return;
    }
  }, [navigate, authUser]);

  const logout = () => {
    useAuthStore.getState().logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-layout">
      <header className="admin-topbar">
        <div className="admin-topbar__inner">
          <div className="admin-topbar__brand">
            <Link to="/" className="brand">MyShop</Link>
          </div>

          <div className="admin-topbar__actions">
            <div className="admin-greeting">Xin chào, {authUser?.name || authUser?.email || "Admin"}</div>
            <div className="logout-wrap">
              <button onClick={logout} className="btn btn--danger">Đăng xuất</button>
            </div>
          </div>
        </div>
      </header>

      <div className="admin-container">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <Link to="/admin" className="admin-nav__item">Tổng quan</Link>
            <Link to="/admin/products" className="admin-nav__item">Quản lý sản phẩm</Link>
            <Link to="/admin/users" className="admin-nav__item">Quản lý người dùng</Link>
            <Link to="/admin/orders" className="admin-nav__item">Quản lý đơn hàng</Link>
          </nav>
        </aside>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
