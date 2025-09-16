import { createHash } from 'crypto';
import prisma from './prisma';

// Hash a string and return the first 8 characters of the hex digest
export function hashId(id: string): string {
    return createHash('sha256').update(id).digest('hex').slice(0, 8);
}

// Find the event by hash
export async function findEventByHash(hash: string) {
    const events = await prisma.event.findMany();
    return events.find(event => hashId(event.id) === hash) || null;
}
