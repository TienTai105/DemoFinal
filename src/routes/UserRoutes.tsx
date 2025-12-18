
import { Routes, Route } from "react-router-dom";

import { HomePage} from "../pages/User/HomePage/HomePage";
import ProductListPage from "../pages/User/ProductList/ProductListPage";
import About from "../pages/User/Aboutpage/AboutPage";
import Contact from "../pages/User/ContactPage/ContactPage";
import ProductDetail from "../pages/User/ProductDetailPage/ProductDetailPage";
import Login from "../pages/User/LoginPage/LoginPage";
import Register from "../pages/User/RegisterPage/RegisterPage";
import { CheckoutPage } from "../pages/User/CheckoutPage/CheckoutPage";
import ShippingPage from "@/pages/User/ShippingPage/ShippingPage";
import OrderUser from "../pages/User/UserOrders/UserOrders";
import ProfileUser from "../pages/User/UserProfile/UserProfile";
const UserRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/collection" element={<ProductListPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/orders" element={<OrderUser />} />
            <Route path="/profile" element={<ProfileUser />} />
        </Routes>
    );
};

export default UserRoutes;


