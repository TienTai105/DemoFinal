import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetailPage.scss";

// ⭐ THÊM IMPORT ZUSTAND
import { useCartStore } from "../store/cartStore";

const mockProduct = {
  id: "1",
  name: "Base Crop",
  price: 50,
  description: "A minimal essential designed for movement and ease...",
  colors: ["Black", "White", "Gray"],
  sizes: ["XXXL", "XXS", "XS", "S", "O", "L", "XL"],

  images: [
    "/images/p_img2_1.png",
    "/images/p_img2_2.png",
    "/images/p_img2_3.png",
    "/images/p_img2_4.png",
  ],
};

const related = [
  {
    id: 2,
    name: "Mono Tee",
    subtitle: "White / Black",
    price: 39,
    img: "/images/p_img2_1.png",
  },
  {
    id: 3,
    name: "Urban Sole",
    subtitle: "Black / White",
    price: 69,
    img: "/images/p_img2_2.png",
  },
  {
    id: 4,
    name: "Pure Joggers",
    subtitle: "White",
    price: 59,
    img: "/images/p_img2_3.png",
  },
  {
    id: 5,
    name: "Contrast Tee",
    subtitle: "Black/White",
    price: 49,
    img: "/images/p_img2_3.png",
  },
];

const ProductDetailPage: React.FC = () => {
  useParams();

  // ⭐ Auto scroll khi vào trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const p = mockProduct;

  // ⭐ LẤY HÀM addItem TỪ ZUSTAND
  const addItem = useCartStore((state) => state.addItem);

  const [mainImg, setMainImg] = useState(p.images[0]);
  const [color, setColor] = useState(p.colors[0]);
  const [size, setSize] = useState(p.sizes[0]);
  const [qty, setQty] = useState(1);

  // ⭐ ADD TO CART GỬI VÀO ZUSTAND
  const handleAdd = () => {
    const item = {
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: qty, 
      color,
      size,
    };

    addItem(item);

    console.log("ZUSTAND CART:", item);
    alert("Đã thêm vào giỏ hàng!");
  };

  return (
    <div className="pdp">
      <div className="pdp-wrapper">
        {/* LEFT GALLERY */}
        <div className="pdp-gallery">
          <div className="gallery-list">
            {p.images.map((img, i) => (
              <img
                key={i}
                className={`thumb ${mainImg === img ? "active" : ""}`}
                src={img}
                alt=""
                onClick={() => setMainImg(img)}
              />
            ))}
          </div>

          <div className="gallery-main">
            <img src={mainImg} alt="" />
          </div>
        </div>

        {/* RIGHT INFO */}
        <div className="pdp-info">
          <div className="breadcrumb">Home Page / Catalog / Base Crop</div>

          <h1 className="title">{p.name}</h1>
          <div className="price">€{p.price.toFixed(2)}</div>

          <div className="label">Description:</div>
          <p className="desc">{p.description}</p>

          <div className="label">Color:</div>
          <div className="color-list">
            {p.colors.map((c) => (
              <button
                key={c}
                className={`pill ${color === c ? "active" : ""}`}
                onClick={() => setColor(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="label">Size:</div>
          <div className="size-list">
            {p.sizes.map((s) => (
              <button
                key={s}
                className={`pill ${size === s ? "active" : ""}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="actions">
            <div className="qty-box">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <div className="qty">{qty}</div>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>

            <button className="btn-add" onClick={handleAdd}>
              Add To Cart – €{(p.price * qty).toFixed(2)}
            </button>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCT */}
      <div className="related">
        <h2>Related Product</h2>

        <div className="related-grid">
          {related.map((item) => (
            <div key={item.id} className="rel-card">
              <img src={item.img} alt="" />
              <div className="rel-name">{item.name}</div>
              <div className="rel-sub">{item.subtitle}</div>
              <div className="rel-price">€{item.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
