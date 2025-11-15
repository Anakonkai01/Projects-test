import React from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const StarRating = ({ rating, onRatingChange, size = 24 }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <span 
                        key={starValue} 
                        onClick={() => onRatingChange && onRatingChange(starValue)}
                        className={onRatingChange ? 'cursor-pointer' : ''}
                    >
                        {rating >= starValue ? (
                            <FaStar color="#ffc107" size={size} />
                        ) : rating >= starValue - 0.5 ? (
                            <FaStarHalfAlt color="#ffc107" size={size} />
                        ) : (
                            <FaRegStar color="#e4e5e9" size={size} />
                        )}
                    </span>
                );
            })}
        </div>
    );
};

export default StarRating;