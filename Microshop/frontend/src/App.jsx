import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminRoute from "./components/Common/AdminRoute";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import SocialAuthCallback from "./pages/SocialAuthCallback";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserManagement from "./components/Admin/UserManagement";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import ProductManagement from "./components/Admin/ProductManagement";
import ProductForm from "./components/Admin/ProductForm";
import Shop from "./pages/Shop";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderManagement from "./components/Admin/OrderManagement";
import OrderDetailAdmin from "./components/Admin/OrderDetailAdmin";
import OrderDetailPage from "./pages/OrderDetailPage";
import DiscountManagement from "./components/Admin/DiscountManagement";
import PaymentReturn from "./pages/PaymentReturn";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

const App = () => {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
        expand={false}
      />

      <Routes>
        <Route path="/" element={<UserLayout />}>
          {/* User layout */}
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="auth/callback" element={<SocialAuthCallback />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="resetpassword/:resettoken" element={<ResetPassword />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="order/:id" element={<OrderDetailPage />} />
          <Route path="payment-return" element={<PaymentReturn />} />

          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* === ADMIN ROUTES === */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="orders/:id" element={<OrderDetailAdmin />} />
            <Route path="discounts" element={<DiscountManagement />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;