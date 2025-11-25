// Nhan/frontend/src/pages/Checkout.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  createOrder,
  reset as resetOrder,
  confirmOrderPayment,
} from "../features/orders/orderSlice";
import { clearCart } from "../features/cart/cartSlice";
import {
  validateDiscountCode,
  resetDiscount,
} from "../features/discounts/discountSlice";
import {
  createVnpayUrl,
  reset as resetPayment,
} from "../features/payments/paymentSlice";
import { getMe } from "../features/auth/authSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. KIỂM TRA CÁC NGUỒN DỮ LIỆU
  const buyNowItem = location.state?.item; // Từ "Mua ngay" (số ít)
  const itemsFromCart = location.state?.items; // Từ giỏ hàng (số nhiều)

  // 2. LẤY STATE
  const { user } = useSelector((state) => state.auth);
  // SỬA: Chỉ lấy cartItems, KHÔNG lấy cartTotalAmount
  const { cartItems } = useSelector((state) => state.cart);
  const { appliedDiscount, isLoading: isDiscountLoading } = useSelector(
    (state) => state.discounts
  );
  const {
    isLoading: isOrderLoading,
    isSuccess,
    isError,
    message,
  } = useSelector((state) => state.order);
  const { isLoading: isPaymentLoading, paymentUrl } = useSelector(
    (state) => state.payment
  );

  // ... (state cục bộ giữ nguyên) ...
  const [guestEmail, setGuestEmail] = useState("");
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    phoneNo: "",
    postalCode: "",
  });
  const [discountCodeInput, setDiscountCodeInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [pointsToRedeem, setPointsToRedeem] = useState("");

  // ... (useEffect cho getMe, VNPay, isError giữ nguyên) ...
  useEffect(() => {
    dispatch(getMe());
    if (user?.addresses?.length > 0) {
      const defaultAddress =
        user.addresses.find((addr) => addr.isDefault) || user.addresses[0];
      setShippingInfo(defaultAddress);
    }
    return () => {
      dispatch(resetDiscount());
    };
  }, [dispatch]);

  useEffect(() => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
      dispatch(resetPayment());
    }
  }, [paymentUrl, dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(resetOrder());
    }
  }, [isError, message, dispatch]);

  // === 3. SỬA LOGIC TÍNH TOÁN ===

  // Quyết định hiển thị item nào
  const itemsToDisplay = useMemo(() => {
    if (buyNowItem) return [buyNowItem]; // 1. ƯU TIÊN CAO NHẤT: Sản phẩm "Mua ngay"
    if (itemsFromCart) return itemsFromCart; // 2. Ưu tiên: Sản phẩm đã chọn từ giỏ hàng
    return cartItems; // 3. Dự phòng: Toàn bộ giỏ hàng (nếu vào /checkout trực tiếp)
  }, [buyNowItem, itemsFromCart, cartItems]);

  // SỬA: Tự tính toán tổng tiền hàng (trước giảm giá)
  const itemsTotalAmount = useMemo(() => {
    return itemsToDisplay.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }, [itemsToDisplay]);

  // GIẢM GIÁ (dùng itemsTotalAmount mới)
  const discountAmount = useMemo(() => {
    if (!appliedDiscount) return 0;
    return appliedDiscount.discountType === "fixed"
      ? appliedDiscount.value
      : (itemsTotalAmount * appliedDiscount.value) / 100;
  }, [appliedDiscount, itemsTotalAmount]);

  // GIẢM TỪ ĐIỂM (dùng itemsTotalAmount mới)
  const pointsDiscountAmount = useMemo(() => {
    const pointsValue = Number(pointsToRedeem) * 1000;
    const maxRedeemableValue = itemsTotalAmount - discountAmount;
    return Math.min(pointsValue, maxRedeemableValue);
  }, [pointsToRedeem, itemsTotalAmount, discountAmount]);

  // TỔNG CUỐI CÙNG (dùng itemsTotalAmount mới)
  const finalTotal = itemsTotalAmount - discountAmount - pointsDiscountAmount;
  // === KẾT THÚC SỬA LOGIC TÍNH TOÁN ===

  const handleApplyDiscount = () => {
    // ... (giữ nguyên)
    if (discountCodeInput.trim()) {
      dispatch(validateDiscountCode(discountCodeInput.trim()));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate phone number (chỉ cho phép số)
    if (name === "phoneNo") {
      const phoneRegex = /^[0-9]*$/;
      if (!phoneRegex.test(value)) {
        return;
      }
    }
    
    // Validate postal code (chỉ cho phép số)
    if (name === "postalCode") {
      const postalRegex = /^[0-9]*$/;
      if (!postalRegex.test(value)) {
        return;
      }
    }
    
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate guest email
    if (!user && !guestEmail.trim()) {
      toast.error("Vui lòng nhập email của bạn để tiếp tục.");
      return;
    }
    
    // Validate phone number length
    if (shippingInfo.phoneNo.length < 10 || shippingInfo.phoneNo.length > 11) {
      toast.error("Số điện thoại phải có 10-11 chữ số.");
      return;
    }
    
    // Validate postal code length
    if (shippingInfo.postalCode.length < 5 || shippingInfo.postalCode.length > 6) {
      toast.error("Mã bưu chính phải có 5-6 chữ số.");
      return;
    }
    
    const guestName = shippingInfo.address;

    // orderData đã đúng vì nó dùng itemsToDisplay
    const orderData = {
      orderItems: itemsToDisplay.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        variant: item.variant._id,
        product: item._id,
      })),
      shippingInfo,
      paymentInfo: {
        id: "",
        status: paymentMethod === "COD" ? "succeeded" : "pending",
      },
      itemsPrice: itemsTotalAmount,
      taxPrice: 0,
      shippingPrice: 0,
      discountPrice: discountAmount,
      pointsToRedeem:
        Number(pointsToRedeem) > 0 ? Number(pointsToRedeem) : undefined,
      pointsDiscountPrice: pointsDiscountAmount,
      totalPrice: finalTotal,
      discountCode: appliedDiscount ? appliedDiscount.code : undefined,
      guestEmail: user ? undefined : guestEmail,
      guestName: user ? undefined : guestName,
    };

    try {
      const createdOrder = await dispatch(createOrder(orderData)).unwrap();

      if (paymentMethod === "VNPAY") {
        const paymentData = {
          orderId: createdOrder._id,
          amount: createdOrder.totalPrice,
        };
        dispatch(createVnpayUrl(paymentData));

        // SỬA: Logic clear cart
        // Chỉ KHÔNG clear cart nếu là "Mua ngay"
        // Nếu là mua từ giỏ (itemsFromCart) hoặc vào thẳng (cartItems), thì clear
        if (!buyNowItem) {
          dispatch(clearCart());
        }
      } else {
        // COD
        dispatch(confirmOrderPayment(createdOrder._id));
        toast.success("Đặt hàng thành công!");

        // Logic tương tự
        if (!buyNowItem) {
          dispatch(clearCart());
        }

        dispatch(resetDiscount());
        dispatch(resetOrder());
        navigate("/order-success");
      }
    } catch (error) {
      toast.error(error.message || "Tạo đơn hàng thất bại.");
    }
  };

  const isLoading = isOrderLoading || isPaymentLoading;
  const userPoints = user?.loyaltyPoints || 0;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Thanh Toán</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ... (Phần form thông tin giao hàng và thanh toán giữ nguyên) ... */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              1. Thông tin giao hàng
            </h2>
            {!user && (
              <div className="mb-4">
                <label
                  htmlFor="guestEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email để nhận xác nhận đơn hàng
                </label>
                <input
                  id="guestEmail"
                  name="guestEmail"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
            )}
            
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={shippingInfo.address || ""}
                onChange={handleInputChange}
                placeholder="VD: 123 Đường ABC, Phường XYZ, Quận 1"
                className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Thành phố <span className="text-red-500">*</span>
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={shippingInfo.city || ""}
                onChange={handleInputChange}
                placeholder="VD: Hồ Chí Minh"
                className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="phoneNo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                id="phoneNo"
                name="phoneNo"
                type="tel"
                value={shippingInfo.phoneNo || ""}
                onChange={handleInputChange}
                placeholder="VD: 0901234567 (10-11 chữ số)"
                className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength="11"
                required
              />
            </div>

            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mã bưu chính <span className="text-red-500">*</span>
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                value={shippingInfo.postalCode || ""}
                onChange={handleInputChange}
                placeholder="VD: 70000 (5-6 chữ số)"
                className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength="6"
                required
              />
            </div>

            <h2 className="text-xl font-semibold mb-4 pt-4 border-t">
              2. Phương thức thanh toán
            </h2>
            <div className="space-y-2">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                Thanh toán khi nhận hàng (COD)
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="VNPAY"
                  checked={paymentMethod === "VNPAY"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                Thanh toán qua VNPAY
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mt-6"
              disabled={isLoading || itemsToDisplay.length === 0}
            >
              {isLoading ? "Đang xử lý..." : "Hoàn tất Đơn hàng"}
            </button>
          </form>
        </div>

        {/* Cột tóm tắt đơn hàng (SỬA) */}
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>

          {/* Dùng itemsToDisplay (Giữ nguyên) */}
          <div className="space-y-2 mb-4">
            {itemsToDisplay.map((item) => (
              <div key={item.variant._id} className="flex justify-between">
                <span>
                  {item.name} ({item.quantity}x)
                </span>
                <span>
                  {new Intl.NumberFormat("vi-VN").format(
                    item.price * item.quantity
                  )}{" "}
                  đ
                </span>
              </div>
            ))}
          </div>
          {itemsToDisplay.length === 0 && (
            <p className="text-center text-gray-500 mb-4">
              Vui lòng chọn sản phẩm để mua.
            </p>
          )}

          {/* ... (Phần mã giảm giá và điểm thưởng giữ nguyên) ... */}
          <div className="border-t pt-4 mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={discountCodeInput}
                onChange={(e) =>
                  setDiscountCodeInput(e.target.value.toUpperCase())
                }
                placeholder="Nhập mã giảm giá"
                className="p-2 border rounded w-full"
                disabled={!!appliedDiscount}
              />
              <button
                onClick={
                  appliedDiscount
                    ? () => dispatch(resetDiscount())
                    : handleApplyDiscount
                }
                className={`px-4 py-2 rounded ${
                  appliedDiscount
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gray-700 hover:bg-gray-800"
                } text-white w-32`}
                disabled={isDiscountLoading}
              >
                {isDiscountLoading
                  ? "..."
                  : appliedDiscount
                  ? "Hủy"
                  : "Áp dụng"}
              </button>
            </div>
          </div>

          <div className="border-t pt-4 mb-4">
            <p className="font-semibold mb-2">Sử dụng điểm thưởng</p>
            <p className="text-sm text-gray-500 mb-2">
              Bạn đang có:{" "}
              <span className="font-bold text-green-600">
                {userPoints} điểm
              </span>
            </p>
            <div className="flex gap-2">
              <input
                type="number"
                value={pointsToRedeem}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? "" : Number(e.target.value);
                  if (value >= 0) {
                    setPointsToRedeem(Math.min(value, userPoints));
                  }
                }}
                placeholder="Nhập số điểm"
                className="p-2 border rounded w-full"
                max={userPoints}
                min="0"
              />
            </div>
          </div>

          {/* SỬA: Dùng các biến tính toán mới */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Tạm tính:</span>
              <span>
                {new Intl.NumberFormat("vi-VN").format(itemsTotalAmount)} đ
              </span>
            </div>
            {appliedDiscount && (
              <div className="flex justify-between text-green-600">
                <span>Giảm giá ({appliedDiscount.code}):</span>
                <span>
                  - {new Intl.NumberFormat("vi-VN").format(discountAmount)} đ
                </span>
              </div>
            )}
            {pointsDiscountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Giảm từ điểm thưởng:</span>
                <span>
                  -{" "}
                  {new Intl.NumberFormat("vi-VN").format(pointsDiscountAmount)}{" "}
                  đ
                </span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Tổng cộng:</span>
              <span className="text-red-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(finalTotal < 0 ? 0 : finalTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
