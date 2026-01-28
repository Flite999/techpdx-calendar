import type { APIRoute } from 'astro'
import { searchEvents } from '../../lib/db'

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q')
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '10')

  if (!query || query.trim().length === 0) {
    return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (page < 1 || limit < 1 || limit > 50) {
    return new Response(JSON.stringify({ error: 'Invalid pagination parameters' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const searchResult = await searchEvents(query.trim(), page, limit)
    return new Response(JSON.stringify(searchResult), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Search API error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
