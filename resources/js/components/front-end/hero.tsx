import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Banner } from '@/types/models';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from 'react';

const Hero = ({ banners }: { banners: Banner[] }) => {
    const slides =
        banners?.flatMap((banner) =>
            (banner.images ?? []).map((imagePath, idx) => ({
                key: `${banner.id}-${idx}`,
                image: imagePath,
                title: banner.title,
            })),
        ) ?? [];

    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) return;
        const update = () => setCurrent(api.selectedScrollSnap());
        update();
        api.on('select', update);
        return () => {
            api.off('select', update);
        };
    }, [api]);

    return (
        <div className="relative w-full">
            <Carousel className="w-full" setApi={setApi} opts={{ loop: true }} plugins={[Autoplay({ delay: 2000, stopOnInteraction: false })]}>
                <CarouselContent>
                    {slides.map((slide) => (
                        <CarouselItem key={slide.key}>
                            <div className="relative w-full flex-shrink-0">
                                <img src={`/storage/${slide.image}`} loading="lazy" alt={slide.title} className="h-[500px] w-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <div className="px-4 text-center text-white">
                                        <h2 className="mb-4 text-3xl font-bold md:text-5xl">{slide.title}</h2>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Pindahkan panah ke bawah */}
                <div className="absolute -bottom-11 left-1/2 flex -translate-x-1/2 space-x-4">
                    <CarouselPrevious className="static translate-x-0 translate-y-0" />
                    <CarouselNext className="static translate-x-0 translate-y-0" />
                </div>
            </Carousel>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={`h-3 w-3 rounded-full transition-all duration-500 ${current === index ? 'bg-white' : 'bg-gray-400'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hero;
