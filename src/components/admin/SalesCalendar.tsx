'use client';

import { Card } from '@/components/ui/card';
import { format, parseISO, isSameDay } from 'date-fns';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface SalesCalendarProps {
    data: Array<{
        date: string;
        total: number;
        count: number;
    }>;
}

export default function SalesCalendar({ data }: SalesCalendarProps) {
    // We'll use this for selection state, though this is primarily a visualization
    const [selected, setSelected] = useState<Date>();

    const modifiers = {
        hasSales: (date: Date) => {
            return data.some((d) => isSameDay(parseISO(d.date), date));
        },
    };

    const modifiersStyles = {
        hasSales: {
            fontWeight: 'bold',
            color: 'var(--primary)',
            backgroundColor: 'rgba(var(--primary-rgb), 0.1)',
        },
    };

    // Custom Day Content
    const formatDay = (day: Date) => {
        const dayData = data.find((d) => isSameDay(parseISO(d.date), day));
        if (!dayData) return day.getDate();

        return (
            <div className="flex flex-col items-center justify-center w-full h-full p-1 text-xs">
                <span className="font-bold">{day.getDate()}</span>
                <span className="text-[10px] text-green-600 font-bold">₹{dayData.total}</span>
            </div>
        );
    };

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Sales Calendar</h3>
            <div className="flex justify-center">
                <style>{`
          .rdp-day_selected { 
            background-color: var(--primary) !important; 
            color: white !important;
          }
          .rdp-button:hover:not([disabled]) {
            background-color: var(--muted);
          }
        `}</style>
                <DayPicker
                    mode="single"
                    selected={selected}
                    onSelect={setSelected}
                    components={{
                        DayButton: (props: any) => {
                            const { day, ...rest } = props;
                            return (
                                <button {...rest}>
                                    {formatDay(day.date)}
                                </button>
                            );
                        },
                    }}
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                />
            </div>
            {selected && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg text-center">
                    <p className="font-semibold">
                        {format(selected, 'MMMM dd, yyyy')}
                    </p>
                    <p className="text-2xl font-bold text-primary mt-1">
                        {(() => {
                            const dayData = data.find((d) => isSameDay(parseISO(d.date), selected));
                            return dayData ? `₹${dayData.total.toLocaleString()}` : 'No Sales';
                        })()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {(() => {
                            const dayData = data.find((d) => isSameDay(parseISO(d.date), selected));
                            return dayData ? `${dayData.count} orders` : '';
                        })()}
                    </p>
                </div>
            )}
        </Card>
    );
}
