const ProductSkeleton = () => {
    return (
        <div className="grid grid-cols-2 gap-4 px-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-40 w-full animate-pulse rounded-lg bg-gray-200" />
            ))}
        </div>
    );
};

export default ProductSkeleton;
