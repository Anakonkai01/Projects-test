import React from "react";
import { motion } from "framer-motion";
import { FiAward, FiShield, FiTruck, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center mb-4">
        <span className="p-3 bg-blue-100 text-blue-600 rounded-full">
          {React.cloneElement(icon, { className: "w-6 h-6" })}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  );
};

// Trang Giới Thiệu
const AboutPage = () => {
  const features = [
    {
      icon: <FiAward />,
      title: "Chất Lượng Hàng Đầu",
      description:
        "Cam kết 100% sản phẩm chính hãng, nguyên seal với đầy đủ bảo hành từ nhà sản xuất.",
    },
    {
      icon: <FiTruck />,
      title: "Giao Hàng Nhanh Chóng",
      description:
        "Hệ thống giao hàng hỏa tốc nội thành và vận chuyển toàn quốc an toàn, nhanh chóng.",
    },
    {
      icon: <FiShield />,
      title: "Bảo Hành An Tâm",
      description:
        "Chính sách bảo hành, đổi trả 1-1 rõ ràng, minh bạch, đặt lợi ích của bạn lên hàng đầu.",
    },
  ];

  return (
    <motion.div
      className="bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-400 to-indigo-600 text-white py-24 md:py-32 text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Về Microshop
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Nơi công nghệ và đam mê hội tụ.
        </motion.p>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center relative">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <img
              src="./banner.jpg"
              alt="Cửa hàng Microshop"
              className="rounded-lg shadow-xl w-full"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Sứ Mệnh Của Chúng Tôi
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Tại Microshop, chúng tôi tin rằng công nghệ là cầu nối mang lại
              tương lai. Sứ mệnh của chúng tôi là mang đến cho khách hàng những
              sản phẩm điện thoại và laptop tiên tiến nhất, với mức giá cạnh
              tranh và dịch vụ hậu mãi vượt trội.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Chúng tôi không chỉ bán sản phẩm, chúng tôi mang đến giải pháp, sự
              tin cậy và trải nghiệm mua sắm an tâm tuyệt đối cho bạn.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Tại Sao Chọn Microshop?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Sẵn sàng khám phá?
        </motion.h2>
        <motion.p
          className="text-gray-600 max-w-xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Duyệt qua hàng ngàn sản phẩm công nghệ mới nhất tại cửa hàng của chúng
          tôi.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/shop"
            className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Đến Cửa Hàng
          </Link>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default AboutPage;