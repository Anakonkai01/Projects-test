import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";
import { register, reset } from "../features/auth/authSlice";

const formVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (isError) {
      toast.error(message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      dispatch(reset());
    }

    if (isSuccess || user) {
      toast.success("Đăng ký thành công!");
      navigate(redirect);
      dispatch(reset());
    }
  }, [user, isError, isSuccess, message, navigate, redirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate name length
    if (name.trim().length < 2) {
      toast.error("Tên phải có ít nhất 2 ký tự!");
      return;
    }
    
    // Validate password length
    if (password.length < 8) {
      toast.error("Mật khẩu phải có ít nhất 8 ký tự!");
      return;
    }
    
    // Validate password match
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }
    
    if (isLoading) return;

    const userData = {
      name,
      email,
      password,
    };
    dispatch(register(userData));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-200 via-blue-300 to-indigo-500 p-4">
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white p-8 rounded-lg border border-gray-200 shadow-xl"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-3xl font-extrabold text-gray-800">Đăng Ký</h2>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="name"
            >
              Họ và Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="VD: Nguyễn Văn A"
              minLength="2"
              required
            />
            {name && name.trim().length < 2 && (
              <p className="text-red-500 text-xs mt-1">Tên phải có ít nhất 2 ký tự</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="email"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your-email@example.com"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="password"
            >
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ít nhất 8 ký tự"
              minLength="8"
              required
            />
            {password && password.length < 8 && (
              <p className="text-red-500 text-xs mt-1">Mật khẩu phải có ít nhất 8 ký tự</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="confirmPassword"
            >
              Xác nhận mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập lại mật khẩu"
              required
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Mật khẩu không khớp</p>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed active:scale-[.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin w-5 h-5 mr-2" />
                  Đang xử lý...
                </>
              ) : (
                "Đăng Ký"
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                to={`/login?redirect=${encodeURIComponent(redirect)}`}
                className="font-medium text-blue-500 hover:underline"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;