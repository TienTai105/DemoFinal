import "./ProductListPage.scss";

const ProductListPage = () => {
  return (
    <div className="product-list-page">
      <div className="container">
        <h1 className="page-title">All Products</h1>

        {/* Filter bar */}
        <div className="filter-bar">
          <select>
            <option>Category</option>
            <option>T-Shirts</option>
            <option>Hoodies</option>
            <option>Accessories</option>
          </select>

          <select>
            <option>Sort by</option>
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {/* Product grid */}
        <div className="product-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="product-card">
              <div className="image-wrapper">
                <img
                  src="https://via.placeholder.com/300x400"
                  alt="Product"
                />
              </div>

              <h3 className="product-name">Dropcode T-Shirt</h3>
              <p className="price">$49.00</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
