import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, deleteProduct } from "../../../api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmModal from "../../../components/UI/ConfirmModal/ConfirmModal";
import type { Product } from "../../../types"; 
import './ManageProduct.scss';

const ManageProduct: React.FC = () => {
  const queryClient = useQueryClient();


  const { data: products, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
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

  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteMutation.mutate(pendingDelete.id);
    setPendingDelete(null);
  };

  if (isLoading) return <p className="text-center mt-6">Đang tải dữ liệu...</p>;
  if (isError) return <p className="text-center mt-6 text-red-500">Lỗi tải sản phẩm</p>;

  return (
  <div className="manage-product">
    {/* Header */}
    <div className="admin-header">
      <h2 className="page-title">Quản lý sản phẩm</h2>
      <Link to="/admin/add-product" className="btn btn--primary">+ Thêm sản phẩm</Link>
    </div>

    {/* Danh sách sản phẩm */}
    {!products || products.length === 0 ? (
      <p className="empty-placeholder">Chưa có sản phẩm nào.</p>
    ) : (
      <div className="product-list">
        {products.map((p: any) => (
          <div key={p.id} className="product-item">
            <div className="product-info">
              <img src={p.image?.[0] || ""} alt={p.name} className="product-thumb" />
              <div>
                <h3 className="product-name">{p.name}</h3>
                <p className="product-meta">Danh mục: <span className="muted">{p.category}</span></p>
                <p className="product-price">{p.price.toLocaleString()},000 VND</p>
              </div>
            </div>

            <div className="product-actions">
              <Link to={`/admin/edit-product/${p.id}`} className="btn btn--small btn--primary">Sửa</Link>
              <button onClick={() => handleDelete(p.id, p.name)} className="btn btn--small btn--danger">Xóa</button>
            </div>
          </div>
        ))}

        {/* Modal xác nhận xóa */}
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
    )}
  </div>
);


};

export default ManageProduct;
