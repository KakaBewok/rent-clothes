import { cn } from '@/lib/utils';
import { isBefore, parseISO, startOfDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface AvailabilityCalendarProps {
    bookedDates: string[];
}

export default function AvailabilityCalendar({ bookedDates }: AvailabilityCalendarProps) {
    const today = startOfDay(new Date());
    const bookedDays = bookedDates.map((d) => parseISO(d));
    const modifiers = {
        booked: bookedDays,
        past: (day: Date) => isBefore(day, today),
    };

    const modifiersStyles = {
        booked: {
            backgroundColor: '#ef4444',
            color: 'white',
            fontWeight: 'bold',
        },
        past: {
            color: '#d1d5db',
        },
    };

    return (
        <div className="rounded-none border-b border-slate-200 bg-white pb-4 shadow-none">
            <DayPicker
                animate={true}
                locale={id}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                showOutsideDays
                captionLayout="label"
                style={
                    {
                        '--rdp-accent-color': '#1e293b', // slate-800
                        '--rdp-accent-color-dark': '#0f172a', // slate-900
                        '--rdp-background-color': 'white',
                        fontFamily: `'Inter', system-ui`,
                    } as React.CSSProperties
                }
                className={cn(
                    '[&_table]:w-full [&_td]:border [&_td]:border-slate-200 [&_td]:bg-slate-50 [&_td]:text-xs', //border each day
                    '[&_.rdp-day]:size-7 sm:[&_.rdp-day]:size-8 [&_td]:text-center [&_td]:align-middle',
                )}
                classNames={{
                    caption_label: 'font-semibold text-slate-900 text-sm !leading-[0.9] !mb-0 !pb-0 !inline-flex !items-center',
                }}
            />

            <div className="mt-4 flex items-center gap-5">
                <span className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-none bg-red-500" />{' '}
                    <span className="text-xs text-slate-700 italic md:text-sm">Full Booked</span>
                </span>
                <span className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-none border border-slate-300 bg-white" />{' '}
                    <span className="text-xs text-slate-700 italic md:text-sm">Available</span>
                </span>
            </div>
        </div>
    );
}
