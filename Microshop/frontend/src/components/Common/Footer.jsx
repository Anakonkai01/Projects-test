import React from "react";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall, FiMail, FiMapPin, FiSend } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-white py-12 text-gray-700">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Microshop
          </h3>
          <p className="text-gray-500 mb-4 text-sm">
            Đăng ký để nhận thông tin về sản phẩm mới và khuyến mãi độc quyền.
          </p>
          <form action="#" className="flex shadow-sm">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="p-3 w-full text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-3 rounded-r-md text-sm font-medium hover:bg-blue-700 transition-colors"
              aria-label="Đăng ký newsletter"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </form>
          <div className="flex items-center space-x-4 mt-6">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 transition-colors"
              aria-label="Facebook"
            >
              <TbBrandMeta className="h-6 w-6" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-pink-600 transition-colors"
              aria-label="Instagram"
            >
              <IoLogoInstagram className="h-6 w-6" />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-black transition-colors"
              aria-label="Twitter X"
            >
              <RiTwitterXLine className="h-6 w-6" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sản Phẩm</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/shop?category=68e633d4a454864a0c48b6a2"
                className="hover:text-blue-600 transition-colors"
              >
                Điện thoại
              </Link>
            </li>
            <li>
              <Link
                to="/shop?sort=-createdAt"
                className="hover:text-blue-600 transition-colors"
              >
                Hàng Mới Về
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Hỗ Trợ</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/about" className="hover:text-blue-600 transition-colors">
                Về Chúng Tôi
              </Link>
            </li>
            <li>
              <Link
                to="/policy/warranty"
                className="hover:text-blue-600 transition-colors"
              >
                Chính Sách Bảo Hành
              </Link>
            </li>
            <li>
              <Link
                to="/policy/return"
                className="hover:text-blue-600 transition-colors"
              >
                Chính Sách Đổi Trả
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-blue-600 transition-colors">
                Câu Hỏi Thường Gặp
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Liên Hệ
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
              <FiMapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
              <span>
                123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh
              </span>
            </li>
            <li className="flex items-center">
              <FiMail className="w-5 h-5 mr-3" />
              <a
                href="mailto:support@microshop.com"
                className="hover:text-blue-600 transition-colors"
              >
                support@microshop.com
              </a>
            </li>
            <li className="flex items-center">
              <FiPhoneCall className="w-5 h-5 mr-3" />
              <a
                href="tel:0123456789"
                className="hover:text-blue-600 transition-colors"
              >
                (+84) 123 456 789
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 border-t border-gray-200 pt-8">
        <p className="text-gray-500 text-sm text-center">
          Bản quyền © {new Date().getFullYear()} Microshop. Đã đăng ký Bản quyền.
        </p>
      </div>
    </footer>
  );
};

export default Footer;