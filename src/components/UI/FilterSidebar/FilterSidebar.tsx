import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./FilterSidebar.scss";

interface FilterSidebarProps {
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
  productTypes: string[];
  setProductTypes: (types: string[]) => void;
  sizes: string[];
  setSizes: (sizes: string[]) => void;
  colors: string[];
  setColors: (colors: string[]) => void;
  onFilterChange?: () => void;
}

export const FilterSidebar = ({
  maxPrice,
  setMaxPrice,
  categories,
  setCategories,
  productTypes,
  setProductTypes,
  sizes,
  setSizes,
  colors,
  setColors,
  onFilterChange,
}: FilterSidebarProps) => {
  const [expandedProducts, setExpandedProducts] = useState<string>("Tops");

  const handleFilterChange = () => {
    onFilterChange?.();
  };

  const handleCategoryToggle = (category: string) => {
    setCategories(
      categories.includes(category)
        ? categories.filter((c) => c !== category)
        : [...categories, category]
    );
    handleFilterChange();
  };

  const handleProductTypeToggle = (type: string) => {
    setProductTypes(
      productTypes.includes(type)
        ? productTypes.filter((t) => t !== type)
        : [...productTypes, type]
    );
    handleFilterChange();
  };

  const handleSizeToggle = (size: string) => {
    setSizes(
      sizes.includes(size)
        ? sizes.filter((s) => s !== size)
        : [...sizes, size]
    );
    handleFilterChange();
  };

  const handleColorChange = (color: string) => {
    setColors(
      colors.includes(color)
        ? colors.filter((c) => c !== color)
        : [color]
    );
    handleFilterChange();
  };

  const productGroups = {
    Tops: ["Hoodies", "T-Shirts", "Tanks / Crops", "Sweatshirts"],
    Bottoms: ["Jeans", "Shorts", "Leggings", "Skirts"],
    Outerwear: ["Jackets", "Coats", "Blazers", "Cardigans"],
    Accessories: ["Belts", "Scarves", "Hats", "Bags"],
  };

  return (
    <aside className="filter">
      {/* ===== CATEGORY ===== */}
      <div className="filter-group">
        <h4>Danh Mục:</h4>
        <div className="checkbox-filter">
          {["Tất Cả", "Nữ", "Nam", "Trẻ Em", "Bé"].map((c) => (
            <label key={c} className="checkbox-item">
              <input
                type="checkbox"
                checked={c === "Tất Cả" || categories.includes(c)}
                onChange={() => {
                  if (c !== "Tất Cả") {
                    handleCategoryToggle(c);
                  }
                }}
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ===== PRODUCTS ===== */}
      <div className="filter-group">
        <h4>Sản Phẩm:</h4>
        <div className="product-filter">
          {(Object.keys(productGroups) as Array<keyof typeof productGroups>).map(
            (group) => (
              <div key={group} className="product-group">
                <div
                  className="product-group-header"
                  onClick={() =>
                    setExpandedProducts(expandedProducts === group ? "" : group)
                  }
                >
                  <span>{group}</span>
                  {expandedProducts === group ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
                {expandedProducts === group && (
                  <div className="product-group-items">
                    {productGroups[group].map((item) => (
                      <label key={item} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={productTypes.includes(item)}
                          onChange={() => handleProductTypeToggle(item)}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* ===== COLOR ===== */}
      <div className="filter-group">
        <h4>Màu:</h4>
        <div className="color-radio-filter">
          {[
            { key: "black", label: "Đen" },
            { key: "white", label: "Trắng" },
            { key: "gray", label: "Xám" },
          ].map((c) => (
            <label
              key={c.key}
              className={`color-radio-item ${colors.includes(c.key) ? "active" : ""}`}
            >
              <input
                type="checkbox"
                checked={colors.includes(c.key)}
                onChange={() => handleColorChange(c.key)}
              />
              <span className={`color-radio-dot ${c.key}`} />
              <span>{c.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ===== SIZE ===== */}
      <div className="filter-group">
        <h4>Kích Cỡ</h4>
        <div className="size-radio-filter">
          {["XXXL", "XXS", "XS", "S", "M", "L", "XL"].map((s) => (
            <label
              key={s}
              className={`size-radio-item ${sizes.includes(s) ? "active" : ""}`}
            >
              <input
                type="checkbox"
                checked={sizes.includes(s)}
                onChange={() => handleSizeToggle(s)}
              />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ===== PRICE RANGE SLIDER ===== */}
      <div className="filter-group">
        <h4>Giá: 59.000đ — {(maxPrice * 1000).toLocaleString('vi-VN')}.000đ</h4>
        <div className="price-range-slider">
          <div className="range-track" />
          <input
            type="range"
            min={0}
            max={1000}
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(+e.target.value);
              handleFilterChange();
            }}
            className="range-input"
          />
        </div>
        <div className="price-labels">
          <span>59.000đ</span>
          <span>949.000đ</span>
        </div>
      </div>
    </aside>
  );
};
