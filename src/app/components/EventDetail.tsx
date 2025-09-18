import { env } from 'process';
import { GoogleMapsEmbed } from '@next/third-parties/google'
import { loadEvent } from '../../../lib/db';

export default async function EventDetail(slug: { slug: string }) {
    const event = await loadEvent(slug);

    if (!event) {
        return <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-600 dark:shadow-none dark:inset-ring dark:inset-ring-white/10"><div className="px-4 py-6 sm:px-6">
            <h3 className="text-base/7 font-semibold text-gray-900 dark:text-white">Event not found</h3>
        </div></div>;
    }
    return (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-600 dark:shadow-none dark:inset-ring dark:inset-ring-white/10">
            <div className="px-4 py-6 sm:px-6">
                <h3 className="text-base/7 font-semibold text-gray-900 dark:text-white">{event.title}</h3>
            </div>
            <div className="border-t border-gray-100 dark:border-white/5">
                <dl className="divide-y divide-gray-100 dark:divide-white/5">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900 dark:text-gray-100">Description</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-300">{event.description}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900 dark:text-gray-100">Start Time</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-300">{event.start_time ? event.start_time.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : ''}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900 dark:text-gray-100">End Time</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-300">
                            {event.end_time ? event.end_time.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : ''}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900 dark:text-gray-100">Website</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-300">{event.website}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900 dark:text-gray-100">Location</dt>
                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-300">
                            {event.location}
                        </dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <GoogleMapsEmbed
                            apiKey={env.GOOGLE_MAPS_API_KEY ?? ''}
                            height={200}
                            width="100%"
                            mode="place"
                            q={event.location || ''}
                        />
                    </div>
                </dl>
            </div>
        </div>
    )
}
