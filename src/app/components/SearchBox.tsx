'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarSearch } from 'lucide-react'

interface SearchBoxProps {
    initialQuery?: string
    placeholder?: string
    className?: string
}
export default function SearchBox({
    initialQuery = '',
    placeholder = "",
    className = ""
}: SearchBoxProps) {
    const [query, setQuery] = useState(initialQuery)
    const router = useRouter()

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const trimmedQuery = query.trim()

        if (trimmedQuery) {
            router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={`relative ${className}`}>
            <div>
                <label htmlFor="search" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-900">
                    Search Events
                </label>
                <div className="mt-2">
                    <div className="flex rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:bg-gray-600 dark:outline-1 dark:-outline-offset-1 dark:outline-white/10 dark:focus-within:outline-indigo-500">
                        <input
                            id="search"
                            name="search"
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={placeholder}
                            className="block min-w-0 grow px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500"
                        />
                        <div className="flex py-1.5 pr-1.5">
                            <CalendarSearch className="inline-flex items-center rounded-sm border border-gray-200 px-1 font-sans text-xs text-gray-400 dark:border-white/10" />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
