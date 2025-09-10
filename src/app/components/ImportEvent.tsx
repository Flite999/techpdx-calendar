import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'

export default function ImportEvent() {
    return (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
                <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">Import an event</h2>
                <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                    Current supported import formats: iCalendar format (.ics)
                </p>
                <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                    For meetup events, copy the .ics hyperlink and paste here.
                </p>
            </div>

            <form className="bg-white shadow-xs outline outline-gray-900/5 sm:rounded-xl md:col-span-2 dark:bg-gray-800/50 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
                <div className="px-4 py-6 sm:p-8">
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                                Import by URL
                            </label>
                            <div className="mt-2">
                                <input
                                    id="import"
                                    name="import"
                                    type="text"
                                    placeholder="Paste URL here"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                                />
                            </div>
                        </div>


                    </div>
                </div>

                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8 dark:border-white/10">
                    <button type="button" className="text-sm/6 font-semibold text-gray-900 dark:text-white">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}
