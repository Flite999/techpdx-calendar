import React from 'react';
import { Search } from 'lucide-react';

export default function EventActions() {
    return (
        <>
            <div className="mt-4 lg:mt-6">
                <ul className="flex gap-5">
                    <li>
                        <a href="/add-event" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                            Add an Event
                        </a>
                    </li>
                    <li>
                        <a href="/import-event" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                            Import Event
                        </a>
                    </li>
                    <li>
                        <a href="/subscribe" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                            Subscribe
                        </a>
                    </li>
                </ul>
            </div>

            {/* Search Bar */}
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
        </>
    );
}
