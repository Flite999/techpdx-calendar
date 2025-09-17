// app/search/page.tsx
'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSearch } from '../../../hooks/useSearch'
import SearchBox from '@/app/components/SearchBox'
import SearchResultsList from '@/app/components/SearchResultsList'
import SearchPagination
  from '@/app/components/SearchPagination'
function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data, loading, error, search } = useSearch()

  const query = searchParams.get('q') || ''
  const currentPage = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    if (query) {
      search(query, currentPage)
    }
  }, [query, currentPage, search])

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams()
    params.set('q', query)
    params.set('page', page.toString())
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Search Box */}

      <div className="px-20 py-10">
        <SearchBox initialQuery={query} />
      </div>

      {query && (
        <>
          {/* Results Header */}
          <div className="mb-6">
            <h1 className="block text-sm/6 font-medium text-gray-900 dark:text-white">
              Search Results
            </h1>
            <p className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-300">
              Results for <span className="font-semibold">{query}</span>
              {data && (
                <span className="text-gray-500 dark:text-gray-400">
                  {' - '}
                  {data.pagination.totalCount} {data.pagination.totalCount === 1 ? 'result' : 'results'} found
                </span>
              )}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
              <p className="block text-sm/6 font-medium text-gray-900 dark:text-white">Searching...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="overflow-hidden rounded-md bg-red-50 dark:bg-red-900/20 shadow-sm dark:shadow-none dark:outline dark:-outline-offset-0 dark:outline-red-500/20 mb-6">
              <div className="px-6 py-4">
                <h3 className="block text-sm/6 font-medium text-gray-900 dark:text-white">Search Error</h3>
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && !error && data && data.results.length === 0 && (
            <div className="overflow-hidden rounded-md bg-white shadow-sm dark:bg-gray-800/50 dark:shadow-none dark:outline dark:-outline-offset-0 dark:outline-white/10">
              <div className="px-6 py-12 text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="block text-sm/6 font-medium text-gray-900 dark:text-white">No results found</h3>

              </div>
            </div>
          )}

          {/* Results */}
          {!loading && !error && data && data.results.length > 0 && (
            <>
              <div className="mb-8">
                <SearchResultsList
                  results={data.results}
                  searchQuery={query}
                />
              </div>

              {/* Pagination */}
              <SearchPagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}


    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="overflow-hidden rounded-md bg-white shadow-sm dark:bg-gray-800/50 dark:shadow-none dark:outline dark:-outline-offset-0 dark:outline-white/10">
              <ul role="list" className="divide-y divide-gray-200 dark:divide-white/10">
                {[...Array(3)].map((_, i) => (
                  <li key={i} className="px-6 py-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}