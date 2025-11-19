// E_com/FE/src/components/Products/ProductReviews.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductReviews, createProductReview, reset } from '../../features/products/reviewSlice';
import { getProductById } from '../../features/products/productSlice';
import { toast } from 'sonner';
import StarRating from './StarRating';

const ProductReviews = ({ productId }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { reviews, isLoading } = useSelector(state => state.reviews);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (productId) {
            dispatch(getProductReviews(productId));
        }
        return () => {
            dispatch(reset());
        };
    }, [dispatch, productId]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        // Validation
        if (rating === 0) {
            toast.error('Vui lòng chọn số sao đánh giá!');
            return;
        }
        
        if (comment.trim().length < 10) {
            toast.error('Bình luận phải có ít nhất 10 ký tự!');
            return;
        }
        
        try {
            // Gửi review
            await dispatch(createProductReview({ productId, reviewData: { rating, comment } })).unwrap();
            
            // Reset form
            setRating(0);
            setComment('');
            
            // Reload product detail để cập nhật rating mới
            dispatch(getProductById(productId));
            
            toast.success('Đánh giá thành công!');
        } catch (error) {
            toast.error(error || 'Đã có lỗi xảy ra');
        }
    };

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Cột hiển thị đánh giá */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">
                        Các đánh giá hiện có ({reviews?.length || 0})
                    </h3>
                    {reviews && reviews.length > 0 ? (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {reviews.map((review, index) => (
                                <div key={review._id || index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <StarRating rating={review.rating} size={16} />
                                        <span className="text-xs text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <p className="font-semibold text-gray-800 mb-1">{review.name}</p>
                                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-8 rounded-lg text-center">
                            <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
                            <p className="text-sm text-gray-400 mt-2">Hãy là người đầu tiên đánh giá!</p>
                        </div>
                    )}
                </div>
                
                {/* Cột viết đánh giá */}
                <div>
                    {user ? (
                        <form onSubmit={handleSubmitReview} className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Viết đánh giá của bạn</h3>
                            <div className="mb-4">
                                <label className="block mb-2 font-medium">
                                    Chọn số sao: <span className="text-red-500">*</span>
                                </label>
                                <StarRating rating={rating} onRatingChange={setRating} />
                                {rating === 0 && (
                                    <p className="text-sm text-gray-500 mt-1">Vui lòng chọn số sao</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="comment" className="block mb-2 font-medium">
                                    Bình luận: <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="5"
                                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm (ít nhất 10 ký tự)..."
                                    minLength="10"
                                    required
                                ></textarea>
                                <div className="flex justify-between mt-1">
                                    <span className="text-xs text-gray-500">
                                        {comment.length}/500 ký tự
                                    </span>
                                    {comment.length > 0 && comment.length < 10 && (
                                        <span className="text-xs text-red-500">
                                            Cần thêm {10 - comment.length} ký tự
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors" 
                                disabled={isLoading || rating === 0 || comment.trim().length < 10}
                            >
                                {isLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
                            </button>
                        </form>
                    ) : (
                        <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
                            <p className="text-gray-600">
                                Vui lòng <a href="/login" className="text-blue-600 hover:underline font-semibold">đăng nhập</a> để viết đánh giá.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductReviews;