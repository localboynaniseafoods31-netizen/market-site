import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 3) {
        return NextResponse.json({ results: [] });
    }

    const headers = {
        'User-Agent': 'Localboynaniseafoods/1.0 (delivery location search)',
        'Accept-Language': 'en',
    };

    function mapItems(data: unknown): { place_id: number; display_name: string; lat: string; lon: string; address: unknown }[] {
        const items = Array.isArray(data) ? data : [];
        return items.map((item: any) => ({
            place_id: item.place_id,
            display_name: item.display_name,
            lat: item.lat,
            lon: item.lon,
            address: item.address,
        }));
    }

    function isIndia(item: any): boolean {
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
        let items = Array.isArray(data) ? data : [];

        // Fallback: if no results, try without country filter then keep only India
        if (items.length === 0) {
            nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=15`;
            res = await fetch(nominatimUrl, { headers });
            if (res.ok) {
                data = await res.json();
                const all = Array.isArray(data) ? data : [];
                items = all.filter((item: any) => isIndia(item)).slice(0, 10);
            }
        }

        const results = mapItems(items);
        return NextResponse.json({ results });
    } catch (error) {
        console.error('Location search error:', error);
        return NextResponse.json({ error: 'Failed to search location' }, { status: 500 });
    }
}
