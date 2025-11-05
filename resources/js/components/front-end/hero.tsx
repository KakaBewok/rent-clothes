import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Banner } from '@/types/models';
import { router } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from 'react';
import BannerImage from './banner-image';

const Hero = ({ banners }: { banners: Banner[] }) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState<number>(0);
    const slides =
        banners?.flatMap((banner) =>
            (banner.images ?? []).map((imagePath, idx) => ({
                key: `${banner.id}-${idx}`,
                image: imagePath,
                title: banner.title ?? '',
                type_id: banner.type_id,
            })),
        ) ?? [];

    const handleBannerClick = (typeId?: number) => {
        if (!typeId) return;

        const params = new URLSearchParams(window.location.search);
        const currentType = params.get('type');

        if (currentType === String(typeId)) {
            params.delete('type');
        } else {
            params.set('type', String(typeId));
        }

        params.set('page', '1');

        router.visit(`${window.location.pathname}?${params.toString()}`, {
            method: 'get',
            preserveScroll: true,
            replace: true,
        });
    };

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
            <Carousel
                className="w-full bg-white"
                setApi={setApi}
                opts={{ loop: true }}
                plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
            >
                <CarouselContent>
                    {slides.map((slide) => {
                        // const isActive = currentType === String(slide.type_id);
                        return (
                            <CarouselItem key={slide.key}>
                                <div className="w-full flex-shrink-0 cursor-pointer" onClick={() => handleBannerClick(slide.type_id)}>
                                    <BannerImage
                                        src={`/storage/${slide.image}`}
                                        alt={slide.title}
                                        className={`h-[300px] md:h-[400px]`}
                                        loading="eager"
                                    />
                                </div>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
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
