// E_com/FE/src/components/Products/ProductReviews.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductReviews, createProductReview, reset } from '../../features/products/reviewSlice';
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

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (rating === 0 || comment.trim() === '') {
            return;
        }
        dispatch(createProductReview({ productId, reviewData: { rating, comment } }));
        setRating(0);
        setComment('');
    };

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Cột hiển thị đánh giá */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Các đánh giá hiện có</h3>
                    {reviews && reviews.length > 0 ? (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {reviews.map(review => (
                                <div key={review._id} className="border-b pb-4">
                                    <StarRating rating={review.rating} size={16} />
                                    <p className="font-semibold my-1">{review.name}</p>
                                    <p className="text-gray-600">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                    )}
                </div>
                
                {/* Cột viết đánh giá */}
                <div>
                    {user ? (
                        <form onSubmit={handleSubmitReview} className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Viết đánh giá của bạn</h3>
                            <div className="mb-4">
                                <label className="block mb-2">Chọn số sao:</label>
                                <StarRating rating={rating} onRatingChange={setRating} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="comment" className="block mb-2">Bình luận:</label>
                                <textarea
                                    id="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" disabled={isLoading}>
                                {isLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
                            </button>
                        </form>
                    ) : (
                        <p>Vui lòng <a href="/login" className="text-blue-600">đăng nhập</a> để viết đánh giá.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductReviews;