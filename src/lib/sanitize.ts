export const MAX_TITLE_LENGTH = 200
export const MAX_DESCRIPTION_LENGTH = 5000
export const MAX_LOCATION_LENGTH = 500
export const MAX_WEBSITE_LENGTH = 2000
export const MAX_ICS_RESPONSE_BYTES = 1_000_000

export function stripHtml(input: string): string {
  const stripped = input.replace(/<[^>]*>/g, '')
  return stripped
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

export function normalizeWhitespace(input: string): string {
  return input.trim().replace(/\s+/g, ' ')
}

export function enforceMaxLength(input: string, max: number): string {
  return input.slice(0, max)
}

export function sanitizeText(input: string, max: number): string {
  return enforceMaxLength(normalizeWhitespace(stripHtml(input)), max)
}

export function sanitizeUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''
  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return ''
    }
    return trimmed
  } catch {
    return ''
  }
}
