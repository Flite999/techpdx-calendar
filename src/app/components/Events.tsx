import {
    CalendarIcon,
    ClockIcon,
    MapPinIcon,
} from '@heroicons/react/20/solid'
import Link from 'next/link'
import { Event } from '@prisma/client'

type Props = {
    events: Event[]
}

export default async function Events({ events }: Props) {
    const meetingImage = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

    return (
        <>
            <ol className="mt-4 divide-y divide-gray-100 text-sm/6 lg:col-span-7 xl:col-span-8 dark:divide-white/10">
                {events.map((event) => (
                    <li key={event.id} className="relative flex gap-x-6 py-6 xl:static">
                        <img
                            alt=""
                            src={meetingImage}
                            className="size-14 flex-none rounded-full dark:outline dark:-outline-offset-1 dark:outline-white/10"
                        />
                        <div className="flex-auto">
                            <Link href={`/events/${event.slug}`}>
                                <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0 dark:text-gray-800">{event.title}</h3>
                            </Link>
                            <dl className="mt-2 flex flex-col text-gray-500 xl:flex-row dark:text-gray-400">
                                <div className="flex items-start gap-x-3">
                                    <dt className="mt-0.5">
                                        <span className="sr-only">Date</span>
                                        <CalendarIcon aria-hidden="true" className="size-5 text-gray-400 dark:text-gray-500" />
                                    </dt>
                                    <dd>
                                        <time dateTime={event.start_time.toDateString()}>
                                            {event.start_time.toDateString()}
                                        </time>
                                    </dd>
                                </div>
                                <div className="flex items-start gap-x-3">
                                    <dt className="mt-0.5">
                                        <span className="sr-only">Time</span>
                                        <ClockIcon aria-hidden="true" className="size-5 text-gray-400 dark:text-gray-500" />
                                    </dt>
                                    <dd>
                                        <time dateTime={event.start_time.toLocaleTimeString()}>
                                            {event.start_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to {event.end_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </time>
                                    </dd>
                                </div>
                                <div className="mt-2 flex items-start gap-x-3 xl:mt-0 xl:ml-3.5 xl:border-l xl:border-gray-400/50 xl:pl-3.5 dark:xl:border-gray-500/50">
                                    <dt className="mt-0.5">
                                        <span className="sr-only">Location</span>
                                        <MapPinIcon aria-hidden="true" className="size-5 text-gray-400 dark:text-gray-500" />
                                    </dt>
                                    <dd>{event.location}</dd>
                                </div>
                            </dl>
                        </div>

                    </li>
                ))}
            </ol>
        </>
    )

}