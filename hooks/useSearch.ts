import { useState, useEffect, useCallback } from 'react'
import { SearchResult } from '../lib/types'

interface UseSearchResult {
    data: SearchResult | null
    loading: boolean
    error: string | null
    search: (query: string, page?: number) => Promise<void>
}

export function useSearch(): UseSearchResult {
    const [data, setData] = useState<SearchResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const search = useCallback(async (query: string, page: number = 1) => {
        if (!query.trim()) return

        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=${page}`)

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Search failed')
            }

            const searchResult: SearchResult = await response.json()
            setData(searchResult)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
            setData(null)
        } finally {
            setLoading(false)
        }
    }, [])

    return { data, loading, error, search }
}