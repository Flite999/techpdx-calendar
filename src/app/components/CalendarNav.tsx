import {
    CalendarIcon,
    ClockIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    MapPinIcon,
} from '@heroicons/react/20/solid'

export default function CalendarNav() {
    return (
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
    )
}