'use client';
import { Calendar } from 'lucide-react';

export default function Header() {
    return (
        <header className="py-4 pt-2 px-4 sm:px-6 md:pt-10 mb-10 lg:mb-28 w-full">
            <div className="flex w-full justify-between items-end border-b lg:border-none pb-4 lg:pb-0">
                <a
                    className="font-semibold text-xl flex gap-2 items-center group"
                    href="/"
                >
                    <Calendar className="w-5 h-5 group-hover:rotate-[17deg] transition-transform duration-200" />
                    TechPDX Calendar
                </a>
            </div>
        </header>
    );
}