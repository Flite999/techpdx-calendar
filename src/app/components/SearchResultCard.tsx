import Link from 'next/link'
import { Event } from '../../../lib/types'

interface SearchResultCardProps {
  event: Event
  searchQuery: string
}

export default function SearchResultCard({ event, searchQuery }: SearchResultCardProps) {
  const highlightText = (text: string, query: string): string => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-900/40 px-1 rounded">$1</mark>')
  }

  const truncateContent = (content: string, maxLength: number = 200): string => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength).trim() + '...'
  }

  return (
    <li className="px-6 py-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <Link
            href={`/events/${event.slug}`}
            className="block group"
          >
            <h3
              className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              dangerouslySetInnerHTML={{
                __html: highlightText(event.title, searchQuery)
              }}
            />
          </Link>

          <p
            className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-300"
            dangerouslySetInnerHTML={{
              __html: highlightText(truncateContent(event.description ?? ''), searchQuery)
            }}
          />

        </div>
      </div>
    </li>
  )
}