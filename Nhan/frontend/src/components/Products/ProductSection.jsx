import React from 'react';
import ProductCard from './ProductCard';

const ProductSection = ({ title, products, isLoading }) => {
    // Hiệu ứng loading đơn giản
    const renderSkeletons = () => (
        Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="border rounded-lg shadow-sm bg-white p-4">
                <div className="bg-gray-200 h-48 w-full animate-pulse"></div>
                <div className="mt-4">
                    <div className="bg-gray-200 h-6 w-3/4 animate-pulse mb-2"></div>
                    <div className="bg-gray-200 h-4 w-1/2 animate-pulse"></div>
                </div>
            </div>
        ))
    );

    return (
        <section className="container mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {isLoading ? renderSkeletons() : products.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default ProductSection;