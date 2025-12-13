import "./ShippingPage.scss";

const ShippingPage = () => {
  return (
    <div className="shipping-page">
      <div className="container">
        <h1 className="page-title">Shipping & Delivery</h1>

        <div className="shipping-content">
          <p>
            Orders are processed within 1–2 business days. Delivery time depends
            on your location.
          </p>

          <div className="info-grid">
            <div className="info-card">
              <h3>🚚 Fast Shipping</h3>
              <p>3–7 business days worldwide.</p>
            </div>

            <div className="info-card">
              <h3>🌍 Worldwide</h3>
              <p>We ship to over 100 countries.</p>
            </div>

            <div className="info-card">
              <h3>📦 Tracking</h3>
              <p>Tracking number provided after shipment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
