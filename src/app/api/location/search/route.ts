import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit';

const MAX_QUERY_LENGTH = 80;

type NominatimAddress = {
    country_code?: string;
    country?: string;
};

type NominatimItem = {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
    address?: NominatimAddress | null;
};

export async function GET(request: NextRequest) {
    const rateLimit = checkRateLimit(request, {
        key: 'location:search',
        limit: 45,
        windowMs: 60_000
    });
    if (!rateLimit.allowed) return rateLimitExceededResponse(rateLimit);

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.trim() || '';

    if (query.length < 3) {
        return NextResponse.json({ results: [] });
    }
    if (query.length > MAX_QUERY_LENGTH) {
        return NextResponse.json({ error: `Query too long (max ${MAX_QUERY_LENGTH} chars)` }, { status: 400 });
    }

    const headers = {
        'User-Agent': 'Localboynaniseafoods/1.0 (delivery location search)',
        'Accept-Language': 'en',
    };

    function mapItems(data: unknown): { place_id: number; display_name: string; lat: string; lon: string; address: NominatimAddress | null }[] {
        const items: NominatimItem[] = Array.isArray(data) ? data as NominatimItem[] : [];
        return items.map((item) => ({
            place_id: item.place_id,
            display_name: item.display_name,
            lat: item.lat,
            lon: item.lon,
            address: item.address ?? null,
        }));
    }

    function isIndia(item: NominatimItem): boolean {
        const addr = item?.address;
        if (!addr) return false;
        const cc = (addr.country_code || '').toLowerCase();
        const country = (addr.country || '').toLowerCase();
        return cc === 'in' || country === 'india';
    }

    try {
        // First try: India only (countrycodes=in). Nominatim sometimes returns empty for this.
        let nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=10&countrycodes=in`;
        let res = await fetch(nominatimUrl, { headers });
        if (!res.ok) {
            console.error(`Nominatim API Error: ${res.status} ${res.statusText}`);
            return NextResponse.json({ error: 'Search temporarily unavailable' }, { status: 502 });
        }
        let data = await res.json();
        let items: NominatimItem[] = Array.isArray(data) ? data as NominatimItem[] : [];

        // Fallback: if no results, try without country filter then keep only India
        if (items.length === 0) {
            nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=15`;
            res = await fetch(nominatimUrl, { headers });
            if (res.ok) {
                data = await res.json();
                const all: NominatimItem[] = Array.isArray(data) ? data as NominatimItem[] : [];
                items = all.filter((item) => isIndia(item)).slice(0, 10);
            }
        }

        const results = mapItems(items);
        return NextResponse.json({ results });
    } catch (error) {
        console.error('Location search error:', error);
        return NextResponse.json({ error: 'Failed to search location' }, { status: 500 });
    }
}
