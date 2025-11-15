// E_com/FE/src/components/Layout/UserLayout.jsx

import React, { useState } from "react"; // Thêm useState
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { Outlet } from "react-router-dom";
import CartDrawer from "../Cart/CartDrawer"; // <-- THÊM DÒNG NÀY

const UserLayout = () => {
    // State để quản lý việc đóng/mở giỏ hàng
    const [isCartOpen, setIsCartOpen] = useState(false);
    const toggleCartDrawer = () => setIsCartOpen(!isCartOpen);

    return (
        <>
            {/* Truyền hàm toggle xuống Header -> NavBar */}
            <Header toggleCartDrawer={toggleCartDrawer} />
            <main>
                <Outlet />
            </main>
            <Footer />
            {/* Render CartDrawer ở đây */}
            <CartDrawer isOpen={isCartOpen} toggleDrawer={toggleCartDrawer} />
        </>
    );
};

export default UserLayout;