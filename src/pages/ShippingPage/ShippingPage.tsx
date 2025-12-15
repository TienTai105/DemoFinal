import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./ShippingPage.scss";
import { ChevronRight } from "lucide-react";

const ShippingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPreviousPage = () => {
    const state = location.state as any;
    if (state?.from) return state.from;
    const prevPage = sessionStorage.getItem('previousPage');
    if (prevPage) return JSON.parse(prevPage);
    return { name: 'Home', path: '/' };
  };

  const previousPage = getPreviousPage();

  useEffect(() => {
    return () => {
      sessionStorage.setItem('previousPage', JSON.stringify({ name: 'Shipping & Delivery', path: '/shipping' }));
    };
  }, []);

  return (
    <div className="shipping-page">
      <div className="shipping-container">
        {/* ===== HEADER ===== */}
        <div className="shipping-header">
          <div className="breadcrumb-top">
            <button 
              className="breadcrumb-link"
              onClick={() => navigate(previousPage.path === '/' ? '/' : previousPage.path, { state: { from: null } })}
            >
              {previousPage.name}
            </button>
            <span className="breadcrumb-sep"><ChevronRight size={18} /></span>
            <span className="breadcrumb-current">Shipping & Delivery</span>
          </div>

          <h1 className="page-title">Shipping & Delivery</h1>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="shipping-body">
          <section>
            <h3>Processing Time</h3>
            <p>
              All orders are processed within 1–2 business days. Orders placed on weekends or holidays will be processed on the next business day. Once your order is shipped, you'll receive an email confirmation with tracking details.
            </p>
          </section>

          <section>
            <h3>Shipping Times</h3>
            <p>
              Delivery times depend on your location and selected shipping option. Standard shipping usually takes 5–10 business days, while express options may arrive in 2–5 days. These estimates may vary based on destination and carrier availability.
            </p>
          </section>

          <section>
            <h3>Tracking Your Order</h3>
            <p>
              When your order has been dispatched, you'll receive a tracking link to monitor the delivery progress. Please allow up to 24 hours for tracking updates to appear after shipment.
            </p>
          </section>

          <section>
            <h3>Shipping Costs</h3>
            <p>
              Shipping costs are calculated at checkout and depend on your location and chosen delivery method. We occasionally offer free shipping during promotional periods.
            </p>
          </section>

          <section>
            <h3>Delays and Exceptions</h3>
            <p>
              Unforeseen circumstances such as weather conditions, customs clearance, or carrier delays may affect delivery times. We appreciate your patience and understanding in such cases.
            </p>
          </section>

          <section>
            <h3>Need Help?</h3>
            <p>
              If you haven't received your order within the expected timeframe or notice any issue with your delivery, contact our team at support@dropcode.com with your order number — we'll assist you as soon as possible.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
