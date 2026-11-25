// Booking storage in Upstash Redis, via its REST API (no SDK needed).
// Bookings for a month live in one hash: bookings:YYYY-MM -> { "YYYY-MM-DDTHH:mm": JSON }.
// HSETNX makes claiming a slot atomic, so two people can never book the same time.
//
// Without Redis credentials, local development falls back to an in-memory store.

const URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const storeConfigured = Boolean(URL && TOKEN);
const useMemory = !storeConfigured && process.env.NODE_ENV !== 'production';

type Memory = { hashes: Map<string, Map<string, string>> };
const g = globalThis as unknown as { __bookingMemory?: Memory };
const memory = (g.__bookingMemory ??= { hashes: new Map() });

async function redis<T>(...command: (string | number)[]): Promise<T> {
  const res = await fetch(URL!, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
  });
  const json = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || json.error) throw new Error(`Redis: ${json.error ?? res.status}`);
  return json.result as T;
}

export class NotConfiguredError extends Error {}

function ensure() {
  if (!storeConfigured && !useMemory) throw new NotConfiguredError('Booking storage is not configured');
}

const monthKey = (slot: string) => `bookings:${slot.slice(0, 7)}`;

/** Slot ids already taken in a month (YYYY-MM). Only ids — never names or emails. */
export async function bookedSlots(month: string): Promise<string[]> {
  ensure();
  if (useMemory) return [...(memory.hashes.get(`bookings:${month}`)?.keys() ?? [])];
  return (await redis<string[]>('HKEYS', `bookings:${month}`)) ?? [];
}

/** Claims a slot. Returns false when someone else already has it. */
export async function claimSlot(slot: string, value: string): Promise<boolean> {
  ensure();
  if (useMemory) {
    const hash = memory.hashes.get(monthKey(slot)) ?? new Map<string, string>();
    memory.hashes.set(monthKey(slot), hash);
    if (hash.has(slot)) return false;
    hash.set(slot, value);
    return true;
  }
  return (await redis<number>('HSETNX', monthKey(slot), slot, value)) === 1;
}

export async function releaseSlot(slot: string) {
  if (useMemory) { memory.hashes.get(monthKey(slot))?.delete(slot); return; }
  await redis('HDEL', monthKey(slot), slot);
}
