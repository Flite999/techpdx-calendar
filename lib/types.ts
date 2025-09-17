export interface Event {
    id: string
    title: string
    description?: string
    start_time: Date
    end_time: Date
    website?: string
    location?: string
    slug: string
}

export interface SearchResult {
    results: Event[]
    pagination: {
        page: number
        limit: number
        totalCount: number
        totalPages: number
    }
}

export interface SearchParams {
    q?: string
    page?: string
}