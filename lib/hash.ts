import { createHash } from 'crypto';
import prisma from './prisma';

// Hash a string and return the first 8 characters of the hex digest
export function hashId(id: string): string {
    return createHash('sha256').update(id).digest('hex').slice(0, 8);
}

// Generate a unique slug for the event based on its title
export async function generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
        .replace(/^-+|-+$/g, '')     // Trim hyphens from start and end
        .slice(0, 5);               // Limit length to 50 characters

    // Use hashId to generate a unique suffix from the event id
    const uniqueSuffix = hashId(title);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    // Ensure uniqueness in the database
    if (await prisma.event.findUnique({ where: { slug } })) {
        // If collision, append a random string (very unlikely)
        return `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    }

    return slug;
}
