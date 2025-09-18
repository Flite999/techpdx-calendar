
'use client'


import { useActionState } from "react"
import { AddEventState } from "../actions"
import { addEventToDB } from "../../../lib/db";

const initialState: AddEventState = {
    message: '',
    errors: {}
};

export default function AddEvent() {
    const [state, formAction, pending] = useActionState<AddEventState, FormData>(addEventToDB, initialState)

    return (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
                <h2 className="text-base/7 font-semibold text-gray-900 dark:text-gray-800">Add a New Event</h2>
            </div>
            <form action={formAction} className="bg-white shadow-xs outline outline-gray-900/5 sm:rounded-xl md:col-span-2 dark:bg-gray-600 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
                <div className="px-4 py-6 sm:p-8">
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label htmlFor="title" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                                Title *
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:bg-white/5 dark:outline-1 dark:-outline-offset-1 dark:outline-gray-600 dark:focus-within:outline-indigo-500">
                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        placeholder="Event title"
                                        className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500"
                                    />
                                </div>
                                {state?.errors?.title && <p className="mt-1 text-sm text-red-600">{state?.errors?.title[0]}</p>}
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="start_time" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                                Start Date & Time *
                            </label>
                            <div className="mt-2">
                                <input
                                    id="start_time"
                                    name="start_time"
                                    type="datetime-local"
                                    className="block w-full rounded-md bg-white py-1.5 px-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-gray-600 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                                />
                                {state?.errors?.start_time && <p className="mt-1 text-sm text-red-600">{state.errors.start_time[0]}</p>}
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="end_time" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                                End Date & Time *
                            </label>
                            <div className="mt-2">
                                <input
                                    id="end_time"
                                    name="end_time"
                                    type="datetime-local"
                                    className="block w-full rounded-md bg-white py-1.5 px-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-gray-600 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                                />
                                {state?.errors?.end_time && <p className="mt-1 text-sm text-red-600">{state.errors.end_time[0]}</p>}
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="location" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                                Location
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:bg-white/5 dark:outline-1 dark:-outline-offset-1 dark:outline-gray-600 dark:focus-within:outline-indigo-500">
                                    <input
                                        id="location"
                                        name="location"
                                        type="text"
                                        placeholder="Enter location (address)"
                                        className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500"
                                    />
                                </div>
                                {state?.errors?.location && <p className="mt-1 text-sm text-red-600">{state.errors.location[0]}</p>}
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="website" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                                Website
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:bg-white/5 dark:outline-1 dark:-outline-offset-1 dark:outline-gray-600 dark:focus-within:outline-indigo-500">
                                    <input
                                        id="website"
                                        name="website"
                                        type="url"
                                        placeholder="https://example.com"
                                        className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500"
                                    />
                                </div>
                                {state?.errors?.website && <p className="mt-1 text-sm text-red-600">{state.errors.website[0]}</p>}
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                                Description
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    placeholder="Describe your event"
                                    className="block w-full rounded-md bg-white py-1.5 px-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-gray-600 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                                />
                                {state?.errors?.description && <p className="mt-1 text-sm text-red-600">{state.errors.description[0]}</p>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8 dark:border-white/10">
                    <button type="button" className="text-sm/6 font-semibold text-gray-900 dark:text-white">
                        Cancel
                    </button>
                    <p aria-live="polite" className={state?.message?.includes('successfully') ? 'text-green-600' : 'text-red-600'}>
                        {state?.message}
                    </p>
                    <button
                        disabled={pending}
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
                    >
                        {pending ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    )
}