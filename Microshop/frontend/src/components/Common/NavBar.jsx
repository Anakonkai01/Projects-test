import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logout, reset } from "../../features/auth/authSlice";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import { HiOutlineLogout } from "react-icons/hi";
import SearchBar from "./SearchBar";
import { IoMdClose } from "react-icons/io";
import { FiLogIn, FiUserPlus } from "react-icons/fi";

const NavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block text-base text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg p-3 transition-all"
  >
    {children}
  </Link>
);

const NavBar = ({ toggleCartDrawer }) => {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
    setNavDrawerOpen(false);
  };

  const handleNavDrawerToggle = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const closeNavDrawer = () => {
    setNavDrawerOpen(false);
  };

  const cartItemCount = cartItems.length;

  return (
    <>
      <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Microshop
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <NavLink to="/shop">Cửa Hàng</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:block">
              <SearchBar onSearch={closeNavDrawer} />
            </div>

            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="uppercase hidden md:block bg-gray-800 text-white text-xs font-semibold px-3 py-2 rounded-md hover:bg-gray-900 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  title="Tài khoản"
                >
                  <HiOutlineUser className="h-6 w-6" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                  title="Đăng xuất"
                >
                  <HiOutlineLogout className="h-6 w-6" />
                </button>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="uppercase bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="uppercase bg-gray-100 text-gray-800 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {user && (
              <button
                onClick={toggleCartDrawer}
                className="relative text-gray-700 hover:text-blue-600 transition-colors"
                aria-label="Mở giỏ hàng"
              >
                <HiOutlineShoppingBag className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={handleNavDrawerToggle}
              className="md:hidden text-gray-700"
              aria-label="Mở menu"
            >
              <HiBars3BottomRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {navDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={handleNavDrawerToggle}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 w-3/4 max-w-sm h-full bg-white shadow-lg z-50 flex flex-col"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <Link
                  to="/"
                  onClick={closeNavDrawer}
                  className="text-xl font-bold text-blue-600"
                >
                  Microshop
                </Link>
                <button onClick={handleNavDrawerToggle} aria-label="Đóng menu">
                  <IoMdClose className="h-6 w-6 text-gray-800" />
                </button>
              </div>

              <div className="p-4 border-b lg:hidden">
                <SearchBar onSearch={closeNavDrawer} />
              </div>

              <nav className="p-4 space-y-2 flex-grow">
                <MobileNavLink to="/shop" onClick={closeNavDrawer}>
                  Shop
                </MobileNavLink>
                <MobileNavLink to="/about" onClick={closeNavDrawer}>
                  About
                </MobileNavLink>
                <MobileNavLink to="/contact" onClick={closeNavDrawer}>
                  Contact
                </MobileNavLink>
              </nav>

              <div className="p-4 border-t border-gray-200">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={closeNavDrawer}
                      className="flex items-center text-base text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg p-3 transition-all mb-2"
                    >
                      <HiOutlineUser className="h-5 w-5 mr-3" />
                      Tài khoản
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center text-base text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg p-3 transition-all"
                    >
                      <HiOutlineLogout className="h-5 w-5 mr-3" />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      onClick={closeNavDrawer}
                      className="w-full flex items-center justify-center bg-blue-600 text-white text-sm font-medium px-4 py-3 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <FiLogIn className="h-5 w-5 mr-2" />
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeNavDrawer}
                      className="w-full flex items-center justify-center bg-gray-100 text-gray-800 text-sm font-medium px-4 py-3 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <FiUserPlus className="h-5 w-5 mr-2" />
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;