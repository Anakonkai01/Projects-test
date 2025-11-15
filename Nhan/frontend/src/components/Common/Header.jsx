import React from "react";
import NavBar from "./NavBar";

const Header = ({ toggleCartDrawer }) => { // <-- Nhận prop ở đây
    return (
        <header className="border-b border-gray-200">
            <NavBar toggleCartDrawer={toggleCartDrawer} />
        </header>
    );
};

export default Header;