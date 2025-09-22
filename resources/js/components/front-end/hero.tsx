import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Banner } from '@/types/models';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from 'react';

const Hero = ({ banners }: { banners: Banner[] }) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState<number>(0);
    const slides =
        banners?.flatMap((banner) =>
            (banner.images ?? []).map((imagePath, idx) => ({
                key: `${banner.id}-${idx}`,
                image: imagePath,
                title: banner.title ?? '',
            })),
        ) ?? [];

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
        <div className="relative w-full md:px-4">
            <Carousel className="w-full" setApi={setApi} opts={{ loop: true }} plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}>
                <CarouselContent>
                    {slides.map((slide) => (
                        <CarouselItem key={slide.key}>
                            <div className="w-full flex-shrink-0">
                                <img
                                    src={`/storage/${slide.image}`}
                                    loading="lazy"
                                    alt={slide.title}
                                    className="h-[300px] w-full object-cover md:h-[400px]"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Arrows */}
                {/* <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 space-x-4">
                    <CarouselPrevious className="static translate-x-0 translate-y-0 cursor-pointer" variant={'default'} />
                    <CarouselNext className="static translate-x-0 translate-y-0 cursor-pointer" variant={'default'} />
                </div> */}
            </Carousel>

            {/* Dot Indicators */}
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={`h-1 w-1 rounded-full transition-all duration-500 md:h-2 md:w-2 ${current === index ? 'bg-white' : 'bg-gray-500'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hero;
