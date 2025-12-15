import { Link } from "react-router-dom";
import "./ShippingPage.scss";

const ShippingPage = () => {
  return (
    <div className="shipping-page">
      <div className="shipping-container">
        {/* ===== HEADER ===== */}
        <div className="shipping-header">
          <div className="breadcrumb">
            <Link to="/">Home Page</Link>
            <span className="sep">›</span>
            <span className="current">Shipping & Delivery</span>
          </div>

          <h1 className="page-title">Shipping & Delivery</h1>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="shipping-body">
          <section>
            <h3>Delivery Time</h3>
            <p>
              Orders are processed within 1–2 business days. Delivery times vary
              depending on your location and selected shipping method.
            </p>
          </section>

          <section>
            <h3>Shipping Locations</h3>
            <p>
              We ship worldwide and collaborate with trusted international
              carriers to ensure safe and timely delivery.
            </p>
          </section>

          <section>
            <h3>Tracking Orders</h3>
            <p>
              Once your order has been shipped, you will receive a tracking
              number via email so you can follow your package.
            </p>
          </section>

          <section>
            <h3>Shipping Costs</h3>
            <p>
              Shipping costs are calculated at checkout based on your location
              and order size.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
