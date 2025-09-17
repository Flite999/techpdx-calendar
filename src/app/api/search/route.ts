// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { searchEvents } from '../../../../lib/db'
import { SearchResult } from '../../../../lib/types'

export async function GET(request: NextRequest): Promise<NextResponse<SearchResult | { error: string }>> {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.trim().length === 0) {
        return NextResponse.json(
            { error: 'Query parameter is required' },
            { status: 400 }
        )
    }

    if (page < 1 || limit < 1 || limit > 50) {
        return NextResponse.json(
            { error: 'Invalid pagination parameters' },
            { status: 400 }
        )
    }

    try {
        const searchResult = await searchEvents(query.trim(), page, limit)
        return NextResponse.json(searchResult)
    } catch (error) {
        console.error('Search API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}