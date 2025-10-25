import { useState } from 'react';

interface ImageThumbnailProps {
    img: string;
    i: number;
    selectedImage: string;
    setSelectedImage: (img: string) => void;
}

const ImageThumbnail = ({ img, i, selectedImage, setSelectedImage }: ImageThumbnailProps) => {
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

    return (
        <button
            key={i}
            onClick={() => setSelectedImage(img)}
            className={`relative cursor-pointer overflow-hidden border-2 ${selectedImage === img ? 'border-first' : 'border-transparent'}`}
        >
            {!isImageLoaded && <div className="absolute inset-0 z-10 h-25 w-full animate-pulse bg-slate-400" />}

            <img
                src={`/storage/${img}`}
                alt={`Thumbnail ${i + 1}`}
                className={`h-25 w-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsImageLoaded(true)}
            />
        </button>
    );
};

export default ImageThumbnail;
