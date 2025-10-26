import React, { useState } from 'react';

type ImageWithSkeletonProps = {
    src: string;
    alt: string;
    className?: string;
    loading?: 'lazy' | 'eager';
};

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({ src, alt, className, loading = 'lazy' }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <>
            <div className="relative max-h-[95vh] max-w-[95vw] overflow-hidden">
                {!loaded && <div className="absolute inset-0 animate-pulse bg-slate-100" />}
                <img
                    src={src}
                    alt={alt}
                    loading={loading}
                    onLoad={() => setLoaded(true)}
                    className={`${className} object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                    style={!loaded ? { visibility: 'hidden' } : {}}
                />
            </div>
        </>
    );
};

export default ImageWithSkeleton;
