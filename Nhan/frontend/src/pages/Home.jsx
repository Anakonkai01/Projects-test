import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchProducts } from "../features/products/productSlice";
import ProductSection from "../components/Products/ProductSection";


const HeroBanner = () => (
  <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white overflow-hidden shadow-lg">
    <div className="container mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-center">
      <motion.div
        className="w-full md:w-1/2 z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          Chào mừng đến với MobileShope!
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-8">
          Khám phá ngay điện thoại & laptop mới nhất với giá ưu đãi.
        </p>
        <motion.a
          href="/shop"
          className="bg-white text-blue-700 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Mua Ngay
        </motion.a>
      </motion.div>
      <motion.div
        className="hidden md:block w-1/2 opacity-20 md:opacity-100 relative "
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        <img
          src="/logo.jpg"
          alt="Laptops and Phones"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 max-w-lg rounded-lg"
        />
      </motion.div>
    </div>
  </div>
);

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const Home = () => {
  const dispatch = useDispatch();
  const { newProducts, bestSellers, laptops, phones, isLoading } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(
      fetchProducts({ query: "?sort=-createdAt&limit=4", type: "newProducts" })
    );
    dispatch(
      fetchProducts({ query: "?sort=-sold&limit=4", type: "bestSellers" })
    );
    dispatch(fetchProducts({ query: "?brand=Apple&limit=4", type: "laptops" }));
    dispatch(
      fetchProducts({ query: "?brand=Samsung&limit=4", type: "phones" })
    );
  }, [dispatch]);

  return (
    <div className="container mx-auto max-screen-85% bg-gray-50 min-h-screen">
      <HeroBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <ProductSection
            title="Hàng Mới Về"
            products={newProducts}
            isLoading={isLoading && newProducts.length === 0}
          />
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <ProductSection
            title="Bán Chạy Nhất"
            products={bestSellers}
            isLoading={isLoading && bestSellers.length === 0}
          />
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <ProductSection
            title="APPLE"
            products={laptops}
            isLoading={isLoading && laptops.length === 0}
          />
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <ProductSection
            title="SAMSUNG"
            products={phones}
            isLoading={isLoading && phones.length === 0}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
