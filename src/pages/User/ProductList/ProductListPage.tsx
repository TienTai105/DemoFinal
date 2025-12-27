import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ProductListPage.scss";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { FilterSidebar } from "@/components/UI/FilterSidebar";
import { Pagination } from "@/components/Pagination/Pagination";
import { ChevronRight } from "lucide-react";
import { useProducts } from "@/api/products/queries";

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
  const navigate = useNavigate();
  const location = useLocation();
  const { data: apiProducts = [] } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const getPreviousPage = () => {
    const state = location.state as any;
    if (state?.from) return state.from;
    const prevPage = sessionStorage.getItem('previousPage');
    if (prevPage) return JSON.parse(prevPage);
    return { name: 'Trang Chủ', path: '/' };
  };

  const previousPage = getPreviousPage();

  // ===== FILTER STATES =====
  const [maxPrice, setMaxPrice] = useState(1000);
  const [categories, setCategories] = useState<string[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  

  // ===== FETCH PRODUCTS FROM MOCKAPI =====
  useEffect(() => {
    if (apiProducts && apiProducts.length > 0) {
      const mapped = apiProducts.map((item: any, i: number) => ({
        ...item,
        size: ["S", "M", "L", "XL"][i % 4],
        color: ["black", "white", "gray"][i % 3],
      }));
      setProducts(mapped);
    }
  }, [apiProducts]);

  // ===== FILTER LOGIC =====
  const filteredProducts = products.filter((item) => {
    const matchPrice = item.price <= maxPrice;

    const matchCategory =
      categories.length === 0 || categories.includes(item.category);

    const matchProduct =
      productTypes.length === 0 ||
      productTypes.some((type) =>
        item.name.toLowerCase().includes(type.toLowerCase()) ||
        (item.name.toLowerCase().includes("hoodie") && type.toLowerCase().includes("hoodies")) ||
        (item.name.toLowerCase().includes("t-shirt") && type.toLowerCase().includes("t-shirts")) ||
        (item.name.toLowerCase().includes("tank") && type.toLowerCase().includes("tanks")) ||
        (item.name.toLowerCase().includes("sweatshirt") && type.toLowerCase().includes("sweatshirts"))
      );

    const matchSize = sizes.length === 0 || (item.size && sizes.includes(item.size));

    const matchColor = colors.length === 0 || (item.color && colors.includes(item.color));

    return (
      matchPrice && matchCategory && matchProduct && matchSize && matchColor
    );
  });

  // ===== HANDLE VIEW DETAILS =====
  const handleViewDetails = (id: string) => {
    navigate(`/product/${id}`);
  };

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
          <div className="breadcrumb-top">
            <button 
              className="breadcrumb-link"
              onClick={() => navigate(previousPage.path === '/' ? '/' : previousPage.path, { state: { from: null } })}
            >
              {previousPage.name}
            </button>
            <span className="breadcrumb-sep"><ChevronRight size={18} /></span>
            <span className="breadcrumb-current">Bộ Sưu Tập</span>
          </div>

          <div className="header-row">
            <h1>Khám Phá Tất Cả Sản Phẩm</h1>
            <div className="sort">
              <span>Sắp xếp: Phù Hợp Nhất</span>
              <span>{filteredProducts.length} sản phẩm</span>
            </div>
          </div>
        </div>

        <div className="catalog-layout">
          {/* ===== FILTER ===== */}
          <FilterSidebar
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            categories={categories}
            setCategories={setCategories}
            productTypes={productTypes}
            setProductTypes={setProductTypes}
            sizes={sizes}
            setSizes={setSizes}
            colors={colors}
            setColors={setColors}
            onFilterChange={() => setCurrentPage(1)}
          />

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
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            <div className="pagination">
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
