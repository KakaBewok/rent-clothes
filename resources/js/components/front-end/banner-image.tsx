import React, { useState } from 'react';

type BannerImageProps = {
    src: string;
    alt: string;
    className?: string;
    loading?: 'lazy' | 'eager';
};

const BannerImage: React.FC<BannerImageProps> = ({ src, alt, className, loading = 'lazy' }) => {
    const [loaded, setLoaded] = useState<boolean>(false);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {!loaded && <div className="absolute inset-0 animate-pulse bg-slate-400" />}

            <img
                src={src}
                alt={alt}
                loading={loading}
                onLoad={() => setLoaded(true)}
                className={`h-full w-full object-contain object-center transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                style={!loaded ? { visibility: 'hidden' } : {}}
            />
        </div>
    );
};

export default BannerImage;
