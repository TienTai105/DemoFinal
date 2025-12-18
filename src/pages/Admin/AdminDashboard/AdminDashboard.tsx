import React, { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useProducts } from "@/api/products/queries";
import { Users, Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import './AdminDashboard.scss';

const AdminDashboard: React.FC = () => {
  const { data: apiProducts = [] } = useProducts();
  const [overview, setOverview] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });
  const [productCount, setProductCount] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

  const loadOverview = () => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const products = JSON.parse(localStorage.getItem("products") || "[]");
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");

      const deliveredOrders = (Array.isArray(orders) ? orders : []).filter((o: any) => String(o.status).toLowerCase() === "delivered");
      const revenue = deliveredOrders.reduce((s: number, o: any) => s + (Number(o.total) || Number(o.subtotal) || 0), 0);

      setOverview({
        users: Array.isArray(users) ? users.length : 0,
        products: Array.isArray(products) ? products.length : 0,
        orders: Array.isArray(orders) ? orders.length : 0,
        revenue,
      });

      const monthData: Record<string, number> = {};
      deliveredOrders.forEach((order: any) => {
        const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
        const deliveredEntry = history.slice().reverse().find((h: any) => String(h.status).toLowerCase() === "delivered");
        const at = deliveredEntry?.at || order.updatedAt || order.createdAt;
        if (!at) return;
        const d = new Date(at);
        if (isNaN(d.getTime())) return;
        const month = `${d.getMonth() + 1}/${d.getFullYear()}`;
        const total = Number(order.total) || Number(order.subtotal) || 0;
        monthData[month] = (monthData[month] || 0) + total;
      });

      // Sắp xếp theo thời gian
      const sorted = Object.entries(monthData)
        .map(([month, revenue]) => ({ month, revenue }))
        .sort((a, b) => {
          const [ma, ya] = a.month.split("/").map(Number);
          const [mb, yb] = b.month.split("/").map(Number);
          return ya !== yb ? ya - yb : ma - mb;
        });

      setMonthlyRevenue(sorted);

      // Get recent orders
      const recentOrders = (Array.isArray(orders) ? orders : [])
        .slice(-5)
        .reverse()
        .map((o: any) => ({
          id: o.id,
          customer: o.customerName || 'Unknown',
          total: o.total || o.subtotal || 0,
          status: o.status || 'pending',
          date: o.createdAt || new Date().toISOString(),
        }));
      setRecentOrders(recentOrders);
    } catch (err) {
      console.error(err);
      setOverview({ users: 0, products: 0, orders: 0, revenue: 0 });
    }
  };

  useEffect(() => {
    loadOverview();
    const onStorage = (e: StorageEvent) => {
      if (["users", "products", "orders"].includes(e.key || "")) loadOverview();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (apiProducts && Array.isArray(apiProducts)) {
      setProductCount(apiProducts.length);
    }
  }, [apiProducts]);

  const chartData = monthlyRevenue.map(item => ({
    month: item.month,
    revenue: item.revenue * 1000,
  }));

  const categoryData = [
    { name: 'Completed', value: overview.orders * 0.6 },
    { name: 'Pending', value: overview.orders * 0.3 },
    { name: 'Cancelled', value: overview.orders * 0.1 },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Welcome back! Here's your business overview.</p>
        </div>
        <Link to="/admin/manage-product" className="btn-add-product">
          <Package size={18} />
          Add Product
        </Link>
      </div>

      {/* Stats Grid with Icons */}
      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Users</p>
            <p className="stat-value">{overview.users}</p>
          </div>
        </div>

        <div className="stat-card products">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Products</p>
            <p className="stat-value">{productCount}</p>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Orders</p>
            <p className="stat-value">{overview.orders}</p>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">{overview.revenue.toLocaleString('vi-VN')}.000₫</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Revenue Chart */}
        <div className="chart-panel full-width">
          <div className="chart-header">
            <h3 className="chart-title">
              <TrendingUp size={20} />
              Monthly Revenue
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis
                stroke="#999"
                tickFormatter={(value: number) =>
                  value >= 1000000
                    ? (value / 1000000).toFixed(1) + "M"
                    : value >= 1000
                      ? (value / 1000).toFixed(1) + "K"
                      : String(value)
                }
              />
              <Tooltip
                formatter={(v: number | undefined) => (v !== undefined ? `${v.toLocaleString()}₫` : "")}
                labelFormatter={(label: string) => `Tháng ${label}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#FF6B6B"
                strokeWidth={3}
                dot={{ fill: '#FF6B6B', r: 5 }}
                activeDot={{ r: 7 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution Charts */}
        <div className="charts-row">
          <div className="chart-panel">
            <h3 className="chart-title">Order Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={800}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Orders */}
          <div className="recent-orders-panel">
            <h3 className="chart-title">Recent Orders</h3>
            <div className="orders-list">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="order-item">
                    <div className="order-info">
                      <p className="order-customer">{order.customer}</p>
                      <p className="order-date">
                        {new Date(order.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="order-status">
                      <span className={`status-badge ${order.status}`}>
                        {order.status}
                      </span>
                      <p className="order-total">{order.total.toLocaleString('vi-VN')}.000₫</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-orders">No orders yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;