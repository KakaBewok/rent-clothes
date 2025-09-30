import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import SwipeHandIcon from './swipe-hand-icon';

interface FullPreviewImageProps {
    setPreviewImage: (image: string | null) => void;
    setApi: (api: CarouselApi) => void;
    images: string[];
    showHint: boolean;
}

const FullPreviewImage = ({ setPreviewImage, setApi, images, showHint }: FullPreviewImageProps) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 z-[70] cursor-pointer bg-black opacity-80" onClick={() => setPreviewImage(null)} />
            {/* Close Button */}
            <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-1 right-1 z-[80] cursor-pointer text-3xl text-white md:top-2 md:right-2 lg:top-4 lg:right-4"
            >
                ✕
            </button>

            {/* Carousel */}
            <Carousel className="z-[70] w-full" setApi={setApi} opts={{ loop: true }}>
                <CarouselContent>
                    {images.map((slide, i) => (
                        <CarouselItem key={i}>
                            <div className="flex h-full w-full flex-shrink-0 items-center justify-center">
                                <img
                                    src={`/storage/${slide}`}
                                    loading="lazy"
                                    alt={`Image gallery ${i}`}
                                    className="max-h-[95vh] max-w-[95vw] object-contain"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious
                    className="absolute top-1/2 z-[80] hidden h-14 w-14 -translate-y-1/2 cursor-pointer bg-second text-black hover:bg-first md:left-5 md:flex"
                    variant="default"
                />
                <CarouselNext
                    className="absolute top-1/2 z-[80] hidden h-14 w-14 -translate-y-1/2 cursor-pointer bg-second text-black hover:bg-first md:right-5 md:flex"
                    variant="default"
                />
            </Carousel>

            {showHint && (
                <div className="animate-fade-out absolute inset-0 z-[90] flex items-center justify-end bg-black/5 text-white md:hidden">
                    <SwipeHandIcon />
                </div>
            )}
        </div>
    );
};

export default FullPreviewImage;
