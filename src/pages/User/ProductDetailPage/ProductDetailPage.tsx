import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import "./ProductDetailPage.scss";

// ⭐ IMPORT HOOKS
import { useCartStore } from "../../../store/cartStore";
import { useProductById, useProducts } from "../../../api/products/queries";
import { ProductCard } from "../../../components/ProductCard/ProductCard";
import { QuantityControl } from "../../../components/UI/QuantityControl/QuantityControl";
import { ChevronRightIcon } from "lucide-react";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // ⭐ Fetch product detail từ API
  const { data: product, isLoading, error } = useProductById(id);
  
  // Debug log
  console.log('ProductDetailPage Debug:', { id, isLoading, error, product });

  // ⭐ Fetch all products để lấy related products
  const { data: allProducts = [] } = useProducts();

  // ⭐ GET PREVIOUS PAGE FROM NAVIGATION STATE OR HISTORY
  const getPreviousPage = () => {
    const state = location.state as any;
    if (state?.from) {
      return state.from;
    }
    
    // Check browser history
    if (window.history.length > 1) {
      // Kiểm tra localStorage để lấy trang trước
      const prevPage = sessionStorage.getItem('previousPage');
      if (prevPage) {
        return JSON.parse(prevPage);
      }
      return null;
    }
    return null;
  };

  const previousPage = getPreviousPage();

  // ⭐ SAVE PRODUCT DETAIL PAGE TO SESSION STORAGE WHEN LEAVING
  useEffect(() => {
    if (!product) return;
    return () => {
      sessionStorage.setItem(
        'previousPage',
        JSON.stringify({
          name: product.name,
          path: `/product/${id}`,
        })
      );
    };
  }, [id, product]);

  // ⭐ Auto scroll khi vào trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // ⭐ LẤY HÀM addItem TỪ ZUSTAND
  const { addItem } = useCartStore();

  const [mainImg, setMainImg] = useState<string>("");
  const [color, setColor] = useState("Black");
  const [size, setSize] = useState("S");
  const [qty, setQty] = useState(1);

  // Set default image khi product load
  useEffect(() => {
    if (product) {
      const rawImage = Array.isArray(product.image) ? product.image[0] : product.image;
      const productImage = rawImage?.startsWith("http")
        ? rawImage
        : `/images${rawImage}`;
      setMainImg(productImage);
    }
  }, [product]);

  // ⭐ GET RELATED PRODUCTS - cùng category, exclude product hiện tại
  const relatedProducts = allProducts
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 10);

  // ⭐ ADD TO CART GỬI VÀO ZUSTAND
  const handleAdd = () => {
    if (!product) return;

    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      image: product.image,
      color,
      size,
    };

    addItem(item);
    toast.success(`Đã thêm ${qty} ${product.name} vào giỏ hàng!`);
  };

  // ⭐ LOADING STATE
  if (!id) {
    return (
      <div className="pdp" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Invalid product ID</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pdp" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading product...</p>
      </div>
    );
  }

  // ⭐ ERROR STATE
  if (error || !product) {
    console.error('Product fetch error:', error);
    return (
      <div className="pdp" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Product not found</p>
        <button onClick={() => navigate("/")} style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer", backgroundColor: '#173036', color: '#fff', border: 'none', borderRadius: '6px' }}>
          Back to Home
        </button>
      </div>
    );
  }

  // Handle image
  const rawImage = Array.isArray(product.image) ? product.image[0] : product.image;
  const images = [rawImage]; // API chỉ trả 1 ảnh, sử dụng làm gallery main

  return (
    <div className="pdp">
      {/* Breadcrumb */}
      <div className="breadcrumb-top">
        {previousPage ? (
          <>
            <button 
              className="breadcrumb-link" 
              onClick={() => navigate(previousPage.path === "/" ? "/" : previousPage.path, { state: { from: null } })}
            >
              {previousPage.name}
            </button>
            <span className="breadcrumb-sep"><ChevronRightIcon size={18}/></span>
          </>
        ) : (
          <>
            <button className="breadcrumb-link" onClick={() => navigate("/")}>
              Home
            </button>
            <span className="breadcrumb-sep"><ChevronRightIcon size={18}/></span>
          </>
        )}
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      <div className="pdp-wrapper">
        {/* LEFT GALLERY */}
        <div className="pdp-gallery">
          <div className="gallery-list">
            {images.map((img, i) => (
              <img
                key={i}
                className={`thumb ${mainImg === img ? "active" : ""}`}
                src={img?.startsWith("http") ? img : `/images${img}`}
                alt=""
                onClick={() => setMainImg(img)}
              />
            ))}
          </div>

          <div className="gallery-main">
            <img src={mainImg} alt={product.name} />
          </div>
        </div>

        {/* RIGHT INFO */}
        <div className="pdp-info">

          <h1 className="title">{product.name}</h1>
          
          <div className="price">{product.price.toLocaleString("vi-VN")}.000đ</div>

          <div className="section">
            <div className="label">Description:</div>
            <p className="desc">{product.description}</p>
          </div>

          <div className="section">
            <div className="label">Color:</div>
            <div className="color-list">
              {(product.colors || ["Black", "White", "Gray"]).map((c) => (
                <button
                  key={c}
                  className={`pill ${color === c ? "active" : ""}`}
                  onClick={() => setColor(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="section">
            <div className="label">Size:</div>
            <div className="size-list">
              {(product.sizes || ["XS", "S", "M", "L", "XL"]).map((s: string) => (
                <button
                  key={s}
                  className={`pill ${size === s ? "active" : ""}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="actions">
            <QuantityControl
              quantity={qty}
              onDecrease={() => setQty(Math.max(1, qty - 1))}
              onIncrease={() => setQty(qty + 1)}
              onChange={(v) => {
                if (v >= 1) setQty(v);
              }}
              size="medium"
            />

            <button className="btn-add" onClick={handleAdd}>
              Add To Cart – {(product.price * qty).toLocaleString("vi-VN")}.000đ
            </button>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCT */}
      <div className="related">
        <h2>Related Product</h2>

        <div className="related-grid">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onViewDetails={(productId) => navigate(`/product/${productId}`)}
              />
            ))
          ) : (
            <p>No related products found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
