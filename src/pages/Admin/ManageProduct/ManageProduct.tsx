import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, deleteProduct } from "../../../api/index";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmModal from "../../../components/UI/ConfirmModal/ConfirmModal";
import { Edit2, Trash2, Plus, Search, Filter } from "lucide-react";
import type { Product } from "../../../types"; 
import './ManageProduct.scss';

const ManageProduct: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const { data: products, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Đã xóa sản phẩm thành công!");
    },
    onError: () => {
      toast.error("Xóa sản phẩm thất bại!");
    },
  });

  const handleDelete = (id: string, name: string) => {
    setPendingDelete({ id, name });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteMutation.mutate(pendingDelete.id);
    setPendingDelete(null);
  };

  // Filter and search
  const filteredProducts = useMemo(() => {
    let result = products || [];

    // Search by name
    if (searchTerm) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (filterCategory !== "all") {
      result = result.filter(p => p.category === filterCategory);
    }

    // Sort
    if (sortBy === "name") {
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price-asc") {
      result = result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result = result.sort((a: any, b: any) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    }

    return result;
  }, [products, searchTerm, filterCategory, sortBy]);

  const categories = useMemo(() => {
    if (!products) return [];
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  if (isLoading) {
    return (
      <div className="manage-product">
        <div className="loading-placeholder">
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="manage-product">
        <div className="error-placeholder">
          <p>Lỗi tải sản phẩm</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-product">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý sản phẩm</h1>
          <p className="page-subtitle">Tổng cộng {filteredProducts.length} sản phẩm</p>
        </div>
        <Link to="/admin/add-product" className="btn-add-new">
          <Plus size={18} />
          Thêm sản phẩm
        </Link>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="sort-group">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Tên (A-Z)</option>
            <option value="price-asc">Giá (Thấp - Cao)</option>
            <option value="price-desc">Giá (Cao - Thấp)</option>
            <option value="newest">Mới nhất</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>Không tìm thấy sản phẩm nào</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="product-table">
            <div className="table-header">
              <div className="header-cell img-header">Hình ảnh</div>
              <div className="header-cell name-header">Tên sản phẩm</div>
              <div className="header-cell category-header">Danh mục</div>
              <div className="header-cell price-header">Giá</div>
              <div className="header-cell stock-header">Kho</div>
              <div className="header-cell actions-header">Hành động</div>
            </div>
            <div className="table-body">
              {filteredProducts.map((product: any) => (
                <div key={product.id} className="table-row">
                  <div className="table-cell img-cell">
                    <img
                      src={product.image?.[0] || ""}
                      alt={product.name}
                      className="product-img"
                    />
                  </div>
                  <div className="table-cell name-cell">
                    <p className="product-name">{product.name}</p>
                  </div>
                  <div className="table-cell category-cell">
                    <span className="category-badge">{product.category}</span>
                  </div>
                  <div className="table-cell price-cell">
                    <span className="price-value">
                      {product.price.toLocaleString('vi-VN')}.000₫
                    </span>
                  </div>
                  <div className="table-cell stock-cell">
                    <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                      {product.stock > 0 ? `${product.stock} cái` : 'Hết hàng'}
                    </span>
                  </div>
                  <div className="table-cell actions-cell">
                    <Link
                      to={`/admin/edit-product/${product.id}`}
                      className="action-btn edit-btn"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="action-btn delete-btn"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!pendingDelete}
        title="Xác nhận xóa sản phẩm"
        message={
          pendingDelete ? (
            <span>
              Bạn có chắc chắn muốn xóa <strong>{pendingDelete.name}</strong> ?
            </span>
          ) : (
            ""
          )
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        cancelText="Hủy"
        confirmText="Xác nhận xóa"
      />
    </div>
  );
};

export default ManageProduct;
