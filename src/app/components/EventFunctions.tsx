import React from 'react';
import { Search } from 'lucide-react';

export default function EventActions() {
    return (
        <>
            {/* Actions */}
            <div className="flex w-full justify-between items-top gap-32">
                <div className="mt-4 lg:mt-6">
                    <ul className="">
                        <li>
                            <button className="border-none rounded-lg bg-purple-700">
                                <a href="/add-event" className="hover:no-underline">
                                    <p className="text-sm text-neutral-100 py-4 px-2">Add/Import an Event</p>
                                </a>
                            </button>
                        </li>
                    </ul>
                </div>
                {/* Search */}
                <div className="mt-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors duration-200"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
