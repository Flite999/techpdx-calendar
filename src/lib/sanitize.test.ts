import { describe, it, expect } from 'vitest'
import {
  stripHtml,
  normalizeWhitespace,
  enforceMaxLength,
  sanitizeText,
  sanitizeUrl,
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
} from './sanitize'

describe('stripHtml', () => {
  it('removes simple HTML tags', () => {
    expect(stripHtml('<b>bold</b>')).toBe('bold')
  })

  it('removes script tags and content between tags', () => {
    expect(stripHtml('<script>alert("xss")</script>')).toBe('alert("xss")')
  })

  it('removes nested tags', () => {
    expect(stripHtml('<div><p>hello</p></div>')).toBe('hello')
  })

  it('removes self-closing tags', () => {
    expect(stripHtml('line1<br/>line2')).toBe('line1line2')
  })

  it('handles malformed tags', () => {
    expect(stripHtml('<div<>text</div>')).toBe('text')
  })

  it('returns plain text unchanged', () => {
    expect(stripHtml('no tags here')).toBe('no tags here')
  })

  it('decodes &amp; entity', () => {
    expect(stripHtml('a &amp; b')).toBe('a & b')
  })

  it('decodes &lt; and &gt; entities', () => {
    expect(stripHtml('&lt;tag&gt;')).toBe('<tag>')
  })

  it('decodes &quot; entity', () => {
    expect(stripHtml('say &quot;hello&quot;')).toBe('say "hello"')
  })

  it('decodes &#39; entity', () => {
    expect(stripHtml("it&#39;s")).toBe("it's")
  })

  it('handles empty string', () => {
    expect(stripHtml('')).toBe('')
  })
})

describe('normalizeWhitespace', () => {
  it('trims leading and trailing whitespace', () => {
    expect(normalizeWhitespace('  hello  ')).toBe('hello')
  })

  it('collapses internal whitespace', () => {
    expect(normalizeWhitespace('a   b    c')).toBe('a b c')
  })

  it('collapses tabs and newlines', () => {
    expect(normalizeWhitespace('a\t\nb')).toBe('a b')
  })

  it('handles empty string', () => {
    expect(normalizeWhitespace('')).toBe('')
  })

  it('handles whitespace-only string', () => {
    expect(normalizeWhitespace('   ')).toBe('')
  })
})

describe('enforceMaxLength', () => {
  it('returns string unchanged when under limit', () => {
    expect(enforceMaxLength('short', 100)).toBe('short')
  })

  it('truncates string at max length', () => {
    expect(enforceMaxLength('abcdefgh', 5)).toBe('abcde')
  })

  it('handles exact length', () => {
    expect(enforceMaxLength('abc', 3)).toBe('abc')
  })

  it('handles empty string', () => {
    expect(enforceMaxLength('', 10)).toBe('')
  })
})

describe('sanitizeText', () => {
  it('applies full pipeline: strip, normalize, truncate', () => {
    const input = '  <b>Hello</b>   World  '
    expect(sanitizeText(input, 50)).toBe('Hello World')
  })

  it('handles XSS script payload', () => {
    const input = '<script>alert("xss")</script>Normal text'
    const result = sanitizeText(input, 200)
    expect(result).not.toContain('<script>')
    expect(result).toContain('Normal text')
  })

  it('handles img onerror XSS', () => {
    const input = '<img src=x onerror=alert(1)>text'
    const result = sanitizeText(input, 200)
    expect(result).not.toContain('<img')
    expect(result).toBe('text')
  })

  it('truncates long input after sanitization', () => {
    const input = 'a'.repeat(300)
    expect(sanitizeText(input, MAX_TITLE_LENGTH)).toHaveLength(MAX_TITLE_LENGTH)
  })

  it('handles entity decoding with length limit', () => {
    expect(sanitizeText('&amp; &lt; &gt;', 5)).toBe('& < >')
  })

  it('handles empty string', () => {
    expect(sanitizeText('', MAX_DESCRIPTION_LENGTH)).toBe('')
  })
})

describe('sanitizeUrl', () => {
  it('accepts valid https URL', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com')
  })

  it('accepts valid http URL', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com')
  })

  it('trims whitespace', () => {
    expect(sanitizeUrl('  https://example.com  ')).toBe('https://example.com')
  })

  it('returns empty string for empty input', () => {
    expect(sanitizeUrl('')).toBe('')
  })

  it('returns empty string for whitespace-only input', () => {
    expect(sanitizeUrl('   ')).toBe('')
  })

  it('rejects javascript: protocol', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('')
  })

  it('rejects ftp: protocol', () => {
    expect(sanitizeUrl('ftp://example.com')).toBe('')
  })

  it('rejects data: protocol', () => {
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('')
  })

  it('returns empty string for invalid URL', () => {
    expect(sanitizeUrl('not-a-url')).toBe('')
  })

  it('accepts URL with path and query', () => {
    const url = 'https://example.com/path?q=1&r=2'
    expect(sanitizeUrl(url)).toBe(url)
  })
})
