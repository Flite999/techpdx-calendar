import Hashids from 'hashids';

const hashids = new Hashids('your-salt', 8);

export function encodeId(id: number): string {
    return hashids.encode(id);
}

export function decodeId(hash: string): number | undefined {
    const decoded = hashids.decode(hash);
    return decoded.length ? decoded[0] as number : undefined;
}