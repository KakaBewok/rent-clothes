'use client';
import { Product } from '@/types/models';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import AvailabilityCalendar from './availability-calendar';

interface CalendarToggleProps {
    allSizesUnavailable: boolean;
    product: Product;
}

export default function CalendarToggle({ allSizesUnavailable, product }: CalendarToggleProps) {
    const [showCalendar, setShowCalendar] = useState<boolean>(false);

    if (allSizesUnavailable) return null;

    return (
        <div className="my-2">
            <button
                type="button"
                onClick={() => setShowCalendar((prev) => !prev)}
                className="cursor-pointer rounded-none bg-green-600 px-3 py-2 text-xs font-medium text-white transition-all md:text-sm"
            >
                <div className="flex items-center justify-center gap-2">
                    <Calendar size={17} />
                    <span className="text-xs md:text-sm">
                        {showCalendar ? 'Tutup ' : 'Lihat '}
                        Ketersediaan
                    </span>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {showCalendar && (
                    <motion.div
                        key="calendar"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <AvailabilityCalendar bookedDates={product.booked_dates ?? []} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
