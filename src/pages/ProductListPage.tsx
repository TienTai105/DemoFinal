import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ProductListPage.scss";
import { ProductCard } from "@/components/ProductCard/ProductCard";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string[];
  color?: string;
  size?: string;
}

const PRODUCTS_PER_PAGE = 9;

const ProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // ===== FILTER STATES =====
  const [maxPrice, setMaxPrice] = useState(500);
  const [categories, setCategories] = useState<string[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  // ===== FETCH PRODUCTS =====
  useEffect(() => {
    fetch("https://68ef2e22b06cc802829c5e18.mockapi.io/api/products")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((item: Product, i: number) => ({
          ...item,
          size: ["S", "M", "L", "XL"][i % 4],
          color: ["black", "white", "gray"][i % 3],
        }));
        setProducts(mapped);
      });
  }, []);

  // ===== TOGGLE HELPER =====
  const toggle = (
    value: string,
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setCurrentPage(1);
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // ===== FILTER LOGIC =====
  const filteredProducts = products.filter((item) => {
    const matchPrice = item.price <= maxPrice;

    const matchCategory =
      categories.length === 0 || categories.includes(item.category);

    const matchProduct =
      productTypes.length === 0 ||
      productTypes.some((type) =>
        item.name.toLowerCase().includes(type.toLowerCase())
      );

    const matchSize = sizes.length === 0 || sizes.includes(item.size || "");

    const matchColor = colors.length === 0 || colors.includes(item.color || "");

    return (
      matchPrice && matchCategory && matchProduct && matchSize && matchColor
    );
  });

  // ===== PAGINATION =====
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  return (
    <div className="catalog-page">
      <div className="catalog-container">
        {/* ===== HEADER ===== */}
        <div className="catalog-header">
          <p className="breadcrumb">
            <Link to="/">Home Page</Link>
            <span> › </span>
            <span>Catalog</span>
          </p>

          <div className="header-row">
            <h1>Explore All Product</h1>
            <div className="sort">
              <span>Sort: Relevance</span>
              <span>{filteredProducts.length} products</span>
            </div>
          </div>
        </div>

        <div className="catalog-layout">
          {/* ===== FILTER ===== */}
          <aside className="filter">
            <div className="filter-group">
              <h4>Category</h4>
              <div className="pill-filter">
                {["Women", "Men", "Unisex"].map((c) => (
                  <span
                    key={c}
                    className={`pill ${categories.includes(c) ? "active" : ""}`}
                    onClick={() => toggle(c, setCategories)}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Products</h4>
              <div className="pill-filter">
                {["Hoodie", "T-shirt", "Accessories"].map((p) => (
                  <span
                    key={p}
                    className={`pill ${
                      productTypes.includes(p) ? "active" : ""
                    }`}
                    onClick={() => toggle(p, setProductTypes)}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Color</h4>

              <div className="color-filter">
                {[
                  { key: "black", label: "Black" },
                  { key: "white", label: "White" },
                  { key: "gray", label: "Gray" },
                ].map((c) => (
                  <div
                    key={c.key}
                    className={`color-option ${
                      colors.includes(c.key) ? "active" : ""
                    }`}
                    onClick={() => toggle(c.key, setColors)}
                  >
                    <span className={`color-dot ${c.key}`} />
                    <span className="color-name">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Size</h4>
              <div className="sizes">
                {["S", "M", "L", "XL"].map((s) => (
                  <span
                    key={s}
                    className={sizes.includes(s) ? "active" : ""}
                    onClick={() => toggle(s, setSizes)}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Price</h4>
              <input
                type="range"
                min={0}
                max={500}
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(+e.target.value);
                  setCurrentPage(1);
                }}
              />
              <p className="price-value">Up to ${maxPrice}</p>
            </div>
          </aside>

          {/* ===== PRODUCTS ===== */}
          <section className="products">
            <div className="grid">
              {currentProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={{
                    id: item.id,
                    name: item.name,
                    description: item.name,
                    category: item.category,
                    price: item.price,
                    originalPrice: item.price + 20, // giả để hiện badge
                    image: item.image?.[0] || "",
                    stock: 10, // giả
                    rating: 5,
                    reviews: 120,
                  }}
                />
              ))}
            </div>

            <div className="pagination">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
