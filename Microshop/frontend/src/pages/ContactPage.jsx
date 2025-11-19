import React from "react";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
} from "react-icons/fi";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

// Trang Liên Hệ
const ContactPage = () => {
  return (
    <motion.div
      className="bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 py-20 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold">
          Liên Hệ Với Chúng Tôi
        </h1>
        <p className="text-lg mt-4 text-blue-100">
          Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn.
        </p>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Cột Thông tin liên hệ */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Thông Tin Liên Hệ
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Hãy liên hệ với chúng tôi qua các kênh dưới đây để được tư vấn và hỗ trợ 
                về sản phẩm, dịch vụ, hoặc bất kỳ thắc mắc nào.
              </p>
            </div>

            <div className="space-y-6">
              {/* Địa chỉ */}
              <div className="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FiMapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Địa chỉ</h3>
                  <p className="text-gray-600">
                    123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh
                  </p>
                </div>
              </div>

              {/* Số điện thoại */}
              <div className="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FiPhone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Điện thoại</h3>
                  <a
                    href="tel:0123456789"
                    className="text-blue-600 hover:underline"
                  >
                    (+84) 123 456 789
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Hotline hỗ trợ 24/7</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FiMail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                  <a
                    href="mailto:support@microshop.com"
                    className="text-blue-600 hover:underline"
                  >
                    support@microshop.com
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Phản hồi trong 24h</p>
                </div>
              </div>

              {/* Giờ làm việc */}
              <div className="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FiClock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Giờ làm việc</h3>
                  <p className="text-gray-600">Thứ 2 - Thứ 7: 8:00 - 20:00</p>
                  <p className="text-gray-600">Chủ nhật: 9:00 - 18:00</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Kết nối với chúng tôi</h3>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
                  title="Facebook"
                >
                  <FaFacebook className="w-6 h-6" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors"
                  title="Instagram"
                >
                  <FaInstagram className="w-6 h-6" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition-colors"
                  title="Twitter"
                >
                  <FaTwitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Cột Bản đồ */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <div className="h-full min-h-[500px] w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.447177810313!2d106.697364!3d10.776993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3a39352e1f%3A0x44268036f86c2957!2zQ2jhu6MgQuG6v24gVGjDoG5o!5e0!3m2!1svi!2s!4v1678888888888!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ Microshop"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Câu Hỏi Thường Gặp
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer group">
              <summary className="font-semibold text-gray-800 list-none flex justify-between items-center">
                <span>Microshop có giao hàng toàn quốc không?</span>
                <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                Có, chúng tôi giao hàng toàn quốc với nhiều hình thức vận chuyển khác nhau. 
                Phí vận chuyển sẽ được tính dựa trên địa chỉ và trọng lượng đơn hàng.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer group">
              <summary className="font-semibold text-gray-800 list-none flex justify-between items-center">
                <span>Chính sách đổi trả như thế nào?</span>
                <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                Sản phẩm có thể đổi trả trong vòng 7 ngày nếu còn nguyên tem, hộp và chưa qua sử dụng. 
                Vui lòng liên hệ hotline để được hỗ trợ.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer group">
              <summary className="font-semibold text-gray-800 list-none flex justify-between items-center">
                <span>Sản phẩm có được bảo hành không?</span>
                <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                Tất cả sản phẩm đều được bảo hành chính hãng từ 6-12 tháng tùy theo từng dòng máy. 
                Thông tin chi tiết về bảo hành có trong mỗi sản phẩm.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer group">
              <summary className="font-semibold text-gray-800 list-none flex justify-between items-center">
                <span>Có thể thanh toán khi nhận hàng không?</span>
                <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                Có, chúng tôi hỗ trợ thanh toán COD (thanh toán khi nhận hàng) cho tất cả đơn hàng 
                trong khu vực nội thành TP.HCM và các tỉnh thành lớn.
              </p>
            </details>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ContactPage;