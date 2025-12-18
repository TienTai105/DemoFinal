import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById } from "../../../api/products/queries";
import { addProduct, updateProduct } from "../../../api/products/commands";
import type { Product } from "../../../types";
import './AddProductPage.scss';

const schema = yup.object({
  name: yup.string().required("Tên sản phẩm là bắt buộc"),
  description: yup.string().required("Mô tả sản phẩm là bắt buộc"),
  price: (yup as any)
    .number()
    .typeError("Phải là số")
    .transform((_v: any, orig: any) =>
      orig === "" || orig == null ? undefined : Number(orig)
    )
    .positive("Giá phải lớn hơn 0")
    .required("Giá là bắt buộc"),
  originalPrice: (yup as any)
    .number()
    .typeError("Phải là số")
    .transform((_v: any, orig: any) =>
      orig === "" || orig == null ? undefined : Number(orig)
    )
    .positive("Giá gốc phải lớn hơn 0"),
  category: yup.string().required("Danh mục là bắt buộc"),
  stock: (yup as any)
    .number()
    .typeError("Phải là số")
    .transform((_v: any, orig: any) =>
      orig === "" || orig == null ? 0 : Number(orig)
    )
    .min(0, "Tồn kho phải >= 0"),
  rating: (yup as any)
    .number()
    .typeError("Phải là số")
    .transform((_v: any, orig: any) =>
      orig === "" || orig == null ? 0 : Number(orig)
    )
    .min(0, "Đánh giá phải >= 0")
    .max(5, "Đánh giá phải <= 5"),
});

type FormValues = {
  id?: string;
  name: string;
  description: string;
  price: number | string;
  originalPrice?: number | string;
  image?: string | string[];
  category: string;
  subCategory?: string;
  stock?: number | string;
  rating?: number | string;
  reviews?: number | string;
  colors?: string;
  sizes?: string;
  date?: number | string;
  bestseller?: boolean;
  newproduct?: boolean;
};

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { id } = useParams<{ id?: string }>();

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [colorsArray, setColorsArray] = useState<string[]>([]);
  const [sizesArray, setSizesArray] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema as any),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      image: "",
      category: "",
      subCategory: "",
      stock: 0,
      rating: 0,
      reviews: 0,
      colors: "",
      sizes: "",
      date: Date.now(),
      bestseller: false,
      newproduct: false,
    },
  });

  // Lấy dữ liệu khi chỉnh sửa
  const { data: existingProduct } = useQuery<Product | null>({
    queryKey: ["product", id ?? "no-id"],
    queryFn: async () => {
      if (!id) return null;
      return await fetchProductById(id);
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!existingProduct) return;
    reset({
      id: existingProduct.id,
      name: existingProduct.name ?? "",
      description: existingProduct.description ?? "",
      price: existingProduct.price ?? "",
      originalPrice: existingProduct.originalPrice ?? "",
      image: Array.isArray(existingProduct.image)
        ? existingProduct.image
        : (existingProduct.image as string) ?? "",
      category: existingProduct.category ?? "",
      subCategory: existingProduct.subCategory ?? "",
      stock: existingProduct.stock ?? 0,
      rating: existingProduct.rating ?? 0,
      reviews: existingProduct.reviews ?? 0,
      date: existingProduct.date ?? Date.now(),
      bestseller: !!existingProduct.bestseller,
      newproduct: !!existingProduct.newproduct,
    });

    if (existingProduct.image) {
      const imgs = Array.isArray(existingProduct.image)
        ? existingProduct.image
        : [existingProduct.image as string];
      setPreviewImages(imgs);
    }

    if (existingProduct.colors && existingProduct.colors.length > 0) {
      setColorsArray(existingProduct.colors);
    }

    if (existingProduct.sizes && existingProduct.sizes.length > 0) {
      setSizesArray(existingProduct.sizes);
    }
  }, [existingProduct, reset]);

  // Hàm upload ảnh lên Cloudinary
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my_preset");
      formData.append("cloud_name", "dgup7jtjx");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dgup7jtjx/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        if (data.secure_url) uploadedUrls.push(data.secure_url);
      } catch (error) {
        console.error("Lỗi upload:", error);
        toast.error("Lỗi khi tải ảnh lên Cloudinary");
      }
    }

    setPreviewImages((prev) => [...prev, ...uploadedUrls]);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Xử lý thêm/xóa color tag
  const handleColorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.trim();
    if ((e.key === "Enter" || e.key === ",") && value) {
      e.preventDefault();
      if (!colorsArray.includes(value)) {
        setColorsArray((prev) => [...prev, value]);
      }
      e.currentTarget.value = "";
    }
  };

  const removeColor = (index: number) => {
    setColorsArray((prev) => prev.filter((_, i) => i !== index));
  };

  // Xử lý thêm/xóa size tag
  const handleSizeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.trim().toUpperCase();
    if ((e.key === "Enter" || e.key === ",") && value) {
      e.preventDefault();
      if (!sizesArray.includes(value)) {
        setSizesArray((prev) => [...prev, value]);
      }
      e.currentTarget.value = "";
    }
  };

  const removeSize = (index: number) => {
    setSizesArray((prev) => prev.filter((_, i) => i !== index));
  };

  // Mutation thêm / cập nhật
  const addMutation = useMutation({
    mutationFn: async (payload: any) => addProduct(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  const updateMutation = useMutation({
    mutationFn: async (product: Product) => updateProduct(product.id, product),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  const onSubmit = (data: FormValues) => {
    const productPayload: Omit<Product, "id"> = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      image: previewImages.length > 0 ? previewImages : [],
      category: data.category,
      subCategory: data.subCategory ?? "",
      stock: data.stock ? Number(data.stock) : 0,
      rating: data.rating ? Number(data.rating) : 0,
      reviews: data.reviews ? Number(data.reviews) : 0,
      colors: colorsArray.length > 0 ? colorsArray : undefined,
      sizes: sizesArray.length > 0 ? sizesArray : undefined,
      date: typeof data.date === "number" ? data.date : Date.now(),
      bestseller: !!data.bestseller,
      newproduct: !!data.newproduct,
    };

    if (id) {
      updateMutation.mutate({ ...productPayload, id } as Product, {
        onSuccess: () => {
          toast.success("Cập nhật sản phẩm thành công");
          navigate("/admin/products");
        },
        onError: (err: any) =>
          toast.error("Cập nhật thất bại: " + (err?.message || "Lỗi")),
      });
    } else {
      addMutation.mutate(productPayload as any, {
        onSuccess: () => {
          toast.success("Thêm sản phẩm thành công");
          navigate("/admin/products");
        },
        onError: (err: any) =>
          toast.error("Thêm thất bại: " + (err?.message || "Lỗi")),
      });
    }
  };

  return (
    <div className="add-product">
      {/* Breadcrumb */}
      <div className="breadcrumb-nav">
        <span onClick={() => navigate("/admin")}>Admin</span>
        <span className="separator">/</span>
        <span onClick={() => navigate("/admin/products")}>Products</span>
        <span className="separator">/</span>
        <span className="active">{id ? "Edit Product" : "Add New Product"}</span>
      </div>

      {/* Page Title */}
      <div className="page-header">
        <div>
          <h1>{id ? "Edit Product" : "Add New Product"}</h1>
          <p>Add a new product to your store</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="form-wrapper">
        <form onSubmit={handleSubmit(onSubmit)} className="product-form">
          {/* Left Column - Main Form */}
          <div className="form-content">
            {/* Name and Description */}
            <div className="form-section">
              <h3 className="section-title">Thông tin cơ bản</h3>
              
              <div className="form-field">
                <label className="form-label">Tên sản phẩm *</label>
                <input
                  {...register("name")}
                  className="form-input"
                  placeholder="VD: Áo thun nửa tay cao cấp"
                />
                {errors.name && <p className="form-error">{errors.name.message}</p>}
              </div>

              <div className="form-field">
                <label className="form-label">Mô tả sản phẩm *</label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="form-input"
                  placeholder="Mô tả chi tiết về sản phẩm của bạn..."
                />
                {errors.description && <p className="form-error">{errors.description.message}</p>}
              </div>

              <div className="form-field">
                <label className="form-label">Chi tiết sản phẩm</label>
                <textarea
                  {...register("subCategory")}
                  rows={2}
                  className="form-input"
                  placeholder="VD: Chất liệu cotton 100%, phù hợp cho mọi lứa tuổi..."
                />
              </div>
            </div>

            {/* Category */}
            <div className="form-section">
              <h3 className="section-title">Phân loại</h3>
              
              <div className="form-field">
                <label className="form-label">Danh mục *</label>
                <select
                  {...register("category")}
                  className="form-input"
                >
                  <option value="">-- Chọn danh mục --</option>
                  <option value="Men">Nam</option>
                  <option value="Women">Nữ</option>
                  <option value="Kids">Trẻ em</option>
                  <option value="Baby">Em bé</option>
                </select>
                {errors.category && <p className="form-error">{errors.category.message}</p>}
              </div>
            </div>

            {/* Colors & Sizes */}
            <div className="form-section">
              <h3 className="section-title">Màu sắc & Kích cỡ</h3>
              
              <div className="form-field">
                <label className="form-label">Màu sắc</label>
                <input
                  type="text"
                  onKeyDown={handleColorKeyDown}
                  className="form-input"
                  placeholder="Nhập màu sắc rồi bấm Enter (VD: Đen, Trắng, Xanh)"
                />
              </div>

              {colorsArray.length > 0 && (
                <div className="tags-list">
                  {colorsArray.map((color: string, index: number) => (
                    <span key={index} className="tag-badge">
                      {color}
                      <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="tag-remove"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="form-field">
                <label className="form-label">Kích cỡ</label>
                <input
                  type="text"
                  onKeyDown={handleSizeKeyDown}
                  className="form-input"
                  placeholder="Nhập kích cỡ rồi bấm Enter (VD: S, M, L, XL)"
                />
              </div>

              {sizesArray.length > 0 && (
                <div className="tags-list">
                  {sizesArray.map((size: string, index: number) => (
                    <span key={index} className="tag-badge">
                      {size}
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="tag-remove"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stock Management */}
            <div className="form-section">
              <h3 className="section-title">Quản lý tồn kho</h3>
              
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Tồn kho</label>
                  <input
                    type="number"
                    {...register("stock")}
                    defaultValue={0}
                    className="form-input"
                  />
                  {errors.stock && <p className="form-error">{errors.stock.message}</p>}
                </div>
                <div className="form-field">
                  <label className="form-label">Số lượt đánh giá</label>
                  <input
                    type="number"
                    {...register("reviews")}
                    defaultValue={0}
                    className="form-input"
                  />
                  {errors.reviews && <p className="form-error">{errors.reviews.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="form-sidebar">
            {/* Pricing */}
            <div className="form-section">
              <h3 className="section-title">Giá bán</h3>
              
              <div className="form-field">
                <label className="form-label">Giá bán *</label>
                <div className="price-input-group">
                  <span className="currency">$</span>
                  <input
                    type="number"
                    {...register("price")}
                    step="any"
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>
                {errors.price && <p className="form-error">{errors.price.message}</p>}
              </div>

              <div className="form-field">
                <label className="form-label">Giá gốc</label>
                <div className="price-input-group">
                  <span className="currency">$</span>
                  <input
                    type="number"
                    {...register("originalPrice")}
                    step="any"
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>
                {errors.originalPrice && <p className="form-error">{errors.originalPrice.message}</p>}
              </div>
            </div>

            {/* Rating & Status */}
            <div className="form-section">
              <h3 className="section-title">Đánh giá & Trạng thái</h3>
              
              <div className="form-field">
                <label className="form-label">Điểm đánh giá (0-5)</label>
                <input
                  type="number"
                  {...register("rating")}
                  step="0.1"
                  min="0"
                  max="5"
                  defaultValue={0}
                  className="form-input"
                />
                {errors.rating && <p className="form-error">{errors.rating.message}</p>}
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    {...register("bestseller")}
                    className="checkbox-input"
                  />
                  <span>Sản phẩm bán chạy</span>
                </label>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    {...register("newproduct")}
                    className="checkbox-input"
                  />
                  <span>Sản phẩm mới</span>
                </label>
              </div>
            </div>

            {/* Product Images */}
            <div className="form-section">
              <h3 className="section-title">Hình ảnh sản phẩm</h3>
              
              <div className="image-upload">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="file-input"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="upload-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                  Nhấp để tải ảnh
                </label>

                {uploading && <p className="form-note">Đang tải ảnh...</p>}

                {previewImages.length > 0 && (
                  <div className="preview-grid">
                    {previewImages.map((src, index) => (
                      <div key={index} className="preview-item">
                        <img src={src} alt={`preview-${index}`} className="preview-img" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="preview-remove"
                          title="Xóa"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="btn btn-secondary"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="btn btn-primary"
          >
            {id ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
