import { Event } from '../../../lib/types'
import SearchResultCard from './SearchResultCard'

interface SearchResultsListProps {
    results: Event[]
    searchQuery: string
}

export default function SearchResultsList({ results, searchQuery }: SearchResultsListProps) {
    if (results.length === 0) {
        return null
    }

    return (
        <div className="overflow-hidden rounded-md bg-white shadow-sm dark:bg-white">
            <ul role="list" className="divide-y divide-gray-200 ">
                {results.map((event) => (
                    <SearchResultCard
                        key={event.slug}
                        event={event}
                        searchQuery={searchQuery}
                    />
                ))}
            </ul>
        </div>
    )
}