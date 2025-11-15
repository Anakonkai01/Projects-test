import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiSend,
  FiLoader,
} from "react-icons/fi";
import { toast } from "sonner";

// Component con cho Input
const FormInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
    />
  </div>
);

// Trang Liên Hệ
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Giả lập API call
    console.log("Form data:", formData);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Đã gửi tin nhắn! Chúng tôi sẽ liên hệ lại với bạn sớm.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <motion.div
      className="bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <section className="bg-gray-50 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Liên Hệ
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Chúng tôi luôn sẵn sàng lắng nghe bạn.
        </p>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Cột Thông tin */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800">
              Thông tin liên hệ
            </h2>
            <p className="text-gray-600">
              Bạn có thắc mắc? Hãy điền vào form bên cạnh hoặc liên hệ trực tiếp
              với chúng tôi qua các kênh dưới đây.
            </p>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <FiMapPin className="w-5 h-5 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                <span>
                  123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center">
                <FiPhone className="w-5 h-5 mr-3 text-blue-600" />
                <a
                  href="tel:0123456789"
                  className="hover:text-blue-600 transition-colors"
                >
                  (+84) 123 456 789
                </a>
              </li>
              <li className="flex items-center">
                <FiMail className="w-5 h-5 mr-3 text-blue-600" />
                <a
                  href="mailto:support@microshop.com"
                  className="hover:text-blue-600 transition-colors"
                >
                  support@microshop.com
                </a>
              </li>
            </ul>
            <div className="h-64 md:h-80 w-full rounded-lg overflow-hidden shadow-md border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.447177810313!2d106.697364!3d10.776993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3a39352e1f%3A0x44268036f86c2957!2zQ2jhu6MgQuG6v24gVGjDoG5o!5e0!3m2!1svi!2s!4v1678888888888!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ"
              ></iframe>
            </div>
          </motion.div>

          {/* Cột Form */}
          <motion.div
            className="bg-gray-50 p-8 rounded-lg shadow-lg border border-gray-200"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Gửi tin nhắn cho chúng tôi
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                id="name"
                label="Họ và Tên"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
              />
              <FormInput
                id="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="bancoten@email.com"
              />
              <FormInput
                id="subject"
                label="Chủ đề"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Hỗ trợ, Báo giá,..."
              />
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tin nhắn
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Nội dung tin nhắn của bạn..."
                  required
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <FiLoader className="animate-spin w-5 h-5 mr-2" />
                  ) : (
                    <FiSend className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? "Đang gửi..." : "Gửi tin nhắn"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default ContactPage;