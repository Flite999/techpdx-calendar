import {
    CalendarIcon,
    ClockIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EllipsisHorizontalIcon,
    MapPinIcon,
} from '@heroicons/react/20/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import prisma from '../../../lib/prisma'

const events = await prisma.event.findMany();
console.log('Fetched events from DB:', events);
const meetingImage = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

const meetings = [
    {
        id: 1,
        date: 'January 10th, 2022',
        time: '5:00 PM',
        datetime: '2022-01-10T17:00',
        name: 'Tech Event A',
        imageUrl:
            'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        location: 'Starbucks',
    },
    {
        id: 2,
        date: 'January 12th, 2022',
        time: '3:00 PM',
        datetime: '2022-01-12T15:00',
        name: 'Tech Event B',
        imageUrl:
            'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        location: 'Tim Hortons',
    },
    {
        id: 3,
        date: 'January 12th, 2022',
        time: '5:00 PM',
        datetime: '2022-01-12T17:00',
        name: 'Tech Event C',
        imageUrl:
            'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        location: 'Costa Coffee at Braehead',
    },
    {
        id: 4,
        date: 'January 14th, 2022',
        time: '10:00 AM',
        datetime: '2022-01-14T10:00',
        name: 'Tech Event D',
        imageUrl:
            'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        location: 'Silverburn',
    },
    {
        id: 5,
        date: 'January 14th, 2022',
        time: '12:00 PM',
        datetime: '2022-01-14T12:00',
        name: 'Tech Event E',
        imageUrl:
            'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        location: 'The Glasgow Green',
    },
]
const days = [
    { date: '2021-12-27' },
    { date: '2021-12-28' },
    { date: '2021-12-29' },
    { date: '2021-12-30' },
    { date: '2021-12-31' },
    { date: '2022-01-01', isCurrentMonth: true },
    { date: '2022-01-02', isCurrentMonth: true },
    { date: '2022-01-03', isCurrentMonth: true },
    { date: '2022-01-04', isCurrentMonth: true },
    { date: '2022-01-05', isCurrentMonth: true },
    { date: '2022-01-06', isCurrentMonth: true },
    { date: '2022-01-07', isCurrentMonth: true },
    { date: '2022-01-08', isCurrentMonth: true },
    { date: '2022-01-09', isCurrentMonth: true },
    { date: '2022-01-10', isCurrentMonth: true },
    { date: '2022-01-11', isCurrentMonth: true },
    { date: '2022-01-12', isCurrentMonth: true, isToday: true },
    { date: '2022-01-13', isCurrentMonth: true },
    { date: '2022-01-14', isCurrentMonth: true },
    { date: '2022-01-15', isCurrentMonth: true },
    { date: '2022-01-16', isCurrentMonth: true },
    { date: '2022-01-17', isCurrentMonth: true },
    { date: '2022-01-18', isCurrentMonth: true },
    { date: '2022-01-19', isCurrentMonth: true },
    { date: '2022-01-20', isCurrentMonth: true },
    { date: '2022-01-21', isCurrentMonth: true },
    { date: '2022-01-22', isCurrentMonth: true, isSelected: true },
    { date: '2022-01-23', isCurrentMonth: true },
    { date: '2022-01-24', isCurrentMonth: true },
    { date: '2022-01-25', isCurrentMonth: true },
    { date: '2022-01-26', isCurrentMonth: true },
    { date: '2022-01-27', isCurrentMonth: true },
    { date: '2022-01-28', isCurrentMonth: true },
    { date: '2022-01-29', isCurrentMonth: true },
    { date: '2022-01-30', isCurrentMonth: true },
    { date: '2022-01-31', isCurrentMonth: true },
    { date: '2022-02-01' },
    { date: '2022-02-02' },
    { date: '2022-02-03' },
    { date: '2022-02-04' },
    { date: '2022-02-05' },
    { date: '2022-02-06' },
]

export default function Calendar() {
    return (
        <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Upcoming events</h2>
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
                <div className="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9">
                    <div className="flex items-center text-gray-900 dark:text-white">
                        <button
                            type="button"
                            className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-white"
                        >
                            <span className="sr-only">Previous month</span>
                            <ChevronLeftIcon aria-hidden="true" className="size-5" />
                        </button>
                        <div className="flex-auto text-sm font-semibold">January</div>
                        <button
                            type="button"
                            className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-white"
                        >
                            <span className="sr-only">Next month</span>
                            <ChevronRightIcon aria-hidden="true" className="size-5" />
                        </button>
                    </div>
                    <div className="mt-6 grid grid-cols-7 text-xs/6 text-gray-500 dark:text-gray-400">
                        <div>M</div>
                        <div>T</div>
                        <div>W</div>
                        <div>T</div>
                        <div>F</div>
                        <div>S</div>
                        <div>S</div>
                    </div>
                    <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow-sm ring-1 ring-gray-200 dark:bg-white/15 dark:shadow-none dark:ring-white/15">
                        {days.map((day) => (
                            <button
                                key={day.date}
                                type="button"
                                data-is-today={day.isToday ? '' : undefined}
                                data-is-selected={day.isSelected ? '' : undefined}
                                data-is-current-month={day.isCurrentMonth ? '' : undefined}
                                className="py-1.5 not-data-is-current-month:bg-gray-50 not-data-is-selected:not-data-is-current-month:not-data-is-today:text-gray-400 first:rounded-tl-lg last:rounded-br-lg hover:bg-gray-100 focus:z-10 data-is-current-month:bg-white not-data-is-selected:data-is-current-month:not-data-is-today:text-gray-900 data-is-current-month:hover:bg-gray-100 data-is-selected:font-semibold data-is-selected:text-white data-is-today:font-semibold data-is-today:not-data-is-selected:text-indigo-600 nth-36:rounded-bl-lg nth-7:rounded-tr-lg dark:not-data-is-current-month:bg-gray-900/75 dark:not-data-is-selected:not-data-is-current-month:not-data-is-today:text-gray-500 dark:hover:bg-gray-900/25 dark:data-is-current-month:bg-gray-900/90 dark:not-data-is-selected:data-is-current-month:not-data-is-today:text-white dark:data-is-current-month:hover:bg-gray-900/50 dark:data-is-selected:text-gray-900 dark:data-is-today:not-data-is-selected:text-indigo-400"
                            >
                                <time
                                    dateTime={day.date}
                                    className="mx-auto flex size-7 items-center justify-center rounded-full in-data-is-selected:not-in-data-is-today:bg-gray-900 in-data-is-selected:in-data-is-today:bg-indigo-600 dark:in-data-is-selected:not-in-data-is-today:bg-white dark:in-data-is-selected:in-data-is-today:bg-indigo-500"
                                >
                                    {/* @ts-expect-error - not ready to enforce default values here yet */}
                                    {day.date.split('-').pop().replace(/^0/, '')}
                                </time>
                            </button>
                        ))}
                    </div>
                </div>
                <ol className="mt-4 divide-y divide-gray-100 text-sm/6 lg:col-span-7 xl:col-span-8 dark:divide-white/10">
                    {events.map((event) => (
                        <li key={event.id} className="relative flex gap-x-6 py-6 xl:static">
                            <img
                                alt=""
                                src={meetingImage}
                                className="size-14 flex-none rounded-full dark:outline dark:-outline-offset-1 dark:outline-white/10"
                            />
                            <div className="flex-auto">
                                <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0 dark:text-white">{event.title}</h3>
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
            </div>
        </div>
    )
}
